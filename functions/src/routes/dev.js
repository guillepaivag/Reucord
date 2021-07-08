const devFunctions = require('../contollers/dev')
const {Router} = require('express')
const router = Router()

router.post('/pasarDatosSusModAProgramaciones', devFunctions.pasarDatosSusModAProgramaciones)

module.exports = router