import mysql from 'mysql'
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
    const insert = CreateUserInput;
    const query = mysql.format(sql, insert);
    const result = await this.conn.applyQuery(query); // Promise
    return await this.getById(result.insertId)
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

export default User


