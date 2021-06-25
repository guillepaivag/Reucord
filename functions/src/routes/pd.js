const {Router} = require('express')
const router = Router()
const controllerPd = require('../contollers/pd')

router.post('/pd', controllerPd.list)
router.post('/pdOne/:pdnro/:dia/:mes/:anho', controllerPd.onePd)
router.post('/pdOneTrabajos/:pdnro/:dia/:mes/:anho', controllerPd.onePdTrabajos)
router.get('/pdInformeXLSX/:pdnro/:dia/:mes/:anho', controllerPd.informeXLSX)
router.get('/ultimoPdInformeXLSX/', controllerPd.ultimoInformePD)
router.post('/getReclamoDePD/:dmednro/:dia/:mes/:anho', controllerPd.getReclamo)
router.post('/pdAdd', controllerPd.add)
router.delete('/pdDelete/:pdnro/:dia/:mes/:anho', controllerPd.delete)
router.put('/pdUpdate/:pdnro/:dia/:mes/:anho', controllerPd.update)

module.exports = router