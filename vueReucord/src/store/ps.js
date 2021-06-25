import axios from 'axios'

export default {
    state: {
        seleccionadoPs: false,
        psRef: {
            REUFECHA: '',
            REUNRO: '',
            ITEM: '',
        },
        ps: {
            REUFECHA: null,
            REUNRO: null,
            ITEM: null,
            LOCAL: null,
            CIRCUITO: null,
            EQUIPO: null,
            TRABAJO: null,
            AUT: null,
            ESTADO: null,
            OBSERVAC: null,
            RESULTADO: null,
            RESPONSABLE: null,
            AMPLIACION: null,
            NRO_REC: null,
            FECHA_REC: null
        },
        psTrabajos: []
    },
    mutations: {
        setSeleccionadoPs(state, select){
            state.seleccionadoPs = select
        },
        setPsRef(state, psRef){
            if(psRef){
                state.psRef = psRef
            }else{
                state.psRef = {
                    REUFECHA: '',
                    REUNRO: '',
                    ITEM: '',
                }
            }
        },
        async setPsState(state, dato){
            if(dato){
                state.ps = await dato
            }else{
                state.ps = {
                    REUFECHA: null,
                    REUNRO: null,
                    ITEM: null,
                    LOCAL: null,
                    CIRCUITO: null,
                    EQUIPO: null,
                    TRABAJO: null,
                    AUT: null,
                    ESTADO: null,
                    OBSERVAC: null,
                    RESULTADO: null,
                    RESPONSABLE: null,
                    AMPLIACION: null,
                    NRO_REC: null,
                    FECHA_REC: null
                }
            }
        },
        async setPsTrabajosState(state, rows) {
            if(rows){
                state.psTrabajos = []
                for(let i = 0; i < rows.length; i++){
                    state.psTrabajos.push(rows[i])
                }
            }else{
                state.psTrabajos = []
            }
        }
    },
    actions: {
        async setPsAction({commit}, ps){
            const rowsPdOne = await axios.post(`/psOne/${ps.REUFECHA}/${ps.REUNRO}/${ps.ITEM}/`)
            commit('setPsState', rowsPdOne.data[0])
        }
    },
    getters: {
        getPs(state){
            return state.ps
        },
        getPsTrabajos(state){
            return state.psTrabajos
        },
        getPsRef(state){
            return state.psRef
        },
        getSelectedPs(state){
            return state.seleccionadoPs
        }
    }
}