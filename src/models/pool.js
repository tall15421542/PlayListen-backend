import mysql from 'mysql'
import fs from 'fs'

// Constructor func 
function pool(){
    this.pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASS,
        charset : 'utf8mb4',
        ssl: {
            ca: fs.readFileSync(__dirname + '/ssl/rds-ca-2015-root.pem'),
        }
    })
}

// Object Method
pool.prototype.getData = function(query){
    return new Promise((resolve, reject) => {
        try {
            this.pool.getConnection((err, conn)=>{
                if(err) throw err
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
            this.pool.getConnection((error, conn)=>{
                conn.query(query, (error, result) => {
                    console.log(query)
                    if(error) throw error 
                    console.log("success")
                    console.log(result)
                    conn.release()
                    resolve(result)
                })
            })
        } catch (error) {
            throw error
        }
    })
}

export default pool
