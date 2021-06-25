const {Router} = require('express')
const router = Router()
const controllerEq23kv = require('../contollers/eq23kv')

router.post('/eq23kv', controllerEq23kv.list)
router.post('/eq23kvOne/:local/:circuito/:equipo', controllerEq23kv.eq23kvOne)
router.post('/eq23kvAnalisis/bc/total', controllerEq23kv.totalBC)
router.post('/eq23kvCircuitoPorLocal/:local', controllerEq23kv.listaCircuitoPorLocal)
router.post('/eq23kvEquipoPorLocalCircuito/:local/:circuito', controllerEq23kv.listaEquipoPorLocalCircuito)
router.post('/eq23kvAdd', controllerEq23kv.save)
router.delete('/eq23kvDelete/:local/:circuito/:equipo', controllerEq23kv.delete)
router.put('/eq23kvEdit/:local/:circuito/:equipo', controllerEq23kv.update)

module.exports = router