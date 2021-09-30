const config = require('../../config')

const dataDB_Prod = require('./keysDB')

const dataDB_Dev = {
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'u915966213_reucord'
}

let database = config.environment === 'production' ? dataDB_Prod : dataDB_Dev

module.exports = {
    database
}