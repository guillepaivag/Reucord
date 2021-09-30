const pool = require('../database/index')

class Eq23kv {
    constructor ( datosEq23kv ) {
        if ( !datosEq23kv ) {
            this.LOCAL = null
            this.CIRCUITO = null
            this.EQUIPO = null
            this.BARRA = null
            
            return
        }
        
        const {
            LOCAL,
            CIRCUITO,
            EQUIPO,
            BARRA
        } = datosLocal

        this.LOCAL = LOCAL
        this.CIRCUITO = CIRCUITO
        this.EQUIPO = EQUIPO
        this.BARRA = BARRA
    }


    /* 
     *   METODOS
     *
     */



    /* 
     *   METODOS ESTATICOS
     *
     */


    static async listaEquipos () {
        const rows = await pool.query('SELECT * FROM eq23kv')

        return rows
    }

    static async unEquipo ( local, circuito, equipo ) {
        const row = await pool.query('SELECT * FROM eq23kv WHERE LOCAL = ? AND CIRCUITO = ? AND EQUIPO = ?', [local, circuito, equipo])

        return row
    }

    static async circuitoPorLocal ( local ) {
        const response = await pool.query('SELECT * FROM eq23kv WHERE LOCAL = ?', [local])

        return response
    }

    static async listaEquipoPorLocalCircuito ( local, circuito ) {
        const response = await pool.query('SELECT * FROM eq23kv WHERE LOCAL = ? AND CIRCUITO = ?', [local, circuito])

        return response
    }

    static async agregarEquipo ( eq23kv ) {
        
        const added = await pool.query('INSERT INTO eq23kv SET ?', [eq23kv])
        
        return added

    }

    static async eliminarEquipo ( local, circuito, equipo ) {
        const deleted = await pool.query('DELETE FROM eq23kv WHERE LOCAL = ? AND CIRCUITO = ? AND EQUIPO = ?', [local, circuito, equipo])

        return deleted
    }

    static async actualizarEquipo ( eq23kv, local, circuito, equipo ) {
        const updated = await pool.query('UPDATE eq23kv SET ? WHERE LOCAL = ? AND CIRCUITO = ? AND EQUIPO = ?', [eq23kv, local, circuito, equipo])

        return updated
    }
}

module.exports = Eq23kv