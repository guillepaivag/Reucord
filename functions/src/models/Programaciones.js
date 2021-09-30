const pool = require('../database/index')

class Programaciones {





    /**
     * METODOS ESTATICOS:
     * 
     * 
    */


    static async trabajosPorRangoDeFecha ( fechaDesde, fechaHasta, opciones ) {
        let stringQueryOpciones = ''

        if ( opciones && opciones.local ) {
            stringQueryOpciones = stringQueryOpciones.length ? `${stringQueryOpciones} AND B.LOCAL = '${opciones.local}'` : `B.LOCAL = '${opciones.local}'`
        }

        if ( opciones && opciones.circuito ) {
            stringQueryOpciones = stringQueryOpciones.length ? `${stringQueryOpciones} AND B.CIRCUITO = '${opciones.circuito}'` : `B.CIRCUITO = '${opciones.circuito}'`
        }

        if ( opciones && opciones.equipo ) {
            stringQueryOpciones = stringQueryOpciones.length ? `${stringQueryOpciones} AND B.EQUIPO = '${opciones.equipo}'` : `B.EQUIPO = '${opciones.equipo}'`
        }

        if ( stringQueryOpciones.length ) {
            stringQueryOpciones = `${stringQueryOpciones} AND`
        }

        let fechaDesdeConHora = `${fechaDesde} 00:00:00`
        let fechaHastaConHora = `${fechaHasta} 23:59:59`

        let stringQueryPs = `SELECT A.* FROM prgtraviop1datos 
        A INNER JOIN prgtraviop1 B 
        ON A.REUFECHA = B.REUFECHA AND A.REUNRO = B.REUNRO AND A.ITEM = B.ITEM 
        WHERE ${stringQueryOpciones} A.FECHATRABA BETWEEN ? AND ?`
        
        let stringQueryPd = `SELECT A.* FROM pd 
        A INNER JOIN pddatos B 
        ON A.NROPROG = B.NROPROG AND A.PDFECHA = B.PDFECHA 
        WHERE ${stringQueryOpciones} A.FECHATRA BETWEEN ? AND ?`

        const listaTrabajosPs = await pool.query(stringQueryPs, [fechaDesdeConHora, fechaHastaConHora])
        const listaTrabajosPd = await pool.query(stringQueryPd, [fechaDesdeConHora, fechaHastaConHora])

        return {
            listaTrabajosPs,
            listaTrabajosPd
        }
    }   

    


    
}

module.exports = Programaciones