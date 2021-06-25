controllerPd = {}
const pool = require('../database/index')
const path = require('path')
const Excel = require('exceljs')
const {verificacionDeCaracteres, dataConversionPd} = require('../algoritmos/general')

controllerPd.list = async (req, res) => {
    try {
        const rows = await pool.query('SELECT * FROM pddatos ORDER BY PDFECHA DESC')

        res.status(200).json({
            codigo: 'Exito',
            mensaje: 'Lista de pedido de disponibilidad enviado con exito',
            respuesta: rows
        })
    } catch (error) {
        res.status(500).json({
            codigo: 'Error002',
            mensaje: 'Hubo un problema',
            respuesta: error
        })
    }
}

controllerPd.onePd = async (req, res) => {
    let { pdnro, dia, mes, anho } = req.params

    let pdfechaString = anho + '/' + mes + '/' + dia
    const pdfecha = new Date(pdfechaString)

    try {
        const row = await pool.query('SELECT * FROM pddatos WHERE NROPROG = ? AND PDFECHA = ?', [pdnro, pdfecha])

        res.status(200).json({
            codigo: 'Exito',
            mensaje: 'Pedido de disponibilidad enviado con exito',
            respuesta: row
        })
    } catch (error) {
        res.status(500).json({
            codigo: 'Error0000',
            mensaje: 'Hubo un problema',
            respuesta: error
        })
    }
}

controllerPd.onePdTrabajos = async (req, res) => {
    let { pdnro, dia, mes, anho } = req.params
    
    let pdfechaString = anho + '/' + mes + '/' + dia
    const pdfecha = new Date(pdfechaString)

    try {
        const row = await pool.query('SELECT * FROM pd WHERE NROPROG = ? AND PDFECHA = ?', [pdnro, pdfecha])

        res.status(200).json({
            codigo: 'Exito',
            mensaje: 'Trabajos de pedido de disponibilidad enviado con exito',
            respuesta: row
        })
    } catch (error) {
        res.status(500).json({
            codigo: 'Error0000',
            mensaje: 'Hubo un problema',
            respuesta: error
        })
    }

}

controllerPd.ultimoInformePD = async (req, res) => {
    const dir = path.join(__dirname, '..', 'storage', 'ANDE_Informe_PedidoDisponibilidad.xlsx')
    res.sendFile(dir)
}

controllerPd.getReclamo = async (req, res) => {
    const { dmednro, dia, mes, anho } = req.params
    
    const fechatrasmString = anho + '/' + mes + '/' + dia
    const fechatrasm = new Date(fechatrasmString)

    try {
        console.log(dmednro)
        console.log(fechatrasm)
        const response = await pool.query('SELECT * FROM reclamos WHERE DMEDNRO = ? AND FECHATRASM = ?', [dmednro, fechatrasm])

        res.status(200).json({
            codigo: 'Exito',
            mensaje: 'Reclamo para el pedido de disponibilidad enviado con exito.',
            respuesta: response
        })
    } catch (error) {
        res.status(500).json({
            codigo: 'Error0000',
            mensaje: 'Hubo un problema',
            respuesta: error
        })
    }

}

controllerPd.informeXLSX = async (req, res) => {
    const { pdnro, dia, mes, anho } = req.params
    
    let pdfechaString = anho + '/' + mes + '/' + dia
    const pdfecha = new Date(pdfechaString)

    const rowPdDatos = await pool.query('SELECT * FROM pddatos WHERE NROPROG = ? AND PDFECHA = ?', [pdnro, pdfecha])

    const rowPd = await pool.query('SELECT * FROM pd WHERE NROPROG = ? AND PDFECHA = ?', [pdnro, pdfecha])

    const nro_rec = await rowPdDatos[0].NRO_REC
    const fecha_rec = await rowPdDatos[0].FECHA_REC

    const reclamoPD = await pool.query('SELECT * FROM reclamos WHERE DMEDNRO = ? AND FECHATRASM = ?', [nro_rec, fecha_rec])

    const dir = path.join(__dirname, '..', 'storage', 'ANDE_Informe_PedidoDisponibilidad.xlsx')
    // const dir = 'https://firebasestorage.googleapis.com/v0/b/sistemareclamosande2021.appspot.com/o/InformePD%2FANDE_Informe_PedidoDisponibilidad.xlsx?alt=media&token=c380e10c-2b0d-4b7c-83a1-7a5cc0c60006'

    var workbook = new Excel.Workbook()
    workbook = await workbook.xlsx.readFile(dir);

    // await dataExcel(workbook, dir, rowPdDatos, rowPd)
    // const respuesta = await workbook.xlsx.readFile(dir)
    var worksheet = await workbook.getWorksheet(1);

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

const dataExcel = async (workbook, dir, rowPdDatos, rowPd) => {
    const respuesta = await workbook.xlsx.readFile(dir)
    var worksheet = workbook.getWorksheet(1);

    // clear data
    worksheet.getRow(3).getCell(3).value = ''
    worksheet.getRow(4).getCell(3).value = ''
    worksheet.getRow(5).getCell(3).value = ''

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
    worksheet.getRow(3).getCell(3).value = rowPdDatos[0].LOCAL
    worksheet.getRow(4).getCell(3).value = rowPdDatos[0].CIRCUITO
    worksheet.getRow(5).getCell(3).value = rowPdDatos[0].EQUIPO
    worksheet.getRow(3).getCell(6).value = rowPdDatos[0].ESTADO
    worksheet.getRow(3).getCell(7).value = rowPdDatos[0].TRABAJO
    worksheet.getRow(3).getCell(9).value = rowPdDatos[0].RESPONSABLE
    worksheet.getRow(3).getCell(10).value = rowPdDatos[0].OBSERVACION

    worksheet.getRow(3).getCell(16).value = rowPdDatos[0].NROPROG

    for (let i = 14, j = 0; i <= 20 && j < rowPd.length; i++, j++) {
        worksheet.getRow(i).getCell(1).value = rowPd[j].FECHATRA
        worksheet.getRow(i).getCell(8).value = rowPd[j].HORAINI
        worksheet.getRow(i).getCell(13).value = rowPd[j].HORAFIN
    }

    worksheet.getRow(22).getCell(3).value = rowPdDatos[0].RECIBIDO
    worksheet.getRow(22).getCell(13).value = rowPdDatos[0].PDFECHA.substring(0, 10)
    worksheet.getRow(22).getCell(15).value = rowPdDatos[0].HORATRAS
    worksheet.getRow(23).getCell(3).value = rowPdDatos[0].PDTRASMI

    console.log(1)
    return workbook.xlsx.writeFile(dir)
}

controllerPd.add = async (req, res) => {
    const {pd, pdTrabajos} = req.body

    try {
        let pdRes = JSON.parse(JSON.stringify(pd))
        let pdTrabajosRes = JSON.parse(JSON.stringify(pdTrabajos))

        let conversion = dataConversionPd(pdRes, pdTrabajosRes)
        pdRes = conversion.pddatos
        pdTrabajosRes = conversion.pd

        console.log('conversion', conversion)
        console.log('pdRes', pdRes)
        console.log('pdTrabajosRes', pdTrabajosRes)

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
                const row = await pool.query('SELECT * FROM pddatos WHERE NROPROG = ? AND PDFECHA = ?', [pdRes.NROPROG, pdRes.PDFECHA])

                // SI ESTA DISPOBIBLE LOS DATOS A AGREGAR
                if(row.length == 0){
                    const result = await pool.query('INSERT INTO pddatos SET ?', [pdRes])
                    let resultpd = []
                    for (let i = 0; i < pdTrabajos.length; i++) {
                        resultpd.push(await pool.query('INSERT INTO pd SET ?', [pdTrabajosRes[i]]))
                    }
                    
                    res.status(200).json({
                        codigo: 'Exito',
                        mensaje: 'Se ha registrado un pedido de disponibilidad.',
                        respuesta: {
                            result,
                            resultpd
                        }
                    })

                // SINO ESTA DISPOBIBLE LOS DATOS A AGREGAR
                }else {
                    res.status(500).json({
                        codigo: 'Error',
                        mensaje: 'Ya existe este pedido de disponibilidad.'
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
            // IDENTIFICA A UN PEDIDO DE DISPONIBILIDAD
            // NO SE AGREGA NADA
            res.json({
                codigo: 'Error',
                mensaje: 'Debe ingresar los datos de NROPROG y PDFECHA.'
            })
        }
    } catch (error) {
        console.log('error', error)

        res.json({
            codigo: 'Error',
            mensaje: 'Hubo un error.',
            respuesta: error
        })
    }
}

controllerPd.delete = async (req, res) => {
    let { pdnro, dia, mes, anho } = req.params

    let pdfechaString = anho + '/' + mes + '/' + dia

    const pdfecha = new Date(pdfechaString)

    try {
        const deletedPDDATOS = await pool.query('DELETE FROM pddatos WHERE NROPROG = ? AND PDFECHA = ?', [pdnro, pdfecha])
        const deletedPD = await pool.query('DELETE FROM pd WHERE NROPROG = ? AND PDFECHA = ?', [pdnro, pdfecha])

        res.status(200).json({
            codigo: 'Exito',
            mensaje: 'Pedido de disponibilidad y sus trabajos eliminados con exito.',
            respuesta: {
                deletedPDDATOS,
                deletedPD
            }
        })
    } catch (error) {
        res.status(500).json({
            codigo: 'Error0000',
            mensaje: 'Hubo un problema',
            respuesta: error
        })
    }
}

controllerPd.update = async (req, res) => {
    const { pdnro, dia, mes, anho } = req.params
    const {pd, pdTrabajos} = req.body

    try {
        console.log('pd', pd)
        console.log('pdTrabajos', pdTrabajos)

        let pdfechaString = anho + '/' + mes + '/' + dia
        const pdfecha = new Date(pdfechaString)
        console.log('pdfechaString', pdfechaString)
        console.log('pdfecha', pdfecha)

        let pdRes = JSON.parse(JSON.stringify(pd))
        let pdTrabajosRes = JSON.parse(JSON.stringify(pdTrabajos))

        let conversion = dataConversionPd(pdRes, pdTrabajosRes)
        console.log('conversion', conversion)
        
        pdRes = conversion.pddatos
        pdTrabajosRes = conversion.pd
        console.log('pdRes', pdRes)
        console.log('pdTrabajosRes', pdTrabajosRes)

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
                const row = await pool.query('SELECT * FROM pddatos WHERE NROPROG = ? AND PDFECHA = ?', [pdRes.NROPROG, pdRes.PDFECHA])

                // SI ESTA DISPOBIBLE LOS DATOS A AGREGAR
                if(row.length == 0){

                    const updated = await pool.query('UPDATE pddatos SET ? WHERE NROPROG = ? AND PDFECHA = ?', [pdRes, pdnro, pdfecha])
                    let updatedPd = []

                    await pool.query('DELETE FROM pd WHERE NROPROG = ? AND PDFECHA = ?', [pdnro, pdfecha])

                    for (let i = 0; i < pdTrabajos.length; i++) {
                        updatedPd.push(await pool.query('INSERT INTO pd SET ?', [pdTrabajosRes[i]]))
                    }
                    
                    res.status(200).json({
                        codigo: 'Exito',
                        mensaje: 'Se ha modificado un pedido de disponibilidad.',
                        respuesta: {
                            updated,
                            updatedPd
                        }
                    })

                // SINO ESTA DISPOBIBLE LOS DATOS A AGREGAR
                }else {
                    // SI LOS DATOS NO DISPONIBLES SON DE LOS DATOS QUE QUEREMOS
                    // MODIFICAR, SE PROCEDE A LA MODIFICACION

                    console.log('pdnro == pdRes.NROPROG', pdnro == pdRes.NROPROG)
                    console.log('pdnro - typeof pdnro', pdnro, typeof pdnro)
                    console.log('pdRes.NROPROG - typeof pdRes.NROPROG', pdRes.NROPROG, typeof pdRes.NROPROG)

                    console.log('pdfecha == pdRes.PDFECHA', pdfecha.getTime() == pdRes.PDFECHA.getTime())
                    console.log('pdfecha - typeof pdfecha', pdfecha, typeof pdfecha)
                    console.log('pdRes.PDFECHA - typeof pdRes.PDFECHA', pdRes.PDFECHA, typeof pdRes.PDFECHA)

                    if(pdnro == pdRes.NROPROG && pdfecha.getTime() == pdRes.PDFECHA.getTime()){

                        const updated = await pool.query('UPDATE pddatos SET ? WHERE NROPROG = ? AND PDFECHA = ?', [pdRes, pdnro, pdfecha])
                        let updatedPd = []

                        await pool.query('DELETE FROM pd WHERE NROPROG = ? AND PDFECHA = ?', [pdnro, pdfecha])

                        for (let i = 0; i < pdTrabajos.length; i++) {
                            updatedPd.push(await pool.query('INSERT INTO pd SET ?', [pdTrabajosRes[i]]))
                        }
                        
                        res.status(200).json({
                            codigo: 'Exito',
                            mensaje: 'Se ha modificado un pedido de disponibilidad.',
                            respuesta: {
                                updated,
                                updatedPd
                            }
                        })

                    // SI LOS DATOS NO DISPONIBLES NO SON DE LOS DATOS QUE QUEREMOS
                    // MODIFICAR (EN ESTE CASO SI SON DE OTROS DATOS NO RELACIONADOS)
                    // NO SE PROCEDE A LA MODIFICACION PORQUE YA EXISTE OTRO 
                    }else {

                        res.status(500).json({
                            codigo: 'Error',
                            mensaje: 'Ya existe este pedido de disponibilidad.'
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
            // IDENTIFICA A UN PEDIDO DE DISPONIBILIDAD
            // NO SE AGREGA NADA
            res.json({
                codigo: 'Error',
                mensaje: 'Debe ingresar los datos de NROPROG y PDFECHA'
            })
        }
    } catch (error) {
        console.log('error', error)

        res.json({
            codigo: 'Error',
            mensaje: 'Hubo un error.',
            respuesta: error
        })
    }
}

module.exports = controllerPd