const pool = require('../database/index')

const NUMERO_MINIMO_PRODUCCION = 1
const NUMERO_MAXIMO_PRODUCCION = 1999

const NUMERO_MINIMO_EXCEPCIONALES = 3000
const NUMERO_MAXIMO_EXCEPCIONALES = 3999

const NUMERO_MINIMO_RELLENO = 5000
const NUMERO_MAXIMO_RELLENO = 5999

const NUMERO_MINIMO_DESARROLLO = 9000
const NUMERO_MAXIMO_DESARROLLO = 9999


const ultimoNumeroRPS = async () => {
    let ultimoNumero = 0
    const anhoActual = new Date().getFullYear()
    // console.log(anhoActual)
    // const anhoActual = '2020'
    
    const rowsRec = await pool.query('SELECT * FROM reclamos')
    for(let i = 0; i < rowsRec.length; i++){
        if(rowsRec[i].FECHATRASM.getFullYear() == anhoActual){
            if(rowsRec[i].DMEDNRO <= NUMERO_MAXIMO_PRODUCCION && rowsRec[i].DMEDNRO > ultimoNumero){
                ultimoNumero = rowsRec[i].DMEDNRO
            }
        }
    }

    const rowsPD = await pool.query('SELECT * FROM pddatos')
    for(let i = 0; i < rowsPD.length; i++){
        if(rowsPD[i].PDFECHA.getFullYear() == anhoActual){
            if(rowsPD[i].NROPROG <= NUMERO_MAXIMO_PRODUCCION && rowsPD[i].NROPROG > ultimoNumero){
                ultimoNumero = rowsPD[i].NROPROG
            }
        }
    }

    const rowsSus = await pool.query('SELECT * FROM suspenciones')
    for(let i = 0; i < rowsSus.length; i++){
        if(rowsSus[i].FECHATRAS.getFullYear() == anhoActual){
            if(rowsSus[i].NROPROG <= NUMERO_MAXIMO_PRODUCCION && rowsSus[i].NROPROG > ultimoNumero){
                ultimoNumero = rowsSus[i].NROPROG
            }
        }
    }

    // console.log(ultimoNumero)
    return ultimoNumero
}

function swap(items, leftIndex, rightIndex){
    var temp = items[leftIndex];
    items[leftIndex] = items[rightIndex];
    items[rightIndex] = temp;
}

function partitionEnlistamientoNroProg(items, left, right) {
    var pivot   = items[Math.floor((right + left) / 2)].NROPROG, //middle element
        i       = left, //left pointer
        j       = right; //right pointer
    while (i <= j) {
        while (items[i].NROPROG < pivot) {
            i++;
        }
        while (items[j].NROPROG > pivot) {
            j--;
        }
        if (i <= j) {
            swap(items, i, j); //sawpping two elements
            i++;
            j--;
        }
    }
    return i;
}
function partitionNormalNumber(items, left, right) {
    var pivot   = items[Math.floor((right + left) / 2)], //middle element
        i       = left, //left pointer
        j       = right; //right pointer
    while (i <= j) {
        while (items[i] < pivot) {
            i++;
        }
        while (items[j] > pivot) {
            j--;
        }
        if (i <= j) {
            swap(items, i, j); //sawpping two elements
            i++;
            j--;
        }
    }
    return i;
}

function quickSort(items, left, right, tipo) {
    var index;
    if (items.length > 1) {    
        
        // seleccion de index segun el tipo de arreglo
        switch(tipo) {
            case 'Enlistamientos':
                // code block
                index = partitionEnlistamientoNroProg(items, left, right); //index returned from partition
                break;
            case 'NormalNumber':
                // code block
                index = partitionNormalNumber(items, left, right); //index returned from partition
                break;
            default:
                // code block  
        }
        
        if (left < index - 1) { //more elements on the left side of the pivot
            quickSort(items, left, index - 1, tipo);
        }

        if (index < right) { //more elements on the right side of the pivot
            quickSort(items, index, right, tipo);
        }
    }
    return items;
}

function verificacionDeCaracteres(myText){
    if(!!myText){
        if(myText.toString().includes('/') || myText.toString().includes('\\')){
            return false
        }
    }

    return true
}


function dataConversionPd(pddatosDatos, pdDatos){
    let pddatos = JSON.parse(JSON.stringify(pddatosDatos))
    let pd = JSON.parse(JSON.stringify(pdDatos))

    pddatos.LOCAL = pddatos.LOCAL ? trim(pddatos.LOCAL) : null
    pddatos.CIRCUITO = pddatos.CIRCUITO ? trim(pddatos.CIRCUITO) : null
    pddatos.EQUIPO = pddatos.EQUIPO ? trim(pddatos.EQUIPO) : null
    pddatos.NROPROG = pddatos.NROPROG ? parseInt(trim(pddatos.NROPROG)) : null
    pddatos.PDTRASMI = pddatos.PDTRASMI ? trim(pddatos.PDTRASMI) : null
    pddatos.PDFECHA = pddatos.PDFECHA ? new Date(trim(pddatos.PDFECHA).replace('-', '/').replace('-', '/')) : null
    pddatos.HORATRAS = pddatos.HORATRAS ? trim(pddatos.HORATRAS) : null
    pddatos.ESTADO = pddatos.ESTADO ? trim(pddatos.ESTADO) : null
    pddatos.SUSMOD = pddatos.SUSMOD ? trim(pddatos.SUSMOD) : null
    pddatos.TRABAJO = pddatos.TRABAJO ? trim(pddatos.TRABAJO) : null
    pddatos.RESPONSABLE = pddatos.RESPONSABLE ? trim(pddatos.RESPONSABLE) : null
    pddatos.OBSERVACION = pddatos.OBSERVACION ? trim(pddatos.OBSERVACION) : null
    pddatos.JEFATURA = pddatos.JEFATURA ? trim(pddatos.JEFATURA) : null
    pddatos.NRO_REC = pddatos.NRO_REC ? parseInt(trim(pddatos.NRO_REC)) : null
    pddatos.FECHA_REC = pddatos.FECHA_REC ? new Date(trim(pddatos.FECHA_REC).replace('-', '/').replace('-', '/')) : null
    pddatos.RECIBIDO = pddatos.RECIBIDO ? trim(pddatos.RECIBIDO) : null
    pddatos.RESULTADO = pddatos.RESULTADO ? trim(pddatos.RESULTADO) : null

    for (let i = 0; i < pd.length; i++) {
        const element = pd[i];
        
        pd[i].NROPROG = element.NROPROG ? parseInt(trim(element.NROPROG)) : null
        pd[i].PDFECHA = element.PDFECHA ? new Date(trim(element.PDFECHA).replace('-', '/').replace('-', '/')) : null
        pd[i].FECHATRA = element.FECHATRA ? new Date(trim(element.FECHATRA).replace('-', '/').replace('-', '/')) : null
        pd[i].HORAINI = element.HORAINI ? trim(element.HORAINI) : null
        pd[i].HORAFIN = element.HORAFIN ? trim(element.HORAFIN) : null
    }

    return {
        pddatos,
        pd
    }
}

function dataConversionPs(psdatos, psdatosTrabajos){
    let ps = JSON.parse(JSON.stringify(psdatos))
    let psTrabajos = JSON.parse(JSON.stringify(psdatosTrabajos))

    ps.REUFECHA = ps.REUFECHA ? parseInt(trim(ps.REUFECHA)) : null
    ps.REUNRO = ps.REUNRO ? parseInt(trim(ps.REUNRO)) : null
    ps.ITEM = ps.ITEM ? parseInt(trim(ps.ITEM)) : null
    ps.LOCAL = ps.LOCAL ? trim(ps.LOCAL) : null
    ps.CIRCUITO = ps.CIRCUITO ? trim(ps.CIRCUITO) : null
    ps.EQUIPO = ps.EQUIPO ? trim(ps.EQUIPO) : null
    ps.TRABAJO = ps.TRABAJO ? trim(ps.TRABAJO) : null
    ps.AUT = ps.AUT ? trim(ps.AUT) : null
    ps.ESTADO = ps.ESTADO ? trim(ps.ESTADO) : null
    ps.SUSMOD = ps.SUSMOD ? trim(ps.SUSMOD) : null
    ps.OBSERVAC = ps.OBSERVAC ? trim(ps.OBSERVAC) : null
    ps.RESULTADO = ps.RESULTADO ? trim(ps.RESULTADO) : null
    ps.RESPONSABLE = ps.RESPONSABLE ? trim(ps.RESPONSABLE) : null
    ps.AMPLIACION = ps.AMPLIACION ? trim(ps.AMPLIACION) : null
    ps.NRO_REC = ps.NRO_REC ? parseInt(trim(ps.NRO_REC)) : null
    ps.FECHA_REC = ps.FECHA_REC ? new Date(trim(ps.FECHA_REC).replace('-', '/').replace('-', '/')) : null

    for (let i = 0; i < psTrabajos.length; i++) {
        const element = psTrabajos[i];
        
        psTrabajos[i].REUFECHA = element.REUFECHA ? parseInt(trim(element.REUFECHA)) : null
        psTrabajos[i].REUNRO = element.REUNRO ? parseInt(trim(element.REUNRO)) : null
        psTrabajos[i].ITEM = element.ITEM ? parseInt(trim(element.ITEM)) : null
        psTrabajos[i].FECHATRABA = element.FECHATRABA ? new Date(trim(element.FECHATRABA).replace('-', '/').replace('-', '/')) : null
        psTrabajos[i].HORADESDE = element.HORADESDE ? trim(element.HORADESDE) : null
        psTrabajos[i].HORAHASTA = element.HORAHASTA ? trim(element.HORAHASTA) : null
    }

    return {
        ps,
        psTrabajos
    }

}

function eq23kvDatosTrim(eq23kvDatos){
    let eq23kv = eq23kvDatos

    if(!!eq23kv.LOCAL) {
        eq23kv.LOCAL = eq23kv.LOCAL.toString().trim()
    }
    if(!!eq23kv.CIRCUITO) {
        eq23kv.CIRCUITO = eq23kv.CIRCUITO.toString().trim()
    }
    if(!!eq23kv.EQUIPO) {
        eq23kv.EQUIPO = eq23kv.EQUIPO.toString().trim()
    }
    if(!!eq23kv.BARRA) {
        eq23kv.BARRA = eq23kv.BARRA.toString().trim()
    }

    return eq23kv
}

function dataConversionReclamos(reclamoDatos){
    let reclamo = JSON.parse(JSON.stringify(reclamoDatos))

    reclamo.LOCAL = reclamo.LOCAL ? trim(reclamo.LOCAL) : null
    reclamo.OTRADEP = reclamo.OTRADEP ? trim(reclamo.OTRADEP) : null
    reclamo.NROOTRADE = reclamo.NROOTRADE ? parseInt(trim(reclamo.NROOTRADE)) : null
    reclamo.DMEDNRO = reclamo.DMEDNRO ? parseInt(trim(reclamo.DMEDNRO)) : null
    reclamo.DMED = reclamo.DMED ? trim(reclamo.DMED) : null
    reclamo.HORATRASM = reclamo.HORATRASM ? trim(reclamo.HORATRASM) : null
    reclamo.FECHATRASM = reclamo.FECHATRASM ? new Date(trim(reclamo.FECHATRASM).replace('-', '/').replace('-', '/')) : null
    reclamo.TRASMPOR = reclamo.TRASMPOR ? trim(reclamo.TRASMPOR) : null
    reclamo.RECIBPOR = reclamo.RECIBPOR ? trim(reclamo.RECIBPOR) : null
    reclamo.RECLAMO = reclamo.RECLAMO ? trim(reclamo.RECLAMO) : null

    return reclamo
}

function dataConversionSuspension (suspensionDatos) {
    let suspension = JSON.parse(JSON.stringify(suspensionDatos))

    suspension.NROPROG = suspension.NROPROG ? parseInt(trim(suspension.NROPROG)) : null
    suspension.FECHATRAS = suspension.FECHATRAS ? new Date(trim(suspension.FECHATRAS).replace('-', '/').replace('-', '/')) : null
    suspension.TRASMPOR = suspension.TRASMPOR ? trim(suspension.TRASMPOR) : null
    suspension.NROREUN = suspension.NROREUN ? parseInt(trim(suspension.NROREUN)) : null
    suspension.REUNIONANO = suspension.REUNIONANO ? parseInt(trim(suspension.REUNIONANO)) : null
    suspension.PDITEM = suspension.PDITEM ? parseInt(trim(suspension.PDITEM)) : null
    suspension.SUSMOD = suspension.SUSMOD ? trim(suspension.SUSMOD) : null
    suspension.DESCRIP = suspension.DESCRIP ? trim(suspension.DESCRIP) : null

    return suspension
}

function trim(trim){
    return trim.toString().trim()
}

module.exports = {
    ultimoNumeroRPS,
    quickSort,
    verificacionDeCaracteres,
    eq23kvDatosTrim,
    dataConversionPd,
    dataConversionPs,
    dataConversionReclamos,
    dataConversionSuspension
}