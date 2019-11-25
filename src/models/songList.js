import mysql from 'mysql'
const shortid = require('shortid')

// Construct func
function songlist(conn, songModel){
    this.conn = conn;
    this.songModel = songModel
}

// Object Method
songlist.prototype.getById = async function(listId){
    const sql = 'SELECT * from List where listId = ?'
    const insert = [listId];
    const query = mysql.format(sql, insert);
    var result = await this.conn.getData(query);
    var listInfo = result[0]
    const songsInfo = await this.songModel.getMultipleInstance(listInfo.listId)
    listInfo.songsInfo = songsInfo
    return listInfo 
}

songlist.prototype.create = async function(CreateSonglistInput, sourceType){
    const sql = 'INSERT INTO List SET ?'
    CreateSonglistInput.listId = shortid.generate()
    const insert = [CreateSonglistInput_to_DatabaseSchema(CreateSonglistInput)]
    const query = mysql.format(sql, insert)
    var result = await this.conn.applyQuery(query) // Promise 
    var insertId = result.insertId
    result = await this.songModel.createMultipleInstance(CreateSonglistInput.listId, CreateSonglistInput.songs, sourceType) // Promise
    return CreateSonglistInput.listId
}

songlist.prototype.delete = async function(id){
    const sql = 'DELETE s.*, l.* FROM Song s LEFT JOIN List l ON s.listId = l.listId  WHERE s.listId = ?'
    const insert = [id]
    const query = mysql.format(sql, insert)
    var result = await this.conn.applyQuery(query)
    return result
}

songlist.prototype.update = async function(UpdatePlaylistInput){
    this.delete(UpdatePlaylistInput.oldId)
    var playlist = UpdatePlaylistInput.listInfo;
    playlist.createdAt = UpdatePlaylistInput.createdAt
    var insertId = await this.create(playlist, "youtube")
    return await this.getById(insertId)
}

songlist.prototype.getByUser = async function(userId){
    const sql = 'SELECT * From List l where l.userId = ?'
    const insert = [userId]
    const query = mysql.format(sql, insert)
    const lists = await this.conn.getData(query)
    const songs = await this.songModel.getByUser(userId)
    const userList = merge_songlist(lists, songs)
    return userList;
}

// Helper method
function CreateSonglistInput_to_DatabaseSchema(CreateSonglistInput){
    return {
        userId: CreateSonglistInput.ownerId,
        listName: CreateSonglistInput.name,
        listDes: CreateSonglistInput.des,
        listCover: CreateSonglistInput.cover,
        listId: CreateSonglistInput.listId,
    }
}

function merge_songlist(lists, songs){
    var cur_songsIdx = 0;
    for(var listIdx = 0 ; listIdx < lists.length ; ++listIdx){
        lists[listIdx].songs = []
        for(var songsIdx = cur_songsIdx ; songsIdx < songs.length ; ++songsIdx){
            if(songs[songsIdx].listId === lists[listIdx].listId){
                lists[listIdx].songs.push(songs[songsIdx])
                continue 
            }
            break 
        } 
        cur_songsIdx = songsIdx 
    }
    return lists
}

export default songlist
