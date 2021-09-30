const pool = require('../database/index')
const helperPorgramacion = {}

helperPorgramacion.getProgrammingByLocalAndYear = async (programmingType, local, year) => {

    let programmingData = []
    let programmingInformation = null
    let programmingWorks = null

    console.time('Busqueda datos')
    if( programmingType == 'PD' ) {
        programmingInformation = await pool.query(`SELECT * FROM pddatos 
                                                WHERE YEAR(PDFECHA) = ? AND LOCAL = ? AND (SUSMOD IS NULL OR SUSMOD != 'S')
                                                ORDER BY pddatos.NROPROG ASC`, [year, local])
        
        programmingWorks = await pool.query(`SELECT A.* FROM pd A 
                                            INNER JOIN pddatos B 
                                            ON A.NROPROG = B.NROPROG AND A.PDFECHA = B.PDFECHA
                                            WHERE YEAR(B.PDFECHA) = ? AND B.LOCAL = ? 
                                            AND (B.SUSMOD IS NULL OR B.SUSMOD != 'S')`, [year, local])

    } else if( programmingType == 'PS' ) {
        programmingInformation = await pool.query(`SELECT * FROM prgtraviop1 
                                                WHERE REUFECHA = ? AND LOCAL = ? AND (SUSMOD IS NULL OR SUSMOD != 'S')
                                                ORDER BY prgtraviop1.ITEM ASC`, [year, local])

        programmingWorks = await pool.query(`SELECT A.* FROM prgtraviop1datos A
                                            INNER JOIN prgtraviop1 B
                                            ON A.REUFECHA = B.REUFECHA AND A.REUNRO = B.REUNRO AND A.ITEM = B.ITEM
                                            WHERE B.REUFECHA = ? AND B.LOCAL = ? AND (B.SUSMOD IS NULL OR B.SUSMOD != 'S')`, [year, local])
    } else {
        return res.status(400).json({
            codigo: 'ErrorUsuario',
            mensaje: 'Hay que elegir una programación valida.',
            respuesta: null
        })
    }
    console.timeEnd('Busqueda datos')

    console.time('Armando estructura')

    for (let programmingIndex = 0; programmingIndex < programmingInformation.length; programmingIndex++) {
            
        const programming = programmingInformation[programmingIndex];

        let worksData = []

        let works = programmingWorks.filter(x => {
            
            if( programmingType == 'PD' ) {
                const equalsNROPROG = x.NROPROG === programming.NROPROG
                const equalsPDFECHA = x.PDFECHA.toISOString().substr(0, 10) === programming.PDFECHA.toISOString().substr(0, 10)

                return equalsNROPROG && equalsPDFECHA
            } else if( programmingType == 'PS' ) {
                const equalsREUFECHA = x.REUFECHA === programming.REUFECHA
                const equalsREUNRO = x.REUNRO === programming.REUNRO
                const equalsITEM = x.ITEM === programming.ITEM

                return equalsREUFECHA && equalsREUNRO && equalsITEM
            } else {
                return res.status(500).json({
                    codigo: 'Error',
                    mensaje: 'Hay que elegir una programación valida.',
                    respuesta: null
                })
            }

        })

        works.length ? worksData.push(...works) : null

        programmingData.push({
            programmingType: programmingType,
            informationData: programming,
            workData: worksData
        })
    }

    console.timeEnd('Armando estructura')

    return programmingData
}

module.exports = helperPorgramacion