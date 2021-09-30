controllerPd = {}
const pool = require('../database/index')
const path = require('path')
const Excel = require('exceljs')
const {verificacionDeCaracteres, dataConversionPd} = require('../helpers/general')
const PedidoDisponibilidad = require('../models/PedidoDisponibilidad')
const PdTrabajo = require('../models/PdTrabajo')
const Reclamo = require('../models/Reclamo')
const Respuesta = require('../models/Respuesta')

controllerPd.list = async (req, res) => {
    let respuesta = null

    try {
        const rows = await PedidoDisponibilidad.listaPedidoDisponibilidad()

        respuesta = new Respuesta({
            status: 200,
            codigo: 'Exito',
            mensaje: 'Lista de pedido de disponibilidad enviado con exito',
            resultado: rows
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

controllerPd.onePd = async (req, res) => {
    let { pdnro, dia, mes, anho } = req.params

    let anhoValido = anho
    let mesValido = mes.length == 1 ? `0${mes}` : mes
    let diaValido = dia.length == 1 ? `0${dia}` : dia
    let pdfechaString = `${ anhoValido }-${ mesValido }-${ diaValido }T13:00:00.000Z`
    const pdfecha = new Date(pdfechaString)
    let respuesta = null

    try {
        const row = await PedidoDisponibilidad.unPedidoDisponibilidad( pdnro, pdfecha )

        respuesta = new Respuesta({
            status: 200,
            codigo: 'Exito',
            mensaje: 'Pedido de disponibilidad enviado con exito',
            resultado: row
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

controllerPd.onePdTrabajos = async (req, res) => {
    let { pdnro, dia, mes, anho } = req.params
    
    let anhoValido = anho
    let mesValido = mes.length == 1 ? `0${mes}` : mes
    let diaValido = dia.length == 1 ? `0${dia}` : dia
    let pdfechaString = `${ anhoValido }-${ mesValido }-${ diaValido }T13:00:00.000Z`
    const pdfecha = new Date(pdfechaString)
    let respuesta = null

    try {
        const row = await PdTrabajo.unPdTrabajo( pdnro, pdfecha )

        respuesta = new Respuesta({
            status: 200,
            codigo: 'Exito',
            mensaje: 'Trabajos de pedido de disponibilidad enviado con exito',
            resultado: row
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

controllerPd.getReclamo = async (req, res) => {
    const { dmednro, dia, mes, anho } = req.params
    
    let anhoValido = anho
    let mesValido = mes.length == 1 ? `0${mes}` : mes
    let diaValido = dia.length == 1 ? `0${dia}` : dia
    const fechatrasmString = `${ anhoValido }-${ mesValido }-${ diaValido }T13:00:00.000Z`
    const fechatrasm = new Date(fechatrasmString)
    let respuesta = null

    try {
        const response = await Reclamo.obtenerReclamo( dmednro, fechatrasm )

        respuesta = new Respuesta({
            status: 200,
            codigo: 'Exito',
            mensaje: 'Reclamo para el pedido de disponibilidad enviado con exito.',
            resultado: response
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

controllerPd.informeXLSX = async (req, res) => {
    let { pdnro, dia, mes, anho } = req.params
    
    // let pdfechaString = `${anho}-${ mes.length == 1 ? `0${mes}` : mes }-${ dia.length == 1 ? `0${dia}` : dia }T13:00:00.000Z`
    // let pdfechaString = `${anho}/${mes}/${dia}`
    let anhoValido = anho
    let mesValido = mes.length == 1 ? `0${mes}` : mes 
    let diaValido = dia.length == 1 ? `0${dia}` : dia
    let pdfechaString = `${ anhoValido }-${ mesValido }-${ diaValido }T13:00:00.000Z`
    const pdfecha = new Date(pdfechaString)

    const rowPdDatos = await pool.query('SELECT * FROM pddatos WHERE NROPROG = ? AND PDFECHA = ?', [pdnro, pdfecha.toISOString().substr(0, 10)])

    if ( !rowPdDatos.length ) {
        return res.status(400).json({
            codigo: 'Error',
            mensaje: 'No existe este pedido de disponibilidad.',
            respuesta: null
        })
    }

    const rowPd = await pool.query('SELECT * FROM pd WHERE NROPROG = ? AND PDFECHA = ?', [pdnro, pdfecha.toISOString().substr(0, 10)])

    const nro_rec = rowPdDatos[0].NRO_REC
    const fecha_rec = rowPdDatos[0].FECHA_REC

    const reclamoPD = nro_rec && fecha_rec ?
    await pool.query('SELECT * FROM reclamos WHERE DMEDNRO = ? AND FECHATRASM = ?', [nro_rec, fecha_rec.toISOString().substr(0, 10)]) : []

    const dir = path.join(__dirname, '..', 'storage', 'ANDE_Informe_PedidoDisponibilidad.xlsx')
    // const dir = 'https://firebasestorage.googleapis.com/v0/b/sistemareclamosande2021.appspot.com/o/InformePD%2FANDE_Informe_PedidoDisponibilidad.xlsx?alt=media&token=c380e10c-2b0d-4b7c-83a1-7a5cc0c60006'

    var workbook = new Excel.Workbook()
    workbook = await workbook.xlsx.readFile(dir)

    // await dataExcel(workbook, dir, rowPdDatos, rowPd)
    // const respuesta = await workbook.xlsx.readFile(dir)
    var worksheet = await workbook.getWorksheet(1)

    // clear data
    worksheet.getRow(3).getCell(3).value = ''
    worksheet.getRow(4).getCell(3).value = ''
    worksheet.getRow(5).getCell(3).value = ''
    worksheet.getRow(6).getCell(3).value = ''
    worksheet.getRow(7).getCell(3).value = ''
    worksheet.getRow(9).getCell(3).value = ''
    worksheet.getRow(10).getCell(3).value = ''

    worksheet.getRow(3).getCell(16).value = ''

    for (let i = 14; i <= 20; i++) {
        worksheet.getRow(i).getCell(1).value = ''
        worksheet.getRow(i).getCell(8).value = ''
        worksheet.getRow(i).getCell(13).value = ''
    }

    worksheet.getRow(22).getCell(3).value = ''
    worksheet.getRow(22).getCell(13).value = ''
    worksheet.getRow(22).getCell(15).value = ''
    worksheet.getRow(23).getCell(3).value = ''

    // add data
    worksheet.getRow(3).getCell(3).value = await rowPdDatos[0].LOCAL
    worksheet.getRow(4).getCell(3).value = await rowPdDatos[0].CIRCUITO
    worksheet.getRow(5).getCell(3).value = await rowPdDatos[0].EQUIPO
    worksheet.getRow(6).getCell(3).value = await rowPdDatos[0].ESTADO
    worksheet.getRow(7).getCell(3).value = await rowPdDatos[0].TRABAJO
    worksheet.getRow(9).getCell(4).value = await rowPdDatos[0].RESPONSABLE
    worksheet.getRow(10).getCell(4).value = await rowPdDatos[0].OBSERVACION

    worksheet.getRow(3).getCell(16).value = await rowPdDatos[0].NROPROG
    if(await reclamoPD.length > 0){
        worksheet.getRow(4).getCell(13).value = await reclamoPD[0].OTRADEP
        worksheet.getRow(4).getCell(16).value = await reclamoPD[0].NROOTRADE
    }

    let rowLength = await rowPd.length

    for (let i = 14, j = 0; i <= 20 && j < rowLength; i++, j++) {
        worksheet.getRow(i).getCell(1).value = await rowPd[j].FECHATRA
        worksheet.getRow(i).getCell(8).value = await rowPd[j].HORAINI
        worksheet.getRow(i).getCell(13).value = await rowPd[j].HORAFIN
    }

    worksheet.getRow(22).getCell(4).value = await rowPdDatos[0].RECIBIDO
    worksheet.getRow(22).getCell(13).value = await rowPdDatos[0].PDFECHA.toISOString().substring(0,10)
    worksheet.getRow(22).getCell(15).value = await rowPdDatos[0].HORATRAS
    worksheet.getRow(23).getCell(4).value = await rowPdDatos[0].PDTRASMI

    const buffer = await workbook.xlsx.writeBuffer()

    const fileName = 'ANDE_Informe_PedidoDisponibilidad.xlsx'

    res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename="' + fileName + '"',
        'x-processed-filename': fileName // <= cabezera personalizada para enviar el nombre del archivo procesado para su descarga
    });

    await res.status(200).send(buffer)
}

controllerPd.ultimoInformePD = async (req, res) => {
    const dir = path.join(__dirname, '..', 'storage', 'ANDE_Informe_PedidoDisponibilidad.xlsx')
    res.sendFile(dir)
}

controllerPd.add = async (req, res) => {
    const {pd, pdTrabajos} = req.body
    let respuesta = null

    try {
        let pdRes = JSON.parse(JSON.stringify(pd))
        let pdTrabajosRes = JSON.parse(JSON.stringify(pdTrabajos))

        let conversion = dataConversionPd(pdRes, pdTrabajosRes)
        pdRes = conversion.pddatos
        pdTrabajosRes = conversion.pd

        // VERIFICACION DE QUE EXISTA ESTOS DATOS IMPORTANTES QUE
        // IDENTIFICAN A UN PEDIDO DE DISPONIBILIDAD
        if(!!pdRes.NROPROG && !!pdRes.PDFECHA)
        {
            // VERIFICACION DE QUE NO EXISTA / \ EN ESTOS DATOS
            if(verificacionDeCaracteres(pdRes.NROPROG)
                && verificacionDeCaracteres(pdRes.LOCAL) 
                && verificacionDeCaracteres(pdRes.CIRCUITO)
                && verificacionDeCaracteres(pdRes.EQUIPO)
                && verificacionDeCaracteres(pdRes.NRO_REC))
            {
                // VERIFICAMOS SI LOS DATOS A AGREGAR ESTAN DISPONIBLES
                const row = await pool.query('SELECT * FROM pddatos WHERE NROPROG = ? AND PDFECHA = ?', [pdRes.NROPROG, pdRes.PDFECHA.toISOString().substr(0, 10)])

                // SI ESTA DISPOBIBLE LOS DATOS A AGREGAR
                if ( !row.length ) {
                    const response = await PedidoDisponibilidad.agregarPedidoDisponibilidad( pdRes, pdTrabajosRes )

                    respuesta = new Respuesta({
                        status: 200,
                        codigo: 'Exito',
                        mensaje: 'Se ha registrado un pedido de disponibilidad.',
                        resultado: response
                    })

                    return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

                // SINO ESTA DISPOBIBLE LOS DATOS A AGREGAR
                } else {
                    respuesta = new Respuesta({
                        status: 400,
                        codigo: 'Error',
                        mensaje: 'Ya existe este pedido de disponibilidad.'
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
            // IDENTIFICA A UN PEDIDO DE DISPONIBILIDAD
            // NO SE AGREGA NADA
            respuesta = new Respuesta({
                status: 400,
                codigo: 'Error',
                mensaje: 'Debe ingresar los datos de NROPROG y PDFECHA.'
            })

            return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )
            
        }
    } catch (error) {
        console.log('error', error)

        respuesta = new Respuesta({
            status: 500,
            codigo: 'Error',
            mensaje: 'Hubo un error.',
        })

        return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

    }
}

controllerPd.delete = async (req, res) => {
    let { pdnro, dia, mes, anho } = req.params

    let anhoValido = anho
    let mesValido = mes.length == 1 ? `0${mes}` : mes 
    let diaValido = dia.length == 1 ? `0${dia}` : dia
    let pdfechaString = `${ anhoValido }-${ mesValido }-${ diaValido }T13:00:00.000Z`

    const pdfecha = new Date(pdfechaString)
    let respuesta = null

    try {
        const response = await PedidoDisponibilidad.eliminarPedidoDisponibilidad( pdnro, pdfecha )

        respuesta = new Respuesta({
            status: 200,
            codigo: 'Exito',
            mensaje: 'Pedido de disponibilidad y sus trabajos eliminados con exito.',
            resultado: response
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

controllerPd.update = async (req, res) => {
    const { pdnro, dia, mes, anho } = req.params
    const {pd, pdTrabajos} = req.body
    let respuesta = null

    try {
        let anhoValido = anho
        let mesValido = mes.length == 1 ? `0${mes}` : mes 
        let diaValido = dia.length == 1 ? `0${dia}` : dia
        let pdfechaString = `${ anhoValido }-${ mesValido }-${ diaValido }T13:00:00.000Z`
        const pdfecha = new Date(pdfechaString)

        let pdRes = JSON.parse(JSON.stringify(pd))
        let pdTrabajosRes = JSON.parse(JSON.stringify(pdTrabajos))

        let conversion = dataConversionPd(pdRes, pdTrabajosRes)
        
        pdRes = conversion.pddatos
        pdTrabajosRes = conversion.pd

        // VERIFICACION DE QUE EXISTA ESTOS DATOS IMPORTANTES QUE
        // IDENTIFICAN A UN PEDIDO DE DISPONIBILIDAD
        if(!!pdRes.NROPROG && !!pdRes.PDFECHA)
        {

            // VERIFICACION DE QUE NO EXISTA / \ EN ESTOS DATOS
            if(verificacionDeCaracteres(pdRes.NROPROG)
                && verificacionDeCaracteres(pdRes.LOCAL) 
                && verificacionDeCaracteres(pdRes.CIRCUITO)
                && verificacionDeCaracteres(pdRes.EQUIPO)
                && verificacionDeCaracteres(pdRes.NRO_REC))
            {

                // VERIFICAMOS SI LOS DATOS A AGREGAR ESTAN DISPONIBLES
                const row = await pool.query('SELECT * FROM pddatos WHERE NROPROG = ? AND PDFECHA = ?', [pdRes.NROPROG, pdRes.PDFECHA.toISOString().substr(0, 10)])

                // SI ESTA DISPOBIBLE LOS DATOS A AGREGAR
                if(row.length == 0){

                    const response = await PedidoDisponibilidad.actualizarPedidoDisponibilidad( pdRes, pdTrabajosRes, pdnro, pdfecha )

                    respuesta = new Respuesta({
                        status: 200,
                        codigo: 'Exito',
                        mensaje: 'Se ha modificado un pedido de disponibilidad.',
                        resultado: response
                    })

                    return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

                // SINO ESTA DISPOBIBLE LOS DATOS A AGREGAR
                }else {
                    // SI LOS DATOS NO DISPONIBLES SON DE LOS DATOS QUE QUEREMOS
                    // MODIFICAR, SE PROCEDE A LA MODIFICACION

                    if( pdnro == pdRes.NROPROG && pdfecha.toISOString().substr(0, 10) == pdRes.PDFECHA.toISOString().substr(0, 10) ){

                        const response = await PedidoDisponibilidad.actualizarPedidoDisponibilidad( pdRes, pdTrabajosRes, pdnro, pdfecha )

                        respuesta = new Respuesta({
                            status: 200,
                            codigo: 'Exito',
                            mensaje: 'Se ha modificado un pedido de disponibilidad.',
                            resultado: response
                        })

                        return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

                    // SI LOS DATOS NO DISPONIBLES NO SON DE LOS DATOS QUE QUEREMOS
                    // MODIFICAR (EN ESTE CASO SI SON DE OTROS DATOS NO RELACIONADOS)
                    // NO SE PROCEDE A LA MODIFICACION PORQUE YA EXISTE OTRO 
                    }else {

                        respuesta = new Respuesta({
                            status: 400,
                            codigo: 'Error',
                            mensaje: 'Ya existe este pedido de disponibilidad.',
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
            // IDENTIFICA A UN PEDIDO DE DISPONIBILIDAD
            // NO SE AGREGA NADA
            respuesta = new Respuesta({
                status: 400,
                codigo: 'Error',
                mensaje: 'Debe ingresar los datos de NROPROG y PDFECHA'
            })

            return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

        }
    } catch (error) {
        console.log('error', error)

        respuesta = new Respuesta({
            status: 500,
            codigo: 'Error',
            mensaje: 'Hubo un error.',
            resultado: error
        })

        return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

    }
}

module.exports = controllerPd