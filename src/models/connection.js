import mysql from 'mysql'
import fs from 'fs'

console.log(process.env.DB_HOST)
let pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASS,
  ssl: {
      ca: fs.readFileSync(__dirname + '/ssl/server-ca.pem'),
      cert: fs.readFileSync(__dirname + '/ssl/client-cert.pem'),
      key: fs.readFileSync(__dirname + '/ssl/client-key.pem')
  }
})

function getData(pool, query) {
    return new Promise((resolve, reject) => {
        try {
            pool.getConnection((err, conn)=>{
                if(err) throw error
                conn.query(query, (error, result) => {
                    if (error) {
                        throw error
                    }
                    console.log(query)
                    console.log('success')
                    conn.release()
                    resolve(result)
                })
            })
        } catch (error) {
            throw error
        }
    })
}

function applyQuery(pool, query) {
    return new Promise((resolve, reject) => {
        try {
            pool.getConnection((err, conn)=>{
                conn.query(query, (eror, results) => {
                    console.log(query)
                    if(err) throw err 
                    console.log("success")
                    conn.release()
                    resolve(results)
                })
            })
        } catch (error) {
            throw error
        }
    })
}

function getMultipleData(queryArray) {
    return Promise.all(queryArray)
}

function createAccount(userData) {
    const sql = 'INSERT INTO User SET ?';
    const insert = userData;
    const query = mysql.format(sql, insert);
    applyQuery(pool, query);
}

/*
connection.applyQuery = applyQuery 
connection.getData = getData
connection.getMultipleData = getMultipleData
*/



export default pool
