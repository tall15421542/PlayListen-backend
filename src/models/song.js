import mysql from 'mysql'
// Construct func
function song(conn){
    this.conn = conn 
}

// Object Method
song.prototype.createMultipleInstance = async function(listId, songs){
    const sql = 'INSERT INTO Song (listId, sourceId, songName, songCover, songDes, duration) VALUES ?'
    var insert = []
    const songsNum = songs.length
    for(var i = 0 ; i < songsNum ; ++i){
        insert.push(CreateSongInput_to_DatabaseSchema(listId, songs[i]))
    }
    console.log(insert)
    const query = mysql.format(sql, [insert]);
    return this.conn.applyQuery(query); // Promise
}

song.prototype.getMultipleInstance = async function(listId){
    const sql = 'SELECT * FROM Song WHERE listId = ?'
    const insert = [listId]
    const query = mysql.format(sql, insert)
    const result = await this.conn.getData(query)
    return result
}

// Helper func
function CreateSongInput_to_DatabaseSchema(listId, CreateSongInput){
    return [
        listId, 
        CreateSongInput.sourceId,
        CreateSongInput.name,
        CreateSongInput.cover,
        "",
        CreateSongInput.duration,
    ]
}

export default song; 
