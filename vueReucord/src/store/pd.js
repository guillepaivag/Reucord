import axios from 'axios'

export default {
    state: {
        pdRef: {
            NROPROG: '',
            DIA: '',
            MES: '',
            ANHO: ''
        },
        pd: {
            LOCAL: '',
            CIRCUITO: '',
            EQUIPO: '',
            NROPROG: '',
            PDTRASMI: '',
            PDFECHA: '',
            HORATRAS: '',
            ESTADO: '',
            TRABAJO: '',
            RESPONSABLE: '',
            OBSERVACION: '',
            JEFATURA: '',
            NRO_REC: '',
            FECHA_REC: '',
            RECIBIDO: '',
            RESULTADO: ''
        },
        pdTrabajos: []
    },
    mutations: {
        setPdRef(state, pdRef){
            if(pdRef){
                state.pdRef = pdRef
            }else{
                state.pdRef = {
                    NROPROG: '',
                    DIA: '',
                    MES: '',
                    ANHO: ''
                }
            }
        },
        async setPdState(state, rows){
            if(rows){
                state.pd = await rows
            }else{
                state.pd = {
                    LOCAL: '',
                    CIRCUITO: '',
                    EQUIPO: '',
                    NROPROG: '',
                    PDTRASMI: '',
                    PDFECHA: '',
                    HORATRAS: '',
                    ESTADO: '',
                    TRABAJO: '',
                    RESPONSABLE: '',
                    OBSERVACION: '',
                    JEFATURA: '',
                    NRO_REC: '',
                    FECHA_REC: '',
                    RECIBIDO: '',
                    RESULTADO: ''
                }
            }
        },
        setPdTrabajosState(state, rows){
            if(rows){
                state.pdTrabajos = []
                for(let i = 0; i < rows.length; i++){
                    state.pdTrabajos.push(rows[i])
                }
            }else{
                state.pdTrabajos = []
            }
        }
    },
    actions: {
        async setPdAction({commit}, pd){
            const rowsPdOne = await axios.post('/pdOne/' + pd.nro + '/' + pd.dia + '/' + pd.mes + '/' + pd.anho)
            commit('setPdState', rowsPdOne.data[0])
        },
        async setPdTrabajosAction({commit}, pd){
            const rowsPdOneTra = await axios.post('/pdOneTrabajos/' + pd.nro + '/' + pd.dia + '/' + pd.mes + '/' + pd.anho)
            commit('setPdTrabajosState', rowsPdOneTra.data)
        },
        async addPdAction(state){
            const pd = state.pd
            const pdTrabajos = state.pdTrabajos
            await axios.post('/pdAdd', {pd, pdTrabajos}).data
        },
        async updatePDAction(state){
            const pd = state.pd
            const pdTrabajos = state.pdTrabajos
            await axios.put(`/pdUpdate/${state.pdRef.NROPROG}/${state.pdRef.DIA}/${state.pdRef.MES}/${state.pdRef.ANHO}`, {pd, pdTrabajos}).data
        }
    },
    getters: {
        getPdRef(state){
            return state.pdRef
        },
        getPd(state){
            return state.pd
        },
        getPdTrabajos(state){
            return state.pdTrabajos
        }
    }
}