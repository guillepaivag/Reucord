<template>
  <div id="app">
    <navegationUser v-if="getLogeo"/>
    <navegation v-else />
    <router-view/>
    <pie/>
  </div>
</template>

<script>
import navegation from '@/components/Navegation.vue'
import navegationUser from '@/components/NavegationUser.vue'
import pie from '@/components/Pie.vue'

import { mapState, mapGetters } from 'vuex'

export default {
  name: 'app',
  components: {
    navegation,
    navegationUser,
    pie
  },
  computed: {
    ...mapGetters(['getLogeo'])
  }
}
</script>

<style>
@import url('https://bootswatch.com/4/lux/bootstrap.min.css');

#nav a {
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
