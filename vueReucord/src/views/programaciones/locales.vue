<template>
    <div class="container">

        <div v-if="system.loading">
            <loading></loading>
        </div>

        <div class="row searchingLocal" v-else>
            <div class="col-md-6">
                <label for="" class="mt-3">Local:</label>
                <b-form-input 
                    list="my-list-id" 
                    v-on:keyup="filtroLocal()" 
                    v-model="localSearch" 
                    placeholder="Local"
                ></b-form-input>

                <datalist id="my-list-id">
                    <option v-for="local in list.localAmountToShow">{{ local }}</option>
                </datalist>

                <b-button variant="outline-primary mt-3" v-on:click="goToLocalProgramming(localSearch)">Elegir local</b-button>
                <b-button variant="outline-primary mt-3 btnProgamacionesLocalExcel" v-on:click="generateExcelOfAllProgrammingByLocal()">Programaciones por local | Excel</b-button>
            </div>
            <div class="col-md-6">
                <label for="" class="mt-3">
                    {{ localSelected ? `Local seleccionado: ${localSelected}` : 'No tienes un local seleccionado' }}
                </label>
                <b class="mt-3" style="display: block;" v-if="localSearch">Se traera todas las programaciones del <u>{{ localSearch }}</u> como local.</b>
                <h6 class="mt-3" v-else>Elige un local :D</h6>
            </div>
        </div>

        <hr>

        <div class="">
            <router-view :localSelectedProp="localSelected"></router-view>
        </div>

    </div>
</template>

<script>
import loading from '@/components/Loading'

export default {
    name: '',
    components: {
        loading,
    },
    data() {
        return {
            system: {
                loading: true,
                error: false,
            },
            localSearch: '',
            localSelected: '',
            list: {
                amountToShow: 5,
                local: [],
                localAmountToShow: []
            }
        }
    },
    methods: {
        goToLocalProgramming(newLocalSelected) {
            if (newLocalSelected != this.localSelected) {
                this.localSelected = newLocalSelected

                this.$router.push({ 
                    name: 'Prog.Local', 
                    params: { 
                        local: newLocalSelected
                    }
                }).catch(() => {})
                
            } else {
                console.log('iguales')
            }
        },

        async filtroLocal(){
            this.list.localAmountToShow = []

            if(this.localSearch){
                let cont = 0
                for(let i = 0; i < this.list.local.length; i++){
                    if(cont < this.list.amountToShow){
                        if(this.list.local[i].includes(this.localSearch)){
                            this.list.localAmountToShow.push(this.list.local[i])
                            cont++
                        }
                    }
                }

            }else{
                for(let i = 0; i < this.list.amountToShow; i++){
                    this.list.localAmountToShow.push(this.list.local[i])
                }
                
            }
        },

        async generateExcelOfAllProgrammingByLocal() {
            try {
                const year = new Date().getFullYear()

                const res = await this.axios.get(`/programmingLists/${year}`,
                    {
                        responseType: 'blob',
                        headers: {
                            Accept: 'application/octet-stream'
                        }
                    }
                )
                const fileName = res.headers['x-processed-filename']; // <= cabezera personalizada
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                // link.setAttribute('download', fileName);
                link.setAttribute("download", `ANDE_Informe_Programaciones.xlsx`);
                document.body.appendChild(link);
                link.click();
                link.remove();
            } catch (error) {
                console.log(error)
            }
        }
    },
    async mounted() {
        try {
            // lista locales
            this.list.local = await this.$store.dispatch('listaLocales') ?? []

            // pushs los n primeros
            for(let i = 0; i < this.list.amountToShow; i++){
                this.list.localAmountToShow.push(this.list.local[i])
            }
        } catch (error) {
            console.log(error)
        } finally {
            this.system.loading = false
        }

    },
    watch: {
        '$route.params.local': function (nuevo, viejo) {
            this.localSearch = nuevo
            this.localSelected = nuevo
        }
    },
    created() {
        this.localSearch = this.$route.params.local ? this.$route.params.local : ''
        this.localSelected = this.$route.params.local ? this.$route.params.local : ''
    },
    destroyed() {
        
    },
}
</script>

<style>

    @media screen and (max-width: 767px) {
        .searchingLocal {
            text-align: center;
        }
    }

    @media screen and (min-width: 992px) {
        .btnProgamacionesLocalExcel {
            margin-left: 10px;
        }
    }

    @media screen and (min-width: 470px) and (max-width: 767px) {
        .btnProgamacionesLocalExcel {
            margin-left: 10px;
        }
    }

</style>