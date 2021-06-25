controller = {}
const pool = require('../database/index')

controller.listaLocales = async (req, res) => {
    
    try {
        let list = []
    
        const response = await pool.query('SELECT * FROM esse')

        for(let i = 0; i < response.length; i++){
            list.push(response[i].LOCAL)
        }

        res.json({
            codigo: 'Exito',
            mensaje: 'Lista de locales enviado con exito.',
            respuesta: await list
        })
    } catch (error) {
        res.status(500).json({
            codigo: 'Error0001',
            mensaje: 'Hubo un problema',
            respuesta: error
        })
    }

}

controller.getLocalDataByLocal = async (req, res) => {
    
    const { local } = req.params

    try {
        let list = []
    
        const response = await pool.query('SELECT * FROM esse WHERE LOCAL = ?', [local])

        res.status(200).json({
            codigo: 'Exito',
            mensaje: 'Datos del local enviado con exito.',
            respuesta: response
        })
    } catch (error) {
        res.status(500).json({
            codigo: 'Error',
            mensaje: 'Hubo un problema en el servidor',
            respuesta: error
        })
    }

}

module.exports = controller