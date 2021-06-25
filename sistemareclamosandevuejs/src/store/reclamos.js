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
        async setReclamoAction({commit}, reclamo){
            const response = await axios.post(`/reclamoOne/${reclamo.DMEDNRO}/${reclamo.DIA}/${reclamo.MES}/${reclamo.ANHO}`)
            commit('setReclamoMutation', response.data[0])
        }
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