// requires
const functions = require('firebase-functions')
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
// const history = require('connect-history-api-fallback')
const admin = require('./firebaseAdmin')

// var
const app = express()

// config

// middlewares
// app.use(history())
app.use(morgan('dev'))

var allowlist = ['https://sistemareclamosande2021.web.app', 'https://reucord.web.app','http://localhost:8080']
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    console.log(req.header('Origin'))
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

app.use(cors(corsOptionsDelegate))

app.use(express.json())
app.use(express.urlencoded({extended: false}))

// routes
app.use('/api', require('./src/routes/general'))
app.use('/api', require('./src/routes/eq23kv'))
app.use('/api', require('./src/routes/pd'))
app.use('/api', require('./src/routes/ps'))
app.use('/api', require('./src/routes/esse'))
app.use('/api', require('./src/routes/reclamos'))
app.use('/api', require('./src/routes/suspensiones'))
app.use('/api', require('./src/routes/programaciones'))
app.use('/dev', require('./src/routes/dev'))

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.app = functions.runWith({
  timeoutSeconds: 300
}).region('southamerica-east1').https.onRequest(app)