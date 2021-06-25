const {Router} = require('express')
const router = Router()
const controllerSus = require('../contollers/suspensiones')

router.post('/suspensiones', controllerSus.listSuspension)
router.post('/suspensionOne/:nroprog/:dia/:mes/:anho/:nroreun/:reunionano/:pditem', controllerSus.oneSuspension)
router.get('/suspensionInformeXLSX/:nroprog/:dia/:mes/:anho/:nroreun/:pditem', controllerSus.informeXLSX_Suspension)
router.post('/suspensionAdd/:programacionSuspendida', controllerSus.addSuspension)
router.put('/suspensionUpdate/:nroprog/:dia/:mes/:anho/:nroreun/:reunionano/:pditem/:programacionSuspendida', controllerSus.updateSuspension)
router.delete('/suspensionDelete/:nroprog/:dia/:mes/:anho/:nroreun/:reunionano/:pditem', controllerSus.deleteSuspension)

module.exports = router