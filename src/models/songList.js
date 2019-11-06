import mysql from 'mysql'
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
    const insert = [CreateSonglistInput_to_DatabaseSchema(CreateSonglistInput)]
    const query = mysql.format(sql, insert)
    var result = await this.conn.applyQuery(query) // Promise 
    var insertId = result.insertId
    result = await this.songModel.createMultipleInstance(insertId, CreateSonglistInput.songs, sourceType) // Promise
    return insertId
}



// Helper method
function CreateSonglistInput_to_DatabaseSchema(CreateSonglistInput){
    return {
        userId: CreateSonglistInput.ownerId,
        listName: CreateSonglistInput.name,
        listDes: CreateSonglistInput.des,
        listCover: CreateSonglistInput.cover,
    }
}

export default songlist
