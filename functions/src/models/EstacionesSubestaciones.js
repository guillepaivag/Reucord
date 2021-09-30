const pool = require('../database/index')

class EstacionesSubestaciones {

    constructor ( datosLocal ) {
        if ( !datosLocal ) {
            this.SIGLA = null
            this.LOCAL = null
            this.SISTEMA = null
            
            return
        }
        
        const {
            SIGLA,
            LOCAL,
            SISTEMA
        } = datosLocal

        this.SIGLA = SIGLA
        this.LOCAL = LOCAL
        this.SISTEMA = SISTEMA
    }

    /* 
        Metodos
    */



    /* 
        Metodos Estaticos
    */

    static async listaLocales () {
        let list = []
    
        const response = await pool.query('SELECT * FROM esse')

        for(let i = 0; i < response.length; i++){
            list.push(response[i].LOCAL)
        }

        return list
    }

    static async datosLocal ( local ) {
        const response = await pool.query('SELECT * FROM esse WHERE LOCAL = ?', [local])

        return response
    }
}

module.exports = EstacionesSubestaciones