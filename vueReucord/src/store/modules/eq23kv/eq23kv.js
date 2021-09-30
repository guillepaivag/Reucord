import axios from 'axios'

export default {
  state: {
    listEq23kv: [],
    eq23kv: {
      LOCAL: '',
      CIRCUITO: '',
      EQUIPO: '',
      BARRA: ''
    },
    total_bc: {
      metrop: [0, 0, 0, 0],
      este: [0, 0, 0, 0],
      sur: [0, 0, 0, 0],
      central: [0, 0, 0, 0],
      norte: [0, 0, 0, 0]
    }
  },
  actions: {
    async listaEquipos ( { commit, dispatch } ) {
      try {
        const res = await axios.post('/eq23kv')

        return res.data.resultado
      } catch (error) {
        dispatch('setError', error, {
          root: true
        })
      }
    },
    async listaCircuitoPorLocal ( { commit, dispatch }, eq23kv ) {
      try {
        const res = await axios.post(`/eq23kvCircuitoPorLocal/${eq23kv.local}`)
      
        return res.data.resultado
      } catch (error) {
        console.clear()
      }
    },
    async listaEquipoPorLocalCircuito ( { commit, dispatch }, eq23kv ) {
      try {
        const res = await axios.post(`/eq23kvEquipoPorLocalCircuito/${eq23kv.local}/${eq23kv.circuito}`)
      
        return res.data.resultado
      } catch (error) {
        console.clear()
      }
    },
    async obtenerEquipo ( { commit, dispatch }, eq23kv ) {
      try {
        const res = await axios.post(`/eq23kvOne/${eq23kv.local}/${eq23kv.circuito}/${eq23kv.equipo}`)

        return res.data.resultado[0]
      } catch (error) {
        dispatch('setError', error, {
          root: true
        })
      }
    },
    async crearEquipo ( { commit, dispatch }, data ) {
      const res = await axios.post('/eq23kvAdd', data.eq23kv)

      return res.data
    },
    async actualizarEquipo ( { commit, dispatch }, data ) {
      const res = await axios.put(`/eq23kvEdit/${data.params.LOCAL}/${data.params.CIRCUITO}/${data.params.EQUIPO}`, data.eq23kv)

      return res.data
    },
    async eliminarEquipo ( { commit, dispatch }, eq23kv ) {
      const res = await axios.delete(`/eq23kvDelete/${eq23kv.local}/${eq23kv.circuito}/${eq23kv.equipo}`)

      return res
    },
    async getBC_API({ commit }){
      const res = await axios.post('/eq23kvAnalisis/bc/total')
      console.log(res.data)
      commit('setTotal_BC', res.data)
    }
  },
  mutations: {
    setEquipo(state, eq23kv){
      state.eq23kv.LOCAL = eq23kv.LOCAL
      state.eq23kv.CIRCUITO = eq23kv.CIRCUITO
      state.eq23kv.EQUIPO = eq23kv.EQUIPO
      state.eq23kv.BARRA = eq23kv.BARRA
    },
    setTotal_BC(state, total_bc){
      state.total_bc = total_bc
    }
  },
  getters: {
    getEquipo(state){
      return state.eq23kv
    },
    getBC(state) {
      return state.total_bc
    }
  }
}
