const controllerReclamos = {}
const pool = require('../database/index')
const path = require('path')
const Excel = require('exceljs')
const {verificacionDeCaracteres, dataConversionReclamos} = require('../helpers/general')
const Reclamo = require('../models/Reclamo')
const Respuesta = require('../models/Respuesta')

controllerReclamos.list = async (req, res) => {
    
    let respuesta = null

    try {
        const reclamos = await Reclamo.listaReclamos()

        respuesta = new Respuesta({
            status: 200,
            codigo: 'Exito',
            mensaje: 'Lista de reclamos enviada con exito',
            resultado: reclamos
        })

        return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )
        
    } catch (error) {
        respuesta = new Respuesta({
            status: 500,
            codigo: 'Error',
            mensaje: 'Hubo un problema',
            resultado: error
        })

        return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )
    }
}

controllerReclamos.listPagination = async (req, res) => {
    const { page, limit } = req.params

    // calculate offset
    let limitAux = parseInt(limit)
    let offset = (parseInt(page) - 1) * limitAux
    let respuesta = null

    try {
        const reclamos = await Reclamo.obtenerDatosPaginados( limitAux, offset )
        
        respuesta = new Respuesta({
            status: 200,
            codigo: 'Exito',
            mensaje: 'Lista de reclamos páginada enviada con exito',
            resultado: reclamos
        })

        return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

    } catch (error) {
        respuesta = new Respuesta({
            status: 500,
            codigo: 'Error',
            mensaje: 'Hubo un problema',
            resultado: error
        })

        return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

    }
}

controllerReclamos.oneReclamos = async (req, res) => {
    const {dmednro, dia, mes, anho} = req.params
    let respuesta = null

    try {
        let anhoValido = anho
        let mesValido = mes.length == 1 ? `0${mes}` : mes
        let diaValido = dia.length == 1 ? `0${dia}` : dia
        let fechaString = `${ anhoValido }-${ mesValido }-${ diaValido }T13:00:00.000Z`
        const fechatrasm = new Date(fechaString)

        const reclamo = await Reclamo.obtenerReclamo( dmednro, fechatrasm )
        
        respuesta = new Respuesta({
            status: 200,
            codigo: 'Exito',
            mensaje: 'Reclamo enviado con exito.',
            resultado: reclamo
        })
        
        return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )
        
    } catch (error) {
        respuesta = new Respuesta({
            status: 500,
            codigo: 'Error',
            mensaje: 'Hubo un problema.',
            resultado: error
        })

        return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )
    }
}

controllerReclamos.informeXLSX_Reclamos = async (req, res) => {
    const {dmednro, dia, mes, anho} = req.params
    
    let anhoValido = anho
    let mesValido = mes.length == 1 ? `0${mes}` : mes
    let diaValido = dia.length == 1 ? `0${dia}` : dia
    let fechaString = `${ anhoValido }-${ mesValido }-${ diaValido }T13:00:00.000Z`
    const fechatrasm = new Date(fechaString)
    
    const dir = path.join(__dirname, '..', 'storage', 'ANDE_Informe_Reclamos.xlsx')

    const reclamo = await pool.query('SELECT * FROM reclamos WHERE DMEDNRO = ? AND FECHATRASM = ?', [dmednro, fechatrasm.toISOString().substr(0, 10)])

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
    let respuesta = null

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
                const fechaString = reclamoRes.FECHATRASM.toISOString().substr(0, 10)
                const row = await pool.query('SELECT * FROM reclamos WHERE DMEDNRO = ? AND FECHATRASM = ?', [reclamoRes.DMEDNRO, fechaString])

                // SI ESTA DISPOBIBLE LOS DATOS A AGREGAR
                if ( !row.length ) {
                    const reclamo = await Reclamo.agregarReclamo( reclamoRes )

                    respuesta = new Respuesta({
                        status: 200,
                        codigo: 'Exito',
                        mensaje: 'Se ha registrado de forma exitosa el Reclamo.',
                        resultado: reclamo
                    })
    
                    return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

                // SINO ESTA DISPOBIBLE LOS DATOS A AGREGAR
                } else {
                    respuesta = new Respuesta({
                        status: 400,
                        codigo: 'Error',
                        mensaje: 'Ya existe este reclamo'
                    })

                    return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

                }
            
            } else {
                // NO SE MODIFICA LOS DATOS SI ES QUE TIENE CARACTERES ESPECIALES COMO
                // / \
                respuesta = new Respuesta({
                    status: 400,
                    codigo: 'Error',
                    mensaje: 'No puede agregar datos con / \\.\nFavor usar -'
                })

                return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )
            }

        } else {
            // SI NO EXISTE ALGUNO DE LOS DATOS IMPORTANTES QUE
            // IDENTIFICA A UN RECLAMO
            // NO SE AGREGA NADA
            respuesta = new Respuesta({
                status: 400,
                codigo: 'Error',
                mensaje: 'Debe ingresar los datos de DMEDNRO, FECHATRASM'
            })

            return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

        }
    } catch (error) {
        console.log('error', error)

        respuesta = new Respuesta({
            status: 500,
            codigo: 'Error',
            mensaje: 'Hubo un problema',
            resultado: error
        })

        return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

    }
}

controllerReclamos.update = async (req, res) => {
    const {reclamo} = req.body
    const {dmednro, dia, mes, anho} = req.params

    let anhoValido = anho
    let mesValido = mes.length == 1 ? `0${mes}` : mes
    let diaValido = dia.length == 1 ? `0${dia}` : dia
    let fechaString = `${ anhoValido }-${ mesValido }-${ diaValido }T13:00:00.000Z`
    const fechatrasm = new Date(fechaString)
    let respuesta = null
    
    try {
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
                // VERIFICAMOS SI LOS DATOS A MODIFICAR ESTAN DISPONIBLES
                const fechaString = reclamoRes.FECHATRASM.toISOString().substr(0, 10)
                const row = await pool.query('SELECT * FROM reclamos WHERE DMEDNRO = ? AND FECHATRASM = ?', [reclamoRes.DMEDNRO, fechaString])

                // SI ESTA DISPOBIBLE LOS DATOS A MODIFICAR
                if ( !row.length ) {
                    const updated = await Reclamo.actualizarReclamo( reclamoRes, dmednro, fechatrasm )

                    respuesta = new Respuesta({
                        status: 200,
                        codigo: 'Exito',
                        mensaje: 'Se ha modificado un reclamo',
                        resultado: updated
                    })

                    return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

                } else {
                    // SINO ESTA DISPOBIBLE LOS DATOS A MODIFICAR.

                    // SI LOS DATOS NO DISPONIBLES SON DE LOS DATOS QUE QUEREMOS
                    // MODIFICAR, SE PROCEDE A LA MODIFICACION.
                    if ( dmednro == reclamoRes.DMEDNRO && fechatrasm.toISOString().substr(0, 10) == reclamoRes.FECHATRASM.toISOString().substr(0, 10) ) {
                        const updated = await Reclamo.actualizarReclamo( reclamoRes, dmednro, fechatrasm )

                        respuesta = new Respuesta({
                            status: 200,
                            codigo: 'Exito',
                            mensaje: 'Se ha modificado un reclamo',
                            resultado: updated
                        })
    
                        return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

                    }else {
                        // SI LOS DATOS NO DISPONIBLES NO SON DE LOS DATOS QUE QUEREMOS
                        // MODIFICAR (EN ESTE CASO SI SON DE OTROS DATOS NO RELACIONADOS)
                        // NO SE PROCEDE A LA MODIFICACION PORQUE YA EXISTE OTRO.
                        respuesta = new Respuesta({
                            status: 400,
                            codigo: 'Error',
                            mensaje: 'Ya existe este reclamo'
                        })
    
                        return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )
                    }
                }
            } else {
                // NO SE MODIFICA LOS DATOS SI ES QUE TIENE CARACTERES ESPECIALES COMO
                // / \
                respuesta = new Respuesta({
                    status: 400,
                    codigo: 'Error',
                    mensaje: 'No puede agregar datos con / \\.\nFavor usar -'
                })

                return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

            }


        } else {
            // SI NO EXISTE ALGUNO DE LOS DATOS IMPORTANTES QUE
            // IDENTIFICA A UN RECLAMO
            // NO SE AGREGA NADA
            respuesta = new Respuesta({
                status: 400,
                codigo: 'Error',
                mensaje: 'Debe ingresar los datos de DMEDNRO, FECHATRASM'
            })

            return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

        }

    } catch (error) {
        respuesta = new Respuesta({
            status: 500,
            codigo: 'Error',
            mensaje: 'Hubo un problema',
            respuesta: error
        })

        return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

    }
}

controllerReclamos.delete = async (req, res) => {
    const {dmednro, dia, mes, anho} = req.params

    let anhoValido = anho
    let mesValido = mes.length == 1 ? `0${mes}` : mes
    let diaValido = dia.length == 1 ? `0${dia}` : dia
    let fechaString = `${ anhoValido }-${ mesValido }-${ diaValido }T13:00:00.000Z`
    const fechatrasm = new Date(fechaString)
    let respuesta = null

    try {
        const deleted = await Reclamo.eliminarReclamo( dmednro, fechatrasm )

        respuesta = new Respuesta({
            status: 200,
            codigo: 'Exito',
            mensaje: 'Se ha eliminado un reclamo.',
            respuesta: deleted
        })

        return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )
        
    } catch (error) {
        respuesta = new Respuesta({
            status: 500,
            codigo: 'Error',
            mensaje: 'Hubo un problema',
            respuesta: error
        })

        return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

    }
}

module.exports = controllerReclamos