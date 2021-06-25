const {Router} = require('express')
const router = Router()
const controllerProg = require('../contollers/programaciones')

router.get('/programmingLists/:year', controllerProg.listProg)
router.post('/programmingLists/:local/:year', controllerProg.listProgByLocal)

module.exports = router