import axios from 'axios'

export default {
  state: {
  },
  actions: {
    async listaDeTrabajosPorDia ({ commit, dispatch }) {
        try {
            let hoy = '2020-01-06'
            let manhana = '2020-01-07'
            let pasadoManhana = '2020-01-08'

            const res = await axios.post('/listaDeTrabajosPorDia', {
                hoy, manhana, pasadoManhana
            })

            return res.data.resultado
        } catch (error) {
            dispatch('setError', error, {
                root: true
            })
        }
    },
    async listaProgramaciones ( { commit, dispatch }, data ) {
        try {
            const {
                local
            } = data

            const year = new Date().getFullYear()
            let res = null

            if ( local ) {
                res = await axios.post(`/programmingLists/${local}/${year}`)
            } else {
                res = await axios.post(`/programmingLists/${year}`)
            }

            return res.data.resultado

        } catch (error) {
            dispatch('setError', error, {
                root: true
            })
        }
    },
    async trabajosPorRangoDeTiempo ( {commit, dispatch}, data ) {
        
        try {
            const {
                fechaDesde, fechaHasta, opciones
            } = data

            console.log('data', data)
            const res = await axios.post(`/trabajosPorRangoDeTiempo`, {
                fechaDesde, fechaHasta, opciones
            })

            return res.data.resultado

        } catch (error) {
            dispatch('setError', error, {
                root: true
            })
        }
    },
    async ultimoNumero ({ commit, dispatch }) {
        try {
            let res = await axios.get('/ultimoNumero')

            return res.data.resultado

        } catch (error) {
            dispatch('setError', error, {
                root: true
            })
        }
        
    }
  },
  mutations: {
  },
  getters: {
  }
}
