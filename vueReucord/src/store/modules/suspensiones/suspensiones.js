import apiReucord from '../../../config/api-reucord'
import axios from 'axios'
console.log('apiReucord.url', apiReucord.url)
axios.defaults.baseURL = apiReucord.url

export default {
    state: {
        suspensionRef: {
            NROPROG: '',
            FECHATRAS: '',
            REUNIONANO: '',
            NROREUN: '',
            PDITEM: ''
        },
        suspension: {
            NROPROG: '',
            FECHATRAS: '',
            TRASMPOR: '',
            NROREUN: '',
            REUNIONANO: '',
            PDITEM: '',
            SUSMOD: '',
            DESCRIP: ''
        },
        suspensiones: []
    },
    mutations: {
        setSuspensionRef(state, susRef){
            if(susRef){
                state.suspensionRef = susRef
            }else{
                state.suspensionRef = {
                    NROPROG: '',
                    DIA: '',
                    MES: '',
                    ANHO: '',
                    NROREUN: '',
                    PDITEM: ''
                }
            }
        },
        setSuspension(state, sus){
            if(sus){
                state.suspension = sus
            }else{
                state.suspension = {
                    NROPROG: '',
                    FECHATRAS: '',
                    TRASMPOR: '',
                    NROREUN: '',
                    REUNIONANO: '',
                    PDITEM: '',
                    SUSMOD: '',
                    DESCRIP: ''
                }
            }
        }
    }, 
    actions: {
        async setSuspension({ dispatch, commit }, suspensionId) {
            try {
                const { NROPROG, FECHATRAS, NROREUN, REUNIONANO, PDITEM } = suspensionId
                const suspensionParaPD = NROREUN === null

                const suspension = await dispatch('obtenerSuspension', {
                    idSuspension: {
                        NROPROG, 
                        FECHATRAS,
                        NROREUN, 
                        REUNIONANO, 
                        PDITEM
                    },
                    tipoSuspension: suspensionParaPD ? 'PD' : 'PS'
                })
                
                commit('setSuspension', suspension[0])
            } catch (error) {
                await dispatch('setError', error, {
                    root: true
                })
            }
        },
        async agregarSuspension ( { dispatch, commit, state }, datos) {
            // agregar

            try {
                const { suspension, tipoSuspension } = datos

                let suspensionAgregada = null

                if ( tipoSuspension === 'PD' ) {
                    suspensionAgregada = await axios.post(`/suspensiones/agregarPd`, {
                        data: {
                            suspensionDatos: suspension
                        }
                    })
                } else {
                    suspensionAgregada = await axios.post(`/suspensiones/agregarPs`, {
                        data: {
                            suspensionDatos: suspension
                        }
                    })
                }

                return suspensionAgregada.data

            } catch (error) {
                console.log(error)
                await dispatch('setError', error, {
                    root: true
                })
            }

        },
        async editarSuspension ( { dispatch, commit, state }, datos) {
            // editar

            try {
                const { params, suspension, tipoSuspension } = datos
                const { NROPROG, DIA, MES, ANHO, NROREUN, REUNIONANO, PDITEM } = params

                let suspensionEditada = null

                if ( tipoSuspension === 'PD' ) {

                    suspensionEditada = await axios.put(`/suspensiones/editarPd/${NROPROG}/${DIA}/${MES}/${ANHO}`, {
                        data: {
                            identificadoresDeProgramacion: {
                                nroreun: null,
                                reunionano: REUNIONANO,
                                pditem: PDITEM
                            },
                            suspensionDatos: suspension
                        }
                    })

                } else {
                    suspensionEditada = await axios.put(`/suspensiones/editarPs/${NROPROG}/${DIA}/${MES}/${ANHO}`, {
                        data: {
                            identificadoresDeProgramacion: {
                                nroreun: NROREUN,
                                reunionano: REUNIONANO,
                                pditem: null
                            },
                            suspensionDatos: suspension
                        }
                    })
                }

                return suspensionEditada.data

            } catch (error) {
                await dispatch('setError', error, {
                    root: true
                })
            }

        },
        async eliminarSuspension ( { dispatch, commit, state }, datos) {
            // eliminar

            try {
                const { idSuspension } = datos
                const { NROPROG, FECHATRAS, NROREUN, REUNIONANO, PDITEM } = idSuspension
                const suspensionParaPD = NROREUN === null

                const DIA = FECHATRAS.getDate()
                const MES = FECHATRAS.getMonth()+1
                const ANHO = FECHATRAS.getFullYear()

                let suspensionEliminada = await axios.post(`/suspensiones/eliminar/${NROPROG}/${DIA}/${MES}/${ANHO}`, {
                    data: {
                        identificadoresDeProgramacion: {
                            nroreun: suspensionParaPD ? null : NROREUN,
                            reunionano: REUNIONANO,
                            pditem: PDITEM
                        },
                    }
                })

                return suspensionEliminada.data
                
            } catch (error) {
                await dispatch('setError', error, {
                    root: true
                })
            }

        },
        async obtenerSuspension ( { dispatch, commit, state }, datos) {
            // Obtener una suspensión

            try {
                const { idSuspension, tipoSuspension } = datos
                const { NROPROG, FECHATRAS, NROREUN, REUNIONANO, PDITEM } = idSuspension

                const DIA = FECHATRAS.getDate()
                const MES = FECHATRAS.getMonth()+1
                const ANHO = FECHATRAS.getFullYear()

                let suspension = await axios.post(`/suspensiones/unaSuspension/${NROPROG}/${DIA}/${MES}/${ANHO}`, {
                    data: {
                        identificadoresDeProgramacion: {
                            nroreun: tipoSuspension === 'PD' ? null : NROREUN,
                            reunionano: REUNIONANO,
                            pditem: tipoSuspension === 'PD' ? PDITEM : null
                        },
                    }
                })

                return suspension.data.resultado

            } catch (error) {
                await dispatch('/setError', error, {
                    root: true
                })
                console.log(error)
            } finally {
                
            }
        },
        async obtenerTodasLasSuspensiones ( { dispatch, commit, state }  ) {
            try {
                let suspension = await axios.post(`/suspensiones`)
                
                return suspension.data.resultado

            } catch (error) {
                await dispatch('setError', error, {
                    root: true
                })
            }
        },
        async getPdSusModValido ( { dispatch, commit, state } ) {
            try {
                let pdSusModValido = await axios.post('/suspensiones/obtenerPdSusModValido')

                return pdSusModValido.data.resultado

            } catch (error) {
                await dispatch('setError', error, {
                    root: true
                })
                console.log(error)
            }
        },
        async getPsSusModValido ( { dispatch, commit, state } ) {
            try {
                let psSusModValido = await axios.post('/suspensiones/obtenerPsSusModValido')

                return psSusModValido.data.resultado

            } catch (error) {
                await dispatch('setError', error, {
                    root: true
                })
                console.log(error)
            }
        },
    },
    getters: {
        getSuspensionRef(state){
            return state.suspensionRef
        },
        getSuspension(state){
            return state.suspension
        }
    }
}