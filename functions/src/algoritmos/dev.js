const {pool, poolDev} = require('../database/index')

const quitarCaracteresEspecialesEquipos = async () => {
    const allEq23kv = await pool.query('SELECT * FROM eq23kv')

    for(let i = 0; i < allEq23kv.length; i++) {

        if(!!allEq23kv[i].LOCAL && !!allEq23kv[i].CIRCUITO && !!allEq23kv[i].EQUIPO){
            if(allEq23kv[i].LOCAL.includes('/') || allEq23kv[i].CIRCUITO.includes('/') || allEq23kv[i].EQUIPO.includes('/')){
                let datoActualizado = {
                    LOCAL: allEq23kv[i].LOCAL.replace('/', '-'),
                    CIRCUITO: allEq23kv[i].CIRCUITO.replace('/', '-'),
                    EQUIPO: allEq23kv[i].EQUIPO.replace('/', '-'),
                    BARRA: allEq23kv[i].BARRA
                }
                
                const updated = await pool.query('UPDATE eq23kv SET ? WHERE LOCAL = ? AND CIRCUITO = ? AND EQUIPO = ?', [datoActualizado, allEq23kv[i].LOCAL, allEq23kv[i].CIRCUITO, allEq23kv[i].EQUIPO])
            }
        }
    }

    return 'terminado..'
}

const quitarCaracteresEspecialesCd = async () => {
    const allCd = await pool.query('SELECT * FROM cd')

    for(let i = 0; i < allCd.length; i++) {

        if(!!allCd[i].LOCAL && !!allCd[i].CIRCUITO && !!allCd[i].EQUIPO){
            if(allCd[i].LOCAL.includes('/') || allCd[i].CIRCUITO.includes('/') || allCd[i].EQUIPO.includes('/')){
                let datoActualizado = {
                    LOCAL: allCd[i].LOCAL.replace('/', '-'),
                    CIRCUITO: allCd[i].CIRCUITO.replace('/', '-'),
                    EQUIPO: allCd[i].EQUIPO.replace('/', '-'),
                }
    
                const updated = await pool.query('UPDATE cd SET ? WHERE LOCAL = ? AND CIRCUITO = ? AND EQUIPO = ?', [datoActualizado, allCd[i].LOCAL, allCd[i].CIRCUITO, allCd[i].EQUIPO])
            }
        }
    }

    return 'terminado..'
}

const quitarCaracteresEspecialesPddatos = async () => {
    const allpddatos = await pool.query('SELECT * FROM pddatos')
    let updated = []

    for(let i = 0; i < allpddatos.length; i++) {

        if(!!allpddatos[i].NROPROG && !!allpddatos[i].PDFECHA && !!allpddatos[i].LOCAL && !!allpddatos[i].CIRCUITO && !!allpddatos[i].EQUIPO){
            if(allpddatos[i].LOCAL.includes('/') || allpddatos[i].CIRCUITO.includes('/') || allpddatos[i].EQUIPO.includes('/')){
                let datoActualizado = {
                    LOCAL: allpddatos[i].LOCAL.replace('/', '-'),
                    CIRCUITO: allpddatos[i].CIRCUITO.replace('/', '-'),
                    EQUIPO: allpddatos[i].EQUIPO.replace('/', '-'),
                }
                let nroprog = await allpddatos[i].NROPROG
                let pddatos = await allpddatos[i].PDFECHA

                console.log(nroprog , pddatos)

                updated.push(await pool.query('UPDATE pddatos SET ? WHERE NROPROG = ? AND PDFECHA = ?', [datoActualizado, nroprog, pddatos]))
            }
        }
    }

    return updated
}

const quitarCaracteresEspecialesPrgtraviop1 = async () => {
    const alldatos = await pool.query('SELECT * FROM prgtraviop1')
    let updated = []

    for(let i = 0; i < alldatos.length; i++) {

        if(!!alldatos[i].REUFECHA && !!alldatos[i].REUNRO && !!alldatos[i].ITEM && !!alldatos[i].LOCAL && !!alldatos[i].CIRCUITO && !!alldatos[i].EQUIPO){
            if(alldatos[i].LOCAL.includes('/') || alldatos[i].CIRCUITO.includes('/') || alldatos[i].EQUIPO.includes('/')){
                let datoActualizado = {
                    LOCAL: alldatos[i].LOCAL.replace('/', '-'),
                    CIRCUITO: alldatos[i].CIRCUITO.replace('/', '-'),
                    EQUIPO: alldatos[i].EQUIPO.replace('/', '-'),
                }
                let reufecha = await alldatos[i].REUFECHA
                let reunro = await alldatos[i].REUNRO
                let item = await alldatos[i].ITEM

                updated.push(await pool.query('UPDATE prgtraviop1 SET ? WHERE REUFECHA = ? AND REUNRO = ? AND ITEM = ?', [datoActualizado, reufecha, reunro, item]))
            }
        }
    }

    return updated
}

// 0123456789
// 29/04/2019

const cambiarFormatoReclamos = async () => {
    const reclamosDev = await poolDev.query('SELECT * FROM reclamos')
    let reclamosNuevoFormato = []

    for (let i = 0; i < reclamosDev.length; i++) {
        let objetoReclamo = JSON.parse(JSON.stringify(reclamosDev[i]))
        let fecha = objetoReclamo.FECHATRASM.substring(6, 10) + '/' + objetoReclamo.FECHATRASM.substring(3, 5) + '/' + objetoReclamo.FECHATRASM.substring(0, 2)

        // DMEDNRO
        if (objetoReclamo.DMEDNRO == null || (objetoReclamo.DMEDNRO != null && objetoReclamo.DMEDNRO.trim() == '')){
            objetoReclamo.DMEDNRO = 0

        } else if(objetoReclamo.DMEDNRO.toLowerCase() == 'whatsapp'){
            objetoReclamo.DMEDNRO = -10
            
        } else if (objetoReclamo.DMEDNRO.toLowerCase() == 'outlook'){
            objetoReclamo.DMEDNRO = -11
            
        } else if (objetoReclamo.DMEDNRO.toLowerCase() == 'prevenido'){
            objetoReclamo.DMEDNRO = -12

        } else if (objetoReclamo.DMEDNRO.toLowerCase() == 'correo'){
            objetoReclamo.NROOTRADE = -13

        } else if (parseInt(objetoReclamo.DMEDNRO).toString() == 'NaN'){
            objetoReclamo.NROOTRADE = -99

        } else {
            console.log('objetoReclamo.DMEDNRO: ' + objetoReclamo.DMEDNRO)
            objetoReclamo.DMEDNRO = parseInt(objetoReclamo.DMEDNRO)
        }

        // NROOTRADE
        if (objetoReclamo.NROOTRADE == null || (objetoReclamo.NROOTRADE != null && objetoReclamo.NROOTRADE.trim() == '')){
            objetoReclamo.NROOTRADE = 0

        } else if(objetoReclamo.NROOTRADE.toLowerCase() == 'whatsapp'){
            objetoReclamo.NROOTRADE = -10
            
        } else if (objetoReclamo.NROOTRADE.toLowerCase() == 'outlook'){
            objetoReclamo.NROOTRADE = -11
            
        } else if (objetoReclamo.NROOTRADE.toLowerCase() == 'prevenido'){
            objetoReclamo.NROOTRADE = -12

        } else if (objetoReclamo.NROOTRADE.toLowerCase() == 'correo'){
            objetoReclamo.NROOTRADE = -13

        } else if (parseInt(objetoReclamo.NROOTRADE).toString() == 'NaN'){
            objetoReclamo.NROOTRADE = -99

        } else {
            console.log('objetoReclamo.NROOTRADE: ' + objetoReclamo.NROOTRADE)
            objetoReclamo.NROOTRADE = parseInt(objetoReclamo.NROOTRADE)
        }

        objetoReclamo.FECHATRASM = new Date(fecha)
        
        reclamosNuevoFormato.push(objetoReclamo)
        await pool.query('INSERT INTO reclamos SET ?', [objetoReclamo])
    }

    return reclamosNuevoFormato
}

const cambiarFormatoPdDatos = async () => {
    const pddatosDev = await poolDev.query('SELECT * FROM pddatos')
    let pddatosNuevoFormato = []

    for (let i = 0; i < pddatosDev.length; i++) {
        let objetoPdDatos = JSON.parse(JSON.stringify(pddatosDev[i]))
        let pdfecha = null
        let fecharec = null

        if(objetoPdDatos.PDFECHA){
            pdfecha = objetoPdDatos.PDFECHA.substring(6, 10) + '/' + objetoPdDatos.PDFECHA.substring(3, 5) + '/' + objetoPdDatos.PDFECHA.substring(0, 2)
        }

        if(objetoPdDatos.FECHA_REC){
            fecharec = objetoPdDatos.FECHA_REC.substring(6, 10) + '/' + objetoPdDatos.FECHA_REC.substring(3, 5) + '/' + objetoPdDatos.FECHA_REC.substring(0, 2)
        }
        
        objetoPdDatos.LOCAL = trim(objetoPdDatos.LOCAL) ? trim(objetoPdDatos.LOCAL) : null
        objetoPdDatos.CIRCUITO = trim(objetoPdDatos.CIRCUITO) ? trim(objetoPdDatos.CIRCUITO) : null
        objetoPdDatos.EQUIPO = trim(objetoPdDatos.EQUIPO) ? trim(objetoPdDatos.EQUIPO) : null
        objetoPdDatos.NROPROG = trim(objetoPdDatos.NROPROG) ? parseInt(trim(objetoPdDatos.NROPROG)) : null
        objetoPdDatos.PDTRASMI = trim(objetoPdDatos.PDTRASMI) ? trim(objetoPdDatos.PDTRASMI) : null
        objetoPdDatos.PDFECHA = trim(objetoPdDatos.PDFECHA) ? new Date(pdfecha) : null
        objetoPdDatos.HORATRAS = trim(objetoPdDatos.HORATRAS) ? trim(objetoPdDatos.HORATRAS) : null
        objetoPdDatos.ESTADO = trim(objetoPdDatos.ESTADO) ? trim(objetoPdDatos.ESTADO) : null
        objetoPdDatos.TRABAJO = trim(objetoPdDatos.TRABAJO) ? trim(objetoPdDatos.TRABAJO) : null
        objetoPdDatos.RESPONSABLE = trim(objetoPdDatos.RESPONSABLE) ? trim(objetoPdDatos.RESPONSABLE) : null
        objetoPdDatos.OBSERVACION = trim(objetoPdDatos.OBSERVACION) ? objetoPdDatos.OBSERVACION : null
        objetoPdDatos.JEFATURA = trim(objetoPdDatos.JEFATURA) ? trim(objetoPdDatos.JEFATURA) : null
        objetoPdDatos.NRO_REC = trim(objetoPdDatos.NRO_REC) ? parseInt(trim(objetoPdDatos.NRO_REC)) : null
        objetoPdDatos.FECHA_REC = trim(objetoPdDatos.FECHA_REC) ? new Date(fecharec) : null
        objetoPdDatos.RECIBIDO = trim(objetoPdDatos.RECIBIDO) ? trim(objetoPdDatos.RECIBIDO) : null
        objetoPdDatos.RESULTADO = trim(objetoPdDatos.RESULTADO) ? trim(objetoPdDatos.RESULTADO) : null
        
        pddatosNuevoFormato.push(objetoPdDatos)
        await pool.query('INSERT INTO pddatos SET ?', [objetoPdDatos])
    }

    return pddatosNuevoFormato
}

const cambiarFormatosPD = async () => {
    const elements = []
    const pdDev = await poolDev.query('SELECT * FROM pd')

    for (let i = 0; i < pdDev.length; i++) {
        let element = JSON.parse(JSON.stringify(pdDev[i]))
        
        let pdfecha = null
        let fechatra = null

        pdfecha = element.PDFECHA.substring(6, 10) + '/' + element.PDFECHA.substring(3, 5) + '/' + element.PDFECHA.substring(0, 2)
        fechatra = element.FECHATRA.substring(6, 10) + '/' + element.FECHATRA.substring(3, 5) + '/' + element.FECHATRA.substring(0, 2)

        element.NROPROG = trim(element.NROPROG) ? parseInt(trim(element.NROPROG)) : null
        element.PDFECHA = trim(element.PDFECHA) ? new Date(pdfecha) : null
        element.FECHATRA = trim(element.FECHATRA) ? new Date(fechatra) : null
        element.HORAINI = trim(element.HORAINI) ? trim(element.HORAINI) : null
        element.HORAFIN = trim(element.HORAFIN) ? trim(element.HORAFIN) : null

        elements.push(element)
        await pool.query('INSERT INTO pd SET ?', [element])
    }

    return elements
}

const cambiarFormatoPrgtraviop1 = async () => {
    const elements = []
    const dev = await poolDev.query('SELECT * FROM prgtraviop1')

    for (let i = 0; i < dev.length; i++) {
        let element = dev[i];
        let push = null
        
        if(element.REUNRO && !!element.REUNRO.trim()){
            element.REUNRO = parseInt(element.REUNRO)
        } else {
            element.REUNRO = 0
        }
        if(element.ITEM && !!element.ITEM.trim()){
            element.ITEM = parseInt(element.ITEM)
        } else {
            element.ITEM = 0
        }

        const existe = await pool.query('SELECT * FROM prgtraviop1 WHERE REUFECHA = ? AND REUNRO = ? AND ITEM = ?', [element.REUFECHA, element.REUNRO, element.ITEM])

        if(!existe.length){
            push = {
                REUFECHA: trim(element.REUFECHA) ? parseInt(trim(element.REUFECHA)) : null,
                REUNRO: trim(element.REUNRO) ? parseInt(trim(element.REUNRO)) : null,
                ITEM: trim(element.ITEM) ? parseInt(trim(element.ITEM)) : null,
                LOCAL: trim(element.LOCAL) ? trim(element.LOCAL) : null,
                CIRCUITO: trim(element.CIRCUITO) ? trim(element.CIRCUITO) : null,
                EQUIPO: trim(element.EQUIPO) ? trim(element.EQUIPO) : null,
                TRABAJO: trim(element.TRABAJO) ? element.TRABAJO : null,
                AUT: trim(element.AUT) ? trim(element.AUT) : null,
                ESTADO: trim(element.ESTADO) ? trim(element.ESTADO) : null,
                OBSERVAC: trim(element.OBSERVAC) ? element.OBSERVAC : null,
                RESULTADO: trim(element.RESULTADO) ? element.RESULTADO : null,
                RESPONSABLE: trim(element.RESPONSABLE) ? trim(element.RESPONSABLE) : null,
                AMPLIACION: trim(element.AMPLIACION) ? trim(element.AMPLIACION) : null,
                NRO_REC: trim(element.NRO_REC) ? parseInt(trim(element.NRO_REC)) : null,
                FECHA_REC: trim(element.FECHA_REC) ? trim(element.FECHA_REC) : null,
            }

            elements.push(push)

            await pool.query('INSERT INTO prgtraviop1 SET ?', [push])
        }

    }

    return elements

}

const cambiarFormatoPrgtraviop1Datos = async () => {
    

    const elements = []
    const dev = await poolDev.query('SELECT * FROM prgtraviop1')

    for (let i = 0; i < dev.length; i++) {
        let element = dev[i];

        let push = {
            REUFECHA: trim(element.REUFECHA) ? parseInt(trim(element.REUFECHA)) : null,
            REUNRO: trim(element.REUNRO) ? parseInt(trim(element.REUNRO)) : null,
            ITEM: trim(element.ITEM) ? parseInt(trim(element.ITEM)) : null,
            FECHATRABA: trim(element.FECHATRABA) ? new Date(trim(element.FECHATRABA)) : null,
            HORADESDE: trim(element.HORADESDE) ? trim(element.HORADESDE) : null,
            HORAHASTA: trim(element.HORAHASTA) ? trim(element.HORAHASTA) : null
        }

        elements.push(push)
        await pool.query('INSERT INTO prgtraviop1datos SET ?', [push])
    }

    return elements

}

const cambiarFormatoSuspensiones = async () => {
    const elements = []
    const dev = await poolDev.query('SELECT * FROM suspenciones')

    for (let i = 0; i < dev.length; i++) {
        let element = dev[i];
        let fecha = element.FECHATRAS.substring(6, 10) + '/' + element.FECHATRAS.substring(3, 5) + '/' + element.FECHATRAS.substring(0, 2)

        element.NROPROG = trim(element.NROPROG) ? parseInt(trim(element.NROPROG)) : null

        element.FECHATRAS = trim(element.FECHATRAS) ? new Date(fecha) : null

        element.TRASMPOR = trim(element.TRASMPOR) ? trim(element.TRASMPOR) : null

        element.REUNIONANO = trim(element.REUNIONANO) ? parseInt(trim(element.REUNIONANO)) : null
        
        element.NROREUN = trim(element.NROREUN) ? parseInt(trim(element.NROREUN)) : null

        element.PDITEM = trim(element.PDITEM) ? parseInt(trim(element.PDITEM)) : null

        element.SUSMOD = trim(element.SUSMOD) ? trim(element.SUSMOD) : null

        element.DESCRIP = trim(element.DESCRIP) ? element.DESCRIP : null

        elements.push(element)
        await pool.query('INSERT INTO suspenciones SET ?', [element])
    }

    return elements
}

function trim(data) {
    return data ? data.toString().trim() : null
}

module.exports = {
    quitarCaracteresEspecialesEquipos,
    quitarCaracteresEspecialesCd,
    quitarCaracteresEspecialesPddatos,
    quitarCaracteresEspecialesPrgtraviop1,
    cambiarFormatoReclamos,
    cambiarFormatoPdDatos,
    cambiarFormatosPD,
    cambiarFormatoPrgtraviop1,
    cambiarFormatoPrgtraviop1Datos,
    cambiarFormatoSuspensiones
}