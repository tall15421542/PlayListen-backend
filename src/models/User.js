import mysql from 'mysql'
const shortid = require('shortid');
import jwt from 'jsonwebtoken' 
import axios from 'axios'

export const createToken = ({ id, name }) => {
  if(!id || !name) return null
  jwt.sign({ id, name }, process.env.TOKEN_SECRET, {
    expiresIn: '1d'
  })
};

export async function getLoginUser(req){
  const token = req.headers['x-token']
  if(token){
    const me = await jwt.verify(token, process.env.TOKEN_SECRET);
    return me
  }
  return null
}

export function user_database_to_graphql(user_database){
  return {
    id: user_database.userId,
    name: user_database.userName,
    bio: user_database.bio,
    avatar: user_database.avatar,
    email: user_database.email,
    googleId: user_database.googleId,
    googleAccessToken: user_database.googleAccessToken,
    facebookId: user_database.facebookId,
    facebookAccessToken: user_database.facebookAccessToken
  }
}
export function user_database_to_authentication_result(user_database){
  var result = null, token = null, user = null
  if(user_database){
    result = 'success'
    user = {
      id: user_database.userId,
      name: user_database.userName,
      bio: user_database.bio,
      avatar: user_database.avatar,
      email: user_database.email,
      googleId: user_database.googleId,
      googleAccessToken: user_database.googleAccessToken,
      facebookId: user_database.facebookId,
      facebookAccessToken: user_database.facebookAccessToken
    }
    token = createToken(user);
  }else{
    result = 'failed'
  }
  return{
    user: user,
    token: token,
    result: result
  }
}

// Construct func
function User(conn){
  this.conn = conn 
}

// Object method
User.prototype.getById = async function(id){
  const sql = 'SELECT * FROM User WHERE userId = ?'
  const insert = [id]
  const query = mysql.format(sql, insert)
  const result = await this.conn.getData(query)
  return result[0]
}

User.prototype.create = async function(CreateUserInput){
  const sql = 'INSERT INTO User SET ?';
  CreateUserInput.userId = shortid.generate();
  const insert = CreateUserInput;
  const query = mysql.format(sql, insert);
  const result = await this.conn.applyQuery(query); // Promise
  return await this.getById(CreateUserInput.userId)
}

User.prototype.exist = async function(user){
  const sql = 'SELECT 1 FROM User WHERE (userName = ? and email = ?)'
  const insert = [user.userName, user.email]
  const query = mysql.format(sql, insert);
  const result = await this.conn.applyQuery(query)
  return result.length === 1
}

User.prototype.getByName = async function(name){
  const sql = 'SELECT * FROM User WHERE userName = ?'
  const insert = [name]
  const query = mysql.format(sql, insert)
  const result = await this.conn.getData(query)
  if(result){
    return result[0]
  }
  return null
}

User.prototype.googleConnected = async function(user){
  const sql = 'SELECT googleId FROM User WHERE userName = ?'
  const insert = [user.userName]
  const query = mysql.format(sql, insert)
  const result = await this.conn.getData(query)
  if(result){
    return true
  }
  return false
}

User.prototype.getByGoogleId = async function(googleId){
  const sql = 'SELECT * FROM User WHERE googleId = ?'
  const insert = [googleId]
  const query = mysql.format(sql, insert)
  const result = await this.conn.getData(query)
  if(result){
    return result[0];
  }  
  return null
}

User.prototype.connectGoogle = async function(userId, googleInfo){
  const sql = 'UPDATE User set googleId = ?, googleAccessToken = ?, googleRefreshToken = ? WHERE userId = ?'
  const insert = [googleInfo.id, googleInfo.accessToken, googleInfo.refreshToken, userId];
  const query = mysql.format(sql, insert)
  const result = await this.conn.applyQuery(query);
}

User.prototype.getGoogleAccessToken = async function(userId){
  const sql = 'SELECT googleRefreshToken from User WHERE userId = ?'
  const insert = [userId]
  const query = mysql.format(sql, insert)
  const result = await this.conn.getData(query)
  const refreshToken = result[0].googleRefreshToken;
  var accessToken = null
  if(refreshToken){
    await axios.post('https://www.googleapis.com/oauth2/v4/token', {
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET, 
      refresh_token: refreshToken,
      grant_type: "refresh_token"
    })
    .then(function (response) {
      console.log("Promise")
      accessToken = response.data.access_token;
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  return accessToken
}

User.prototype.facebookConnected = async function(user){
  const sql = 'SELECT facebookId FROM User WHERE userName = ?'
  const insert = [user.userName]
  const query = mysql.format(sql, insert)
  const result = await this.conn.getData(query)
  if(result){
    return true
  }
  return false
}

User.prototype.getByFacebookId = async function(facebookId){
  const sql = 'SELECT * FROM User WHERE facebookId = ?'
  const insert = [facebookId]
  const query = mysql.format(sql, insert)
  const result = await this.conn.getData(query)
  if(result){
    return result[0];
  }  
  return null
}

User.prototype.connectFacebook = async function(userId, facebookInfo){
  const sql = 'UPDATE User set facebookId = ?, facebookAccessToken = ?, avatar = ? WHERE userId = ?'
  const insert = [facebookInfo.id, facebookInfo.accessToken, getAvatarURL(facebookInfo.id), userId];
  const query = mysql.format(sql, insert)
  const result = await this.conn.applyQuery(query);
}
export default User

// helper 

function getAvatarURL(facebookId) {
  let url = "http://graph.facebook.com/" + facebookId + "/picture?type=large";
  return url;
}

