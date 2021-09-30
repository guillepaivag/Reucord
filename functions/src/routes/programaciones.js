const {Router} = require('express')
const router = Router()
const controllerProg = require('../contollers/programaciones')

router.get('/programmingLists/:year', controllerProg.listProg)
router.post('/programmingLists/:local/:year', controllerProg.listProgByLocal)
router.post('/listaDeTrabajosPorDia', controllerProg.listaDeTrabajosPorDia)
router.post('/trabajosPorRangoDeTiempo', controllerProg.trabajosPorRangoDeTiempo)
router.get('/ultimoNumero', controllerProg.ultimoNumero)

module.exports = router