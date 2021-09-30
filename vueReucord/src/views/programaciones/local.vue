<template>
    <div>
        <div v-if="system.loading">
            <loading></loading>
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
            if( programming.programmingType === 'PD' ) {
                
                const pdFecha = new Date( `${programming.informationData.PDFECHA.substring(0,10)}T13:00:00.000Z` )

                const NROPROG = programming.informationData.NROPROG
                const PDFECHA = pdFecha.toISOString().substr(0, 10)
                const DAY = pdFecha.getDate()
                const MONTH = pdFecha.getMonth()+1
                const YEAR = pdFecha.getFullYear()

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
                this.programmingLists = await this.$store.dispatch('listaProgramaciones', {
                    local
                }) ?? []

            } catch (error) {
                console.log(error)

            } finally{
                this.system.loading = false
            }
        },
    },
    watch: {
        localSelectedProp: async function (val, oldVal) {
            await this.getProgrammingsByLocal(val)
            this.localSelected = val
        }
    },
    async mounted() {
        this.localSelected = this.$route.params.local
        
        await this.getProgrammingsByLocal(this.localSelected)
    },
}
</script>

<style>

</style>