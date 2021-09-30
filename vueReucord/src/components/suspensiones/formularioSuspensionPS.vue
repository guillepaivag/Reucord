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

                    <div class="row">
                        <div class="col-md-6">
                            <label for="" class="mt-3">N° de reunión:</label>
                            <input type="number" class="form-control" v-model="suspension.NROREUN" disabled placeholder="NROREUN">
                        </div>
                        <div class="col-md-6">
                            <label for="" class="mt-3">Reunión año:</label>
                            <input type="number" class="form-control" v-model="suspension.REUNIONANO" disabled placeholder="REUNIONANO">
                        </div>
                    </div>
                    
                    <b-form-select v-if=" operation != 'read' " class="mt-3" v-model="identificadorSeleccionadoPs" :options="listaIdPsSusModValido"></b-form-select>

                    <hr>

                    <h5 class="mt-3">Información del item:</h5> 

                    <div v-if=" operation === 'read' ">
                        <div class="row mt-3" v-for="(itemInfo, index) in suspension.ITEMS_INFO" :key="index">
                            <hr>

                            <div class="col-md-7">
                                <label for="" class="mt-3">Item:</label>
                                <input type="number" class="form-control" v-model="itemInfo.PDITEM" disabled placeholder="Item">
                            </div>
                            
                            <div class="col-md-5">

                                <label for="exampleFormControlTextarea1" class="mt-3">Descripción:</label>
                                <textarea type="text" class="form-control" v-model="itemInfo.DESCRIP" id="exampleFormControlTextarea1" disabled placeholder="DESCRIP" rows="5"></textarea>

                            </div>

                            <hr>
                        </div>
                    </div>
                    <div v-else>

                        <div class="row mt-3" v-for="(itemInfo, index) in listaPsItemsDescrip" :key="index">
                            <hr>

                            <div class="col-md-7">
                                <label for="" class="mt-3">Item:</label>
                                <input type="number" class="form-control" v-model="itemInfo.PDITEM" disabled placeholder="Item">

                                <hr>

                                <div v-if="!actualizado && operation != 'read'">
                                    <button type="button" class="btn btn-outline-success mt-1" v-if="itemInfo.HABILITADO" v-on:click="deshabilitarItem(index)">Habilitado</button>
                                    <button type="button" class="btn btn-outline-danger mt-1" v-else v-on:click="habilitarItem(index)">Deshabilitado</button>
                                </div>
                            </div>
                            
                            <div class="col-md-5">

                                <label for="exampleFormControlTextarea1" class="mt-3">Descripción:</label>
                                <textarea type="text" class="form-control" v-model="itemInfo.DESCRIP" id="exampleFormControlTextarea1" :disabled="actualizado || !itemInfo.HABILITADO" placeholder="DESCRIP" rows="5"></textarea>

                            </div>

                            <hr>
                        </div>
                    </div>
                    

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
                ITEMS_INFO: []
            },
            suspensionGuardada: {
                NROPROG: null,
                FECHATRAS: null,
                HORATRAS: null,
                TRASMPOR: null,
                NROREUN: null,
                REUNIONANO: null,
                ITEMS_INFO: []
            },
            listaIdPsSusModValido: [],
            identificadorSeleccionadoPs: null,
            listaPsItemsDescrip: [],
            opcionesItems: [],
            actualizado: false,
            guardado: {
                nroprog: null,
            },
            conUltimoNumero: false,
            suspensionPedidoDisponibilidad: false,
            suspensionResultado: Object
        }
    },
    props: {
        suspensionDatos: Object,
        operation: String,
        ultimoNumero: Number,
    },
    methods: {
        enviarDatos ( suspension ) {

            const suspensionPs = JSON.parse( JSON.stringify( suspension ) )

            if ( this.operation == 'update' ) {
                suspensionPs.ITEMS_INFO = []
            }

            for (let i = 0; i < this.listaPsItemsDescrip.length; i++) {
                const element = this.listaPsItemsDescrip[i]
                
                if ( element.HABILITADO ) {
                    suspensionPs.ITEMS_INFO.push({
                        PDITEM: element.PDITEM,
                        DESCRIP: element.DESCRIP
                    })
                }
            }

            this.$emit('enviarDatos', suspensionPs)

            if ( this.operation === 'create' ) {
                this.suspension = {
                    NROPROG: null,
                    FECHATRAS: null,
                    HORATRAS: null,
                    TRASMPOR: null,
                    NROREUN: null,
                    REUNIONANO: null,
                    ITEMS_INFO: []
                }

                this.identificadorSeleccionadoPs = null
            }
        },
        async getPsSusModValido () {
            
            try {
                return await this.$store.dispatch('getPsSusModValido')

            } catch (error) {
                this.$store.dispatch('setError', error)
            }

        },
        async setDatosEnFormulario ( suspensionDatos ) {
            this.guardado.nroprog = parseInt(suspensionDatos.NROPROG)
            
            this.suspension = JSON.parse( JSON.stringify( suspensionDatos ) )
            this.suspensionGuardada = JSON.parse( JSON.stringify( suspensionDatos ) )
            
            if ( this.operation === 'read' ) return

            this.listaIdPsSusModValido.push({ 
                value: null, 
                text: this.operation === 'create' ? 
                'Elegir un identificador de PS.' : 
                `Mantener el PS actual: REUFECHA: ${this.suspensionGuardada.REUNIONANO} - REUNRO: ${this.suspensionGuardada.NROREUN}`
            })
            this.psSusModValidos = await this.getPsSusModValido()

            for (let i = 0; i < this.psSusModValidos.length; i++) {
                const element = this.psSusModValidos[i]

                if ( this.listaIdPsSusModValido.length > 0 ) {
                    const idPsRepetido = this.listaIdPsSusModValido.find(x => {
   
                        if (x.value) {
                            return x.value.REUFECHA == element.REUFECHA && 
                            x.value.REUNRO == element.REUNRO
                        }
                        
                        return null
                    } )

                    if ( !!idPsRepetido ) {
                        continue
                    }
                }

                this.listaIdPsSusModValido.push({ 
                    value: {
                        REUFECHA: element.REUFECHA,
                        REUNRO: element.REUNRO
                    }, 
                    text: `REUFECHA: ${element.REUFECHA} - REUNRO: ${element.REUNRO}`
                })
            }

            this.cambioIdentificadorSeleccionadoPs()

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
        cambiarTipoDeSuspencion(){
            if( this.suspensionPedidoDisponibilidad ){
                // guadamos el numero de nroreun
                this.suspensionPedidoDisponibilidad = true
                this.guardado.nroreun = this.suspension.NROREUN
                this.suspension.NROREUN = null
            } else {
                this.suspensionPedidoDisponibilidad = false
                this.suspension.NROREUN = this.guardado.nroreun
            }
        },
        habilitarItem(index){
            this.listaPsItemsDescrip[index].HABILITADO = true
        },
        deshabilitarItem(index){
            this.listaPsItemsDescrip[index].HABILITADO = false
        },
        cambioIdentificadorSeleccionadoPs () {
            this.listaPsItemsDescrip = []
            if ( !this.identificadorSeleccionadoPs ) {
                this.suspension.REUNIONANO = this.operation === 'create' ? null : this.suspensionGuardada.REUNIONANO
                this.suspension.NROREUN =  this.operation === 'create' ? null : this.suspensionGuardada.NROREUN

                if ( this.operation == 'create' ) {
                    return
                }
            }

            this.suspension.REUNIONANO = this.identificadorSeleccionadoPs ? this.identificadorSeleccionadoPs.REUFECHA : this.suspensionGuardada.REUNIONANO
            this.suspension.NROREUN =  this.identificadorSeleccionadoPs ? this.identificadorSeleccionadoPs.REUNRO : this.suspensionGuardada.NROREUN

            // LEER LOS ITEMS DE PROGRAMACIONES SEMANALES SUSPENDIDAS DISPONIBLES
            const result = this.psSusModValidos.filter(x => {
                return x.REUFECHA == this.suspension.REUNIONANO && x.REUNRO == this.suspension.NROREUN
            })

            for (let i = 0; i < result.length; i++) {
                const element = result[i]
                this.listaPsItemsDescrip.push({
                    PDITEM: element.ITEM,
                    DESCRIP: null,
                    HABILITADO: false
                })
            }

            if ( this.operation === 'update' ) {
                
                const mismaProgramacionSemanalSuspendida = this.suspensionGuardada.NROREUN == this.suspension.NROREUN && 
                                                            this.suspensionGuardada.REUNIONANO == this.suspension.REUNIONANO
                if ( mismaProgramacionSemanalSuspendida ) 
                {
                    // LEER LOS ITEMS DE PROGRAMACIONES SEMANALES SUSPENDIDAS ¡NO DISPONIBLES!
                    for (let i = 0; i < this.suspensionGuardada.ITEMS_INFO.length; i++) {
                        const element = this.suspensionGuardada.ITEMS_INFO[i]
                        this.listaPsItemsDescrip.push({
                            PDITEM: element.PDITEM,
                            DESCRIP: element.DESCRIP,
                            HABILITADO: true
                        })
                    }
                }
            }
        }
    },
    watch: {
        suspensionDatos: function (nuevo, viejo) {
            try {
                this.setDatosEnFormulario(nuevo)
            } catch (error) {
                console.log(error)
            }
            
        },
        identificadorSeleccionadoPs: function (nuevo, viejo) {
            this.cambioIdentificadorSeleccionadoPs()
            
        },
    },
    async created() {
        
        try {
            this.setDatosEnFormulario(this.suspensionDatos)
        } catch (error) {
            console.log(error)
        } finally {

        }

    },
    computed: {
        suspensionParaPD: () => {
            return this.suspensionPedidoDisponibilidad
        }
    }
}
</script>

<style>

</style>