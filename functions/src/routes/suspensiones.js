const {Router} = require('express')
const router = Router()
const controllerSus = require('../contollers/suspensiones')

router.post('/suspensiones', controllerSus.listSuspension)
router.post('/suspensiones/unaSuspension/:nroprog/:dia/:mes/:anho', controllerSus.oneSuspension)
router.post('/suspensiones/obtenerPdSusModValido', controllerSus.obtenerPdSusModValido)
router.post('/suspensiones/obtenerPsSusModValido', controllerSus.obtenerPsSusModValido)

router.get('/suspensiones/informe/XLSX/:nroprog/:dia/:mes/:anho/:nroreun/:reunionano/:pditem', controllerSus.informeXLSX_Suspension)

router.post('/suspensiones/agregarPd', controllerSus.addSuspensionPd)
router.post('/suspensiones/agregarPs', controllerSus.addSuspensionPs)
router.put('/suspensiones/editarPd/:nroprog/:dia/:mes/:anho', controllerSus.updateSuspensionPd)
router.put('/suspensiones/editarPs/:nroprog/:dia/:mes/:anho', controllerSus.updateSuspensionPs)
router.post('/suspensiones/eliminar/:nroprog/:dia/:mes/:anho', controllerSus.deleteSuspension)

module.exports = router