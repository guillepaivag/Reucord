const devFunctions = require('../algoritmos/dev')
const {Router} = require('express')
const router = Router()

router.post('/quitarCaracteresEspeciales/:tabla', async (req, res) => {
    const tabla = req.params.tabla

    switch (tabla) {
        case 'eq23kv':
            res.json(await devFunctions.quitarCaracteresEspecialesEquipos())
            break;
        
        case 'cd':
            res.json(await devFunctions.quitarCaracteresEspecialesCd())
            break

        case 'pddatos':
            res.json(await devFunctions.quitarCaracteresEspecialesPddatos())
            break
        
        case 'prgtraviop1':
            res.json(await devFunctions.quitarCaracteresEspecialesPrgtraviop1())
            break

        default:
            res.json({
                response: 'Esta tabla no existe..'
            })
            break;
    }
})

router.post('/cambiarFormato/:tabla', async (req, res) => {
    const tabla = req.params.tabla

    switch (tabla) {
        case 'reclamos':
            res.json(await devFunctions.cambiarFormatoReclamos())
            break;
        
        case 'pddatos':
            res.json(await devFunctions.cambiarFormatoPdDatos())
            break;

        case 'pd':
            res.json(await devFunctions.cambiarFormatosPD())
            break;

        case 'prgtraviop1':
            res.json(await devFunctions.cambiarFormatoPrgtraviop1())
            break;

        case 'prgtraviop1datos':
            res.json(await devFunctions.cambiarFormatoPrgtraviop1Datos())
            break;

        case 'suspensiones':
            res.json(await devFunctions.cambiarFormatoSuspensiones())
            break;

        default:
            res.json({
                response: 'Esta tabla no existe..'
            })
            break;
    }
})


module.exports = router