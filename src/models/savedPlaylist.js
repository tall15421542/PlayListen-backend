import mysql from 'mysql'
// Construct func
function savedPlaylist(conn){
  this.conn = conn 
}

// Object Method
savedPlaylist.prototype.create = async function(savePlaylistInput){
  const sql = `INSERT IGNORE INTO SavedPlaylist SET ?`;
  const insert = savePlaylistInput
  const query = mysql.format(sql, insert)
  const result = await this.conn.applyQuery(query)
  return result
}

savedPlaylist.prototype.getByUserId = async function(userId){
  const sql = `SELECT * from SavedPlaylist where userId = ? ORDER BY savedAt DESC`
  const insert = [userId]
  const query = mysql.format(sql, insert)
  const savedLists = await this.conn.getData(query)
  return savedLists;
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

savedPlaylist.prototype.deleteByListId = async function(listId){
  const sql = `DELETE FROM SavedPlaylist WHERE listId = ?`
  const insert = [listId]
  const query = mysql.format(sql, insert)
  await this.conn.applyQuery(query)
}

export default savedPlaylist; 
