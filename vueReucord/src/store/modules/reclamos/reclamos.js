import axios from 'axios'

export default {
    state: {
        system: {
            add: true
        },
        reclamoRef: {
            DMEDNRO: '',
            DIA: '',
            MES: '',
            ANHO: ''
        },
        reclamo: {
            LOCAL: '',
            OTRADEP: '',
            NROOTRADE: '',
            DMEDNRO: '',
            DMED: '',
            HORATRASM: '',
            FECHATRASM: '',
            TRASMPOR: '',
            RECIBPOR: '',
            RECLAMO: ''
        }
    },
    mutations: {
        setSystemAdd(state, add){
            state.system.add = add
        },
        setReclamoRef(state, reclamoRef){
            if(reclamoRef){
                state.reclamoRef = reclamoRef
            }else{
                state.reclamoRef = {
                    DMEDNRO: '',
                    DIA: '',
                    MES: '',
                    ANHO: ''
                }
            }
        },
        setReclamoMutation(state, reclamo){
            if(reclamo){
                state.reclamo = reclamo
            }else{
                state.reclamo = {
                    LOCAL: '',
                    OTRADEP: '',
                    NROOTRADE: '',
                    DMEDNRO: '',
                    DMED: '',
                    HORATRASM: '',
                    FECHATRASM: '',
                    TRASMPOR: '',
                    RECIBPOR: '',
                    RECLAMO: ''
                }
            }
        }
    },
    actions: {
        async listaReclamos( {commit, dispatch} ) {
            try {
                const res = await axios.post('/reclamos')

                return res.data.resultado

            } catch (error) {
                dispatch('setError', error, {
                    root: true
                })
            }
        },
        async obtenerUnReclamo ( {commit, dispatch}, data ) {
            try {
                const {
                    dmednro, dia, mes, anho
                } = data

                const res = await axios.post(`/reclamoOne/${dmednro}/${dia}/${mes}/${anho}`)

                return res.data.resultado[0]

            } catch (error) {
                dispatch('setError', error, {
                    root: true
                })
            }
        },
        async agregarReclamo ( {commit, dispatch}, data ) {
            try {
                const {
                    reclamo
                } = data

                const res = await axios.post('/reclamoAdd', {
                    reclamo
                })

                return res.data

            } catch (error) {
                dispatch('setError', error, {
                    root: true
                })
            }
        },
        async actualizarReclamo ( {commit, dispatch}, data ) {
            try {
                const {
                    params,
                    reclamo
                } = data

                const res = await axios.put(`/reclamoUpdate/${params.dmednro}/${params.dia}/${params.mes}/${params.anho}`, {
                    reclamo
                })

                return res.data

            } catch (error) {
                dispatch('setError', error, {
                    root: true
                })
            }
        },
        async eliminarReclamo( {commit, dispatch}, data ) {
            try {
                const {
                    dmednro, dia, mes, anho
                } = data

                const res = await axios.delete(`/reclamoDelete/${dmednro}/${dia}/${mes}/${anho}`)

                return res.data

            } catch (error) {
                dispatch('setError', error, {
                    root: true
                })
            }
        },
    },
    getters: {
        getReclamoRef(state){
            return state.reclamoRef
        },
        getReclamo(state){
            return state.reclamo
        },
        getSystemAdd(state){
            return state.system.add
        }
    }
}