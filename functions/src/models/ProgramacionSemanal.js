const pool = require('../database/index')
const PsTrabajo = require('./PsTrabajo')

class ProgramacionSemanal {
    constructor ( datosPs, datosTrabajos ) {
        this.REUFECHA = datosPs ? datosPs.REUFECHA : null
        this.REUNRO = datosPs ? datosPs.REUNRO : null
        this.ITEM = datosPs ? datosPs.ITEM : null
        this.LOCAL = datosPs ? datosPs.LOCAL : null
        this.CIRCUITO = datosPs ? datosPs.CIRCUITO : null
        this.EQUIPO = datosPs ? datosPs.EQUIPO : null
        this.TRABAJO = datosPs ? datosPs.TRABAJO : null
        this.AUT = datosPs ? datosPs.AUT : null
        this.ESTADO = datosPs ? datosPs.ESTADO : null
        this.OBSERVAC = datosPs ? datosPs.OBSERVAC : null
        this.RESULTADO = datosPs ? datosPs.RESULTADO : null
        this.RESPONSABLE = datosPs ? datosPs.RESPONSABLE : null
        this.AMPLIACION = datosPs ? datosPs.AMPLIACION : null
        this.SUSMOD = datosPs ? datosPs.SUSMOD : null
        this.NRO_REC = datosPs ? datosPs.NRO_REC : null
        this.FECHA_REC = datosPs ? datosPs.FECHA_REC : null

        this.TRABAJOS = datosTrabajos ? datosTrabajos : []
    }


    /**
     * 
     * METODOS ESTATICOS
     * 
     */

    static async listaProgramacionSemanal () {
        const rows = await pool.query('SELECT * FROM prgtraviop1 ORDER BY REUFECHA DESC')

        return rows
    }

    static async unaProgramacionSemanal ( reufecha, reunro, item ) {
        const rows = await pool.query('SELECT * FROM prgtraviop1 WHERE REUFECHA = ? AND REUNRO = ? AND ITEM = ?', [reufecha, reunro, item])

        return rows
    }

    static async agregarProgramacionSemanal ( ps, psTrabajos ) {
        const result = await pool.query('INSERT INTO prgtraviop1 SET ?', [ ps ])
        let resultTrabajos = []
        for (let i = 0; i < psTrabajos.length; i++) {
            const psTrabajoAgregado = await PsTrabajo.agregarPsTrabajo( psTrabajos[i] )
            resultTrabajos.push( psTrabajoAgregado )
        }
        
        return {
            result,
            resultTrabajos
        }
    }

    static async actualizarProgramacionSemanal ( psRes, psTrabajosRes, reufecha, reunro, item ) {
        
        const result = await pool.query('UPDATE prgtraviop1 SET ? WHERE REUFECHA = ? AND REUNRO = ? AND ITEM = ?', [psRes, reufecha, reunro, item])

        let resultTrabajos = []

        await PsTrabajo.eliminarPsTrabajo( reufecha, reunro, item )

        for (let i = 0; i < psTrabajosRes.length; i++) {
            const psTrabajoAgregado = await PsTrabajo.agregarPsTrabajo( psTrabajosRes[i] )
            resultTrabajos.push( psTrabajoAgregado )
        }
        
        return {
            result,
            resultTrabajos
        }
    }

    static async eliminarProgramacionSemanal ( reufecha, reunro, item ) {
        const deleted = await pool.query('DELETE FROM prgtraviop1 WHERE REUFECHA = ? AND REUNRO = ? AND ITEM = ?', [reufecha, reunro, item])

        return deleted
    }
}

module.exports = ProgramacionSemanal