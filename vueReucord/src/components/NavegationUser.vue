<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <router-link class="navbar-brand" to="/">
      Reucord <samp>Beta</samp>
      </router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarColor01"
        aria-controls="navbarColor01"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarColor01">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item active">
            <router-link class="nav-link" to="/equipos"
              >Equipos
            </router-link>
          </li>
          <li class="nav-item active">
            <router-link class="nav-link" to="/reclamos">
                Reclamos
            </router-link>
          </li>
          <li class="nav-item dropdown active">
            <a
              class="nav-link dropdown-toggle"
              data-toggle="dropdown"
              role="button"
              aria-haspopup="true"
              aria-expanded="false"
              >
              A tratar
            </a>
            <div class="dropdown-menu">
              <router-link class="dropdown-item" to="/programaciones">
                Programaciones
              </router-link>
              <div class="dropdown-divider"></div>
              <router-link class="dropdown-item" to="/pd">
                Pedido de disponibilidad
              </router-link>
              <div class="dropdown-divider"></div>
              <router-link class="dropdown-item" to="/ps">
                Programación semanal
              </router-link>
            </div>
          </li>
          <li class="nav-item active">
            <router-link  class="nav-link" to="/suspensiones">
                Suspensiones
            </router-link >
          </li>
        </ul>
        <div class="m-auto nav-item">
            <a class="btn btn-outline-light" v-on:click="cerrarSesion">CERRAR SESIÓN</a>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
    name: 'navegationUser',
    methods: {
        async cerrarSesion(){
          await this.$store.dispatch('firebaseLogout')
          this.$router.push('/login')
        }
    },
};
</script>

<style>
</style>