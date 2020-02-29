import mysql from 'mysql'
const shortid = require('shortid')

// Construct func
function songlist(conn, songModel){
  this.conn = conn;
  this.songModel = songModel
}

// Object Method
songlist.prototype.getByIds = async function(ids){
  var sql = 'SELECT * from List where '
  for(var i = 0 ; i < ids.length ; ++i){
    sql += " listId = ? "
    if(i != ids.length - 1) sql += " OR "
  }
  const insert = ids;
  const query = mysql.format(sql, insert);
  var results = await this.conn.getData(query);
  return results 
}
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
  if(!CreateSonglistInput.listId)
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
  var playlist = UpdatePlaylistInput.listInfo;
  playlist.createdAt = UpdatePlaylistInput.createdAt
  playlist.listId = UpdatePlaylistInput.oldId
  const sql = 'UPDATE List SET ? WHERE listId = ?'
  const insert = [CreateSonglistInput_to_DatabaseSchema(playlist), playlist.listId]
  const query = mysql.format(sql, insert)
  await this.conn.applyQuery(query)
  await this.songModel.delete(playlist.listId)
  await this.songModel.createMultipleInstance(playlist.listId, playlist.songs, 'youtube') // Promise
  return await this.getById(playlist.listId)
}

songlist.prototype.getListIdsByUser = async function(userId){
  const sql = `SELECT listId From List l where l.userId = ?`
  const insert = [userId]
  const query = mysql.format(sql, insert)
  const listIds = await this.conn.getData(query)
  return listIds.map(listId => listId.listId)
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

songlist.prototype.getExploreList = async function(num){
  return await this.getRandom(num);
}

songlist.prototype.getRandom = async function(num){
  const query = `SELECT * FROM List ORDER BY RAND() LIMIT ${num}`;
  const lists = await this.conn.getData(query);
  return lists;
}

songlist.prototype.getExploreListIds = async function(num){
  return await this.getRandomIds(num)
}

songlist.prototype.getRandomIds = async function(num){
  const query = `SELECT listId FROM List ORDER BY RAND() LIMIT ${num}`;
  const listIds = await this.conn.getData(query)
  return listIds
}

songlist.prototype.searchByPrefix = async function(prefix){
  const sql = 'SELECT * FROM List WHERE listName like ?'
  const insert = [(prefix + '%')]
  const query = mysql.format(sql, insert)
  const playlists = await this.conn.getData(query)
  return playlists
}

// Helper method
function CreateSonglistInput_to_DatabaseSchema(CreateSonglistInput){
  if(CreateSonglistInput.createdAt){
    return {
      userId: CreateSonglistInput.ownerId,
      listName: CreateSonglistInput.name,
      listDes: CreateSonglistInput.des,
      listCover: CreateSonglistInput.cover,
      listId: CreateSonglistInput.listId,
      createdAt: CreateSonglistInput.createdAt,
    }
  }
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

// helper
export function songList_database_to_graphql(list_database){
  return{
    id: list_database.listId,
    ownerId: list_database.userId,
    name: list_database.listName,
    des: list_database.listDes,
    cover: list_database.listCover,
    createdAt: list_database.createdAt,
    updatedAt: list_database.updatedAt,
  }
}

export function userList_database_to_graphql(userList_database){
  var ret = [];
  for(var listIdx = 0 ; listIdx < userList_database.length ; ++listIdx){
    var list = userList_database[listIdx];
    var retList = songList_database_to_graphql(list)
    retList.songs = []
    if(list.songs){
      for(var songIdx = 0 ; songIdx < list.songs.length ; ++songIdx){
        retList.songs.push(song_database_to_graphql(list.songs[songIdx]))
      }
    }
    ret.push(retList)
  }
  return ret 
}

function song_database_to_graphql(song_database){
  return{
    id: song_database.songId,
    listId: song_database.listId,
    sourceId: song_database.sourceId,
    name: song_database.songName,
    cover: song_database.songCover,
    duration: song_database.duration 
  }
}

export function songs_to_graphql(songs){
  var ret = []
  const resultNum = songs.length 
  for(var i = 0 ; i < resultNum ; ++i){
    if(!songs[i].listId){
      songs[i].songId = songs[i].listId = -1
    }
    ret.push(song_database_to_graphql(songs[i]))
  }
  return ret 
}

