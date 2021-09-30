const controllerPs = {}
const pool = require('../database/index')
const path = require('path')
const Excel = require('exceljs')
const { verificacionDeCaracteres, dataConversionPs } = require('../helpers/general')
const ProgramacionSemanal = require('../models/ProgramacionSemanal')
const PsTrabajo = require('../models/PsTrabajo')
const Respuesta = require('../models/Respuesta')

controllerPs.list = async (req, res) => {
    
    let respuesta = null

    try {
        const rows = await ProgramacionSemanal.listaProgramacionSemanal()

        respuesta = new Respuesta({
            status: 200,
            codigo: 'Exito',
            mensaje: 'Lista de programación semanal enviada con exito',
            resultado: rows
        })

        return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )
        
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

controllerPs.onePs = async (req, res) => {
    let { reufecha, reunro, item } = req.params
    let respuesta = null

    try {
        const row = await ProgramacionSemanal.unaProgramacionSemanal( reufecha, reunro, item )

        respuesta = new Respuesta({
            status: 200,
            codigo: 'Exito',
            mensaje: 'Programación semanal enviada con exito',
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

controllerPs.onePsTrabajos = async (req, res) => {
    let { reufecha, reunro, item } = req.params
    let respuesta = null

    try {
        const row = await PsTrabajo.unaPsTrabajo( reufecha, reunro, item )

        respuesta = new Respuesta({
            status: 200,
            codigo: 'Exito',
            mensaje: 'Programación semanal enviada con exito',
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

controllerPs.addPs = async (req, res) => {
    const {ps, psTrabajos} = req.body
    let respuesta = null

    try {
        let psRes = JSON.parse(JSON.stringify(ps))
        let psTrabajosRes = JSON.parse(JSON.stringify(psTrabajos))
        
        let conversion = dataConversionPs(psRes, psTrabajosRes)
        psRes = conversion.ps
        psTrabajosRes = conversion.psTrabajos
        
        // VERIFICACION DE QUE EXISTA ESTOS DATOS IMPORTANTES QUE
        // IDENTIFICAN A UNA PROGRAMACION SEMANAL
        if(!!psRes.REUFECHA && !!psRes.REUNRO && !!psRes.ITEM)
        {
            // VERIFICACION DE QUE NO EXISTA / \ EN ESTOS DATOS
            if(verificacionDeCaracteres(psRes.REUFECHA) 
                && verificacionDeCaracteres(psRes.REUNRO) 
                && verificacionDeCaracteres(psRes.ITEM)
                && verificacionDeCaracteres(psRes.LOCAL) 
                && verificacionDeCaracteres(psRes.CIRCUITO)
                && verificacionDeCaracteres(psRes.EQUIPO)
                && verificacionDeCaracteres(psRes.NRO_REC))
            {
                // VERIFICAMOS SI LOS DATOS A AGREGAR ESTAN DISPONIBLES
                const row = await ProgramacionSemanal.unaProgramacionSemanal( psRes.REUFECHA, psRes.REUNRO, psRes.ITEM )

                // SI ESTA DISPOBIBLE LOS DATOS A AGREGAR
                if ( !row.length ) {

                    const response = await ProgramacionSemanal.agregarProgramacionSemanal( psRes, psTrabajosRes )

                    respuesta = new Respuesta({
                        status: 200,
                        codigo: 'Exito',
                        mensaje: 'Se ha registrado una Programación semanal',
                        resultado: response
                    })

                    return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )


                // SINO ESTA DISPOBIBLE LOS DATOS A AGREGAR
                }else {
                    respuesta = new Respuesta({
                        status: 400,
                        codigo: 'Error',
                        mensaje: 'Ya existe esta Programación semanal'
                    })

                    return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

                }

            } else {
                // SI NO EXISTE ALGUNO DE LOS DATOS IMPORTANTES QUE
                // IDENTIFICA A UNA PROGRAMACION SEMANAL
                // NO SE AGREGA NADA
                respuesta = new Respuesta({
                    status: 400,
                    codigo: 'Error',
                    mensaje: 'No puede agregar datos con / \\.\nFavor usar -'
                })

                return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

            }

        } else {
            // NO SE MODIFICA LOS DATOS SI ES QUE TIENE CARACTERES ESPECIALES COMO
            // / \
            respuesta = new Respuesta({
                status: 400,
                codigo: 'Error',
                mensaje: 'Debe ingresar los datos de REUFECHA, REUNRO, ITEM y FECHATRABA'
            })

            return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )
        }    
    
    // HUBO UN PROBLEMA
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

controllerPs.update = async (req, res) => {
    let { reufecha, reunro, item } = req.params
    const { ps, psTrabajos } = req.body
    let respuesta = null

    try {
        let psRes = JSON.parse(JSON.stringify(ps))
        let psTrabajosRes = JSON.parse(JSON.stringify(psTrabajos))

        let conversion = dataConversionPs(psRes, psTrabajosRes)
        psRes = conversion.ps
        psTrabajosRes = conversion.psTrabajos

        // VERIFICACION DE QUE EXISTA ESTOS DATOS IMPORTANTES QUE
        // IDENTIFICAN A UNA PROGRAMACION SEMANAL
        if(!!psRes.REUFECHA && !!psRes.REUNRO && !!psRes.ITEM)
        {
            // VERIFICACION DE QUE NO EXISTA / \ EN ESTOS DATOS
            if(verificacionDeCaracteres(psRes.REUFECHA) 
                && verificacionDeCaracteres(psRes.REUNRO) 
                && verificacionDeCaracteres(psRes.ITEM)
                && verificacionDeCaracteres(psRes.LOCAL) 
                && verificacionDeCaracteres(psRes.CIRCUITO)
                && verificacionDeCaracteres(psRes.EQUIPO)
                && verificacionDeCaracteres(psRes.NRO_REC))
            {

                // VERIFICAMOS SI LOS DATOS A AGREGAR ESTAN DISPONIBLES
                const row = await ProgramacionSemanal.unaProgramacionSemanal( psRes.REUFECHA, psRes.REUNRO, psRes.ITEM )
                const exist = row.length > 0

                // SI ESTA DISPOBIBLE LOS DATOS A AGREGAR
                if ( !exist ) {

                    const response = await ProgramacionSemanal.actualizarProgramacionSemanal( psRes, psTrabajosRes, reufecha, reunro, item )

                    respuesta = new Respuesta({
                        status: 200,
                        codigo: 'Exito',
                        mensaje: 'Se ha guardado los cambios de la Programación semanal',
                        resultado: response
                    })

                    return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )
                
                } else {
            
                    // SI LOS DATOS NO DISPONIBLES SON DE LOS DATOS QUE QUEREMOS
                    // MODIFICAR, SE PROCEDE A LA MODIFICACION

                    if( reufecha == psRes.REUFECHA && reunro == psRes.REUNRO && item == psRes.ITEM ) {
                        
                        const response = await ProgramacionSemanal.actualizarProgramacionSemanal( psRes, psTrabajosRes, reufecha, reunro, item )

                        respuesta = new Respuesta({
                            status: 200,
                            codigo: 'Exito',
                            mensaje: 'Se ha guardado los cambios de la Programación semanal',
                            resultado: response
                        })

                        return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

                    // SI LOS DATOS NO DISPONIBLES NO SON DE LOS DATOS QUE QUEREMOS
                    // MODIFICAR (EN ESTE CASO SI SON DE OTROS DATOS NO RELACIONADOS)
                    // NO SE PROCEDE A LA MODIFICACION PORQUE YA EXISTE OTRO 
                    } else {
                        respuesta = new Respuesta({
                            status: 400,
                            codigo: 'Error',
                            mensaje: 'Ya existe esta Programación semanal.'
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
            // IDENTIFICA A UNA PROGRAMACION SEMANAL
            // NO SE MODIFICA NADA
            respuesta = new Respuesta({
                status: 400,
                codigo: 'Error',
                mensaje: 'Debe ingresar los datos de REUFECHA, REUNRO, ITEM y FECHATRABA'
            })

            return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )
        }

    // HUBO UN PROBLEMA 
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

controllerPs.delete = async (req, res) => {
    let { reufecha, reunro, item } = req.params
    let respuesta = null

    try {
        const deleted = await ProgramacionSemanal.eliminarProgramacionSemanal( reufecha, reunro, item )
        const deletedWorks = await PsTrabajo.eliminarPsTrabajo( reufecha, reunro, item )

        respuesta = new Respuesta({
            status: 200,
            codigo: 'Exito',
            mensaje: 'Se ha eliminado una Programación semanal',
            resultado: {
                deleted,
                deletedWorks
            }
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

controllerPs.informeXLSX_PS = async (req, res) => {
    // inicio
    const { reufecha, reunro } = req.params
    let pag = 1
    const dir = path.join(__dirname, '..', 'storage', 'ANDE_Informe_ProgramacionSemanal.xlsx')
    let respuesta = null

    // Seleccion de el archivo a copiar
    var workbookModelo = new Excel.Workbook()
    workbookModelo = await workbookModelo.xlsx.readFile(dir)
    const worksheetModelo = await workbookModelo.getWorksheet(1)

    // creacion del excel a enviar
    const workbook = new Excel.Workbook()
    let worksheets = []

    // proceso de obtener todos los datos a agregar en el informe (datos de informacion y datos de trabajo)
    const rowDatos = await pool.query(`SELECT * FROM prgtraviop1 
                                    WHERE REUFECHA = ? AND REUNRO = ? 
                                    AND ( AMPLIACION != ? OR AMPLIACION = ? OR AMPLIACION IS NULL ) 
                                    AND ( SUSMOD IS NULL OR SUSMOD != 'S' )
                                    ORDER BY prgtraviop1.ITEM ASC`, [reufecha, reunro, 'A', ''])
                                    
    const rowTrabajosDatos = await pool.query(`SELECT A.* FROM prgtraviop1datos A
                                            INNER JOIN prgtraviop1 B
                                            ON A.REUFECHA = B.REUFECHA AND A.REUNRO = B.REUNRO AND A.ITEM = B.ITEM
                                            WHERE B.REUFECHA = ? AND B.REUNRO = ? 
                                            AND ( B.AMPLIACION != ? OR B.AMPLIACION = ? OR B.AMPLIACION IS NULL ) 
                                            AND ( B.SUSMOD IS NULL OR B.SUSMOD != 'S' )
                                            ORDER BY A.ITEM ASC`, [reufecha, reunro, 'A', ''])

    if ( !rowDatos.length ) {
        return res.status(400).send({
            codigo: 'ErrorUsuario',
            mensaje: `No hay ninguna programación semanal de año ${reufecha} y reunión ${reunro} (no ampliado y no suspendido).`,
            resultado: 0
        }) 
    }

    if ( !rowTrabajosDatos.length ) {
        return res.status(400).send({
            codigo: 'ErrorUsuario',
            mensaje: `No hay ningún trabajo de programación semanal de año ${reufecha} y reunión ${reunro} (no ampliado y no suspendido).`,
            resultado: 0
        })  
    }

    let fechaDesde = rowTrabajosDatos[0].FECHATRABA
    let fechaHasta = rowTrabajosDatos[0].FECHATRABA

    for (let i = 1; i < rowTrabajosDatos.length; i++) {
        let fecha = rowTrabajosDatos[i].FECHATRABA
        
        if(fechaDesde > fecha) {
            fechaDesde =  rowTrabajosDatos[i].FECHATRABA
        }

        if(fechaHasta < fecha) {
            fechaHasta =  rowTrabajosDatos[i].FECHATRABA
        }
    }

    // proceso de insertar los datos
    worksheets = createNewWorksheet(workbook, worksheets, worksheetModelo, false, {
        pag,
        fechaDesde,
        fechaHasta,
        reunro,
        reufecha
    })

    for(let i = 0, cont = 1, row = 8; i < rowDatos.length; i++, cont++, row++) {
        if(cont > 20){
            cont = 1
            row = 8
            pag++
            worksheets = createNewWorksheet(workbook, worksheets, worksheetModelo, false, {
                pag, fechaDesde, fechaHasta, reunro, reufecha
            })
        }
    
        worksheets[pag-1].getRow(row).getCell(1).value = rowDatos[i].ITEM
        worksheets[pag-1].getRow(row).getCell(2).value = rowDatos[i].LOCAL
        worksheets[pag-1].getRow(row).getCell(3).value = rowDatos[i].CIRCUITO
        worksheets[pag-1].getRow(row).getCell(4).value = rowDatos[i].EQUIPO

        worksheets[pag-1].getRow(row).getCell(14).value = rowDatos[i].AUT
        worksheets[pag-1].getRow(row).getCell(15).value = rowDatos[i].ESTADO
        worksheets[pag-1].getRow(row).getCell(16).value = rowDatos[i].TRABAJO
        worksheets[pag-1].getRow(row).getCell(17).value = rowDatos[i].RESPONSABLE
        worksheets[pag-1].getRow(row).getCell(18).value = rowDatos[i].OBSERVAC
        worksheets[pag-1].getRow(row).getCell(19).value = rowDatos[i].RESULTADO

        // Sunday -> 0 and Monday -> 1
        let weekday = Array(7).fill(null)

        let horaDesde = rowTrabajosDatos[0].HORADESDE
        let horaHasta = rowTrabajosDatos[0].HORAHASTA
        for(let j = 0; j < rowTrabajosDatos.length; j++){
            if (rowDatos[i].ITEM == rowTrabajosDatos[j].ITEM) {
                const dateWork = new Date(rowTrabajosDatos[j].FECHATRABA);
                const numberDay = dateWork.getDay() 
                weekday[numberDay] = dateWork.getDate()

                // console.log('${rowTrabajosDatos[0].HORADESDE} - ${rowTrabajosDatos[0].HORAHASTA}' + `${rowTrabajosDatos[0].HORADESDE} - ${rowTrabajosDatos[0].HORAHASTA}`)
                horaDesde = rowTrabajosDatos[j].HORADESDE ? rowTrabajosDatos[j].HORADESDE.substring(0, 5) : null
                horaHasta = rowTrabajosDatos[j].HORAHASTA ? rowTrabajosDatos[j].HORAHASTA.substring(0, 5) : null
            }
        }

        for (let weekdayPosition = 0, weekdayPositionExcel = 6; weekdayPosition < 7; weekdayPosition++, weekdayPositionExcel++) {
            if (weekdayPosition == 0) {
                worksheets[pag-1].getRow(row).getCell(12).value = weekday[weekdayPosition] ? weekday[weekdayPosition] : ''
                weekdayPositionExcel--
            } else {
                worksheets[pag-1].getRow(row).getCell(weekdayPositionExcel).value = weekday[weekdayPosition] ? weekday[weekdayPosition] : ''
            }
        }

        worksheets[pag-1].getRow(row).getCell(13).value = horaDesde + ' - ' + horaHasta
        
    }

    const REUNRO_NO_AMPLIACION = parseInt(reunro)

    if(REUNRO_NO_AMPLIACION > 1){
        
        const REUNRO_AMPLIACION = REUNRO_NO_AMPLIACION - 1

        // proceso de obtener todos los items en orden sin repetir
        const rowDatos_Ampliacion = await pool.query(`SELECT * FROM prgtraviop1 
                                                    WHERE REUFECHA = ? AND REUNRO = ? 
                                                    AND AMPLIACION = 'A'
                                                    AND ( SUSMOD IS NULL OR SUSMOD != 'S' )
                                                    ORDER BY prgtraviop1.ITEM ASC`, [reufecha, REUNRO_AMPLIACION])

        const rowTrabajosDatos_Ampliacion = await pool.query(`SELECT A.* FROM prgtraviop1datos A
                                                            INNER JOIN prgtraviop1 B
                                                            ON A.REUFECHA = B.REUFECHA AND A.REUNRO = B.REUNRO AND A.ITEM = B.ITEM
                                                            WHERE B.REUFECHA = ? AND B.REUNRO = ? 
                                                            AND B.AMPLIACION = 'A'
                                                            AND ( B.SUSMOD IS NULL OR B.SUSMOD != 'S' )
                                                            ORDER BY A.ITEM ASC`, [reufecha, REUNRO_AMPLIACION])

        if(rowTrabajosDatos_Ampliacion.length > 0){

            let fechaDesde_Ampliacion = rowTrabajosDatos_Ampliacion[0].FECHATRABA
            let fechaHasta_Ampliacion = rowTrabajosDatos_Ampliacion[0].FECHATRABA

            for (let i = 1; i < rowTrabajosDatos_Ampliacion.length; i++) {
                let fecha = rowTrabajosDatos_Ampliacion[i].FECHATRABA
                
                if(fechaDesde_Ampliacion > fecha) {
                    fechaDesde_Ampliacion =  rowTrabajosDatos_Ampliacion[i].FECHATRABA
                }
        
                if(fechaHasta_Ampliacion < fecha) {
                    fechaHasta_Ampliacion =  rowTrabajosDatos_Ampliacion[i].FECHATRABA
                }
            }

            // proceso de insertar los datos
            pag++
            worksheets = createNewWorksheet(workbook, worksheets, worksheetModelo, true, {
                pag: pag,
                fechaDesde: fechaDesde_Ampliacion,
                fechaHasta: fechaHasta_Ampliacion,
                reunro: REUNRO_AMPLIACION,
                reufecha: reufecha
            })
    
            for(let i = 0, cont = 1, row = 8; i < rowDatos_Ampliacion.length; i++, cont++, row++) {
                if(cont > 20) {
                    cont = 1
                    row = 8
                    pag++
                    worksheets = createNewWorksheet(workbook, worksheets, worksheetModelo, true, {
                        pag: pag,
                        fechaDesde: fechaDesde_Ampliacion,
                        fechaHasta: fechaHasta_Ampliacion,
                        reunro: REUNRO_AMPLIACION,
                        reufecha: reufecha
                    })
                }

                worksheets[pag-1].getRow(row).getCell(1).value = rowDatos_Ampliacion[i].ITEM
                worksheets[pag-1].getRow(row).getCell(2).value = rowDatos_Ampliacion[i].LOCAL
                worksheets[pag-1].getRow(row).getCell(3).value = rowDatos_Ampliacion[i].CIRCUITO
                worksheets[pag-1].getRow(row).getCell(4).value = rowDatos_Ampliacion[i].EQUIPO

                worksheets[pag-1].getRow(row).getCell(14).value = rowDatos_Ampliacion[i].AUT
                worksheets[pag-1].getRow(row).getCell(15).value = rowDatos_Ampliacion[i].ESTADO
                worksheets[pag-1].getRow(row).getCell(16).value = rowDatos_Ampliacion[i].TRABAJO
                worksheets[pag-1].getRow(row).getCell(17).value = rowDatos_Ampliacion[i].RESPONSABLE
                worksheets[pag-1].getRow(row).getCell(18).value = rowDatos_Ampliacion[i].OBSERVAC
                worksheets[pag-1].getRow(row).getCell(19).value = rowDatos_Ampliacion[i].RESULTADO
    
                // Sunday -> 0 and Monday -> 1
                let weekday = Array(7).fill(null)

                let horaDesde_Ampliacion = rowTrabajosDatos_Ampliacion[0].HORADESDE
                let horaHasta_Ampliacion = rowTrabajosDatos_Ampliacion[0].HORAHASTA
                for(let j = 0; j < rowTrabajosDatos_Ampliacion.length; j++){
                    
                    if (rowDatos_Ampliacion[i].ITEM == rowTrabajosDatos_Ampliacion[j].ITEM) {
                        const dateWork = new Date(rowTrabajosDatos_Ampliacion[j].FECHATRABA)
                        const numberDay = dateWork.getDay() 
                        weekday[numberDay] = dateWork.getDate()

                        horaDesde_Ampliacion = rowTrabajosDatos[0].HORADESDE ? rowTrabajosDatos[0].HORADESDE.substring(0, 5) : null
                        horaHasta_Ampliacion = rowTrabajosDatos[0].HORAHASTA ? rowTrabajosDatos[0].HORAHASTA.substring(0, 5) : null
                    }
                }

                for (let weekdayPosition = 0, weekdayPositionExcel = 6; weekdayPosition < 7; weekdayPosition++, weekdayPositionExcel++) {
                    if (weekdayPosition == 0) {
                        worksheets[pag-1].getRow(row).getCell(12).value = weekday[weekdayPosition] ? weekday[weekdayPosition] : ''
                        weekdayPositionExcel--
                    } else {
                        worksheets[pag-1].getRow(row).getCell(weekdayPositionExcel).value = weekday[weekdayPosition] ? weekday[weekdayPosition] : ''
                    }
                }

                worksheets[pag-1].getRow(row).getCell(13).value = horaDesde_Ampliacion + ' - ' + horaHasta_Ampliacion
                
            }
        }
    }

    const buffer = await workbook.xlsx.writeBuffer()

    const fileName = 'ANDE_Informe_ProgramacionSemanal.xlsx'

    res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename="' + fileName + '"',
        'x-processed-filename': fileName // <= cabezera personalizada para enviar el nombre del archivo procesado para su descarga
    });

    return res.status(200).send(buffer)
}

const createNewWorksheet = (workbook, worksheets, worksheetModelo, ampliado, data) => {

    let textSheet = ampliado ? `Hoja ${data.pag.toString()} - ampliacion` : `Hoja ${data.pag.toString()}`

    worksheets.push(workbook.addWorksheet(textSheet))
    worksheets[data.pag-1].model = Object.assign(worksheetModelo.model, {
        mergeCells: worksheetModelo.model.merges
    })
    worksheets[data.pag-1].name = textSheet

    worksheets[data.pag-1].getRow(5).getCell(8).value = data.fechaDesde
    worksheets[data.pag-1].getRow(6).getCell(8).value = data.fechaHasta

    worksheets[data.pag-1].getRow(1).getCell(19).value = data.reunro
    worksheets[data.pag-1].getRow(2).getCell(19).value = data.reufecha
    worksheets[data.pag-1].getRow(28).getCell(19).value = data.pag

    return worksheets
}

module.exports = controllerPs