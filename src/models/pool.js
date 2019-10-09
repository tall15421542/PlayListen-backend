import mysql from 'mysql'
import fs from 'fs'

// Constructor func 
function pool(){
    this.pool = mysql.createPool({
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
}

// Object Method
pool.prototype.getData = function(query){
    return new Promise((resolve, reject) => {
        try {
            this.pool.getConnection((err, conn)=>{
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

pool.prototype.applyQuery = function(query){
    return new Promise((resolve, reject) => {
        try {
            this.pool.getConnection((err, conn)=>{
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

export default pool
