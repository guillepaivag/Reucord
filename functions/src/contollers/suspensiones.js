const controllerSus = {}
const pool = require('../database/index')
const utilsSuspension = require('../utils/suspensiones')
const path = require('path')
const Excel = require('exceljs')
const {verificacionDeCaracteres, dataConversionSuspensionPD, dataConversionSuspensionPS, dataConversionPd, formatoRespuesta} = require('../helpers/general')
const Respuesta = require('../models/Respuesta')
const Suspension = require('../models/Suspension')
const PedidoDisponibilidad = require('../models/PedidoDisponibilidad')
const ProgramacionSemanal = require('../models/ProgramacionSemanal')

controllerSus.listSuspension = async (req, res) => {
    
    let respuesta = null

    try {
        const suspensiones = await Suspension.obtenerListaSuspension()

        respuesta = new Respuesta({
            status: 200,
            codigo: 'Exito',
            mensaje: 'Lista de suspenciones enviado con exito.',
            resultado: suspensiones
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

controllerSus.oneSuspension = async (req, res) => {
    
    let respuesta = null
    
    try {
        const { nroprog, dia, mes, anho } = req.params
        const { data } = req.body
        const { identificadoresDeProgramacion } = data
        const { nroreun, reunionano, pditem } = identificadoresDeProgramacion
        
        let anhoValido = anho
        let mesValido = mes.length == 1 ? `0${mes}` : mes
        let diaValido = dia.length == 1 ? `0${dia}` : dia
        let fechaString = `${ anhoValido }-${ mesValido }-${ diaValido }T13:00:00.000Z`
        const fechatras = new Date(fechaString)

        const suspension = await Suspension.unaSuspension( nroprog, fechatras, nroreun, reunionano, pditem )

        respuesta = new Respuesta({
            status: 200,
            codigo: 'Exito',
            mensaje: 'Suspención obtenida con exito.',
            resultado: suspension
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

controllerSus.informeXLSX_Suspension = async (req, res) => {
    const { nroprog, dia, mes, anho, nroreun, reunionano, pditem } = req.params
    // const { nroreun, reunionano, pditem } = req.body

    let susmodPd = nroreun === 'null'
    let responseSusMod = null
    let responseProg = null
    let anhoValido = anho
    let mesValido = mes.length == 1 ? `0${mes}` : mes
    let diaValido = dia.length == 1 ? `0${dia}` : dia
    let fechaString = `${ anhoValido }-${ mesValido }-${ diaValido }T13:00:00.000Z`
    const fechatras = new Date(fechaString)
    let respuesta = null
    
    if (!susmodPd) {
        responseSusMod = await pool.query('SELECT * FROM suspenciones WHERE NROPROG = ? AND FECHATRAS = ? AND NROREUN = ? AND REUNIONANO = ?', [
            nroprog, 
            fechatras.toISOString().substr(0, 10), 
            nroreun, 
            reunionano,
        ])
        responseProg = await pool.query('SELECT * FROM prgtraviop1 WHERE REUFECHA = ? AND REUNRO = ? AND ITEM = ?', [reunionano, nroreun, pditem])
    } else {
        responseSusMod = await pool.query('SELECT * FROM suspenciones WHERE NROPROG = ? AND FECHATRAS = ? AND NROREUN IS NULL AND REUNIONANO = ? AND PDITEM = ?', [
            nroprog, 
            fechatras.toISOString().substr(0, 10), 
            reunionano,
            pditem
        ])
        responseProg = await pool.query('SELECT * FROM pddatos WHERE NROPROG = ? AND YEAR(PDFECHA) = ?', [pditem, reunionano])
    }

    if ( !responseSusMod.length ) {
        return res.status(400).send({
            codigo: 'ErrorUsuario',
            mensaje: 'No se encontro los datos de la suspensión/modificación.',
            resultado: responseSusMod.length
        })
    }
    
    if ( !responseProg.length ) {
        return res.status(400).send({
            codigo: 'ErrorUsuario',
            mensaje: 'No se encontro los datos de la programación.',
            resultado: responseProg.length
        })
    }
    
    if ( !responseProg[0].SUSMOD ) {
        return res.status(400).send({
            codigo: 'ErrorUsuario',
            mensaje: 'La programación no esta suspendida.',
            resultado: !responseProg[0].SUSMOD
        })
    }

    const esSuspension = responseProg[0].SUSMOD === 'S'
    const tipoSuspension = esSuspension ? 'Suspension' : 'Modificacion'
    const dir = path.join(__dirname, '..', 'storage', `ANDE_Informe_${tipoSuspension}.xlsx`)

    let workbook = new Excel.Workbook()
    workbook = await workbook.xlsx.readFile(dir)

    let worksheet = workbook.getWorksheet(1)

    // clear data
    worksheet.getRow(3).getCell(5).value = ''
    worksheet.getRow(6).getCell(2).value = ''
    worksheet.getRow(4).getCell(6).value = ''
    worksheet.getRow(5).getCell(6).value = ''
    worksheet.getRow(7).getCell(1).value = ''

    // add data
    worksheet.getRow(3).getCell(5).value = `DD/MEQ  N° ${responseSusMod[0].NROPROG}/${responseSusMod[0].REUNIONANO}`
    worksheet.getRow(6).getCell(2).value = responseSusMod[0].TRASMPOR
    worksheet.getRow(4).getCell(6).value = `Fecha:  ${responseSusMod[0].FECHATRAS ? responseSusMod[0].FECHATRAS.toISOString().substring(0,10) : ''}`
    worksheet.getRow(5).getCell(6).value = `Hora: ${responseSusMod[0].HORATRAS ? responseSusMod[0].HORATRAS.substring(0,5) : ''} hs.`
    
    let descripcion = ``
    for (let i = 0; i < responseSusMod.length; i++) {
        const element = responseSusMod[i];
        
        descripcion += `${element.PDITEM} - ${element.DESCRIP}`

        if ( i < responseSusMod.length-1 ) {
            descripcion += `\n
            ----------------------------------------------------------------------------
            \n`
        }
    }
    
    worksheet.getRow(7).getCell(1).value = descripcion

    const buffer = await workbook.xlsx.writeBuffer()

    const fileName = 'ANDE_Informe_Suspension.xlsx'

    res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename="' + fileName + '"',
        'x-processed-filename': fileName // <= cabezera personalizada para enviar el nombre del archivo procesado para su descarga
    });

    return res.status(200).send(buffer)
}

controllerSus.addSuspensionPd = async (req, res) => {
    const { data } = req.body
    const { suspensionDatos } = data
    let respuesta = null
    
    try {
        // clone de los datos
        let suspensionRes = JSON.parse( JSON.stringify( suspensionDatos ) )
        
        suspensionRes.NROREUN = null

        // quitamos los espacios de los costados y saltos de linea
        suspensionRes = dataConversionSuspensionPD(suspensionRes)

        if ( !!suspensionRes.NROREUN ) {
            respuesta = new Respuesta({
                status: 400,
                codigo: 'Error',
                mensaje: 'Su suspensión no debe de tener un valor en NROREUN, ya que intenta suspender un pedido de disponibilidad.',
                resultado: null
            })
    
            return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

        }

        let suspensionValida = !!suspensionRes.NROPROG && !!suspensionRes.FECHATRAS  && !!suspensionRes.REUNIONANO && !!suspensionRes.PDITEM
        let suspensionDatosValidos = verificacionDeCaracteres(suspensionRes.NROPROG) && 
                                verificacionDeCaracteres(suspensionRes.REUNIONANO) &&
                                verificacionDeCaracteres(suspensionRes.PDITEM)
        
        // VERIFICACION DE QUE EXISTA ESTOS DATOS IMPORTANTES QUE
        // IDENTIFICAN A UNA SUSPENCION
        if( suspensionValida )
        {
            // VERIFICACION DE QUE NO EXISTA / \ EN ESTOS DATOS
            if( suspensionDatosValidos )
            {
                // VERIFICAMOS SI LOS DATOS A AGREGAR ESTAN DISPONIBLES
                let idSuspensionDisponible = ( await Suspension.suspensionPorIdAnho(suspensionRes.NROPROG, suspensionRes.FECHATRAS) ).length === 0

                // VERIFICAMOS SI LOS DATOS A AGREGAR ESTAN DISPONIBLES
                let disponibleParaActualizar = ( await Suspension.unaSuspension( suspensionRes.NROPROG, suspensionRes.FECHATRAS, null, suspensionRes.REUNIONANO, suspensionRes.PDITEM ) ).length === 0

                let pdExiste = ( await PedidoDisponibilidad.unPedidoDisponibilidadPorAnho( suspensionRes.PDITEM, suspensionRes.REUNIONANO ) ).length > 0

                if ( !idSuspensionDisponible ) {
                    respuesta = new Respuesta({
                        status: 400,
                        codigo: 'Error',
                        mensaje: 'Ya existe este n° de programación para este año para la suspención.',
                        resultado: null
                    })
            
                    return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

                }

                if ( !pdExiste ) {
                    respuesta = new Respuesta({
                        status: 400,
                        codigo: 'Error',
                        mensaje: 'Debe existir un Pedido de disponibilidad como Suspendido/Modificado para poder modificarse.',
                        resultado: null
                    })
            
                    return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

                }
         
                if ( !disponibleParaActualizar ) {
                    respuesta = new Respuesta({
                        status: 400,
                        codigo: 'Error',
                        mensaje: 'Ya existe esta suspensión.',
                        resultado: null
                    })
            
                    return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

                }

                const response = await Suspension.agregarSuspension( suspensionRes )

                respuesta = new Respuesta({
                    status: 200,
                    codigo: 'Exito',
                    mensaje: 'Se ha registrado una suspensión.',
                    resultado: response
                })
        
                return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

            } else {
                // NO SE MODIFICA LOS DATOS SI ES QUE TIENE CARACTERES ESPECIALES COMO
                // / \
                respuesta = new Respuesta({
                    status: 400,
                    codigo: 'Error',
                    mensaje: 'No puede agregar datos con / \\.\nFavor usar -',
                    resultado: null
                })
        
                return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )
                
            }

        } else {
            // SI NO EXISTE ALGUNO DE LOS DATOS IMPORTANTES QUE
            // IDENTIFICA A UNA SUSPENSION
            // NO SE AGREGA NADA
            respuesta = new Respuesta({
                status: 400,
                codigo: 'Error',
                mensaje: 'Debe ingresar los datos de NROPROG, FECHATRAS, NROREUN, REUNIONANO y PDITEM. En caso que se suspenda un PD, entonces, no agregue NROREUN.',
                resultado: null
            })
    
            return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )
            
        }

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

controllerSus.addSuspensionPs = async (req, res) => {
    const { data } = req.body
    const { suspensionDatos } = data
    let respuesta = null
    
    try {

        // clone de los datos
        let suspensionRes = JSON.parse(JSON.stringify(suspensionDatos))
        
        // Verificación de que la suspención sea valida
        // quitamos los espacios de los costados y saltos de linea
        suspensionRes = dataConversionSuspensionPS(suspensionRes)
            
        if ( !suspensionRes.NROREUN ) {
            respuesta = new Respuesta({
                status: 400,
                codigo: 'Error',
                mensaje: 'Su suspensión debe de tener un valor en NROREUN, ya que intenta suspender una programación semanal.',
                resultado: null
            })
    
            return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

        }
        
        let suspensionValida = !!suspensionRes.NROPROG && !!suspensionRes.FECHATRAS && !!suspensionRes.REUNIONANO && !!suspensionRes.NROREUN
        
        let suspensionDatosValidos = verificacionDeCaracteres(suspensionRes.NROPROG) && 
                                verificacionDeCaracteres(suspensionRes.REUNIONANO) &&
                                verificacionDeCaracteres(suspensionRes.NROREUN)
    
        for (let i = 0; i < suspensionRes.ITEMS_INFO.length; i++) {
            const element = suspensionRes.ITEMS_INFO[i]

            let cantidadItems = 0
            for (let j = 0; j < suspensionRes.ITEMS_INFO.length; j++) {
                const element2 = suspensionRes.ITEMS_INFO[j];
                
                if ( element.PDITEM === element2.PDITEM ) {
                    cantidadItems = cantidadItems + 1
                }
            }

            if ( cantidadItems > 1 ) {
                respuesta = new Respuesta({
                    status: 400,
                    codigo: 'Error',
                    mensaje: 'No puedes duplicar esta suspensión.',
                    resultado: {
                        NROPROG: suspensionRes.NROPROG,
                        FECHATRAS: suspensionRes.FECHATRAS,
                        HORATRAS: suspensionRes.HORATRAS,
                        TRASMPOR: suspensionRes.TRASMPOR,
                        NROREUN: suspensionRes.NROREUN,
                        REUNIONANO: suspensionRes.REUNIONANO,
                        PDITEM: element.PDITEM,
                        DESCRIP: element.DESCRIP
                    }
                })
        
                return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

            }
            
            suspensionValida = suspensionValida && !!element.PDITEM
            suspensionDatosValidos = suspensionDatosValidos && verificacionDeCaracteres(element.PDITEM)
        }
        
        // VERIFICACION DE QUE EXISTA ESTOS DATOS IMPORTANTES QUE
        // IDENTIFICAN A UNA SUSPENCION
        if( suspensionValida )
        {
            // VERIFICACION DE QUE NO EXISTA / \ EN ESTOS DATOS
            if( suspensionDatosValidos )
            {
                // VERIFICAMOS SI LOS DATOS A AGREGAR ESTAN DISPONIBLES
                let rowPs 
                let datosAAgregar = []

                for (let i = 0; i < suspensionRes.ITEMS_INFO.length; i++) {
                    const element = suspensionRes.ITEMS_INFO[i];

                    // VERIFICAMOS SI LOS DATOS A AGREGAR ESTAN DISPONIBLES
                    let psExiste = (await pool.query('SELECT * FROM prgtraviop1 WHERE REUFECHA = ? AND REUNRO = ? AND SUSMOD IS NOT NULL AND ITEM = ?', [
                        suspensionRes.REUNIONANO, 
                        suspensionRes.NROREUN, 
                        element.PDITEM
                    ])).length > 0

                    if ( !psExiste ) {
                        respuesta = new Respuesta({
                            status: 400,
                            codigo: 'Error',
                            mensaje: 'Debe existir una Programación semanal como Suspendido/Modificado para poder agregar.',
                            resultado: null
                        })
                
                        return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )
                        
                    }

                    rowPs = await Suspension.unaSuspension(suspensionRes.NROPROG, 
                        suspensionRes.FECHATRAS, 
                        suspensionRes.NROREUN, 
                        suspensionRes.REUNIONANO,
                        element.PDITEM)

                    // pool.query('SELECT * FROM suspenciones WHERE NROPROG = ? AND FECHATRAS = ? AND NROREUN = ? AND REUNIONANO = ? AND PDITEM = ?', [
                    //     suspensionRes.NROPROG, 
                    //     suspensionRes.FECHATRAS, 
                    //     suspensionRes.NROREUN, 
                    //     suspensionRes.REUNIONANO,
                    //     element.PDITEM
                    // ])

                    const suspencionParaAgregar = {
                        NROPROG: suspensionRes.NROPROG,
                        FECHATRAS: suspensionRes.FECHATRAS,
                        HORATRAS: suspensionRes.HORATRAS,
                        TRASMPOR: suspensionRes.TRASMPOR,
                        NROREUN: suspensionRes.NROREUN,
                        REUNIONANO: suspensionRes.REUNIONANO,
                        PDITEM: element.PDITEM,
                        DESCRIP: element.DESCRIP
                    }

                    // SI ESTA DISPOBIBLE LOS DATOS A AGREGAR
                    if ( !rowPs.length ) {
                        datosAAgregar.push(suspencionParaAgregar)
                    
                    } else {
                        // SINO ESTA DISPOBIBLE LOS DATOS A AGREGAR
                        respuesta = new Respuesta({
                            status: 400,
                            codigo: 'Error',
                            mensaje: 'Ya existe esta suspensión en la base de datos.',
                            resultado: suspencionParaAgregar
                        })
                
                        return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )
                        
                    }
                    
                }

                const datosAgregados = []
                for (let i = 0; i < datosAAgregar.length; i++) {
                    const suspencionParaAgregar = datosAAgregar[i]
                    const suspensionPsAgregado = await pool.query('INSERT INTO suspenciones SET ?', [suspencionParaAgregar])

                    datosAgregados.push(suspensionPsAgregado)
                }

                respuesta = new Respuesta({
                    status: 200,
                    codigo: 'Exito',
                    mensaje: 'Se ha registrado una suspensión.',
                    resultado: datosAgregados
                })
        
                return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

            } else {
                // NO SE MODIFICA LOS DATOS SI ES QUE TIENE CARACTERES ESPECIALES COMO
                // / \
                respuesta = new Respuesta({
                    status: 400,
                    codigo: 'Error',
                    mensaje: 'No puede agregar datos con / \\.\nFavor usar -',
                    resultado: null
                })
        
                return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

            }

        } else {
            // SI NO EXISTE ALGUNO DE LOS DATOS IMPORTANTES QUE
            // IDENTIFICA A UNA SUSPENSION
            // NO SE AGREGA NADA
            respuesta = new Respuesta({
                status: 400,
                codigo: 'Error',
                mensaje: 'Debe ingresar los datos de NROPROG, FECHATRAS, NROREUN, REUNIONANO y PDITEM. En caso que se suspenda un PD, entonces, no agregue NROREUN.',
                resultado: null
            })
    
            return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

        }

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

controllerSus.obtenerPdSusModValido = async (req, res) => {

    let respuesta = null

    try {
        const anhoActual = new Date().getFullYear()
        const pdDatosValidos = []

        const pdAnhoSusMod = await pool.query('SELECT * FROM pddatos WHERE YEAR(PDFECHA) = ? AND SUSMOD IS NOT NULL', [anhoActual])

        // LAS PROGRAMACIONES CON SUSMOD VALIDOS PARA AGREGAR SON 
        // LAS QUE NO ESTAN EN suspensiones
        for (let i = 0; i < pdAnhoSusMod.length; i++) {
            const pdDatos = pdAnhoSusMod[i]
            
            const suspensionPd = await pool.query('SELECT * FROM suspenciones WHERE NROREUN IS NULL AND REUNIONANO = ? AND PDITEM = ?', [anhoActual, pdDatos.NROPROG])
            const valido = suspensionPd.length === 0

            if ( valido ) {
                pdDatosValidos.push(pdDatos)
            }
        }

        respuesta = new Respuesta({
            status: 200,
            codigo: 'Exito',
            mensaje: 'Suspención obtenida con exito.',
            resultado: pdDatosValidos
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

controllerSus.obtenerPsSusModValido = async (req, res) => {

    let respuesta = null

    try {
        const anhoActual = new Date().getFullYear()
        const psDatosValidos = []

        const psAnhoSusMod = await pool.query('SELECT * FROM prgtraviop1 WHERE REUFECHA = ? AND SUSMOD IS NOT NULL', [anhoActual])

        // LAS PROGRAMACIONES CON SUSMOD VALIDOS PARA AGREGAR SON 
        // LAS QUE NO ESTAN EN suspensiones
        for (let i = 0; i < psAnhoSusMod.length; i++) {
            const psDatos = psAnhoSusMod[i]
            
            const suspensionPs = await pool.query('SELECT * FROM suspenciones WHERE NROREUN IS NOT NULL AND REUNIONANO = ? AND NROREUN = ? AND PDITEM = ?', [anhoActual, psDatos.REUNRO, psDatos.ITEM])
            const valido = suspensionPs.length === 0

            if ( valido ) {
                psDatosValidos.push(psDatos)
            }
        }

        respuesta = new Respuesta({
            status: 200,
            codigo: 'Exito',
            mensaje: 'Lista de programación semanal con SUSMOD enviada con exito.',
            resultado: psDatosValidos
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

controllerSus.updateSuspensionPd = async (req, res) => {
    let respuesta = null

    try {
        const { nroprog, dia, mes, anho } = req.params
        const { data } = req.body
        
        const { identificadoresDeProgramacion, suspensionDatos } = data
        const { nroreun, reunionano, pditem } = identificadoresDeProgramacion

        let anhoValido = anho
        let mesValido = mes.length == 1 ? `0${mes}` : mes
        let diaValido = dia.length == 1 ? `0${dia}` : dia
        let fechaString = `${ anhoValido }-${ mesValido }-${ diaValido }T13:00:00.000Z`
        const fechatras = new Date(fechaString)

        const respuesta = await utilsSuspension.actualizarSuspensionPd(
            parseInt(nroprog),
            fechatras,
            nroreun,
            reunionano,
            pditem,
            suspensionDatos
        )

        return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() ) 

    } catch (error) {
        console.log('error - updateSuspensionPd', error)

        respuesta = new Respuesta({
            status: 500,
            codigo: 'Error',
            mensaje: 'Hubo un problema',
            resultado: error
        })

        return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )
    }

}

controllerSus.updateSuspensionPs = async (req, res) => {
    const { nroprog, dia, mes, anho } = req.params
    const { data } = req.body
    
    const { identificadoresDeProgramacion, suspensionDatos } = data
    const { nroreun, reunionano, pditem } = identificadoresDeProgramacion
    let respuesta = null

    try {
        let anhoValido = anho
        let mesValido = mes.length == 1 ? `0${mes}` : mes
        let diaValido = dia.length == 1 ? `0${dia}` : dia
        let fechaString = `${ anhoValido }-${ mesValido }-${ diaValido }T13:00:00.000Z`
        const fechatras = new Date(fechaString)

        const respuesta = await utilsSuspension.actualizarSuspensionPs(
            parseInt(nroprog),
            fechatras,
            nroreun,
            reunionano,
            pditem,
            suspensionDatos
        )

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

controllerSus.deleteSuspension = async (req, res) => {

    let respuesta = null

    try {
        const { nroprog, dia, mes, anho } = req.params
        const { data } = req.body

        let anhoValido = anho
        let mesValido = mes.length == 1 ? `0${mes}` : mes
        let diaValido = dia.length == 1 ? `0${dia}` : dia
        let fechaString = `${ anhoValido }-${ mesValido }-${ diaValido }T13:00:00.000Z`
        const fechatras = new Date(fechaString)

        const { identificadoresDeProgramacion } = data
        const { nroreun, reunionano, pditem } = identificadoresDeProgramacion
        let resultado = null

        const eliminarSuspensionParaPd = !nroreun

        if ( eliminarSuspensionParaPd ) {
            resultado = await pool.query('DELETE FROM suspenciones WHERE NROPROG = ? AND FECHATRAS = ? AND NROREUN IS NULL AND REUNIONANO = ? AND PDITEM = ?', [
                nroprog, 
                fechatras.toISOString().substr(0, 10), 
                reunionano, 
                pditem
            ])
        } else {
            resultado = await pool.query('DELETE FROM suspenciones WHERE NROPROG = ? AND FECHATRAS = ? AND NROREUN = ? AND REUNIONANO = ? AND PDITEM = ?', [
                nroprog, 
                fechatras.toISOString().substr(0, 10), 
                nroreun, 
                reunionano, 
                pditem
            ])
        }

        respuesta = new Respuesta({
            status: 200,
            codigo: 'Exito',
            mensaje: 'Se ha eliminado una suspensión.',
            resultado
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

module.exports = controllerSus