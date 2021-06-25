const controllerEq23kv = {}
const pool = require('../database/index')
const {eq23kvDatosTrim, verificacionDeCaracteres} = require('../algoritmos/general')

controllerEq23kv.list = async (req, res) => {
    
    try {
        const rows = await pool.query('SELECT * FROM eq23kv')

        res.status(200).json({
            codigo: 'Exito',
            mensaje: 'Lista de eq23kv enviado con exito',
            respuesta: await rows
        })
    } catch (error) {
        res.json({
            codigo: 'Error002',
            mensaje: 'Hubo un problema',
            respuesta: error
        })
    }
}

controllerEq23kv.eq23kvOne = async (req, res) => {
    const {local, circuito, equipo} = req.params

    try {
        if(verificacionDeCaracteres(local)
            && verificacionDeCaracteres(circuito)
            && verificacionDeCaracteres(equipo))
        {
            const row = await pool.query('SELECT * FROM eq23kv WHERE LOCAL = ? AND CIRCUITO = ? AND EQUIPO = ?', [local, circuito, equipo])

            res.status(200).json({
                codigo: 'Exito',
                mensaje: 'Eq23kv enviado con exito',
                respuesta: await row
            })
        } else {
            res.json({
                codigo: 'Error002',
                mensaje: 'No ingrese datos que contengan / \\'
            })
        }

    } catch (error) {
        res.json({
            codigo: 'Error002',
            mensaje: 'Hubo un problema',
            respuesta: error
        })
    }

}

controllerEq23kv.listaCircuitoPorLocal = async (req, res) => {
    const {local} = req.params

    let list = []
    
    try {
        if(verificacionDeCaracteres(local)){
            const response = await pool.query('SELECT * FROM eq23kv WHERE LOCAL = ?', [local])

            if(response.length > 0){
                for(let i = 0; i < response.length; i++){
                    if(!list.includes(response[i].CIRCUITO)){
                        list.push(response[i].CIRCUITO)
                    }
                }
            
                res.json({
                    codigo: 'Exito',
                    mensaje: 'Lista de circuitos enviado con exito',
                    respuesta: list
                })
            }else {
                res.json({
                    codigo: 'Error',
                    mensaje: 'No existe el local'
                })
            }
        } else {
            res.json({
                codigo: 'Error002',
                mensaje: 'No ingrese datos que contengan / \\'
            })
        }
        
    } catch (error) {
        res.json({
            codigo: 'Error002',
            mensaje: 'Hubo un problema',
            respuesta: error
        })
    }

}

controllerEq23kv.listaEquipoPorLocalCircuito = async (req, res) => {
    const {local, circuito} = req.params

    let list = []
    
    try {
        if(verificacionDeCaracteres(local)
            && verificacionDeCaracteres(circuito))
        {
            const response = await pool.query('SELECT * FROM eq23kv WHERE LOCAL = ? AND CIRCUITO = ?', [local, circuito])

            if(response.length > 0){
                for(let i = 0; i < response.length; i++){
                    if(!list.includes(response[i].EQUIPO)){
                        list.push(response[i].EQUIPO)
                    }
                }
            
                res.json({
                    codigo: 'Exito',
                    mensaje: 'Lista de equipos enviado con exito',
                    respuesta: list
                })
            }else {
                res.json({
                    codigo: 'Error',
                    mensaje: 'No existe el local o el circuito'
                })
            }
        } else {
            res.json({
                codigo: 'Error002',
                mensaje: 'No ingrese datos que contengan / \\'
            })
        }

    } catch (error) {
        res.json({
            codigo: 'Error002',
            mensaje: 'Hubo un problema',
            respuesta: error
        })
    }
}

controllerEq23kv.save = async (req, res) => {
    const data = req.body

    let eq23kvRes = JSON.parse(JSON.stringify(data))

    try {
        eq23kvRes = eq23kvDatosTrim(eq23kvRes)

        if((!!eq23kvRes.LOCAL && !!eq23kvRes.CIRCUITO && !!eq23kvRes.EQUIPO) && (eq23kvRes.LOCAL != ''
            && eq23kvRes.CIRCUITO != '' && eq23kvRes.EQUIPO != ''))
        {
            if(verificacionDeCaracteres(eq23kvRes.LOCAL)
                && verificacionDeCaracteres(eq23kvRes.CIRCUITO)
                && verificacionDeCaracteres(eq23kvRes.EQUIPO))
            {
                const verificacion = await pool.query('SELECT * FROM eq23kv WHERE LOCAL = ? AND CIRCUITO = ? AND EQUIPO = ?', [eq23kvRes.LOCAL, eq23kvRes.CIRCUITO, eq23kvRes.EQUIPO])

                if(verificacion.length == 0){
                    const added = await pool.query('INSERT INTO eq23kv SET ?', [eq23kvRes])
                
                    res.json({
                        codigo: 'Exito',
                        mensaje: 'Se ha agregado el equipo en eq23kv con exito.',
                        respuesta: await added
                    })
                } else {
                    res.json({
                        codigo: 'Error002',
                        mensaje: 'Ya existe este equipo.'
                    })
                }
            } else {
                res.json({
                    codigo: 'Error002',
                    mensaje: 'No ingrese datos que contengan / \\.'
                })
            }
        } else {
            res.json({
                codigo: 'Error002',
                mensaje: 'Ingrese todos los datos para la identificación de un equipo.'
            })
        }
    } catch (error) {
        res.json({
            codigo: 'Error002',
            mensaje: 'Hubo un problema',
            respuesta: error
        })
    }
}

controllerEq23kv.delete = async (req, res) => {
    const {local, circuito, equipo} = req.params

    try {
        if(verificacionDeCaracteres(local)
            && verificacionDeCaracteres(circuito)
            && verificacionDeCaracteres(equipo))
        {
            const deleted = await pool.query('DELETE FROM eq23kv WHERE LOCAL = ? AND CIRCUITO = ? AND EQUIPO = ?', [local, circuito, equipo])
            
            res.json({
                codigo: 'Exito',
                mensaje: 'Un eq23kv se a eliminado con exito.',
                respuesta: await deleted
            })
        } else {
            res.status(500).json({
                codigo: 'Error002',
                mensaje: 'No ingrese datos que contengan / \\'
            })
        }
    } catch (error) {
        res.json({
            codigo: 'Error002',
            mensaje: 'Hubo un problema',
            respuesta: error
        })
    }
}

controllerEq23kv.update = async (req, res) => {
    const {local, circuito, equipo} = req.params
    const datoActualizado = req.body

    let eq23kvRes = JSON.parse(JSON.stringify(datoActualizado))

    try {
        eq23kvRes = eq23kvDatosTrim(eq23kvRes)

        if((!!eq23kvRes.LOCAL && !!eq23kvRes.CIRCUITO && !!eq23kvRes.EQUIPO) && (eq23kvRes.LOCAL != ''
            && eq23kvRes.CIRCUITO != '' && eq23kvRes.EQUIPO != ''))
        {
            if(verificacionDeCaracteres(eq23kvRes.LOCAL)
                && verificacionDeCaracteres(eq23kvRes.CIRCUITO)
                && verificacionDeCaracteres(eq23kvRes.EQUIPO))
            {
                const verificacion = await pool.query('SELECT * FROM eq23kv WHERE LOCAL = ? AND CIRCUITO = ? AND EQUIPO = ?', [eq23kvRes.LOCAL, eq23kvRes.CIRCUITO, eq23kvRes.EQUIPO])

                if(verificacion.length == 0){
                    const updated = await pool.query('UPDATE eq23kv SET ? WHERE LOCAL = ? AND CIRCUITO = ? AND EQUIPO = ?', [eq23kvRes, local, circuito, equipo])
                
                    res.json({
                        codigo: 'Exito',
                        mensaje: 'Se ha actualizado un equipo de eq23kv con exito.',
                        respuesta: await updated
                    })
                } else {
                    if(local == eq23kvRes.LOCAL && circuito == eq23kvRes.CIRCUITO && equipo == eq23kvRes.EQUIPO){
                        const updated = await pool.query('UPDATE eq23kv SET ? WHERE LOCAL = ? AND CIRCUITO = ? AND EQUIPO = ?', [eq23kvRes, local, circuito, equipo])
                
                        res.json({
                            codigo: 'Exito',
                            mensaje: 'Se ha actualizado un equipo de eq23kv con exito.',
                            respuesta: await updated
                        })
                    } else {
                        res.json({
                            codigo: 'Error002',
                            mensaje: 'Ya existe este equipo.'
                        })
                    }
                }

            } else {
                res.json({
                    codigo: 'Error002',
                    mensaje: 'No ingrese datos que contengan / \\.'
                })
            }
        } else {
            res.json({
                codigo: 'Error002',
                mensaje: 'Ingrese todos los datos para la identificación de un equipo.'
            })
        }
    } catch (error) {
        res.json({
            codigo: 'Error002',
            mensaje: 'Hubo un problema',
            respuesta: error
        })
    }

}

controllerEq23kv.totalBC = async (req, res) => {
    
    const sistemas = ['METROP.', 'ESTE', 'SUR', 'CENTRAL', 'NORTE']
    let total_bc = {
        metrop: [0, 0, 0, 0],
        este: [0, 0, 0, 0],
        sur: [0, 0, 0, 0],
        central: [0, 0, 0, 0],
        norte: [0, 0, 0, 0]
    }

    for(let sistemaNro = 0; sistemaNro < sistemas.length; sistemaNro++){
        let sistema = sistemas[sistemaNro]
        let rowsEsse = await pool.query('SELECT * FROM esse WHERE SISTEMA = ?', [sistema])

        for(let esseNro = 0; esseNro < rowsEsse.length; esseNro++){
            let rowEsse = rowsEsse[esseNro]
            let rowsEq23kv = await pool.query('SELECT * FROM eq23kv WHERE LOCAL = ?', [rowEsse.LOCAL]) 

            for(let eq23kvNro = 0; eq23kvNro < rowsEq23kv.length; eq23kvNro++){
                let rowEq23kv = rowsEq23kv[eq23kvNro]

                for(let i = 1; i <= 4; i++){
                    if(rowEq23kv.CIRCUITO){
                        if(rowEq23kv.CIRCUITO.includes('BC-0'+i)){
                            if(sistema === 'METROP.'){
                                total_bc.metrop[i-1]++
                                continue
                            }else if(sistema === 'ESTE'){
                                total_bc.este[i-1]++
                                continue
                            }else if(sistema ==='SUR'){
                                total_bc.sur[i-1]++
                                continue
                            }else if(sistema === 'CENTRAL'){
                                total_bc.central[i-1]++
                                continue
                            }else if(sistema === 'NORTE'){
                                total_bc.norte[i-1]++
                                continue
                            }
                        }
                    }
                }
            }
        }
    }

    console.log(total_bc)

    res.status(200).json(total_bc)
}



module.exports = controllerEq23kv