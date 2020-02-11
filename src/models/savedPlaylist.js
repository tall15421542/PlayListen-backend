import mysql from 'mysql'
// Construct func
function savedPlaylist(conn){
  this.conn = conn 
}

// Object Method
savedPlaylist.prototype.create = async function(savePlaylistInput){
  const sql = `INSERT INTO SavedPlaylist SET ?`;
  const insert = savePlaylistInput
  const query = mysql.format(sql, insert)
  const result = await this.conn.applyQuery(query)
  return result
}

savedPlaylist.prototype.getListIdsByUserId = async function(userId){
  const sql = `SELECT listId from SavedPlaylist where userId = ? ORDER BY savedAt DESC`
  const insert = [userId]
  const query = mysql.format(sql, insert)
  const listIds = await this.conn.getData(query)
  return listIds.map(list => list.listId );
}

savedPlaylist.prototype.delete = async function(deleteSavedPlaylistInput){
  const sql = `DELETE FROM SavedPlaylist where userId = ? AND listId = ?`
  const insert = [deleteSavedPlaylistInput.userId, deleteSavedPlaylistInput.listId]
  const query = mysql.format(sql, insert)
  const result = await this.conn.applyQuery(query)
  return result
}

export default savedPlaylist; 
