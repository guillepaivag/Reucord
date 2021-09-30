const utils = {}

const config = require('../../config')
const URL_ORIGEN = config.environment === 'production' ? 'https://reucord.web.app' : 'http://localhost:8080'
const URL_BASE_PD = '/pd/verPd-aTratar'
const URL_BASE_PS = '/ps/verPs-aTratar'

utils.createNewWorksheet = (workbook, worksheets, worksheetModelo, data) => {

    let textSheet = data.local

    worksheets.push(workbook.addWorksheet(textSheet))
    
    worksheets[data.localIndex].model = Object.assign(worksheetModelo.model, {
        mergeCells: worksheetModelo.model.merges
    })
    worksheets[data.localIndex].name = textSheet

    return worksheets
}

utils.insertProgrammingIdentifier = (programmings, localIndex, worksheets) => {

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

module.exports = utils