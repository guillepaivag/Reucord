const {Router} = require('express')
const router = Router()
const controllerReclamos = require('../contollers/reclamos')

router.post('/reclamos', controllerReclamos.list)
router.post('/reclamoOne/:dmednro/:dia/:mes/:anho', controllerReclamos.oneReclamos)
router.get('/reclamosInformeXLSX/:dmednro/:dia/:mes/:anho', controllerReclamos.informeXLSX_Reclamos)
router.post('/reclamoAdd', controllerReclamos.add)
router.delete('/reclamoDelete/:dmednro/:dia/:mes/:anho', controllerReclamos.delete)
router.put('/reclamoUpdate/:dmednro/:dia/:mes/:anho', controllerReclamos.update)

module.exports = router