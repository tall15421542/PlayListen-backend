import mysql from 'mysql'
// Construct func
function song(conn, source){
  this.conn = conn 
  this.source = source 
}

// Object Method
song.prototype.getSongsByListIds = async function(listIds){
  var sql = `SELECT * FROM Song WHERE `
  listIds.forEach((listId, index, arr) => {
    sql += ` listId = ? `
    if(index !== arr.length - 1) sql += ` OR `
  })
  const query = mysql.format(sql, listIds)
  const songs = await this.conn.getData(query)
  var ret = {}
  songs.forEach(song => {
    if(ret[song.listId]){
      ret[song.listId].push(song)
    }
    else{
      ret[song.listId] = [song]
    }
  })
  return ret;
}

song.prototype.delete = async function(listId){
  const sql = `Delete FROM Song WHERE listId = ?`
  const insert = [listId]
  const query = mysql.format(sql, insert)
  await this.conn.getData(query)
}

song.prototype.createMultipleInstance = async function(listId, songs, sourceType){
  await this.source[sourceType].setDuration(songs)
  const sql = 'INSERT INTO Song (listId, sourceId, songName, songCover, songDes, duration) VALUES ?'
  var insert = []
  const songsNum = songs.length
  for(var i = 0 ; i < songsNum ; ++i){
    insert.push(CreateSongInput_to_DatabaseSchema(listId, songs[i]))
  }
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

song.prototype.getByUser = async function (userId){
  const sql = 'SELECT s.* FROM Song s INNER JOIN List l on s.listId = l.listId where l.userId = ?'
  const insert = [userId]
  const query = mysql.format(sql, insert)
  const songs = await this.conn.getData(query)
  return songs;
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
