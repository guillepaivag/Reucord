const pool = require('../database/index')

class Reclamo {
    constructor ( datosReclamo ) {
        this.LOCAL = datosReclamo ? datosReclamo.LOCAL : null
        this.OTRADEP = datosReclamo ? datosReclamo.OTRADEP : null
        this.NROOTRADE = datosReclamo ? datosReclamo.NROOTRADE : null
        this.DMEDNRO = datosReclamo ? datosReclamo.DMEDNRO : null
        this.DMED = datosReclamo ? datosReclamo.DMED : null
        this.HORATRASM = datosReclamo ? datosReclamo.HORATRASM : null
        this.FECHATRASM = datosReclamo ? datosReclamo.FECHATRASM : null
        this.TRASMPOR = datosReclamo ? datosReclamo.TRASMPOR : null
        this.RECIBPOR = datosReclamo ? datosReclamo.RECIBPOR : null
        this.RECLAMO = datosReclamo ? datosReclamo.RECLAMO : null
    }

    /*
     * METODOS
     *
     * 
     * */



    /*
     * METODOS ESTATICOS
     *
     * 
     * */

    static listaReclamos () {
        const reclamos = pool.query('SELECT * FROM reclamos ORDER BY FECHATRASM DESC')

        return reclamos
    }

    static obtenerDatosPaginados ( limit, offset ) {
        const reclamos = pool.query('SELECT * FROM reclamos LIMIT ? OFFSET ?', [limit, offset])

        return reclamos
    }

    static obtenerReclamo ( dmednro, fechatrasm ) {
        const numero = parseInt(dmednro)
        const fecha = fechatrasm.toISOString().substr(0, 10)
        const reclamo = pool.query('SELECT * FROM reclamos WHERE DMEDNRO = ? AND FECHATRASM = ?', [ numero, fecha ])
    
        return reclamo
    }

    static agregarReclamo ( reclamo ) {
        const result = pool.query('INSERT INTO reclamos SET ?', [reclamo])

        return result
    }

    static actualizarReclamo ( reclamo, dmednro, fechatrasm ) {
        const updated = pool.query('UPDATE reclamos SET ? WHERE DMEDNRO = ? AND FECHATRASM = ?', [reclamo, dmednro, fechatrasm.toISOString().substr(0, 10)])
        
        return updated
    }

    static eliminarReclamo ( dmednro, fechatrasm ) {
        const deleted = pool.query('DELETE FROM reclamos WHERE DMEDNRO = ? AND FECHATRASM = ?', [dmednro, fechatrasm.toISOString().substr(0, 10)])

        return deleted
    }
}

module.exports = Reclamo