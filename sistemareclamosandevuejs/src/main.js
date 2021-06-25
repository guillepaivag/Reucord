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
// import 'https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj'
// import 'https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.bundle.min.js'

// AXIOS
import axios from 'axios'
import VueAxios from 'vue-axios'

// REUCORD API
import apiReucord from './config/api'

axios.defaults.baseURL = apiReucord.url
// axios.defaults.baseURL = 'http://localhost:5001/sistemareclamosande2021/us-central1/app/api'
// axios.defaults.baseURL = 'https://us-central1-sistemareclamosande2021.cloudfunctions.net/app/api'

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
      console.log('hay usuario')
      console.log(userDB)
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


