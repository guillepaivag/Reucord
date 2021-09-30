const controllerProg = {}
const pool = require('../database/index')
const path = require('path')
const Excel = require('exceljs')
const { getProgrammingByLocalAndYear } = require('../helpers/programaciones')
const { createNewWorksheet, insertProgrammingIdentifier } = require('../utils/Programaciones')
const EstacionesSubestaciones = require('../models/EstacionesSubestaciones')
const Programaciones = require('../models/Programaciones')
const Respuesta = require('../models/Respuesta')
const {ultimoNumeroRPS} = require('../helpers/general')

controllerProg.listProg = async (req, res) => {
    const { year } = req.params

    let programmingData = []
    let respuesta = null

    try {
        const dir = path.join(__dirname, '..', 'storage', 'ANDE_Informe_Programaciones.xlsx')

        // Seleccion de el archivo a copiar
        var workbookModelo = new Excel.Workbook()
        workbookModelo = await workbookModelo.xlsx.readFile(dir)
        const worksheetModelo = await workbookModelo.getWorksheet(1)

        // creacion del excel a enviar
        const workbook = new Excel.Workbook()
        let worksheets = []

        const locales = await EstacionesSubestaciones.listaLocales()

        for (let localIndex = 0; localIndex < locales.length; localIndex++) {
            const local = locales[localIndex]

            // Agregar nueva hoja (Local)
            worksheets = createNewWorksheet(workbook, worksheets, worksheetModelo, {
                local,
                localIndex
            })
            
            const programmingDataPD = await getProgrammingByLocalAndYear('PD', local, parseInt(year))
            const programmingDataPS = await getProgrammingByLocalAndYear('PS', local, parseInt(year))

            programmingData.push({
                local: local,
                programming: [
                    ...programmingDataPD,
                    ...programmingDataPS
                ]
            })

            worksheets = insertProgrammingIdentifier(programmingData[0].programming, localIndex, worksheets)

            programmingData.splice(0, programmingData.length)
        }

        const buffer = await workbook.xlsx.writeBuffer()

        const fileName = 'ANDE_Informe_Programaciones.xlsx'

        res.set({
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': 'attachment; filename="' + fileName + '"',
            'x-processed-filename': fileName // <= cabezera personalizada para enviar el nombre del archivo procesado para su descarga
        });

        return res.status(200).send(buffer)
        
    } catch (error) {
        console.log('ERROR EN listProg', error)

        respuesta = new Respuesta({
            status: 500,
            codigo: 'Error',
            mensaje: 'Hubo un problema en el sistema.',
            resultado: error
        })

        return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

    }

}

controllerProg.listProgByLocal = async (req, res) => {
    const { local, year } = req.params

    let programmingData = []
    let respuesta = null

    try {
        const responseLocal = await EstacionesSubestaciones.datosLocal( local )

        const existLocal =  responseLocal.length > 0

        if (existLocal) {
            programmingData = await getProgrammingByLocalAndYear('PD', local, parseInt(year))
            programmingData.push(...(await getProgrammingByLocalAndYear('PS', local, parseInt(year))))

            respuesta = new Respuesta({
                status: 200,
                codigo: 'Exito',
                mensaje: 'Lista de programaciones por local y por año enviado con exito.',
                resultado: programmingData
            })
    
            return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

        } else {
            respuesta = new Respuesta({
                status: 400,
                codigo: 'Error',
                mensaje: 'No existe este local.',
                resultado: null
            })
    
            return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )
        }
        
    } catch (error) {
        console.log('ERROR EN listProgByLocal', error)

        respuesta = new Respuesta({
            status: 500,
            codigo: 'Error',
            mensaje: 'Hubo un problema en el sistema.',
            resultado: error
        })

        return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

    }
}

controllerProg.listaDeTrabajosPorDia = async (req, res) => {
    try {
        
        const { body } = req
        const { hoy, manhana, pasadoManhana } = body
        let respuesta = null

        console.log('body', body)
        const hoyDate = new Date( `${hoy}T13:00:00.000Z` )
        const manhanaDate = new Date( `${manhana}T13:00:00.000Z` )
        const pasadoManhanaDate = new Date( `${pasadoManhana}T13:00:00.000Z` )

        // const hoyDate = new Date('2020-01-06T13:00:00.000Z')
        // const manhanaDate = new Date('2020-01-07T13:00:00.000Z')
        // const pasadoManhanaDate = new Date('2020-01-08T13:00:00.000Z')

        const hoy_manhana_pasadoManhana = [
            hoyDate,
            manhanaDate,
            pasadoManhanaDate
        ]
        const pdTrabajos = []
        const psTrabajos = []

        let pdWorks = await pool.query(`SELECT A.* FROM pd A 
                                        INNER JOIN pddatos B
                                        ON A.NROPROG = B.NROPROG AND A.PDFECHA = B.PDFECHA
                                        WHERE B.SUSMOD IS NULL AND FECHATRA = ? || FECHATRA = ? || FECHATRA = ?`, 
        [
            hoyDate.toISOString().substr(0, 10),
            manhanaDate.toISOString().substr(0, 10),
            pasadoManhanaDate.toISOString().substr(0, 10)
        ])
        
        let psWorks = await pool.query(`SELECT A.* FROM prgtraviop1datos A 
                                        INNER JOIN prgtraviop1 B 
                                        ON A.REUFECHA = B.REUFECHA AND A.REUNRO = B.REUNRO AND A.ITEM = B.ITEM 
                                        WHERE B.SUSMOD IS NULL AND FECHATRABA = ? OR FECHATRABA = ? OR FECHATRABA = ?`, 
        [
            hoyDate.toISOString().substr(0, 10),
            manhanaDate.toISOString().substr(0, 10),
            pasadoManhanaDate.toISOString().substr(0, 10)
        ])

        for (let i = 0; i < hoy_manhana_pasadoManhana.length; i++) {
            let paraFormatoTexto = 'Hoy'
            let paraFormatoFecha = hoyDate.toISOString().substring(0,10)
            const element = hoy_manhana_pasadoManhana[i]
            
            if ( i === 1) {
                paraFormatoTexto = 'Mañana'
                paraFormatoFecha = manhanaDate.toISOString().substring(0,10)
            } else if ( i === 2) {
                paraFormatoTexto = 'Pasado mañana'
                paraFormatoFecha = pasadoManhanaDate.toISOString().substring(0,10)
            }

            const resultadoPd = pdWorks.filter(pdWork => pdWork.FECHATRA.toISOString().substr(0, 10) === element.toISOString().substr(0, 10))

            const resultadoPs = psWorks.filter(psWork => psWork.FECHATRABA.toISOString().substr(0, 10) === element.toISOString().substr(0, 10))

            pdTrabajos.push({
                paraFormatoTexto,
                paraFormatoFecha,
                tipo: 'PD',
                datosTrabajos: resultadoPd
            })

            psTrabajos.push({
                paraFormatoTexto,
                paraFormatoFecha,
                tipo: 'PS',
                datosTrabajos: resultadoPs
            })
        }

        respuesta = new Respuesta({
            status: 200,
            codigo: 'Exito',
            mensaje: 'Lista de trabajos por fecha enviado',
            resultado: {
                pdTrabajos,
                psTrabajos
            }
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

controllerProg.trabajosPorRangoDeTiempo = async ( req, res ) => {
    
    const { body } = req
    const { fechaDesde, fechaHasta, opciones } = body
    let respuesta = null

    try {
        if ( new Date(fechaDesde).getTime() > new Date(fechaHasta).getTime() ) {
            respuesta = new Respuesta({
                status: 400,
                codigo: 'Error',
                mensaje: 'La fecha-hasta debe ser mayor que la fecha-desde.',
                resultado: null
            })

            return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )
        }

        const listaTrabajos = await Programaciones.trabajosPorRangoDeFecha( fechaDesde, fechaHasta, opciones )

        respuesta = new Respuesta({
            status: 200,
            codigo: 'Exito',
            mensaje: 'Lista de trabajos en un rango de fecha creado con exito.',
            resultado: listaTrabajos
        })

    } catch (error) {
        console.log('ERROR EN trabajosPorRangoDeTiempo', error)

        respuesta = new Respuesta({
            status: 500,
            codigo: 'Error',
            mensaje: 'Hubo un problema en el sistema.',
            resultado: error
        })

    } finally {
        return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )
    }
}

controllerProg.excelTrabajosPorLocalPorRangoDeTiempo = async ( req, res ) => {
    
}

controllerProg.ultimoNumero = async ( req, res ) => {
    
    let respuesta = null
    
    try {
        const ultimoNumero = await ultimoNumeroRPS()

        respuesta = new Respuesta({
            status: 200,
            codigo: 'Exito',
            mensaje: 'Ultimo número de programaciones generado.',
            resultado: ultimoNumero
        })

        return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

    } catch (error) {
        console.log('ERROR EN ultimoNumero', error)

        respuesta = new Respuesta({
            status: 500,
            codigo: 'Error',
            mensaje: 'Hubo un problema en el sistema.',
            resultado: error
        })

        return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )
    }
}

module.exports = controllerProg