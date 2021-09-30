import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// FIREBASE
import firebase from 'firebase'
import 'firebase/firestore'
import firebaseConfig from '@/config/firebase'
firebase.initializeApp(firebaseConfig)
export const db = firebase.firestore()

// BOOTSTRAP
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
import 'bootstrap-vue/dist/bootstrap-vue.css'

// AXIOS
import axios from 'axios'
import VueAxios from 'vue-axios'

// REUCORD API
import apiReucord from './config/api-reucord'

axios.defaults.baseURL = apiReucord.url
export const axiosReucord = axios

Vue.use(VueAxios, axios)
Vue.config.productionTip = false

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
    var uid = user.uid;
    console.log(user)
    db.collection('users').doc(uid).onSnapshot((userDB) => {
      // store.commit('setUser', {
      //   uid: uid,
      //   nombre: userDB.nombre,
      //   apellido: userDB.apellido,
      //   email: userDB.email
      // })
      console.log('hay usuario', userDB)
    })
    // ...
  } else {
    // User is signed out
    // ...
    console.log('no hay usuario')
  }

  store.commit('setLogeado', !!user)

  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
});


