<template>
    <div class="container">

        <div v-if=" !existeSuspension ">
            No existe la suspensión
            <hr>
             {{ JSON.stringify(params, null, ' ') }}
        </div>

        <div v-else>
            <div v-if="$store.getters.getLoading || $store.getters.getError">
                <vistaEvento />
            </div>

            <div v-else>
                <div v-if="operation === 'create'">
                    <b-form-checkbox class="mt-3 mb-4" v-on:input="cambiarTipoDeSuspencion" v-model="suspensionPedidoDisponibilidad" size="lg" name="check-button" switch>
                        Tipo de suspensión:
                        <b v-if="suspensionPedidoDisponibilidad">Pedido de disponibilidad</b>
                        <b v-else>Programación semanal</b>
                    </b-form-checkbox>
                </div>

                <div v-if="suspensionPedidoDisponibilidad">
                    <formularioSuspensionPD
                        v-bind:suspensionDatos="suspensionPd"
                        v-bind:operation="operation"
                        v-bind:ultimoNumero="ultimoNumero"
                        v-bind:actualizado="actualizado"

                        v-on:enviarDatos="actionSuspensionPD($event)"
                    />
                </div>

                <div v-if="!suspensionPedidoDisponibilidad">
                    <formularioSuspensionPS
                        v-bind:suspensionDatos="suspensionPs"
                        v-bind:operation="operation"
                        v-bind:ultimoNumero="ultimoNumero"
                        v-bind:actualizado="actualizado"

                        v-on:enviarDatos="actionSuspensionPS($event)"
                    />
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import vistaEvento from '@/components/vistaEvento.vue'
import formularioSuspensionPD from '@/components/suspensiones/formularioSuspensionPD'
import formularioSuspensionPS from '@/components/suspensiones/formularioSuspensionPS'
import {mapGetters, mapActions} from 'vuex'

export default {
    name: 'cruSuspension',
    components: {
        vistaEvento,
        formularioSuspensionPD,
        formularioSuspensionPS,
    },
    data() {
        return {
            existeSuspension: true,

            suspensionPd: {
                NROPROG: null,
                FECHATRAS: null,
                HORATRAS: null,
                TRASMPOR: null,
                NROREUN: null,
                REUNIONANO: null,
                PDITEM: null,
                DESCRIP: null
            },
            suspensionPs: {
                NROPROG: null,
                FECHATRAS: null,
                HORATRAS: null,
                TRASMPOR: null,
                NROREUN: null,
                REUNIONANO: null,
                ITEMS_INFO: []
            },
            operation: 'read',
            ultimoNumero: -1,
            actualizado: false,

            suspensionPedidoDisponibilidad: false,

            params: {
                NROPROG: this.$route.params.nroprog,
                DIA: this.$route.params.dia,
                MES: this.$route.params.mes,
                ANHO: this.$route.params.anho,
                NROREUN: this.$route.params.nroreun ? this.$route.params.nroreun : null,
                REUNIONANO: this.$route.params.reunionano,
                PDITEM: this.$route.params.pditem ? this.$route.params.pditem : null
            }
        }
    },
    methods: {
        
        async actionSuspensionPD ( suspensionResultado ) {

            try {
                await this.$store.dispatch('setLoading', true)

                let suspension = JSON.parse( JSON.stringify( suspensionResultado ) )
                let tipoSuspension = 'PD'

                suspension = this.trimAndConversionPD( suspension )

                if( this.operation === 'create' ) {
                    // Agregar
                    const datos = {
                        suspension,
                        tipoSuspension
                    }

                    await this.$store.dispatch('agregarSuspension', datos)

                } else {
                    // Editar
                    const datos = {
                        params: this.params,
                        suspension,
                        tipoSuspension
                    }

                    await this.$store.dispatch('editarSuspension', datos)

                    this.actualizado = true
                }
                
            } catch (error) {
                this.$store.dispatch('setError', error)

            } finally {
                await this.$store.dispatch('setLoading', false)
            
            }
        },

        async actionSuspensionPS ( suspensionResultado ) {

            const tipoSuspension = 'PS'
            let suspension = JSON.parse( JSON.stringify( suspensionResultado ) )

            suspension = this.trimAndConversionPS( suspension )

            if( this.operation === 'create' ) {
                // Agregar
                const datos = {
                    suspension,
                    tipoSuspension
                }

                await this.$store.dispatch('agregarSuspension', datos)

            } else {
                // Editar
                const datos = {
                    params: this.params,
                    suspension,
                    tipoSuspension
                }

                await this.$store.dispatch('editarSuspension', datos)

                this.actualizado = true
            }
        },
        cambiarTipoDeSuspencion(){
            if( this.suspensionPedidoDisponibilidad ){
                // guadamos el numero de nroreun
                this.suspensionPedidoDisponibilidad = true
            } else {
                this.suspensionPedidoDisponibilidad = false
            }
        },   
        verificacionDeCaracteres(myText){
            if(!!myText){
                if(myText.toString().includes('/') || myText.toString().includes('\\')){
                    return false
                }
            }

            return true
        },
        trimAndConversionPD(suspensionDatos){
            let suspension = JSON.parse(JSON.stringify(suspensionDatos))
            
            suspension.NROPROG = suspension.NROPROG ? parseInt(this.trim(suspension.NROPROG)) : null
            suspension.FECHATRAS = suspension.FECHATRAS ? this.trim(suspension.FECHATRAS) : null
            suspension.HORATRAS = suspension.HORATRAS ? this.trim(suspension.HORATRAS) : null
            suspension.TRASMPOR = suspension.TRASMPOR ? this.trim(suspension.TRASMPOR) : null
            suspension.NROREUN = suspension.NROREUN ? parseInt(this.trim(suspension.NROREUN)) : null
            suspension.REUNIONANO = suspension.REUNIONANO ? parseInt(this.trim(suspension.REUNIONANO)) : null
            suspension.PDITEM = suspension.PDITEM ? parseInt(this.trim(suspension.PDITEM)) : null
            suspension.DESCRIP = suspension.DESCRIP ? suspension.DESCRIP : null

            return suspension
        },
        trimAndConversionPS(suspensionDatos){
            let suspension = JSON.parse(JSON.stringify(suspensionDatos))
            
            suspension.NROPROG = suspension.NROPROG ? parseInt(this.trim(suspension.NROPROG)) : null
            suspension.FECHATRAS = suspension.FECHATRAS ? this.trim(suspension.FECHATRAS) : null
            suspension.HORATRAS = suspension.HORATRAS ? this.trim(suspension.HORATRAS) : null
            suspension.TRASMPOR = suspension.TRASMPOR ? this.trim(suspension.TRASMPOR) : null
            suspension.NROREUN = suspension.NROREUN ? parseInt(this.trim(suspension.NROREUN)) : null
            suspension.REUNIONANO = suspension.REUNIONANO ? parseInt(this.trim(suspension.REUNIONANO)) : null
            
            for (let i = 0; i < suspension.ITEMS_INFO.length; i++) {
                const element = suspension.ITEMS_INFO[i];
                
                suspension.ITEMS_INFO[i].PDITEM = element.PDITEM ? parseInt(this.trim(element.PDITEM)) : null
                suspension.ITEMS_INFO[i].DESCRIP = element.DESCRIP ? element.DESCRIP : null
            }

            return suspension
        },
        trim(trim){
            return trim.toString().trim()
        },
    },
    async beforeMount(){
        try {
            await this.$store.dispatch('setLoading', true)

            // OPERACIONES
            const pathnameFuncion = window.location.pathname.split('/')[2]

            if( pathnameFuncion.includes('agregarSuspension') ) {
                this.operation = 'create'
            } else if ( pathnameFuncion.includes('editarSuspension') ) {
                this.operation = 'update'
            } else {
                this.operation = 'read'
            }

            // ultimo numero
            this.ultimoNumero = await this.$store.dispatch('ultimoNumero')
            this.ultimoNumero++

            // obtenemos los datos a modificar
            if ( this.operation != 'create' ) {

                // PASO 0: IDETIFICAMOS QUE TIPO DE SUSPENSION ES
                this.suspensionPedidoDisponibilidad = !this.params.NROREUN

                // PASO 1: TRANSFORMAMOS CON LOS DATOS DE FECHA A UNA TIPO FECHA
                let anho = String(this.params.ANHO)
                let mes = String(this.params.MES)
                let dia = String(this.params.DIA)
                mes = mes.length === 2 ? mes : `0${mes}`
                dia = dia.length === 2 ? dia : `0${dia}`
                const FECHATRAS = new Date(`${anho}-${mes}-${dia}T13:00:00.000Z`)

                // PASO 2: obtener los datos para lectura y/o actualización                
                let suspensionDatos = await this.$store.dispatch('obtenerSuspension', {
                    idSuspension: {
                        NROPROG: this.params.NROPROG, 
                        FECHATRAS, 
                        NROREUN: this.params.NROREUN, 
                        REUNIONANO: this.params.REUNIONANO, 
                        PDITEM: this.params.PDITEM
                    },
                    tipoSuspension: this.suspensionPedidoDisponibilidad ? 'PD' : 'PS'
                })

                // Si no existe la suspensión, mostrar vista de no existencia
                this.existeSuspension = suspensionDatos.length

                if ( !this.existeSuspension ) {
                    return 
                }

                // PASO 3: verificacion de si se suspende un PD
                if ( this.suspensionPedidoDisponibilidad ) {
                    // PASO 3.1: formato normal para pedido de disponibilidad 
                    this.suspensionPd = suspensionDatos[0]

                    // PASO 3.2: convertir la fecha para que reconozca el calendario
                    if(this.suspensionPd.FECHATRAS){
                        this.suspensionPd.FECHATRAS = this.suspensionPd.FECHATRAS.substring(0, 10)
                    }
                    
                } else {
                    // PASO 3.1: formato normal para programación semanal
                    this.suspensionPs = {
                        NROPROG: suspensionDatos[0].NROPROG,
                        FECHATRAS: suspensionDatos[0].FECHATRAS,
                        HORATRAS: suspensionDatos[0].HORATRAS,
                        TRASMPOR: suspensionDatos[0].TRASMPOR,
                        NROREUN: suspensionDatos[0].NROREUN,
                        REUNIONANO: suspensionDatos[0].REUNIONANO,
                        ITEMS_INFO: []
                    }

                    // PASO 3.2: convertir la fecha para que reconozca el calendario
                    if(this.suspensionPs.FECHATRAS){
                        this.suspensionPs.FECHATRAS = this.suspensionPs.FECHATRAS.substring(0, 10)
                    }

                    // PASO 3.3: formato especial para programación semanal (items y descripcion)
                    for (let i = 0; i < suspensionDatos.length; i++) {
                        const element = suspensionDatos[i];
                        
                        this.suspensionPs.ITEMS_INFO.push({
                            PDITEM: element.PDITEM,
                            DESCRIP: element.DESCRIP
                        })
                    }

                }
            }

        } catch (error) {
            await this.$store.dispatch('setError', error)
        } finally {
            await this.$store.dispatch('setLoading', false)
        }
    },
    updated(){
        // this.pd.pdfecha = this.trasmision.fecha_context.selectedYMD.substring(8, 10) + '/' + this.trasmision.fecha_context.selectedYMD.substring(5, 7) + '/' + this.trasmision.fecha_context.selectedYMD.substring(0, 4) + ' 0:00:00'
        // this.pd.fechatra = this.trabajo.fecha_context.selectedYMD.substring(8, 10) + '/' + this.trabajo.fecha_context.selectedYMD.substring(5, 7) + '/' + this.trabajo.fecha_context.selectedYMD.substring(0, 4) + ' 0:00:00'
        // console.log(this.addUltimoNro)
        // console.log(this.pd)
    },
    computed: {
        ...mapGetters(['getSuspension', 'getError']),
        ...mapActions(['agregarSuspension', 'editarSuspension']),
    }
}
</script>

<style>

</style>