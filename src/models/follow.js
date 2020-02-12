import mysql from 'mysql'

// Construct func
function Follow(conn){
  this.conn = conn 
}

Follow.prototype.create = async function(CreateFollowInput){
  const sql = `INSERT IGNORE INTO Follow SET ?`
  const insert = CreateFollowInput
  const query = mysql.format(sql, insert)
  const result = await this.conn.applyQuery(query)
  return result
}

Follow.prototype.delete = async function(DeleteFollowInput){
  const sql = `DELETE FROM Follow where followerId = ? AND followeeId = ?`
  const insert = [DeleteFollowInput.followerId, DeleteFollowInput.followeeId]
  const query = mysql.format(sql, insert)
  const result = await this.conn.applyQuery(query)
  return result
}

Follow.prototype.getFollowerIds = async function(userId){
  const sql = `SELECT followerId FROM Follow where followeeId = ?`
  const insert = [userId]
  const query = mysql.format(sql, insert)
  const followerIds = await this.conn.getData(query)
  return followerIds.map(follower => follower.followerId)
}

Follow.prototype.getFolloweeIds = async function(userId){
  const sql = `SELECT followeeId FROM Follow where followerId = ?`
  const insert = [userId]
  const query = mysql.format(sql, insert)
  const followeeIds = await this.conn.getData(query)
  return followeeIds.map(followee => followee.followeeId)
}
export default Follow
