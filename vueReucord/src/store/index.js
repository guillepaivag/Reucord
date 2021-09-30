import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router/index'

Vue.use(Vuex)

import usuario from './modules/usuarios/usuarios'
import eq23kv from './modules/eq23kv/eq23kv'
import pd from './modules/programaciones/pd'
import ps from './modules/programaciones/ps'
import reclamo from './modules/reclamos/reclamos'
import suspension from './modules/suspensiones/suspensiones'
import programaciones from './modules/programaciones/index'
import esse from './modules/esse/index'

export default new Vuex.Store({
  state: {
    loading: false,
    error: null,
    alert: {
      type: 'success',
      show: false,
      message: ''
    }
  },
  mutations: {
    setLoading: (state, loading) => {
      state.loading = loading
    },
    setError: (state, error) => {
      state.error = error
    },
    setAlertMessage: (state, data) => {
      state.alert.type = data.type
      state.alert.show = data.show
      state.alert.message = data.message
      setTimeout(() => {
        state.alert.type = 'success'
        state.alert.show = false
        state.alert.message = ''
      }, data.timeout)
    }
  },
  actions: {
    /* 
      SETTERS
    */
    setLoading: async ( { dispatch, commit, state }, loading ) => {
      commit('setLoading', loading)
    },
    
    setError: async ( { dispatch, commit, state }, error ) => {
      let datosError = {}

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        datosError.tipo = 'response'
        datosError.data = error.response.data
        datosError.status = error.response.status
        datosError.headers = error.response.headers
  
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        datosError.tipo = 'request'
        datosError.request = error.request

      } else {
        // Something happened in setting up the request that triggered an Error
        datosError.tipo = 'message'
        datosError.message = error.message

      }
      
      commit('setError', datosError)
      router.push({ name: 'Error' })
    }

    /*
      GETTERS
    */
  },
  getters: {
    getLoading: (state) => {
      return state.loading
    },
    getError: (state) => {
      return state.error
    },
    getAlert: (state) => {
      return state.alert
    }
  },
  modules: {
    usuario,
    eq23kv,
    pd,
    ps,
    reclamo,
    suspension,
    programaciones,
    esse
  }
})
