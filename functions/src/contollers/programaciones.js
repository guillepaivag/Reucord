controllerProg = {}
const config = require('../../config')
const axios = require('axios')
const pool = require('../database/index')
const path = require('path')
const Excel = require('exceljs')

const URL_ORIGEN = config.environment === 'production' ? 'https://reucord.web.app' : 'http://localhost:8080'
const URL_BASE_PD = '/pd/verPd-aTratar'
const URL_BASE_PS = '/ps/verPs-aTratar'

const createNewWorksheet = (workbook, worksheets, worksheetModelo, data) => {

    let textSheet = data.local

    worksheets.push(workbook.addWorksheet(textSheet))
    
    worksheets[data.localIndex].model = Object.assign(worksheetModelo.model, {
        mergeCells: worksheetModelo.model.merges
    })
    worksheets[data.localIndex].name = textSheet

    return worksheets
}

const insertProgrammingIdentifier = (programmings, localIndex, worksheets) => {

    for (let programmingIndex = 0; programmingIndex < programmings.length; programmingIndex++) {
        const element = programmings[programmingIndex]

        if (element.programmingType === 'PD') {
            const NROPROG = element.informationData.NROPROG
            const PDFECHA = element.informationData.PDFECHA.toISOString().substring(0,10)
            const DAY = element.informationData.PDFECHA.getDate()
            const MONTH = element.informationData.PDFECHA.getMonth()+1
            const YEAR = element.informationData.PDFECHA.getFullYear()
            const IDENTIFIER_PROGRAMMING_TEXT = `/${NROPROG}/${DAY}/${MONTH}/${YEAR}`
            const LINK_PD = `${URL_ORIGEN}${URL_BASE_PD}${IDENTIFIER_PROGRAMMING_TEXT}`

            worksheets[localIndex].getRow(programmingIndex+2).getCell(1).value = NROPROG
            worksheets[localIndex].getRow(programmingIndex+2).getCell(2).value = PDFECHA
            worksheets[localIndex].getRow(programmingIndex+2).getCell(3).value = ''
            worksheets[localIndex].getRow(programmingIndex+2).getCell(4).value = { 
                text: `Ver PD (${NROPROG} | ${PDFECHA})`, 
                hyperlink: LINK_PD 
            };
            
        } else {
            const REUFECHA = element.informationData.REUFECHA
            const REUNRO = element.informationData.REUNRO
            const ITEM = element.informationData.ITEM
            const IDENTIFIER_PROGRAMMING_TEXT = `/${REUFECHA}/${REUNRO}/${ITEM}`
            const LINK_PS = `${URL_ORIGEN}${URL_BASE_PS}${IDENTIFIER_PROGRAMMING_TEXT}`

            worksheets[localIndex].getRow(programmingIndex+2).getCell(1).value = REUNRO
            worksheets[localIndex].getRow(programmingIndex+2).getCell(2).value = REUFECHA
            worksheets[localIndex].getRow(programmingIndex+2).getCell(3).value = ITEM
            worksheets[localIndex].getRow(programmingIndex+2).getCell(4).value = { 
                text: `Ver PS (${REUFECHA} | ${REUNRO} | ${ITEM})`, 
                hyperlink: LINK_PS 
            };
        }
        
    }

    return worksheets
}


controllerProg.listProg = async (req, res) => {
    const { year } = req.params

    let programmingData = []

    try {
        const dir = path.join(__dirname, '..', 'storage', 'ANDE_Informe_Programaciones.xlsx')

        // Seleccion de el archivo a copiar
        var workbookModelo = new Excel.Workbook()
        workbookModelo = await workbookModelo.xlsx.readFile(dir)
        const worksheetModelo = await workbookModelo.getWorksheet(1)

        // creacion del excel a enviar
        const workbook = new Excel.Workbook()
        let worksheets = []
        
        if ( config.environment === 'development' ) {
            console.log('config', config)
        }

        const locales = (await axios.default.post(`${config.reucordAPI_baseURL}/locales`)).data.respuesta

        for (let localIndex = 0; localIndex < locales.length; localIndex++) {
            const local = locales[localIndex]
            // console.log('local', local)

            // // Agregar nueva hoja (Local)
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

            var result = programmingData.splice(0, programmingData.length)
        }

        const buffer = await workbook.xlsx.writeBuffer()

        const fileName = 'ANDE_Informe_Programaciones.xlsx'

        res.set({
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': 'attachment; filename="' + fileName + '"',
            'x-processed-filename': fileName // <= cabezera personalizada para enviar el nombre del archivo procesado para su descarga
        });

        return res.status(200).send(buffer)

        // return res.status(200).json({
        //     codigo: 'Exito',
        //     mensaje: 'Lista de programaciones por locales y por año enviado con exito.',
        //     respuesta: result
        // })
        
    } catch (error) {
        
        console.log('ERROR EN listProg', error)

        return res.status(500).json({
            codigo: 'Error',
            mensaje: 'Hubo un problema en el sistema.',
            respuesta: error
        })

    }

}

controllerProg.listProgByLocal = async (req, res) => {
    const { local, year } = req.params

    let programmingData = []

    try {
        const responseLocal = (await axios.default.post(`${config.reucordAPI_baseURL}/locales/${local}`)).data.respuesta
        console.log('responseLocal', responseLocal)
        const existLocal =  responseLocal.length > 0

        if (existLocal) {
            programmingData = await getProgrammingByLocalAndYear('PD', local, parseInt(year))
            programmingData.push(...(await getProgrammingByLocalAndYear('PS', local, parseInt(year))))

            return res.status(200).json({
                codigo: 'Exito',
                mensaje: 'Lista de programaciones por local y por año enviado con exito.',
                respuesta: programmingData
            })
        } else {
            return res.status(400).json({
                codigo: 'Exito',
                mensaje: 'No existe este local.',
                respuesta: programmingData
            })
        }
        
    } catch (error) {
        console.log('ERROR EN listProgByLocal', error)

        return res.status(500).json({
            codigo: 'Error',
            mensaje: 'Hubo un problema en el sistema.',
            respuesta: error
        })
    }
}

// FUNCIONES

const verificationSuspension = async (programmingType, dataToVerify) => {

    let discontinued = null
    const NROREUN = dataToVerify.NROREUN
    const REUNIONANO = dataToVerify.REUNIONANO
    const PDITEM = dataToVerify.PDITEM

    if( programmingType == 'PD' ) {
        discontinued = await pool.query('SELECT * FROM suspenciones WHERE NROREUN IS NULL AND REUNIONANO = ? AND PDITEM = ?', [REUNIONANO, PDITEM])
    } else if( programmingType == 'PS' ) {
        discontinued = await pool.query('SELECT * FROM suspenciones WHERE NROREUN = ? AND REUNIONANO = ? AND PDITEM = ?', [NROREUN, REUNIONANO, PDITEM])
    } else {
        return res.status(500).json({
            codigo: 'Error',
            mensaje: 'Hay que elegir una programación valida.',
            respuesta: null
        })
    }

    discontinued = discontinued.length > 0 ? true : false

    return discontinued
}

const getProgrammingByLocalAndYear = async (programmingType, local, year) => {

    let programmingData = []
    let programmingInformation = null
    let programmingWorks = null

    if( programmingType == 'PD' ) {
        programmingInformation = await pool.query('SELECT * FROM pddatos WHERE YEAR(PDFECHA) = ? AND LOCAL = ? ORDER BY `pddatos`.`NROPROG` ASC', [year, local])
        programmingWorks = await pool.query('SELECT * FROM pd WHERE YEAR(PDFECHA) = ? ORDER BY `pd`.`NROPROG` ASC', [year])
    } else if( programmingType == 'PS' ) {
        programmingInformation = await pool.query('SELECT * FROM prgtraviop1 WHERE REUFECHA = ? AND LOCAL = ? ORDER BY `prgtraviop1`.`REUNRO` ASC', [year, local])
        programmingWorks = await pool.query('SELECT * FROM prgtraviop1datos WHERE REUFECHA = ? ORDER BY `prgtraviop1datos`.`REUNRO` ASC', [year])
    } else {
        return res.status(500).json({
            codigo: 'Error',
            mensaje: 'Hay que elegir una programación valida.',
            respuesta: null
        })
    }

    for (let programmingIndex = 0; programmingIndex < programmingInformation.length; programmingIndex++) {
            
        const programming = programmingInformation[programmingIndex];
    
        const isSuspension = await verificationSuspension(programmingType, programming)

        if( !isSuspension ) {
            let worksData = []

            let works = programmingWorks.filter(x => {
                
                if( programmingType == 'PD' ) {
                    const equalsNROPROG = x.NROPROG === programming.NROPROG
                    const equalsPDFECHA = x.PDFECHA.getTime() === programming.PDFECHA.getTime()

                    return equalsNROPROG && equalsPDFECHA
                } else if( programmingType == 'PS' ) {
                    const equalsREUFECHA = x.REUFECHA === programming.REUFECHA
                    const equalsREUNRO = x.REUNRO === programming.REUNRO
                    const equalsITEM = x.ITEM === programming.ITEM

                    return equalsREUFECHA && equalsREUNRO && equalsITEM
                } else {
                    return res.status(500).json({
                        codigo: 'Error',
                        mensaje: 'Hay que elegir una programación valida.',
                        respuesta: null
                    })
                }

            })

            works.length ? worksData.push(...works) : null

            programmingData.push({
                programmingType: programmingType,
                informationData: programming,
                workData: worksData
            })
        } else {
            // // SUSPENDIDO
            // console.log(`${programmingIndex} - SUSPENDIDO`)
        }
    }

    return programmingData
}

const getProgrammingByYear = async (programmingType, year) => {

    let programmingData = []
    let programmingInformation = null
    let programmingWorks = null

    if( programmingType == 'PD' ) {
        programmingInformation = await pool.query('SELECT * FROM pddatos WHERE YEAR(PDFECHA) = ? ORDER BY `pddatos`.`NROPROG` ASC', [year])
        programmingWorks = await pool.query('SELECT * FROM pd WHERE YEAR(PDFECHA) = ? ORDER BY `pd`.`NROPROG` ASC', [year])
    } else if( programmingType == 'PS' ) {
        programmingInformation = await pool.query('SELECT * FROM prgtraviop1 WHERE REUFECHA = ? ORDER BY `prgtraviop1`.`REUNRO` ASC', [year])
        programmingWorks = await pool.query('SELECT * FROM prgtraviop1datos WHERE REUFECHA = ? ORDER BY `prgtraviop1datos`.`REUNRO` ASC', [year])
    } else {
        return res.status(500).json({
            codigo: 'Error',
            mensaje: 'Hay que elegir una programación valida.',
            respuesta: null
        })
    }

    for (let programmingIndex = 0; programmingIndex < programmingInformation.length; programmingIndex++) {
            
        const programming = programmingInformation[programmingIndex];
    
        const isSuspension = await verificationSuspension(programmingType, programming)

        if( !isSuspension ) {
            let worksData = []

            let works = programmingWorks.filter(x => {
                
                if( programmingType == 'PD' ) {
                    const equalsNROPROG = x.NROPROG === programming.NROPROG
                    const equalsPDFECHA = x.PDFECHA.getTime() === programming.PDFECHA.getTime()

                    return equalsNROPROG && equalsPDFECHA
                } else if( programmingType == 'PS' ) {
                    const equalsREUFECHA = x.REUFECHA === programming.REUFECHA
                    const equalsREUNRO = x.REUNRO === programming.REUNRO
                    const equalsITEM = x.ITEM === programming.ITEM

                    return equalsREUFECHA && equalsREUNRO && equalsITEM
                } else {
                    return res.status(500).json({
                        codigo: 'Error',
                        mensaje: 'Hay que elegir una programación valida.',
                        respuesta: null
                    })
                }

            })

            works.length ? worksData.push(...works) : null

            programmingData.push({
                programmingType: programmingType,
                informationData: programming,
                workData: worksData
            })
        } else {
            // // SUSPENDIDO
            // console.log(`${programmingIndex} - SUSPENDIDO`)
        }
    }

    return programmingData
}

module.exports = controllerProg