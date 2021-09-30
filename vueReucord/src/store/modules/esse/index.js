import axios from 'axios'

export default {
  state: {
    
  },
  actions: {
    async listaLocales ( { commit, dispatch } ) {
      try {
        const res = await axios.post('/locales')

        return res.data.resultado
      } catch (error) {
        dispatch('setError', error, {
          root: true
        })
      }
    },
    
  },
  mutations: {
    
  },
  getters: {
    
  }
}
