import firebase from 'firebase';

export default {
  state: {
    user: null,
    logeado: false
  },
  actions: {
    firebaseLogin: ({commit}, user) => {
      return firebase.auth().signInWithEmailAndPassword(user.email, user.password);
    },
    firebaseLogout: () => {
      return firebase.auth().signOut();
    }
  },
  mutations: {
    setUser: (state, user) => {
      if ( user ) {
        state.user = {
          uid: user.uid,
          nombre: user.nombre,
          apellido: user.apellido,
          email: user.email
        }
        state.logeado = true;
      } else {
        state.user = null;
        state.logeado = false;
      }
    },
    setLogeado(state, logeo){
        state.logeado = logeo
    }
  },
  getters: {
    getLogeo: (state) => {
      return state.logeado;
    }
  }
}
