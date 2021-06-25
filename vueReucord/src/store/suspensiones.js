import axios from 'axios'

export default {
    state: {
        systemSuspension: {
            add: true
        },
        suspensionRef: {
            NROPROG: '',
            DIA: '',
            MES: '',
            ANHO: '',
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
        }
    },
    mutations: {
        setSystemSuspensionAdd(state, add){
            state.systemSuspension.add = add
        },
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
        setSuspensionMutation(state, sus){
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
        async setSuspensionAction({commit}, sus){
            const isForPd = sus.NROREUN == null ? 1 : 0
            const response = await axios.post(`/suspensionOne/${sus.NROPROG}/${sus.DIA}/${sus.MES}/${sus.ANHO}/${sus.NROREUN}/${sus.PDITEM}/${isForPd}`)
            console.log('response.data[0]')
            console.log(response.data[0])
            console.log('sus')
            console.log(sus)
            commit('setSuspensionMutation', response.data[0])
        }
    },
    getters: {
        getSuspensionRef(state){
            return state.suspensionRef
        },
        getSuspension(state){
            return state.suspension
        },
        getSystemSuspensionAdd(state){
            return state.systemSuspension.add
        }
    }
}