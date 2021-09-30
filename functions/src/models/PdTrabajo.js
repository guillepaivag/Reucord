const pool = require('../database/index')

class PdTrabajo {
    constructor ( datosPdTrabajo ) {
        this.NROPROG = datosPdTrabajo ? datosPdTrabajo.NROPROG : null
        this.PDFECHA = datosPdTrabajo ? datosPdTrabajo.PDFECHA : null
        this.FECHATRA = datosPdTrabajo ? datosPdTrabajo.FECHATRA : null
        this.HORAINI = datosPdTrabajo ? datosPdTrabajo.HORAINI : null
        this.HORAFIN = datosPdTrabajo ? datosPdTrabajo.HORAFIN : null
    }

    /*
     * METODOS
     * 
     */


    /*
     * METODOS ESTATICOS
     * 
     */

    static async unPdTrabajo ( pdnro, pdfecha ) {
        const row = await pool.query('SELECT * FROM pd WHERE NROPROG = ? AND PDFECHA = ?', [pdnro, pdfecha.toISOString().substr(0, 10)])

        return row
    }

    static async agregarPdTrabajo ( pdTrabajo ) {
        return await pool.query( 'INSERT INTO pd SET ?', [pdTrabajo] )
    }

    static async eliminarPdTrabajo ( pdnro, pdfecha ) {
        return await pool.query('DELETE FROM pd WHERE NROPROG = ? AND PDFECHA = ?', [pdnro, pdfecha.toISOString().substr(0, 10)])
    }
}

module.exports = PdTrabajo