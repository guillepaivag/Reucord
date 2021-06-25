const {Router} = require('express')
const router = Router()

const controller = require('../contollers/esse')

router.post('/locales', controller.listaLocales)
router.post('/locales/:local', controller.getLocalDataByLocal)

module.exports = router