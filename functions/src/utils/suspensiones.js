const pool = require('../database/index')
const {verificacionDeCaracteres, dataConversionSuspensionPD, dataConversionSuspensionPS, dataConversionPd, formatoRespuesta} = require('../helpers/general')
const Respuesta = require("../models/Respuesta")

const utils = {}

utils.actualizarSuspensionPd = async ( nroprog, fechatras, nroreun, reunionano, pditem, suspensionDatos ) => {
    let response = null

    // clone de los datos
    let suspensionRes = JSON.parse(JSON.stringify(suspensionDatos))
    
    // quitamos los espacios de los costados y saltos de linea
    suspensionRes = dataConversionSuspensionPD(suspensionRes)

    // Verificación de que la suspención sea valida
    if ( !!suspensionRes.NROREUN ) {
        return new Respuesta({
            status: 400,
            codigo: 'Error',
            mensaje: 'Su suspensión no debe de tener un valor en NROREUN, ya que intenta suspender un pedido de disponibilidad.',
            resultado: null
        })
        
    }

    let suspensionValida = !!suspensionRes.NROPROG && !!suspensionRes.FECHATRAS  && !!suspensionRes.REUNIONANO && !!suspensionRes.PDITEM
    let suspensionDatosValidos = verificacionDeCaracteres(suspensionRes.NROPROG) && 
                            verificacionDeCaracteres(suspensionRes.REUNIONANO) &&
                            verificacionDeCaracteres(suspensionRes.PDITEM)

    // VERIFICACION DE QUE EXISTA ESTOS DATOS IMPORTANTES QUE
    // IDENTIFICAN A UNA SUSPENCION
    if( suspensionValida )
    {
        // VERIFICACION DE QUE NO EXISTA / \ EN ESTOS DATOS
        if( suspensionDatosValidos )
        {
            // VERIFICAMOS SI LOS DATOS A AGREGAR ESTAN DISPONIBLES
            let suspensionDePdDisponible = (await pool.query('SELECT * FROM pddatos WHERE NROPROG = ? AND YEAR(PDFECHA) = ? AND SUSMOD IS NOT NULL', [
                suspensionRes.PDITEM, 
                suspensionRes.REUNIONANO
            ])).length > 0

            if ( !suspensionDePdDisponible ) {
                return new Respuesta({
                    status: 400,
                    codigo: 'Error',
                    mensaje: 'Debe existir un Pedido de disponibilidad como Suspendido/Modificado para poder modificarse.',
                    resultado: null
                })

            }

            let disponibleParaActualizar = (await pool.query('SELECT * FROM suspenciones WHERE NROPROG = ? AND FECHATRAS = ? AND NROREUN IS NULL AND REUNIONANO = ? AND PDITEM = ?', [
                suspensionRes.NROPROG, 
                suspensionRes.FECHATRAS.toISOString().substr(0, 10), 
                suspensionRes.REUNIONANO, 
                suspensionRes.PDITEM
            ])).length === 0
            
            let actualizandoMismaSuspension = suspensionRes.NROPROG == nroprog && 
                fechatras.toISOString().substr(0, 10) == suspensionRes.FECHATRAS.toISOString().substr(0, 10) && 
                suspensionRes.REUNIONANO == reunionano && 
                suspensionRes.PDITEM == pditem

            if ( !disponibleParaActualizar && !actualizandoMismaSuspension ) {
                return new Respuesta({
                    status: 400,
                    codigo: 'Error',
                    mensaje: 'Ya existe esta suspensión.',
                    resultado: suspensionRes
                })
                
            }

            // SI ESTA DISPOBIBLE LOS DATOS A AGREGAR
            response = await pool.query('UPDATE suspenciones SET ? WHERE NROPROG = ? AND FECHATRAS = ? AND NROREUN IS NULL AND REUNIONANO = ? AND PDITEM = ?', [
                suspensionRes, 
                nroprog, 
                fechatras.toISOString().substr(0, 10), 
                reunionano, 
                pditem
            ]) 

            return new Respuesta({
                status: 200,
                codigo: 'Exito',
                mensaje: 'Se ha modificado una suspensión.',
                resultado: response
            })
            
        } else {
            // NO SE MODIFICA LOS DATOS SI ES QUE TIENE CARACTERES ESPECIALES COMO
            // / \
            return new Respuesta({
                status: 400,
                codigo: 'Error',
                mensaje: 'No puede agregar datos con / \\.\nFavor usar -',
                resultado: null
            })

        }

    } else {
        // SI NO EXISTE ALGUNO DE LOS DATOS IMPORTANTES QUE
        // IDENTIFICA A UNA SUSPENSION
        // NO SE AGREGA NADA
        return new Respuesta({
            status: 400,
            codigo: 'Error',
            mensaje: 'Debe ingresar los datos de NROPROG, FECHATRAS, NROREUN, REUNIONANO y PDITEM. En caso que se suspenda un PD, entonces, no agregue NROREUN.',
            resultado: null
        })

    }
}

utils.actualizarSuspensionPs = async ( nroprog, fechatras, nroreun, reunionano, pditem, suspensionDatos ) => {
    // clone de los datos
    let suspensionRes = JSON.parse(JSON.stringify(suspensionDatos))
        
    // quitamos los espacios de los costados y saltos de linea
    suspensionRes = dataConversionSuspensionPS(suspensionRes)

    // Verificación de que la suspención sea valida
    if ( !suspensionRes.NROREUN ) {
        return new Respuesta({
            status: 400,
            codigo: 'Error',
            mensaje: 'Su suspensión debe de tener un valor en NROREUN, ya que intenta suspender una programación semanal.',
            resultado: null
        })
        
    }

    let suspensionValida = !!suspensionRes.NROPROG && !!suspensionRes.FECHATRAS && !!suspensionRes.REUNIONANO && !!suspensionRes.NROREUN
    let suspensionDatosValidos = verificacionDeCaracteres(suspensionRes.NROPROG) && 
                            verificacionDeCaracteres(suspensionRes.REUNIONANO) &&
                            verificacionDeCaracteres(suspensionRes.NROREUN)

    
    for (let i = 0; i < suspensionRes.ITEMS_INFO.length; i++) {
        const element = suspensionRes.ITEMS_INFO[i]
        
        let cantidadRepetida = 0
        for (let j = 0; j < suspensionRes.ITEMS_INFO.length; j++) {
            const element2 = suspensionRes.ITEMS_INFO[j]
            
            if ( element.PDITEM === element2.PDITEM ) {
                cantidadRepetida = cantidadRepetida + 1
            }

        }

        if ( cantidadRepetida >= 2) {
            return new Respuesta({
                status: 400,
                codigo: 'Error',
                mensaje: 'No se puede repetir los items para la suspensión de una programación semanal.',
                resultado: null
            })
            
        }

    }

    
    // VERIFICACION DE QUE EXISTA ESTOS DATOS IMPORTANTES QUE
    // IDENTIFICAN A UNA SUSPENCION
    if( suspensionValida )
    {
        // VERIFICACION DE QUE NO EXISTA / \ EN ESTOS DATOS
        if( suspensionDatosValidos )
        {
            let suspensionesDisponibles = []

            let actualizandoMismaSuspension = suspensionRes.NROPROG == nroprog && fechatras.toISOString().substr(0, 10) == suspensionRes.FECHATRAS.toISOString().substr(0, 10) && 
                                            suspensionRes.REUNIONANO == reunionano && suspensionRes.NROREUN == nroreun

            for (let i = 0; i < suspensionRes.ITEMS_INFO.length; i++) {
                const element = suspensionRes.ITEMS_INFO[i]

                const suspencionParaActualizar = {
                    NROPROG: suspensionRes.NROPROG,
                    FECHATRAS: suspensionRes.FECHATRAS,
                    HORATRAS: suspensionRes.HORATRAS,
                    TRASMPOR: suspensionRes.TRASMPOR,
                    NROREUN: suspensionRes.NROREUN,
                    REUNIONANO: suspensionRes.REUNIONANO,
                    PDITEM: element.PDITEM,
                    DESCRIP: element.DESCRIP
                }

                // VERIFICAMOS SI LOS DATOS A AGREGAR ESTAN DISPONIBLES
                let psExiste = (await pool.query('SELECT * FROM prgtraviop1 WHERE REUFECHA = ? AND REUNRO = ? AND SUSMOD IS NOT NULL AND ITEM = ?', [
                    suspencionParaActualizar.REUNIONANO, 
                    suspencionParaActualizar.NROREUN, 
                    suspencionParaActualizar.PDITEM
                ])).length > 0

                if ( !psExiste ) {
                    return new Respuesta({
                        status: 400,
                        codigo: 'Error',
                        mensaje: 'Debe existir una Programación semanal como Suspendido/Modificado para poder modificarse.',
                        resultado: null
                    })

                }

                // VERIFICAMOS SI LOS DATOS A AGREGAR ESTAN DISPONIBLES
                let disponibleParaActualizar = (await pool.query('SELECT * FROM suspenciones WHERE NROPROG = ? AND FECHATRAS = ? AND NROREUN IS NOT NULL AND REUNIONANO = ? AND NROREUN = ? AND PDITEM = ?', [
                    suspencionParaActualizar.NROPROG, 
                    suspencionParaActualizar.FECHATRAS.toISOString().substr(0, 10), 
                    suspencionParaActualizar.REUNIONANO, 
                    suspencionParaActualizar.NROREUN,
                    suspencionParaActualizar.PDITEM
                ])).length === 0

                // SI ESTA DISPOBIBLE LOS DATOS A AGREGAR
                if ( !actualizandoMismaSuspension && !disponibleParaActualizar ) {
                    return new Respuesta({
                        status: 400,
                        codigo: 'Error',
                        mensaje: 'No disponible. No se puede repetir las suspensiones de una programacion semanal.',
                        resultado: suspencionParaActualizar
                    })
                    
                }
                
                suspensionesDisponibles.push(suspencionParaActualizar)
                    
            }

            await pool.query('DELETE FROM suspenciones WHERE NROPROG = ? AND FECHATRAS = ? AND NROREUN IS NOT NULL AND REUNIONANO = ? AND NROREUN = ?', [
                nroprog, 
                fechatras.toISOString().substr(0, 10), 
                reunionano, 
                nroreun,
            ])

            let suspensionesModificadas = []
            for (let i = 0; i < suspensionesDisponibles.length; i++) {
                const suspensionParaAgregar = suspensionesDisponibles[i]

                suspensionesModificadas.push(await pool.query('INSERT INTO suspenciones SET ?', [suspensionParaAgregar]))
            }

            return new Respuesta({
                status: 200,
                codigo: 'Exito',
                mensaje: 'Se ha modificado una suspensión.',
                resultado: suspensionesModificadas
            })

        } else {
            // NO SE MODIFICA LOS DATOS SI ES QUE TIENE CARACTERES ESPECIALES COMO
            // / \
            return new Respuesta({
                status: 400,
                codigo: 'Error',
                mensaje: 'No puede agregar datos con / \\.\nFavor usar -',
                resultado: null
            })
            
        }

    } else {
        // SI NO EXISTE ALGUNO DE LOS DATOS IMPORTANTES QUE
        // IDENTIFICA A UNA SUSPENSION
        // NO SE AGREGA NADA
        return new Respuesta({
            status: 400,
            codigo: 'Error',
            mensaje: 'Debe ingresar los datos de NROPROG, FECHATRAS, NROREUN, REUNIONANO y PDITEM. En caso que se suspenda un PD, entonces, no agregue NROREUN.',
            resultado: null
        })
        
    }
}

module.exports = utils