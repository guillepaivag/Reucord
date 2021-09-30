<template>
    <div>
        <div class="row mt-4">

            <div class="col-md-9">
                
                <div>
                    <div class="row">
                        <div class="col-md-6">
                            <label for="" class="mt-3">N° de reunión:</label>
                            <input type="number" class="form-control" v-model="suspension.NROPROG" :disabled="actualizado" placeholder="NROPROG">
                        </div>
                        <div class="col-md-6">
                            <label for="" class="mt-3">Fecha trasmitida:</label>
                            <b-calendar v-model="suspension.FECHATRAS" :disabled="actualizado" block locale="es-ES"></b-calendar>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <label for="" class="mt-3">Hora trasmitida:</label>
                            <b-form-timepicker v-model="suspension.HORATRAS" :disabled="actualizado" show-seconds locale="es"></b-form-timepicker>
                        </div>
                        <div class="col-md-6">
                            <label for="" class="mt-3">Trasmitido por:</label>
                            <input type="text" class="form-control" v-model="suspension.TRASMPOR" :disabled="actualizado" placeholder="TRASMPOR">
                        </div>
                    </div>

                    <div class="row" v-if=" operation != 'read' ">
                        <div class="col-md-6">
                            <label for="" class="mt-3">Año de reunión (Año de PDFECHA):</label>
                            <input type="number" class="form-control" v-model="suspension.REUNIONANO" disabled placeholder="REUNIONANO">
                        </div>
                        <div class="col-md-6">
                            <label for="" class="mt-3">N° de PD (NROPROG):</label>
                            <input type="number" class="form-control" v-model="suspension.PDITEM" disabled placeholder="PDITEM">
                        </div>
                    </div>
                    
                    <b-form-select v-if=" operation != 'read' " class="mt-3" v-model="identificadorSeleccionadoPd" :options="listaPdSusModValido"></b-form-select>

                    <div class="">
                        <label for="exampleFormControlTextarea1" class="mt-3">Descripción:</label>
                        <textarea type="text" class="form-control" v-model="suspension.DESCRIP" id="exampleFormControlTextarea1" :disabled="actualizado" placeholder="DESCRIP" rows="5"></textarea>
                    </div>

                    <hr>

                    <div class="container mt-4">
                        <div class="container">
                            <div class="container">
                                <div v-if=" operation != 'create' ">
                                    <button v-on:click="enviarDatos( suspension )" v-if="!actualizado" class="btn btn-outline-primary btn-block">Editar</button>
                                    <button v-on:click="redirectSeccionPrincipal()" v-else class="btn btn-outline-success btn-block">Volver</button>
                                </div>
                                <div v-else>
                                    <button v-on:click="enviarDatos( suspension )" class="btn btn-outline-primary btn-block">Agregar</button>
                                </div>
                            </div>  
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
                <div class="bg-light p-4" v-if="!actualizado">
                    <b-form-checkbox
                    id="checkbox-1"
                    v-model="conUltimoNumero"
                    @input="cambioNumeroProgramacion"
                    name="checkbox-1"
                    :value="true"
                    :unchecked-value="false"
                    >
                    Último número
                    </b-form-checkbox>
                </div>
                <!-- <div v-if="mensaje.visible" class="alert alert-dismissible mt-4" v-bind:class="mensaje.color">
                    <button type="button" class="close" v-on:click="alternarAlertaVisible(false)">&times;</button>
                    <h6 class="mt-2">{{mensaje.titulo}}</h6>
                    <hr>
                    {{mensaje.msg}}
                    <div v-if="this.mensaje.color == 'alert-success'">
                        <hr>
                        Agregado:
                        <ul>
                            <li v-for="(datoEquipo, index) in mensaje.lista" :key="index">
                                {{datoEquipo}}
                            </li>
                        </ul>
                    </div>
                    <hr>
                    <router-link to="/" class="alert-link">Reclamos ANDE</router-link>.
                </div> -->
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: '',
    data() {
        return {
            suspension: {
                NROPROG: null,
                FECHATRAS: null,
                HORATRAS: null,
                TRASMPOR: null,
                NROREUN: null,
                REUNIONANO: null,
                PDITEM: null,
                DESCRIP: null,
            },
            suspensionGuardada: {
                NROPROG: null,
                FECHATRAS: null,
                HORATRAS: null,
                TRASMPOR: null,
                NROREUN: null,
                REUNIONANO: null,
                PDITEM: null,
                DESCRIP: null,
            },
            listaPdSusModValido: [],
            identificadorSeleccionadoPd: null,
            guardado: {
                nroprog: null,
            },
            conUltimoNumero: false,
        }
    },
    props: {
        suspensionDatos: Object,
        operation: String,
        ultimoNumero: Number,
        actualizado: Boolean,
    },
    methods: {
        enviarDatos ( suspension ) {
            console.log( 'suspension', suspension )

            this.$emit('enviarDatos', suspension)

            if ( this.operation === 'create' ) {
                this.suspension = {
                    NROPROG: null,
                    FECHATRAS: null,
                    HORATRAS: null,
                    TRASMPOR: null,
                    NROREUN: null,
                    REUNIONANO: null,
                    PDITEM: null,
                    DESCRIP: null,
                }

                this.identificadorSeleccionadoPd = null
            }
        },
        async getPdSusModValido () {
            
            try {
                return await this.$store.dispatch('getPdSusModValido')

            } catch (error) {
                this.$store.dispatch('setError', error)
            }

        },
        async cambioNumeroProgramacion () {
            try {
                if ( this.conUltimoNumero ) {
                    // guaradar el numero anterior
                    this.guardado.nroprog = this.suspension.NROPROG
                    
                    // cambiar al ultimo numero
                    this.suspension.NROPROG = this.ultimoNumero
                }else{
                    // cambiamos al numero guardado
                    this.suspension.NROPROG = this.guardado.nroprog
                }

            } catch (error) {
                console.log(error)
            }
           
        },
        async setDatosEnFormulario ( suspensionDatos ) {
            this.guardado.nroprog = parseInt(suspensionDatos.NROPROG)
            this.suspension = JSON.parse( JSON.stringify( suspensionDatos ) )
            this.suspensionGuardada = JSON.parse( JSON.stringify( suspensionDatos ) )

            const pdSusModValidos = await this.getPdSusModValido()

            this.listaPdSusModValido.push({ 
                value: null, 
                text: this.operation === 'create' ? 
                'Elegir un identificador de PD.' : 
                `Mantener el PD actual: PDFECHA: ${this.suspensionGuardada.REUNIONANO} - NROPROG: ${this.suspensionGuardada.PDITEM}`
            })
            for (let i = 0; i < pdSusModValidos.length; i++) {
                const element = pdSusModValidos[i]
                
                this.listaPdSusModValido.push({ 
                    value: {
                        NROPROG: element.NROPROG,
                        PDFECHA: element.PDFECHA
                    }, 
                    text: `NROPROG: ${element.NROPROG} - PDFECHA: ${element.PDFECHA.substring(0,10)}`
                })
            }
        },
        redirectSeccionPrincipal(){
            this.$router.push('/suspensiones')
        },
    },
    watch: {
        suspensionDatos: async function (nuevo, viejo) {
            try {
                await this.setDatosEnFormulario(nuevo)
            } catch (error) {
                console.log(error)
            }

        },
        identificadorSeleccionadoPd: function (nuevo, viejo) {

            if ( !this.identificadorSeleccionadoPd ) {
                this.suspension.REUNIONANO = this.operation === 'create' ? null : this.suspensionGuardada.REUNIONANO
                this.suspension.PDITEM =  this.operation === 'create' ? null : this.suspensionGuardada.PDITEM

                return
            }

            const fechatrasString = this.identificadorSeleccionadoPd.PDFECHA.substring(0,10).replace('-', '/').replace('-', '/')

            this.suspension.REUNIONANO = new Date(fechatrasString).getFullYear()
            this.suspension.PDITEM =  this.identificadorSeleccionadoPd.NROPROG
        },
    },
    async created() {
        try {
            await this.setDatosEnFormulario(this.suspensionDatos)
        } catch (error) {
            console.log(error)
        }
    },
}
</script>

<style>

</style>