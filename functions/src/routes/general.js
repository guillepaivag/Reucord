const {Router} = require('express')
const router = Router()
const pool = require('../database/index')
const path = require('path')
const Excel = require('exceljs')
const {ultimoNumeroRPS, quickSort} = require('../helpers/general')

router.post('/general/ultimoNumero', async (req, res) => {
    const ultimoNumero = await ultimoNumeroRPS()
    res.json({
        ultimoNumero
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

module.exports = router