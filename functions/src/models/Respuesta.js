class Respuesta {
    constructor ( datosRespuesta ) {
        this.status = datosRespuesta && datosRespuesta.status ? datosRespuesta.status : 0
        this.codigo = datosRespuesta && datosRespuesta.codigo ? datosRespuesta.codigo : ''
        this.mensaje = datosRespuesta && datosRespuesta.mensaje ? datosRespuesta.mensaje : ''
        this.resultado = datosRespuesta && datosRespuesta.resultado ? datosRespuesta.resultado : null
    }

    getRespuesta () {
        return {
            codigo: this.codigo,
            mensaje: this.mensaje,
            resultado: this.resultado
        }
    }

    getStatusCode () {
        return this.status
    }
}

module.exports = Respuesta