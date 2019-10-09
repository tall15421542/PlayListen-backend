// Construct func
function User(conn){
    this.conn = conn 
}

// Object method
User.prototype.createUser = async function(CreateUserInput){
    const sql = 'INSERT INTO User SET ?';
    const insert = CreateUserInput;
    const query = mysql.format(sql, insert);
    this.conn.applyQuery(query); // Promise
}

export default User


