<template>
    <div>
        <div v-if="system.loading">
            <loading></loading>
        </div>
        <div v-else-if="system.error">
            <error></error>
        </div>
        <div v-else>
            <table class="table table-hover table-responsive-xl mt-3">
                <thead>
                    <tr>
                    <th scope="col">N°</th>
                    <th scope="col">Número de programación</th>
                    <th scope="col">Fecha/Año de programación</th>
                    <th scope="col">Item de programación</th>
                    <th scope="col">Ver los datos completos de programación</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(programming, programmingIndex) in programmingLists" :key="programmingIndex">
                        <th scope="row">{{ programmingIndex + 1 }}</th>
                        <td>
                            {{ programming.programmingType === 'PD' ? programming.informationData.NROPROG : programming.informationData.REUNRO }}
                        </td>
                        <td>
                            {{ programming.programmingType === 'PD' ? programming.informationData.PDFECHA.substring(0,10) : programming.informationData.REUFECHA }}
                        </td>
                        <td>
                            {{ programming.programmingType === 'PD' ? '' : programming.informationData.ITEM }}
                        </td>
                        <td>
                            <b-button variant="outline-primary" v-on:click="viewProgrammingData(programming)">Ver todos los datos</b-button>
                        </td>
                    </tr>
                    
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import loading from '@/components/Loading'
import error from '@/components/Error'

export default {
    name: '',
    components: {
        loading,
        error
    },
    data() {
        return {
            system: {
                loading: true,
                error: false,
            },
            programmingLists: [],
            localSelected: ''
        }
    },
    props: {
        localSelectedProp: ''
    },
    computed: {
        
    },
    methods: {
        viewProgrammingData (programming) {
            if(programming.programmingType === 'PD') {
                const NROPROG = programming.informationData.NROPROG
                const PDFECHA = programming.informationData.PDFECHA.toISOString().substring(0,10)
                const DAY = programming.informationData.PDFECHA.getDate()
                const MONTH = programming.informationData.PDFECHA.getMonth()+1
                const YEAR = programming.informationData.PDFECHA.getFullYear()

                let routeUrl = this.$router.resolve({ name: 'Pd.viewPd', params: { 
                    nroprog: NROPROG,
                    dia: DAY,
                    mes: MONTH,
                    anho: YEAR
                }})
                window.open(routeUrl .href, '_blank');

            } else {
                const REUFECHA = programming.informationData.REUFECHA
                const REUNRO = programming.informationData.REUNRO
                const ITEM = programming.informationData.ITEM

                let routeUrl = this.$router.resolve({ name: 'Ps.viewPs', params: { 
                    reufecha: REUFECHA,
                    reunro: REUNRO,
                    item: ITEM,
                }})
                window.open(routeUrl .href, '_blank');
            }
        },
        async getProgrammingsByLocal (local) {
            this.system.loading = true
            
            try {
                console.table({
                    localSelected: local
                })

                const year = new Date().getFullYear()
                
                return await this.axios.post(`/programmingLists/${local}/${year}`)

            } catch (error) {
                this.system.error = true

                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
                console.log(error.config);
            } finally{
                this.system.loading = false
            }
        },
        async bringNewData () {
            const programmingLists = await this.getProgrammingsByLocal(this.localSelected)

            console.log('programmingLists', programmingLists)

            this.programmingLists = programmingLists.data.respuesta
        }
    },
    watch: {
        localSelectedProp: async function getData(val, oldVal) {
            this.localSelected = val
            
            console.log('WATCH this.localSelectedProp', this.localSelectedProp)
            console.log('WATCH this.localSelected', this.localSelected)
            console.log({
                val, oldVal
            })
            await this.bringNewData()
        }
    },
    async mounted() {
        this.localSelected = this.$route.params.local
        console.log('MOUNTED this.localSelected', this.localSelected, this.$route.params.local)
        
        await this.bringNewData()
    },
}
</script>

<style>

</style>