import mysql from 'mysql'
// Construct func
function songList(conn, songModel){
    this.conn = conn;
    this.songModel = songModel
}

// Object Method
songList.prototype.getById = async function(listId){
    const sql = 'SELECT * from List where listId = ?'
    const insert = [listId];
    const query = mysql.format(sql, insert);
    var listInfo = await this.conn.getData(query);
    console.log(listInfo[0])
    const songsInfo = await this.songModel.getMultipleInstance(listInfo[0].listId)
    listInfo.songsInfo = songsInfo
    return listInfo 
}

songList.prototype.create = async function(CreateSongListInput){
    const sql = 'INSERT INTO List SET ?'
    const insert = [CreateSongListInput_to_DatabaseSchema(CreateSongListInput)]
    const query = mysql.format(sql, insert)
    var result = await this.conn.applyQuery(query) // Promise 
    console.log(result)
    result = await this.songModel.createMultipleInstance(result.insertId, CreateSongListInput.songs) // Promise
    console.log(result)
}

// Helper method
function CreateSongListInput_to_DatabaseSchema(CreateSongListInput){
    return {
        userId: CreateSongListInput.ownerId,
        listName: CreateSongListInput.name,
        listDes: CreateSongListInput.des,
        listCover: CreateSongListInput.cover,
    }
}

export default songList
