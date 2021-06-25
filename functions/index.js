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

// app.use(cors({
//     credentials: true,
//     origin: 'https://sistemareclamosande2021.web.app',
//     optionsSuccessStatus: 200,
// }))
app.use(cors(corsOptionsDelegate))

app.use(express.json())
app.use(express.urlencoded({extended: false}))
// Add headers
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', 'https://sistemareclamosande2021.web.app');
//     res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method, token');
//     res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
//     res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
//     next();
// });
// app.use(function (req, res, next) {
//     // Website you wish to allow to connect
//     res.set('Access-Control-Allow-Origin', '*');
//     // Request methods you wish to allow
//     res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     // Request headers you wish to allow
//     res.set('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//     // Set to true if you need the website to include cookies in the requests sent
//     // to the API (e.g. in case you use sessions)
//     res.set('Access-Control-Allow-Credentials', true);
//     // Pass to next layer of middleware

//     // res.set('Access-Control-Allow-Origin', '*');
//     // res.set('Access-Control-Allow-Methods', 'GET');
//     // res.set('Access-Control-Allow-Headers', 'Content-Type');
//     next();
// });

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

exports.app = functions.https.onRequest(app);
