<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6">
        <div class="card container mt-5">
          <form v-on:submit.prevent="login()">

            <h3 class="mt-3" style="text-align: center;">Inicio de sesión</h3>

            <label for="nameLogin" class="mt-3">Correo:</label>
            <input type="text" id="nameLogin" class="form-control" v-model="datosUsuario.email" name="email" placeholder="Correo electronico">
            
            <label for="passLogin" class="mt-5">Contraseña:</label>
            <input type="text" id="passLogin" class="form-control" v-model="datosUsuario.password" name="pass" placeholder="Contraseña">

            <button type="submit" class="btn btn-outline-primary mt-5 mb-3 btn-block">Iniciar sesión</button>
          </form>
        </div>
      </div>
      <div class="col-md-6">

      </div>
    </div>
  </div>
</template>

<script>
import firebase from 'firebase'
import 'firebase/firestore'
import {db} from '@/main'

export default {
  name: '',
  data() {
    return {
      datosUsuario: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    login(){
      console.log(this.datosUsuario)
      if(this.datosUsuario.email != '' && this.datosUsuario.password != ''){
        this.$store.dispatch('firebaseLogin', this.datosUsuario)
        .then((userCredential) => {
          db.collection('users').doc(userCredential.user.uid).onSnapshot((user) => {
            console.log(user)
            this.$router.push('/')
          })
        })
      }else{
        console.log('no debe estar nada vacio')
      }
    }
  },
}
</script>