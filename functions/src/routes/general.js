const {Router} = require('express')
const router = Router()
const pool = require('../database/index')
const path = require('path')
const Excel = require('exceljs')
const {ultimoNumeroRPS, quickSort, dma_To_amd, amd_To_dma, toAMD, toDMA} = require('../algoritmos/general')

router.post('/general/ultimoNumero', async (req, res) => {
    const ultnro = await ultimoNumeroRPS()
    res.json({
        ultnro
    })
})

router.post('/general/enlistamiento/:anho', async (req, res) => {
    const {anho} = req.params
    const {historico} = req.body

    let totalData = []
    let listaNroProg = []
    let enlistamiento = []
    let reclamos = await pool.query('SELECT * FROM reclamos')
    let pds = await pool.query('SELECT * FROM pddatos')
    let suspenciones = await pool.query('SELECT * FROM suspenciones')

    for(let i = 0, pos = 0; i < reclamos.length; i++, pos++){
        totalData.push({
            NROPROG: reclamos[i].DMEDNRO,
            FECHA: reclamos[i].FECHATRASM,
            DATO1: '',
            DATO2: '',
            DATO3: ''
        })
        totalData[pos].NROPROG = parseInt(reclamos[i].DMEDNRO)
    }

    for(let i = 0, pos = totalData.length; i < pds.length; i++, pos++){
        totalData.push({
            NROPROG: pds[i].NROPROG,
            FECHA: pds[i].PDFECHA,
            DATO1: pds[i].LOCAL,
            DATO2: pds[i].CIRCUITO,
            DATO3: pds[i].EQUIPO
        })
        totalData[pos].NROPROG = parseInt(pds[i].NROPROG)
    }

    for(let i = 0, pos = totalData.length; i < suspenciones.length; i++, pos++){
        totalData.push({
            NROPROG: suspenciones[i].NROPROG,
            FECHA: suspenciones[i].PDFECHA,
            DATO1: suspenciones[i].NROREUN,
            DATO2: suspenciones[i].PDITEM,
            DATO3: suspenciones[i].SUSMOD
        })
        totalData[pos].NROPROG = parseInt(suspenciones[i].NROPROG)
    }
    
    for(let i = 0; i < totalData.length; i++){
        if(historico){
            if(!listaNroProg.includes(totalData[i].NROPROG)){
                listaNroProg.push(totalData[i].NROPROG)
                enlistamiento.push(totalData[i])
            }
        }else{
            if(anho == totalData[i].FECHA.substring(6, 10)){
                if(!listaNroProg.includes(totalData[i].NROPROG)){
                    listaNroProg.push(totalData[i].NROPROG)
                    enlistamiento.push(totalData[i])
                }
            }
        }
    }

    enlistamiento = quickSort(enlistamiento, 0, enlistamiento.length - 1, 'Enlistamientos');

    res.json(enlistamiento)
})

router.get('/getListWorksForDate', async (req, res) => {
    let dateToday = new Date()
    let dateTomorrow = new Date()
    let dayAfterTomorrow = new Date()

    dateTomorrow.setDate(dateToday.getDate() + 1)
    dayAfterTomorrow.setDate(dateToday.getDate() + 2)

    const day1 = dateToday.getDate()
    const month1 = dateToday.getMonth()+1
    const year1 = dateToday.getFullYear()
    const day2 = dateTomorrow.getDate()
    const month2 = dateTomorrow.getMonth()+1
    const year2 = dateTomorrow.getFullYear()
    const day3 = dayAfterTomorrow.getDate()
    const month3 = dayAfterTomorrow.getMonth()+1
    const year3 = dayAfterTomorrow.getFullYear()

    const todayDate = new Date(new Date().setDate(new Date().getDate() + 0)).toISOString().substring(0,10)
    const tomorrowDate = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().substring(0,10)
    const dayAfterTomorrowDate = new Date(new Date().setDate(new Date().getDate() + 2)).toISOString().substring(0,10)

    // const day1 = 6
    // const month1 = 1
    // const year1 = 2020
    // const day2 = 7
    // const month2 = 1
    // const year2 = 2020
    // const day3 = 8
    // const month3 = 1
    // const year3 = 2020

    let allPdTrabajosForDate = {
        today: [],
        tomorrow: [],
        dayAfterTomorrow: []
    }

    let allPdDatosForDate = []

    let allPsTrabajosForDate = {
        today: [],
        tomorrow: [],
        dayAfterTomorrow: []
    }

    try {
        let pdDatosWorks = [null, null, null]
        let pdWorks = [null, null, null]
        let psWorks = [null, null, null]

        pdWorks[0] = await pool.query('SELECT * FROM pd WHERE FECHATRA = ?', [toDMA(day1, month1, year1)])
        pdWorks[1] = await pool.query('SELECT * FROM pd WHERE FECHATRA = ?', [toDMA(day2, month2, year2)])
        pdWorks[2] = await pool.query('SELECT * FROM pd WHERE FECHATRA = ?', [toDMA(day3, month3, year3)])

        // pdDatosWorks[0] = await pool.query('SELECT * FROM pddatos WHERE PDFECHA = ?', [toDMA(day1, month1, year1)])
        // pdDatosWorks[1] = await pool.query('SELECT * FROM pddatos WHERE PDFECHA = ?', [toDMA(day2, month2, year2)])
        // pdDatosWorks[2] = await pool.query('SELECT * FROM pddatos WHERE PDFECHA = ?', [toDMA(day3, month3, year3)])
        pdDatosWorks[0] = []
        pdDatosWorks[1] = []
        pdDatosWorks[2] = []
        
        psWorks[0] = await pool.query('SELECT * FROM prgtraviop1 WHERE FECHATRABA = ?', [toAMD(day1, month1, year1)])
        psWorks[1] = await pool.query('SELECT * FROM prgtraviop1 WHERE FECHATRABA = ?', [toAMD(day2, month2, year2)])
        psWorks[2] = await pool.query('SELECT * FROM prgtraviop1 WHERE FECHATRABA = ?', [toAMD(day3, month3, year3)])
        

        for(let i = 0; i < pdWorks.length; i++){
            let datos = []

            for(let j = 0; j < pdWorks[i].length; j++){
                
                let yearPd = parseInt(pdWorks[i][j].PDFECHA.substring(6, 10))
                let pditem = parseInt(pdWorks[i][j].NROPROG)
                
                let itAlreadyExists = await pool.query('SELECT * FROM suspenciones WHERE NROREUN IS NULL AND REUNIONANO = ? AND PDITEM = ?', [yearPd, pditem])
                let pddato = await pool.query('SELECT * FROM pddatos WHERE NROPROG = ? AND PDFECHA = ?', [pdWorks[i][j].NROPROG, pdWorks[i][j].PDFECHA])
                
                if(itAlreadyExists.length == 0){
                    datos.push({suspendido: false, dato: pdWorks[i][j]})
                    allPdDatosForDate.push({suspendido: false, dato: pddato[0]})
                }else {
                    datos.push({suspendido: true, dato: pdWorks[i][j]})
                    allPdDatosForDate.push({suspendido: true, dato: pddato[0]})
                }
            }

            switch (i) {
                // Si es para el dia actual (hoy)
                case 0:
                    allPdTrabajosForDate.today = datos
                    break;

                // Si es para el dia siguiente (mañana)
                case 1:
                    allPdTrabajosForDate.tomorrow = datos
                    break;

                // Si es para el dia actual (pasado mañana)
                case 2:
                    allPdTrabajosForDate.dayAfterTomorrow = datos
                    break;
            
                default:
                    break;
            }

        }

        for(let i = 0; i < psWorks.length; i++){
            let datos = []

            for(let j = 0; j < psWorks[i].length; j++){
                
                let nroreun = parseInt(psWorks[i][j].REUNRO)
                let yearPd = parseInt(psWorks[i][j].REUFECHA)
                let pditem = parseInt(psWorks[i][j].ITEM)

                let itAlreadyExists = await pool.query('SELECT * FROM suspenciones WHERE NROREUN = ? AND REUNIONANO = ? AND PDITEM = ?', [nroreun, yearPd, pditem])
                
                if(itAlreadyExists.length == 0){
                    datos.push({suspendido: false, dato: psWorks[i][j]})
                }else {
                    datos.push({suspendido: true, dato: psWorks[i][j]})
                }
            }

            switch (i) {
                // Si es para el dia actual (hoy)
                case 0:
                    allPsTrabajosForDate.today = datos
                    break;

                // Si es para el dia siguiente (mañana)
                case 1:
                    allPsTrabajosForDate.tomorrow = datos
                    break;

                // Si es para el dia actual (pasado mañana)
                case 2:
                    allPsTrabajosForDate.dayAfterTomorrow = datos
                    break;
            
                default:
                    break;
            }

        }

        res.json({
            codigo: 'Exito0000',
            mensaje: 'Lista de trabajos por fecha enviado',
            respuesta: {
                completed: true,
                dates: {
                    todayDate: amd_To_dma(todayDate).substring(0,10),
                    tomorrowDate: amd_To_dma(tomorrowDate).substring(0,10),
                    dayAfterTomorrowDate: amd_To_dma(dayAfterTomorrowDate).substring(0,10),
                },
                pd: allPdTrabajosForDate,
                allPdDatosForDate,
                ps: allPsTrabajosForDate,
            }
        })
    } catch (error) {
        res.json({
            codigo: 'Error0000',
            mensaje: 'Hubo un problema',
            respuesta: error
        })
    }


})

module.exports = router