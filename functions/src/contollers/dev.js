const pool = require('../database/index')

const controllerDev = {}

controllerDev.pasarDatosSusModAProgramaciones = async (req, res) => {
    // Verificacion de que exista programaciones suspendidas o modificadas 
    const datosPD = await verificarDatosSusModPD()
    const datosPS = await verificarDatosSusModPS()

    if (datosPD === 'ExisteTodo' && datosPS === 'ExisteTodo') {
        // Pasar datos a las programaciones

        const datosCambiadosPD = await pasarDatosSusModPD()
        const datosCambiadosPS = await pasarDatosSusModPS()

        return res.status(200).json({
            datosPD,
            datosPS,
            datosCambiadosPD,
            datosCambiadosPS
        })
    } 

    return res.status(500).json({
        message: 'No existen todos los datos'
    })
}

const verificarDatosSusModPD = async () => {
    const datosSuspensionPD = await pool.query('SELECT * FROM suspenciones WHERE NROREUN IS NULL')

    for (let i = 0; i < datosSuspensionPD.length; i++) {
        const element = datosSuspensionPD[i];

        const existe = await pool.query('SELECT * FROM pddatos WHERE NROPROG = ? AND YEAR(PDFECHA) = ?', [element.PDITEM, element.REUNIONANO])

        if (!existe) {
            return `NoExiste`
        }
        
    }

    return 'ExisteTodo'
}

const verificarDatosSusModPS = async (req, res) => {
    const datosSuspensionPS = await pool.query('SELECT * FROM suspenciones WHERE NROREUN IS NOT NULL')

    for (let i = 0; i < datosSuspensionPS.length; i++) {
        const element = datosSuspensionPS[i];

        const existe = await pool.query('SELECT * FROM prgtraviop1 WHERE REUFECHA = ? AND REUNRO = ? AND ITEM = ?', [element.REUNIONANO, element.NROREUN, element.PDITEM])

        if (!existe) {
            return `NoExiste`
        }
        
    }

    return 'ExisteTodo'
}

const pasarDatosSusModPD = async () => {
    const cambio = []
    const datosSuspensionPD = await pool.query('SELECT * FROM suspenciones WHERE NROREUN IS NULL')

    for (let i = 0; i < datosSuspensionPD.length; i++) {
        const element = datosSuspensionPD[i];

        cambio.push(await pool.query('UPDATE pddatos SET SUSMOD = ? WHERE NROPROG = ? AND YEAR(PDFECHA) = ?', [element.SUSMOD, element.PDITEM, element.REUNIONANO]))
        
    }

    return cambio
}

const pasarDatosSusModPS = async (req, res) => {
    const cambio = []
    const datosSuspensionPS = await pool.query('SELECT * FROM suspenciones WHERE NROREUN IS NOT NULL')

    for (let i = 0; i < datosSuspensionPS.length; i++) {
        const element = datosSuspensionPS[i];

        cambio.push(await pool.query('UPDATE prgtraviop1 SET SUSMOD = ? WHERE REUFECHA = ? AND REUNRO = ? AND ITEM = ?', [element.SUSMOD, element.REUNIONANO, element.NROREUN, element.PDITEM]))

    }

    return cambio
}


module.exports = controllerDev