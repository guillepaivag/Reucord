import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import user from './users'
import eq23kv from './eq23kv'
import pd from './pd'
import ps from './ps'
import reclamo from './reclamos'
import suspension from './suspensiones'
import general from './general'

export default new Vuex.Store({
  state: {
    loading: true,
    alert: {
      type: 'success',
      show: false,
      message: ''
    }
  },
  mutations: {
    setLoaded: (state, loaded) => {
      state.loaded = loaded
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
  },
  modules: {
    user,
    eq23kv,
    pd,
    ps,
    reclamo,
    suspension,
    general
  }
})
