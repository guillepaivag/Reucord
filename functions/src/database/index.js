const mysql = require('mysql')
const {promisify} = require('util')

const {database} = require('./keys')
const pool = mysql.createPool(database)

console.log('database.database', database.database)

pool.getConnection((err, conn) => {
    if(err){
        console.log('error :(')
        console.log(err)
    }

    if(conn) {
        conn.release()
        console.log('db conectado :)')
    }
    return 
})

pool.query = promisify(pool.query)

module.exports = pool