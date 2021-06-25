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
