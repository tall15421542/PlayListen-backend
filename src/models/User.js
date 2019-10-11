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
    console.log(result)
    return CreateUserInput
}

export default User


