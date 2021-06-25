const controllerReclamos = {}
const pool = require('../database/index')
const path = require('path')
const Excel = require('exceljs')
const {verificacionDeCaracteres, dataConversionReclamos} = require('../algoritmos/general')

controllerReclamos.list = async (req, res) => {
    try {
        
        const reclamos = await pool.query('SELECT * FROM reclamos ORDER BY FECHATRASM DESC')
        
        res.status(200).json({
            codigo: 'Exito',
            mensaje: 'Lista de reclamos enviada con exito',
            respuesta: await reclamos
        })
    } catch (error) {
        res.json({
            codigo: 'Error0001',
            mensaje: 'Hubo un problema',
            respuesta: error
        })
    }
}

controllerReclamos.listPagination = async (req, res) => {
    const { page, limit } = req.params

    // calculate offset
    let offset = (page - 1) * limit
    let limitAux = parseInt(limit)


    try {
        const reclamos = await pool.query('SELECT * FROM reclamos LIMIT ? OFFSET ?', [limitAux, offset])
        
        res.status(200).json({
            codigo: 'Exito',
            mensaje: 'Lista de reclamos páginada enviada con exito',
            respuesta: await reclamos
        })
    } catch (error) {
        res.json({
            codigo: 'Error0001',
            mensaje: 'Hubo un problema',
            respuesta: error
        })
    }
}

controllerReclamos.oneReclamos = async (req, res) => {
    const {dmednro, dia, mes, anho} = req.params

    try {
        const fechatrasmString = anho + '/' + mes + '/' + dia
        const fechatrasm = new Date(fechatrasmString)

        const reclamo = await pool.query('SELECT * FROM reclamos WHERE DMEDNRO = ? AND FECHATRASM = ?', [dmednro, fechatrasm])
        
        res.status(200).json({
            codigo: 'Exito',
            mensaje: 'Reclamo enviado con exito',
            respuesta: reclamo
        })
    } catch (error) {
        res.json({
            codigo: 'Error0001',
            mensaje: 'Hubo un problema',
            respuesta: error
        })
    }
}

controllerReclamos.informeXLSX_Reclamos = async (req, res) => {
    const {dmednro, dia, mes, anho} = req.params
    
    const fechatrasmString = anho + '/' + mes + '/' + dia
    const fechatrasm = new Date(fechatrasmString)
    
    const dir = path.join(__dirname, '..', 'storage', 'ANDE_Informe_Reclamos.xlsx')

    const reclamo = await pool.query('SELECT * FROM reclamos WHERE DMEDNRO = ? AND FECHATRASM = ?', [dmednro, fechatrasm])
    console.log('reclamo', reclamo)

    var workbook = new Excel.Workbook()
    workbook = await workbook.xlsx.readFile(dir)

    var worksheet = await workbook.getWorksheet(1);

    // clear data
    worksheet.getRow(1).getCell(1).value = ''
    worksheet.getRow(1).getCell(3).value = ''
    worksheet.getRow(1).getCell(7).value = ''
    worksheet.getRow(1).getCell(9).value = ''
    worksheet.getRow(2).getCell(1).value = ''
    worksheet.getRow(2).getCell(3).value = ''
    worksheet.getRow(2).getCell(7).value = ''
    worksheet.getRow(2).getCell(9).value = ''

    worksheet.getRow(4).getCell(1).value = ''

    // add data
    worksheet.getRow(1).getCell(1).value = await reclamo[0].OTRADEP
    worksheet.getRow(1).getCell(3).value = 'DD/DME'
    worksheet.getRow(1).getCell(7).value = await reclamo[0].FECHATRASM
    worksheet.getRow(1).getCell(9).value = await reclamo[0].HORATRASM
    worksheet.getRow(2).getCell(1).value = await reclamo[0].NROOTRADE
    worksheet.getRow(2).getCell(3).value = await reclamo[0].DMEDNRO
    worksheet.getRow(2).getCell(7).value = await reclamo[0].TRASMPOR
    worksheet.getRow(2).getCell(9).value = await reclamo[0].RECIBPOR

    worksheet.getRow(4).getCell(1).value = await reclamo[0].RECLAMO

    const buffer = await workbook.xlsx.writeBuffer()

    const fileName = 'ANDE_Informe_Reclamos.xlsx'

    res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename="' + fileName + '"',
        'x-processed-filename': fileName // <= cabezera personalizada para enviar el nombre del archivo procesado para su descarga
    });

    await res.status(200).send(buffer)
}

controllerReclamos.add = async (req, res) => {
    const {reclamo} = req.body

    try {
        // clone de los datos
        let reclamoRes = JSON.parse(JSON.stringify(reclamo))

        // quitamos los espacios de los costados y saltos de linea
        reclamoRes = dataConversionReclamos(reclamoRes)

        // VERIFICACION DE QUE EXISTA ESTOS DATOS IMPORTANTES QUE
        // IDENTIFICAN A UN RECLAMO
        if(!!reclamoRes.DMEDNRO && !!reclamoRes.FECHATRASM)
        {
            // VERIFICACION DE QUE NO EXISTA / \ EN ESTOS DATOS
            if(verificacionDeCaracteres(reclamoRes.LOCAL)
                && verificacionDeCaracteres(reclamoRes.DMEDNRO)
                && verificacionDeCaracteres(reclamoRes.NROOTRADE))
            {
                // VERIFICAMOS SI LOS DATOS A AGREGAR ESTAN DISPONIBLES
                const row = await pool.query('SELECT * FROM reclamos WHERE DMEDNRO = ? AND FECHATRASM = ?', [reclamoRes.DMEDNRO, reclamoRes.FECHATRASM])

                // SI ESTA DISPOBIBLE LOS DATOS A AGREGAR
                if(row.length == 0){
                    const result = await pool.query('INSERT INTO reclamos SET ?', [reclamoRes])
                    
                    res.status(200).json({
                        codigo: 'Exito',
                        mensaje: 'Se ha registrado un reclamo',
                        respuesta: result
                    })

                // SINO ESTA DISPOBIBLE LOS DATOS A AGREGAR
                } else {
                    res.json({
                        codigo: 'Error',
                        mensaje: 'Ya existe este reclamo'
                    })
                }
            
            } else {
                // NO SE MODIFICA LOS DATOS SI ES QUE TIENE CARACTERES ESPECIALES COMO
                // / \
                res.json({
                    codigo: 'Error',
                    mensaje: 'No puede agregar datos con / \\.\nFavor usar -'
                })
            }

        } else {
            // SI NO EXISTE ALGUNO DE LOS DATOS IMPORTANTES QUE
            // IDENTIFICA A UN RECLAMO
            // NO SE AGREGA NADA
            res.json({
                codigo: 'Error',
                mensaje: 'Debe ingresar los datos de DMEDNRO, FECHATRASM'
            })
        }
    } catch (error) {
        console.log('error', error)

        res.json({
            codigo: 'Error0001',
            mensaje: 'Hubo un problema',
            respuesta: error
        })
    }
}

controllerReclamos.update = async (req, res) => {
    const {reclamo} = req.body
    const {dmednro, dia, mes, anho} = req.params

    console.log('reclamo', reclamo)
    const fecha = anho + '/' + mes + '/' + dia
    const fechatrasm = new Date(fecha)
    
    try {
        let reclamoRes = JSON.parse(JSON.stringify(reclamo))
        console.log('reclamoRes1', reclamoRes)

        // quitamos los espacios de los costados y saltos de linea
        reclamoRes = dataConversionReclamos(reclamoRes)
        console.log('reclamoRes2', reclamoRes)

        // VERIFICACION DE QUE EXISTA ESTOS DATOS IMPORTANTES QUE
        // IDENTIFICAN A UN RECLAMO
        if(!!reclamoRes.DMEDNRO && !!reclamoRes.FECHATRASM)
        {
            // VERIFICACION DE QUE NO EXISTA / \ EN ESTOS DATOS
            if(verificacionDeCaracteres(reclamoRes.LOCAL)
                && verificacionDeCaracteres(reclamoRes.DMEDNRO)
                && verificacionDeCaracteres(reclamoRes.NROOTRADE))
            {
                // VERIFICAMOS SI LOS DATOS A MODIFICAR ESTAN DISPONIBLES
                const row = await pool.query('SELECT * FROM reclamos WHERE DMEDNRO = ? AND FECHATRASM = ?', [reclamoRes.DMEDNRO, reclamoRes.FECHATRASM])

                // SI ESTA DISPOBIBLE LOS DATOS A MODIFICAR
                if(row.length == 0){
                    const updated = await pool.query('UPDATE reclamos SET ? WHERE DMEDNRO = ? AND FECHATRASM = ?', [reclamoRes, dmednro, fechatrasm])
                    res.json({
                        codigo: 'Exito',
                        mensaje: 'Se ha modificado un reclamo',
                        respuesta: updated
                    })


                } else {
                    // SINO ESTA DISPOBIBLE LOS DATOS A MODIFICAR.

                    // SI LOS DATOS NO DISPONIBLES SON DE LOS DATOS QUE QUEREMOS
                    // MODIFICAR, SE PROCEDE A LA MODIFICACION.
                    if(dmednro == reclamoRes.DMEDNRO && fechatrasm.getTime() == reclamoRes.FECHATRASM.getTime()){
                        const updated = await pool.query('UPDATE reclamos SET ? WHERE DMEDNRO = ? AND FECHATRASM = ?', [reclamoRes, dmednro, fechatrasm])
                        
                        res.json({
                            codigo: 'Exito',
                            mensaje: 'Se ha modificado un reclamo',
                            respuesta: updated
                        })

                    }else {
                        // SI LOS DATOS NO DISPONIBLES NO SON DE LOS DATOS QUE QUEREMOS
                        // MODIFICAR (EN ESTE CASO SI SON DE OTROS DATOS NO RELACIONADOS)
                        // NO SE PROCEDE A LA MODIFICACION PORQUE YA EXISTE OTRO.
                        res.json({
                            codigo: 'Error',
                            mensaje: 'Ya existe este reclamo'
                        })
                    }
                }
            } else {
                // NO SE MODIFICA LOS DATOS SI ES QUE TIENE CARACTERES ESPECIALES COMO
                // / \
                res.json({
                    codigo: 'Error',
                    mensaje: 'No puede agregar datos con / \\.\nFavor usar -'
                })
            }


        } else {
            // SI NO EXISTE ALGUNO DE LOS DATOS IMPORTANTES QUE
            // IDENTIFICA A UN RECLAMO
            // NO SE AGREGA NADA
            res.json({
                codigo: 'Error',
                mensaje: 'Debe ingresar los datos de DMEDNRO, FECHATRASM'
            })
        }

    } catch (error) {
        res.status(500).json({
            codigo: 'Error0001',
            mensaje: 'Hubo un problema',
            respuesta: error
        })
    }
}

controllerReclamos.delete = async (req, res) => {
    const {dmednro, dia, mes, anho} = req.params

    const fecha = anho + '/' + mes + '/' + dia
    const fechatrasm = new Date(fecha)

    try {
        const deleted = await pool.query('DELETE FROM reclamos WHERE DMEDNRO = ? AND FECHATRASM = ?', [dmednro, fechatrasm])
        
        res.json({
            codigo: 'Exito',
            mensaje: 'Se ha eliminado un reclamo',
            respuesta: await deleted
        })
    } catch (error) {
        res.json({
            codigo: 'Error0000',
            mensaje: 'Hubo un problema',
            respuesta: error
        })
    }
}

module.exports = controllerReclamos