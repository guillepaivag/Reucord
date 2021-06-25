<template>
  <div class="container">
      <div v-if="system.loading">
            <loading></loading>
        </div>
        
        <div v-else-if="system.error">
            <error></error>
        </div>
      <div class="row mt-3" v-else>
          <div class="col-md-9">
                <button type="button" class="btn btn-outline-primary mb-3" v-on:click="bcVistaGrafica=!bcVistaGrafica">
                    Cambiar vista
                </button>

              <div v-if="bcVistaGrafica">
                  <proximamente> </proximamente>
              </div>

              <div v-else>
                <table class="table table-hover table-responsive-lg">
                    <thead>
                        <tr>
                        <th scope="col">Item</th>
                        <th scope="col">Sistema</th>
                        <th scope="col">BC-01</th>
                        <th scope="col">BC-02</th>
                        <th scope="col">BC-03</th>
                        <th scope="col">BC-04</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="table-secondary">
                            <th scope="row">1</th>
                            <td>Metropol.</td>
                            <td>{{getBC.metrop[0]}}</td>
                            <td>{{getBC.metrop[1]}}</td>
                            <td>{{getBC.metrop[2]}}</td>
                            <td>{{getBC.metrop[3]}}</td>
                        </tr>
                        <tr class="table-secondary">
                            <th scope="row">2</th>
                            <td>Este</td>
                            <td>{{getBC.este[0]}}</td>
                            <td>{{getBC.este[1]}}</td>
                            <td>{{getBC.este[2]}}</td>
                            <td>{{getBC.este[3]}}</td>
                        </tr>
                        <tr class="table-secondary">
                            <th scope="row">3</th>
                            <td>Sur</td>
                            <td>{{getBC.sur[0]}}</td>
                            <td>{{getBC.sur[1]}}</td>
                            <td>{{getBC.sur[2]}}</td>
                            <td>{{getBC.sur[3]}}</td>
                        </tr>
                        <tr class="table-secondary">
                            <th scope="row">4</th>
                            <td>Central</td>
                            <td>{{getBC.central[0]}}</td>
                            <td>{{getBC.central[1]}}</td>
                            <td>{{getBC.central[2]}}</td>
                            <td>{{getBC.central[3]}}</td>
                        </tr>
                        <tr class="table-secondary">
                            <th scope="row">5</th>
                            <td>Norte</td>
                            <td>{{getBC.norte[0]}}</td>
                            <td>{{getBC.norte[1]}}</td>
                            <td>{{getBC.norte[2]}}</td>
                            <td>{{getBC.norte[3]}}</td>
                        </tr>
                    </tbody>
                </table>
              </div>
          </div>
          <div class="col-md-3">
              
          </div>
      </div>
  </div>
</template>

<script>
import loading from '@/components/Loading'
import error from '@/components/Error'
import proximamente from '@/components/Proximamente'
import {mapMutations, mapGetters} from 'vuex'

export default {
    name: '',
    data() {
        return {
            bcVistaGrafica: false,
            system: {
                loading: true,
                error: false,
            },
        }
    },
    components: {
        loading,
        error,
        proximamente
    },
    methods: {
        ...mapMutations(['setTotal_BC'])
    },
    async created(){
        try {
            const res = await this.axios.post('/eq23kvAnalisis/bc/total')
            this.setTotal_BC(res.data)
            
        } catch (error) {
            this.system.error = true
            console.log(error)        
        } finally {
            this.system.loading = false
        }
    },
    computed: {
        ...mapGetters(['getBC'])
    },
    updated(){}
}
</script>

<style>

</style>