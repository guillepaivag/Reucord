const {Router} = require('express')
const router = Router()
const controllerPs = require('../contollers/ps')

router.post('/ps', controllerPs.list)
router.post('/psOne/:reufecha/:reunro/:item', controllerPs.onePs)
router.post('/psOneTrabajos/:reufecha/:reunro/:item', controllerPs.onePsTrabajos)
router.get('/psInformeXLSX/:reufecha/:reunro', controllerPs.informeXLSX_PS)
router.post('/psAdd', controllerPs.addPs)
router.put('/psUpdate/:reufecha/:reunro/:item', controllerPs.update)
router.delete('/psDelete/:reufecha/:reunro/:item', controllerPs.delete)

module.exports = router