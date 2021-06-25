const functions = require('firebase-functions')

const baseURL_Prod = 'https://us-central1-sistemareclamosande2021.cloudfunctions.net/app/api'
const baseURL_Dev = 'http://localhost:5001/sistemareclamosande2021/us-central1/app/api'

// config {
//     environment: '',
//     reucordAPI_baseURL: ''
// }
let config = require('./env.json').config

if( Object.keys(functions.config()).length ) {
    config = functions.config().config
}

// !development
config.reucordAPI_baseURL = config.environment === 'production' ? baseURL_Prod : baseURL_Dev

console.log('config', config)

module.exports = config