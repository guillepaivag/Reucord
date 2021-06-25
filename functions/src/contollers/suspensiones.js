const controllerSus = {}
const pool = require('../database/index')
const path = require('path')
const Excel = require('exceljs')
const {verificacionDeCaracteres, dataConversionSuspension} = require('../algoritmos/general')

controllerSus.listSuspension = async (req, res) => {
    try {
        const response = await pool.query('SELECT * FROM suspenciones ORDER BY FECHATRAS DESC')
        
        res.json({
            codigo: 'Exito',
            mensaje: 'Lista de suspenciones enviado con exito.',
            respuesta: response
        })
    } catch (error) {
        res.json({
            codigo: 'Error',
            mensaje: 'Hubo un problema',
            respuesta: error
        })
    }
    
}

controllerSus.oneSuspension = async (req, res) => {
    const {nroprog, dia, mes, anho, nroreun, reunionano, pditem} = req.params
    let response = null
    const fechatras = new Date(anho + '/' + mes + '/' + dia)

    console.log('nroreun', nroreun)
    console.log('typeof nroreun', typeof nroreun)
    console.log('fechatras', fechatras)
    try {
        if(nroreun != 'null'){
            response = await pool.query('SELECT * FROM suspenciones WHERE NROPROG = ? AND FECHATRAS = ? AND NROREUN = ? AND REUNIONANO = ? AND PDITEM = ?', [nroprog, fechatras, nroreun, reunionano, pditem])
        }else {
            response = await pool.query('SELECT * FROM suspenciones WHERE NROPROG = ? AND FECHATRAS = ? AND NROREUN IS NULL AND REUNIONANO = ? AND PDITEM = ?', [nroprog, fechatras, reunionano, pditem])
        }

        // res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
        res.json({
            codigo: 'Exito',
            mensaje: 'Suspención enviado con exito.',
            respuesta: await response
        })

    } catch (error) {
        res.json({
            codigo: 'Error',
            mensaje: 'Hubo un problema',
            respuesta: await error
        })
    }

}

controllerSus.informeXLSX_Suspension = async (req, res) => {
    const {nroprog, dia, mes, anho, nroreun, pditem} = req.params

    const isNullNroReun = nroreun == 'null'
    let response = null
    const fechatras = new Date(anho + '/' + mes + '/' + dia)
    const dir = path.join(__dirname, '..', 'storage', 'ANDE_Informe_Suspension.xlsx')

    if(!isNullNroReun){
        response = await pool.query('SELECT * FROM suspenciones WHERE NROPROG = ? AND FECHATRAS = ? AND NROREUN = ? AND PDITEM = ?', [nroprog, fechatras, nroreun, pditem])
    }else {
        response = await pool.query('SELECT * FROM suspenciones WHERE NROPROG = ? AND FECHATRAS = ? AND NROREUN IS NULL AND PDITEM = ?', [nroprog, fechatras, pditem])
    }

    var workbook = new Excel.Workbook()
    workbook = await workbook.xlsx.readFile(dir)

    var worksheet = workbook.getWorksheet(1)

    // clear data
    worksheet.getRow(5).getCell(1).value = ''
    // worksheet.getRow(3).getCell(2).value = ''
    // worksheet.getRow(4).getCell(2).value = ''
    worksheet.getRow(9).getCell(2).value = ''
    // worksheet.getRow(6).getCell(2).value = ''
    worksheet.getRow(7).getCell(9).value = ''
    worksheet.getRow(8).getCell(9).value = ''
    worksheet.getRow(12).getCell(1).value = ''

    // add data
    worksheet.getRow(5).getCell(1).value = `DD/DME N° ${response[0].NROPROG}/${response[0].REUNIONANO}`
    // worksheet.getRow(3).getCell(2).value = ''
    // worksheet.getRow(4).getCell(2).value = 'DD/DME'
    worksheet.getRow(9).getCell(2).value = response[0].TRASMPOR
    // worksheet.getRow(6).getCell(2).value = ''
    worksheet.getRow(7).getCell(9).value = response[0].FECHATRAS
    worksheet.getRow(8).getCell(9).value = '0:00:00'
    worksheet.getRow(12).getCell(1).value = response[0].DESCRIP

    const buffer = await workbook.xlsx.writeBuffer()

    const fileName = 'ANDE_Informe_Suspension.xlsx'

    res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename="' + fileName + '"',
        'x-processed-filename': fileName // <= cabezera personalizada para enviar el nombre del archivo procesado para su descarga
    });

    return res.status(200).send(buffer)
}

controllerSus.addSuspension = async (req, res) => {
    const {programacionSuspendida} = req.params
    const {suspension} = req.body

    try {
        // clone de los datos
        let suspensionRes = JSON.parse(JSON.stringify(suspension))

        // quitamos los espacios de los costados y saltos de linea
        suspensionRes = dataConversionSuspension(suspensionRes)
        
        // Verificación de que la suspención sea valida
        switch (programacionSuspendida) {
            case 'PD':
                suspensionRes.NROREUN = null
                break;

            case 'PS':
                if(!suspensionRes.NROREUN){
                    return res.json({
                        codigo: 'Error',
                        mensaje: 'Su suspensión debe de tener un valor en NROREUN, ya que intenta suspender una programación semanal.',
                        respuesta: null
                    })
                } 
                break;
        
            default:
                return res.json({
                    codigo: 'Error',
                    mensaje: 'Eliga una programación valida para suspender.',
                    respuesta: null
                })
        }

        // VERIFICACION DE QUE EXISTA ESTOS DATOS IMPORTANTES QUE
        // IDENTIFICAN A UNA SUSPENCION
        if(!!suspensionRes.NROPROG && !!suspensionRes.FECHATRAS  && !!suspensionRes.REUNIONANO && !!suspensionRes.PDITEM)
        {
            // VERIFICACION DE QUE NO EXISTA / \ EN ESTOS DATOS
            if(verificacionDeCaracteres(suspensionRes.NROPROG) 
                && verificacionDeCaracteres(suspensionRes.NROREUN)
                && verificacionDeCaracteres(suspensionRes.REUNIONANO)
                && verificacionDeCaracteres(suspensionRes.PDITEM))
            {
                // VERIFICAMOS SI LOS DATOS A AGREGAR ESTAN DISPONIBLES
                let row = null
                if(!!suspensionRes.NROREUN){
                    row = await pool.query('SELECT * FROM suspenciones WHERE NROPROG = ? AND FECHATRAS = ? AND NROREUN = ? AND REUNIONANO = ? AND PDITEM = ?', [suspensionRes.NROPROG, suspensionRes.FECHATRAS, suspensionRes.NROREUN, suspensionRes.REUNIONANO, suspensionRes.PDITEM])
                }else {
                    row = await pool.query('SELECT * FROM suspenciones WHERE NROPROG = ? AND FECHATRAS = ? AND NROREUN IS NULL AND REUNIONANO = ? AND PDITEM = ?', [suspensionRes.NROPROG, suspensionRes.FECHATRAS, suspensionRes.REUNIONANO, suspensionRes.PDITEM])
                }

                // SI ESTA DISPOBIBLE LOS DATOS A AGREGAR
                if(row.length == 0){
                    const response = await pool.query('INSERT INTO suspenciones SET ?', [suspensionRes])
                    
                    res.status(200).json({
                        codigo: 'Exito',
                        mensaje: 'Se ha registrado una suspensión.',
                        respuesta: response
                    })

                } else {
                    // SINO ESTA DISPOBIBLE LOS DATOS A AGREGAR
                    res.json({
                        codigo: 'Error',
                        mensaje: 'Ya existe esta suspensión.',
                        respuesta: null
                    })
                }

            } else {
                // NO SE MODIFICA LOS DATOS SI ES QUE TIENE CARACTERES ESPECIALES COMO
                // / \
                res.json({
                    codigo: 'Error',
                    mensaje: 'No puede agregar datos con / \\.\nFavor usar -',
                    respuesta: null
                })
            }

        } else {
            // SI NO EXISTE ALGUNO DE LOS DATOS IMPORTANTES QUE
            // IDENTIFICA A UNA SUSPENSION
            // NO SE AGREGA NADA
            res.json({
                codigo: 'Error',
                mensaje: 'Debe ingresar los datos de NROPROG, FECHATRAS, NROREUN, REUNIONANO y PDITEM. En caso que se suspenda un PD, entonces, no agregue NROREUN.',
                respuesta: null
            })
        }
        
    } catch (error) {
        res.json({
            codigo: 'Error0001',
            mensaje: 'Hubo un problema',
            respuesta: error
        })
    }

}

controllerSus.updateSuspension = async (req, res) => {
    const {nroprog, dia, mes, anho, nroreun, reunionano, pditem, programacionSuspendida} = req.params
    const {suspension} = req.body

    try {
        let response = null
        const fechatras = new Date(anho + '/' + mes + '/' + dia)

        // clone de los datos
        let suspensionRes = JSON.parse(JSON.stringify(suspension))
        
        // quitamos los espacios de los costados y saltos de linea
        suspensionRes = dataConversionSuspension(suspensionRes)

        // Verificación de que la suspención sea valida
        switch (programacionSuspendida) {
            case 'PD':
                suspensionRes.NROREUN = null
                break;

            case 'PS':
                if(!suspensionRes.NROREUN){
                    return res.json({
                        codigo: 'Error',
                        mensaje: 'Su suspensión debe de tener un valor en NROREUN, ya que intenta suspender una programación semanal.',
                        respuesta: null
                    })
                } 
                break;
        
            default:
                return res.json({
                    codigo: 'Error',
                    mensaje: 'Eliga una programación valida para suspender.',
                    respuesta: null
                })
        }

        // VERIFICACION DE QUE EXISTA ESTOS DATOS IMPORTANTES QUE
        // IDENTIFICAN A UNA SUSPENCION
        if(!!suspensionRes.NROPROG && !!suspensionRes.FECHATRAS  && !!suspensionRes.REUNIONANO && !!suspensionRes.PDITEM)
        {
            // VERIFICACION DE QUE NO EXISTA / \ EN ESTOS DATOS
            if(verificacionDeCaracteres(suspensionRes.NROPROG) 
                && verificacionDeCaracteres(suspensionRes.NROREUN)
                && verificacionDeCaracteres(suspensionRes.REUNIONANO)
                && verificacionDeCaracteres(suspensionRes.PDITEM))
            {
                // VERIFICAMOS SI LOS DATOS A AGREGAR ESTAN DISPONIBLES
                let row = null
                if(!!suspensionRes.NROREUN){
                    row = await pool.query('SELECT * FROM suspenciones WHERE NROPROG = ? AND FECHATRAS = ? AND NROREUN = ? AND REUNIONANO = ? AND PDITEM = ?', [suspensionRes.NROPROG, suspensionRes.FECHATRAS, suspensionRes.NROREUN, suspensionRes.REUNIONANO, suspensionRes.PDITEM])
                }else {
                    row = await pool.query('SELECT * FROM suspenciones WHERE NROPROG = ? AND FECHATRAS = ? AND NROREUN IS NULL AND REUNIONANO = ? AND PDITEM = ?', [suspensionRes.NROPROG, suspensionRes.FECHATRAS, suspensionRes.REUNIONANO, suspensionRes.PDITEM])
                }

                // SI ESTA DISPOBIBLE LOS DATOS A AGREGAR
                if(row.length == 0){
                    if(nroreun != 'null'){
                        response = await pool.query('UPDATE suspenciones SET ? WHERE NROPROG = ? AND FECHATRAS = ? AND NROREUN = ? AND REUNIONANO = ? AND PDITEM = ?', [suspensionRes, nroprog, fechatras, nroreun, reunionano, pditem])
                    }else {
                        response = await pool.query('UPDATE suspenciones SET ? WHERE NROPROG = ? AND FECHATRAS = ? AND NROREUN IS NULL AND REUNIONANO = ? AND PDITEM = ?', [suspensionRes, nroprog, fechatras, reunionano, pditem])
                    }

                    console.log('response', response)
                    
                    res.status(200).json({
                        codigo: 'Exito',
                        mensaje: 'Se ha modificado una suspensión.',
                        respuesta: response
                    })

                } else {
                    // SINO ESTA DISPOBIBLE LOS DATOS A AGREGAR
                    res.json({
                        codigo: 'Error',
                        mensaje: 'Ya existe esta suspensión.',
                        respuesta: null
                    })
                }

            } else {
                // NO SE MODIFICA LOS DATOS SI ES QUE TIENE CARACTERES ESPECIALES COMO
                // / \
                res.json({
                    codigo: 'Error',
                    mensaje: 'No puede agregar datos con / \\.\nFavor usar -',
                    respuesta: null
                })
            }

        } else {
            // SI NO EXISTE ALGUNO DE LOS DATOS IMPORTANTES QUE
            // IDENTIFICA A UNA SUSPENSION
            // NO SE AGREGA NADA
            res.json({
                codigo: 'Error',
                mensaje: 'Debe ingresar los datos de NROPROG, FECHATRAS, NROREUN, REUNIONANO y PDITEM. En caso que se suspenda un PD, entonces, no agregue NROREUN.',
                respuesta: null
            })
        }
    
    } catch (error) {
        res.json({
            codigo: 'Error0001',
            mensaje: 'Hubo un problema',
            respuesta: error
        })
    }

}

controllerSus.deleteSuspension = async (req, res) => {
    const {nroprog, dia, mes, anho, nroreun, reunionano, pditem} = req.params

    let response = null
    const fechatras = new Date(anho + '/' + mes + '/' + dia)

    try {
        if(nroreun == 'null'){
            console.log('ps')
            response = await pool.query('DELETE FROM suspenciones WHERE NROPROG = ? AND FECHATRAS = ? AND NROREUN IS NULL AND REUNIONANO = ? AND PDITEM = ?', [nroprog, fechatras, reunionano, pditem])
        }else {
            console.log('pd')
            response = await pool.query('DELETE FROM suspenciones WHERE NROPROG = ? AND FECHATRAS = ? AND NROREUN = ? AND REUNIONANO = ? AND PDITEM = ?', [nroprog, fechatras, nroreun, reunionano, pditem])
        }
        
        res.json({
            codigo: 'Exito',
            mensaje: 'Se ha eliminado una suspensión.',
            respuesta: response
        })
    } catch (error) {
        res.json({
            codigo: 'Error0000',
            mensaje: 'Hubo un problema',
            respuesta: error
        })
    }

}

module.exports = controllerSus