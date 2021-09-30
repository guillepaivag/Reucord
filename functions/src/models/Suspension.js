const pool = require('../database/index')

class Suspension {
    constructor ( datosSuspension ) {
        this.NROPROG = datosSuspension?.NROPROG ?? null
        this.FECHATRAS = datosSuspension?.FECHATRAS ?? null
        this.HORATRAS = datosSuspension?.HORATRAS ?? null
        this.TRASMPOR = datosSuspension?.TRASMPOR ?? null
        this.NROREUN = datosSuspension?.NROREUN ?? null
        this.REUNIONANO = datosSuspension?.REUNIONANO ?? null
        this.PDITEM = datosSuspension?.PDITEM ?? null
        this.DESCRIP = datosSuspension?.DESCRIP ?? null
    }

    /**
     * 
     * 
     * 
    */



    /**
     * 
     * Metodos Estaticos
     * 
    */

    static async obtenerListaSuspension ( ) {
        const response = await pool.query('SELECT * FROM suspenciones ORDER BY FECHATRAS DESC')

        return response
    }

    static async suspensionPorIdAnho ( nroprog, fechatras ) {
        const response = await pool.query('SELECT * FROM suspenciones WHERE NROPROG = ? AND YEAR(FECHATRAS) = ?', [
            nroprog, 
            fechatras.getFullYear()
        ])

        return response
    }

    static async unaSuspension ( nroprog, fechatras, nroreun, reunionano, pditem ) {
        let suspension
        
        if(nroreun){
            suspension = await pool.query('SELECT * FROM suspenciones WHERE NROPROG = ? AND FECHATRAS = ? AND NROREUN = ? AND REUNIONANO = ?', [
                nroprog, 
                fechatras.toISOString().substr(0, 10), 
                nroreun, 
                reunionano
            ])
        }else {
            suspension = await pool.query('SELECT * FROM suspenciones WHERE NROPROG = ? AND FECHATRAS = ? AND NROREUN IS NULL AND REUNIONANO = ? AND PDITEM = ?', [
                nroprog, 
                fechatras.toISOString().substr(0, 10), 
                reunionano, 
                pditem
            ])
        }

        return suspension
    }

    static async agregarSuspension ( suspension ) {
        const response = await pool.query('INSERT INTO suspenciones SET ?', [suspension])

        return response
    }
}

module.exports = Suspension