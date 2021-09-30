const controllerEq23kv = {}
const pool = require('../database/index')
const {eq23kvDatosTrim, verificacionDeCaracteres} = require('../helpers/general')
const Eq23kv = require('../models/Eq23kv')
const Respuesta = require('../models/Respuesta')

controllerEq23kv.list = async (req, res) => {
    
    let respuesta = null

    try {
        const rows = await Eq23kv.listaEquipos()

        respuesta = new Respuesta({
            status: 200,
            codigo: 'Exito',
            mensaje: 'Lista de eq23kv enviado con exito',
            resultado: rows
        })

        return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

    } catch (error) {
        respuesta = new Respuesta({
            status: 500,
            codigo: 'Error',
            mensaje: 'Hubo un problema',
            resultado: error
        })

        return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

    }
}

controllerEq23kv.eq23kvOne = async (req, res) => {
    const {local, circuito, equipo} = req.params

    let respuesta = null

    try {
        if( verificacionDeCaracteres(local)
            && verificacionDeCaracteres(circuito)
            && verificacionDeCaracteres(equipo) )
        {
            const row = await Eq23kv.unEquipo( local, circuito, equipo )

            respuesta = new Respuesta({
                status: 200,
                codigo: 'Exito',
                mensaje: 'Eq23kv enviado con exito',
                resultado: row
            })
    
            return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

        } else {
            respuesta = new Respuesta({
                status: 400,
                codigo: 'Error',
                mensaje: 'No ingrese datos que contengan / \\'
            })
    
            return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

        }

    } catch (error) {
        respuesta = new Respuesta({
            status: 500,
            codigo: 'Error',
            mensaje: 'Hubo un problema',
            resultado: error
        })

        return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

    }

}

controllerEq23kv.listaCircuitoPorLocal = async (req, res) => {
    const {local} = req.params

    let list = []
    let respuesta = null
    
    try {
        if(verificacionDeCaracteres(local)){
            const response = await Eq23kv.circuitoPorLocal( local )

            if(response.length > 0){
                for(let i = 0; i < response.length; i++){
                    if(!list.includes(response[i].CIRCUITO)){
                        list.push(response[i].CIRCUITO)
                    }
                }

                respuesta = new Respuesta({
                    status: 200,
                    codigo: 'Exito',
                    mensaje: 'Lista de circuitos enviado con exito',
                    resultado: list
                })
        
                return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

            }else {
                respuesta = new Respuesta({
                    status: 400,
                    codigo: 'Error',
                    mensaje: 'No existe el local'
                })
        
                return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

            }
        } else {
            respuesta = new Respuesta({
                status: 400,
                codigo: 'Error',
                mensaje: 'No ingrese datos que contengan / \\'
            })
    
            return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

        }
        
    } catch (error) {
        respuesta = new Respuesta({
            status: 500,
            codigo: 'Error',
            mensaje: 'Hubo un problema',
            resultado: error
        })

        return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

    }

}

controllerEq23kv.listaEquipoPorLocalCircuito = async (req, res) => {
    const {local, circuito} = req.params

    let list = []
    let respuesta = null
    
    try {
        if( verificacionDeCaracteres(local) && verificacionDeCaracteres(circuito) ) {
            const response = await Eq23kv.listaEquipoPorLocalCircuito( local, circuito )

            if(response.length > 0){
                for(let i = 0; i < response.length; i++){
                    if(!list.includes(response[i].EQUIPO)){
                        list.push(response[i].EQUIPO)
                    }
                }

                respuesta = new Respuesta({
                    status: 200,
                    codigo: 'Exito',
                    mensaje: 'Lista de equipos enviado con exito',
                    resultado: list
                })
        
                return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )
            
            }else {
                respuesta = new Respuesta({
                    status: 400,
                    codigo: 'Error',
                    mensaje: 'No existe el local o el circuito'
                })
        
                return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

            }
        } else {
            respuesta = new Respuesta({
                status: 400,
                codigo: 'Error',
                mensaje: 'No ingrese datos que contengan / \\'
            })
    
            return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

        }

    } catch (error) {
        respuesta = new Respuesta({
            status: 500,
            codigo: 'Error',
            mensaje: 'Hubo un problema',
            resultado: error
        })

        return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

    }
}

controllerEq23kv.save = async (req, res) => {
    const data = req.body

    let eq23kvRes = JSON.parse(JSON.stringify(data))
    let respuesta = null

    try {
        eq23kvRes = eq23kvDatosTrim(eq23kvRes)

        if((!!eq23kvRes.LOCAL && !!eq23kvRes.CIRCUITO && !!eq23kvRes.EQUIPO) && (eq23kvRes.LOCAL != ''
            && eq23kvRes.CIRCUITO != '' && eq23kvRes.EQUIPO != ''))
        {
            if(verificacionDeCaracteres(eq23kvRes.LOCAL)
                && verificacionDeCaracteres(eq23kvRes.CIRCUITO)
                && verificacionDeCaracteres(eq23kvRes.EQUIPO))
            {
                const verificacion = await Eq23kv.unEquipo( eq23kvRes.LOCAL, eq23kvRes.CIRCUITO, eq23kvRes.EQUIPO )

                if( !verificacion.length ){
                    const response = await Eq23kv.agregarEquipo( eq23kvRes )

                    respuesta = new Respuesta({
                        status: 200,
                        codigo: 'Exito',
                        mensaje: 'Se ha agregado el equipo en eq23kv con exito.',
                        resultado: response
                    })

                    return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

                } else {
                    respuesta = new Respuesta({
                        status: 400,
                        codigo: 'Error',
                        mensaje: 'Ya existe este equipo.'
                    })

                    return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

                }

            } else {
                respuesta = new Respuesta({
                    status: 400,
                    codigo: 'Error',
                    mensaje: 'No ingrese datos que contengan / \\.'
                })

                return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )
                
            }
        } else {
            respuesta = new Respuesta({
                status: 400,
                codigo: 'Error',
                mensaje: 'Ingrese todos los datos para la identificación de un equipo.'
            })

            return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

        }
    } catch (error) {
        respuesta = new Respuesta({
            status: 500,
            codigo: 'Error',
            mensaje: 'Hubo un problema',
            resultado: error
        })

        return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

    }
}

controllerEq23kv.delete = async (req, res) => {
    const {local, circuito, equipo} = req.params
    let respuesta = null

    try {
        if(verificacionDeCaracteres(local)
            && verificacionDeCaracteres(circuito)
            && verificacionDeCaracteres(equipo))
        {   
            const verificacion = await Eq23kv.unEquipo( local, circuito, equipo )

            if ( !verificacion.length ) {
                respuesta = new Respuesta({
                    status: 400,
                    codigo: 'Error',
                    mensaje: 'No existe el equipo.',
                })

                return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )
            }

            const deleted = await Eq23kv.eliminarEquipo( local, circuito, equipo )
            
            respuesta = new Respuesta({
                status: 200,
                codigo: 'Exito',
                mensaje: 'Un eq23kv se a eliminado con exito.',
                resultado: deleted
            })

            return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

        } else {
            respuesta = new Respuesta({
                status: 400,
                codigo: 'Error',
                mensaje: 'No ingrese datos que contengan / \\'
            })

            return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

        }
    } catch (error) {
        respuesta = new Respuesta({
            status: 500,
            codigo: 'Error',
            mensaje: 'Hubo un problema',
            resultado: error
        })

        return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

    }
}

controllerEq23kv.update = async (req, res) => {
    const {local, circuito, equipo} = req.params
    const datoActualizado = req.body
    let respuesta = null

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
                const verificacion = await Eq23kv.unEquipo( eq23kvRes.LOCAL, eq23kvRes.CIRCUITO, eq23kvRes.EQUIPO )

                if( !verificacion.length ) {
                    const response = await Eq23kv.actualizarEquipo( eq23kvRes, local, circuito, equipo )

                    respuesta = new Respuesta({
                        status: 200,
                        codigo: 'Exito',
                        mensaje: 'Se ha actualizado un equipo de eq23kv con exito.',
                        resultado: response
                    })

                    return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

                } else {
                    if( local == eq23kvRes.LOCAL && circuito == eq23kvRes.CIRCUITO && equipo == eq23kvRes.EQUIPO ) {
                        const response = await Eq23kv.actualizarEquipo( eq23kvRes, local, circuito, equipo )

                        respuesta = new Respuesta({
                            status: 200,
                            codigo: 'Exito',
                            mensaje: 'Se ha actualizado un equipo de eq23kv con exito.',
                            resultado: response
                        })

                        return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

                    } else {
                        respuesta = new Respuesta({
                            status: 400,
                            codigo: 'Error',
                            mensaje: 'Ya existe este equipo.'
                        })

                        return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

                    }
                }

            } else {
                respuesta = new Respuesta({
                    status: 400,
                    codigo: 'Error',
                    mensaje: 'No ingrese datos que contengan / \\.'
                })

                return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

            }
        } else {
            respuesta = new Respuesta({
                status: 400,
                codigo: 'Error',
                mensaje: 'Ingrese todos los datos para la identificación de un equipo.'
            })

            return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

        }
    } catch (error) {
        respuesta = new Respuesta({
            status: 500,
            codigo: 'Error',
            mensaje: 'Hubo un problema',
            resultado: error
        })

        return res.status( respuesta.getStatusCode() ).json( respuesta.getRespuesta() )

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