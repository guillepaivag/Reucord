const config = require('../../config')

const dataDB_Prod = {
    host: 'sql487.main-hosting.eu',
    user: 'u915966213_reucord',
    password: 'Reucord-DMED-2020',
    port: 3306,
    database: 'u915966213_reucord'
}

const dataDB_Dev = {
    host: 'localhost',
    user: 'root',
    password: '',
    port: 3306,
    database: 'reucord'
}

let database = config.environment === 'production' ? dataDB_Prod : dataDB_Dev


module.exports = {
    database
}