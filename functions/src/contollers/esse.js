const controller = {}
const EstacionesSubestaciones = require('../models/EstacionesSubestaciones')
const Respuesta = require('../models/Respuesta')

controller.listaLocales = async (req, res) => {
    
    let respuesta = null

    try {
        let list = await EstacionesSubestaciones.listaLocales()

        respuesta = new Respuesta({
            status: 200,
            codigo: 'Exito',
            mensaje: 'Lista de locales enviado con exito.',
            resultado: list
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

controller.getLocalDataByLocal = async (req, res) => {
    
    const { local } = req.params
    let respuesta = null

    try {
        const response = await EstacionesSubestaciones.datosLocal( local )

        respuesta = new Respuesta({
            status: 200,
            codigo: 'Exito',
            mensaje: 'Datos del local enviado con exito.',
            resultado: response
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

module.exports = controller