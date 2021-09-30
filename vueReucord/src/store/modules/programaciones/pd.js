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
            SUSMOD: '',
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
        setPdState(state, rows){
            if(rows){
                state.pd = rows
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
        async getListaPd ( { commit, dispatch } ) {
            try {
                const res = await axios.post('/pd')
                return res.data.resultado
            } catch (error) {
                dispatch('setError', error, {
                    root: true
                })
            }
            
        },
        async getPd ( { commit, dispatch }, pd ) {
            try {
                const res = await axios.post(`/pdOne/${pd.nroprog}/${pd.dia}/${pd.mes}/${pd.anho}`)
                return res.data.resultado[0]
            } catch (error) {
                dispatch('setError', error, {
                    root: true
                })
            }

        },
        async getPdTrabajo ( { commit, dispatch }, pd ) {
            try {
                const res = await axios.post(`/pdOneTrabajos/${pd.nroprog}/${pd.dia}/${pd.mes}/${pd.anho}`)
                return res.data.resultado
            } catch (error) {
                dispatch('setError', error, {
                    root: true
                })
            }
        },
        async agregarPedidoDisponibilidad ( { commit, dispatch }, data ) {
            try {
                const {
                    pd,
                    pdTrabajos
                } = data
                
                const res = await axios.post('/pdAdd', {
                    pd, 
                    pdTrabajos
                })
                
                return res.data

            } catch (error) {
                dispatch('setError', error, {
                    root: true
                })
            }
            
        },
        async actualizarPedidoDisponibilidad ( { commit, dispatch }, data ) {
            try {
                const {
                    params,
                    pd,
                    pdTrabajos
                } = data
                const res = await axios.put(`/pdUpdate/${params.NROPROG}/${params.DIA}/${params.MES}/${params.ANHO}`, {
                    pd, 
                    pdTrabajos
                })
                return res.data
            } catch (error) {
                dispatch('setError', error, {
                    root: true
                })
            }
            
        },
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
        },
        async genenrarExcel ( { commit },pd ) {
            try {
                return await axios.get(`/pdInformeXLSX/${pd.NROPROG}/${pd.DIA}/${pd.MES}/${pd.ANHO}`, {
                    responseType: 'blob',
                    headers: {
                        Accept: 'application/octet-stream'
                    }
                })
            } catch (error) {
                dispatch('setError', error, {
                    root: true
                })
            }
        },
        async eliminarPdAction ( { commit }, pd ) {
            try {
                await axios.delete(`/pdDelete/${pd.nroprog}/${pd.dia}/${pd.mes}/${pd.anho}`)
            } catch (error) {
                dispatch('setError', error, {
                    root: true
                })
            }
            
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