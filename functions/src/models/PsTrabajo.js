const pool = require('../database/index')

class PsTrabajo {
    constructor ( datosPsTrabajo ) {
        this.REUFECHA = datosPsTrabajo ? datosPsTrabajo.REUFECHA : null
        this.REUNRO = datosPsTrabajo ? datosPsTrabajo.REUNRO : null
        this.ITEM = datosPsTrabajo ? datosPsTrabajo.ITEM : null
        this.FECHATRABA = datosPsTrabajo ? datosPsTrabajo.FECHATRABA : null
        this.HORADESDE = datosPsTrabajo ? datosPsTrabajo.HORADESDE : null
        this.HORAHASTA = datosPsTrabajo ? datosPsTrabajo.HORAHASTA : null
    }

    /*
     * METODOS
     * 
     */


    /*
     * METODOS ESTATICOS
     * 
     */

    static async unaPsTrabajo ( reufecha, reunro, item ) {
        const row = await pool.query('SELECT * FROM prgtraviop1datos WHERE REUFECHA = ? AND REUNRO = ? AND ITEM = ?', [reufecha, reunro, item])

        return row
    }

    static async agregarPsTrabajo ( psTrabajo ) {
        return await pool.query('INSERT INTO prgtraviop1datos SET ?', [ psTrabajo ])
    }

    static async eliminarPsTrabajo ( reufecha, reunro, item ) {
        return await pool.query('DELETE FROM prgtraviop1datos WHERE REUFECHA = ? AND REUNRO = ? AND ITEM = ?', [reufecha, reunro, item])
    }
}

module.exports = PsTrabajo