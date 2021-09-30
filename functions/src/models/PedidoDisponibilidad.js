const pool = require('../database/index')
const PdTrabajo = require('./PdTrabajo')

class PedidoDisponibilidad {
    constructor ( datosPd, datosTrabajos ) {
        this.LOCAL = datosPd ? datosPd.LOCAL : null
        this.CIRCUITO = datosPd ? datosPd.CIRCUITO : null
        this.EQUIPO = datosPd ? datosPd.EQUIPO : null
        this.NROPROG = datosPd ? datosPd.NROPROG : null
        this.PDTRASMI = datosPd ? datosPd.PDTRASMI : null
        this.PDFECHA = datosPd ? datosPd.PDFECHA : null
        this.HORATRAS = datosPd ? datosPd.HORATRAS : null
        this.ESTADO = datosPd ? datosPd.ESTADO : null
        this.TRABAJO = datosPd ? datosPd.TRABAJO : null
        this.RESPONSABLE = datosPd ? datosPd.RESPONSABLE : null
        this.OBSERVACION = datosPd ? datosPd.OBSERVACION : null
        this.JEFATURA = datosPd ? datosPd.JEFATURA : null
        this.SUSMOD = datosPd ? datosPd.SUSMOD : null
        this.NRO_REC = datosPd ? datosPd.NRO_REC : null
        this.FECHA_REC = datosPd ? datosPd.FECHA_REC : null
        this.RECIBIDO = datosPd ? datosPd.RECIBIDO : null
        this.RESULTADO = datosPd ? datosPd.RESULTADO : null

        this.TRABAJOS = datosTrabajos ? datosTrabajos : []
    }


    /* 
     *   METODOS
     *
     */

    


    /* 
     *   METODOS ESTATICOS
     *
     */


    static async listaPedidoDisponibilidad () {
        const rows = await pool.query('SELECT * FROM pddatos ORDER BY PDFECHA DESC')

        return rows
    }

    static async unPedidoDisponibilidad ( pdnro, pdfecha ) {
        const row = await pool.query('SELECT * FROM pddatos WHERE NROPROG = ? AND PDFECHA = ?', [pdnro, pdfecha.toISOString().substr(0, 10)])

        return row
    }

    static async unPedidoDisponibilidadPorAnho ( pdnro, anho ) {
        const row = await pool.query('SELECT * FROM pddatos WHERE NROPROG = ? AND YEAR(PDFECHA) = ? AND SUSMOD IS NOT NULL', [pdnro, anho])

        return row
    }

    static async agregarPedidoDisponibilidad ( pd, pdTrabajos ) {
        const resultPd = await pool.query('INSERT INTO pddatos SET ?', [pd])
                    
        let resultPdTrabajos = []
        for (let i = 0; i < pdTrabajos.length; i++) {
            let pdTrabajoAgregado = await PdTrabajo.agregarPdTrabajo( pdTrabajos[i] )
            resultPdTrabajos.push( pdTrabajoAgregado )
        }

        return {
            resultPd,
            resultPdTrabajos
        }
    }

    static async eliminarPedidoDisponibilidad ( pdnro, pdfecha ) {
        const resultPd = await pool.query('DELETE FROM pddatos WHERE NROPROG = ? AND PDFECHA = ?', [pdnro, pdfecha.toISOString().substr(0, 10)])
        const resultPdTrabajos = await PdTrabajo.eliminarPdTrabajo( pdnro, pdfecha )

        return {
            resultPd,
            resultPdTrabajos
        }
    }

    static async actualizarPedidoDisponibilidad ( pd, pdTrabajos, pdnro, pdfecha ) {
        const resultPd = await pool.query('UPDATE pddatos SET ? WHERE NROPROG = ? AND PDFECHA = ?', [pd, pdnro, pdfecha.toISOString().substr(0, 10)])
        let resultPdTrabajos = []

        await PdTrabajo.eliminarPdTrabajo( pdnro, pdfecha )

        for (let i = 0; i < pdTrabajos.length; i++) {
            let pdTrabajoAgregado = await PdTrabajo.agregarPdTrabajo( pdTrabajos[i] )
            resultPdTrabajos.push( pdTrabajoAgregado )
        }

        return {
            resultPd,
            resultPdTrabajos
        }
    }
}

module.exports = PedidoDisponibilidad