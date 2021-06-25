<template>
    <div class="container">
        <div v-if="system.loading">
            <loading></loading>
        </div>
        <div v-else-if="system.error">
            <error></error>
        </div>

        <div v-else>

            <div class="row mt-4">

                <div class="col-md-9">
                    <b-form-checkbox class="mt-3 mb-4" v-on:input="cambiarTipoDeSuspencion" v-model="system.pdSus" size="lg" name="check-button" switch>
                        Suspender un pedido de disponibilidad:
                        <b v-if="system.pdSus">Si</b>
                        <b v-else>No</b>
                    </b-form-checkbox>

                    <div>
                        <div class="row">
                            <div class="col-md-6">
                                <label for="" class="mt-3">NROPROG:</label>
                                <input type="number" class="form-control" v-model="suspension.NROPROG" :disabled="system.updated" placeholder="NROPROG">
                            </div>
                            <div class="col-md-6">
                                <label for="" class="mt-3">FECHATRAS:</label>
                                <b-calendar v-model="suspension.FECHATRAS" :disabled="system.updated" block locale="es-ES"></b-calendar>
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <label for="" class="mt-3">TRASMPOR:</label>
                                <input type="text" class="form-control" v-model="suspension.TRASMPOR" :disabled="system.updated" placeholder="TRASMPOR">
                            </div>
                            <div class="col-md-6">
                                <label for="" class="mt-3">NROREUN:</label>
                                <input type="number" class="form-control" v-model="suspension.NROREUN" :disabled="system.updated || system.pdSus" placeholder="NROREUN">
                            </div>
                        </div>

                        <div class="row">
                            <div class="col-md-6">
                                <label for="" class="mt-3">REUNIONANO:</label>
                                <input type="number" class="form-control" v-model="suspension.REUNIONANO" :disabled="system.updated" placeholder="REUNIONANO">
                            </div>
                            <div class="col-md-6">
                                <label for="" class="mt-3">PDITEM:</label>
                                <input type="number" class="form-control" v-model="suspension.PDITEM" :disabled="system.updated" placeholder="PDITEM">
                            </div>
                        </div>

                        <div class="">
                            <label for="" class="mt-3">SUSMOD:</label>
                            <input type="text" class="form-control" v-model="suspension.SUSMOD" :disabled="system.updated" placeholder="SUSMOD">
                        </div>

                        <div class="">
                            <label for="exampleFormControlTextarea1" class="mt-3">DESCRIP:</label>
                            <textarea type="text" class="form-control" v-model="suspension.DESCRIP" id="exampleFormControlTextarea1" :disabled="system.updated" placeholder="DESCRIP" rows="5"></textarea>
                        </div>

                        <hr>

                        <div class="container mt-4">
                            <div class="container">
                                <div class="container">
                                    <div v-if="!this.system.isAdd">
                                        <button v-on:click="actionSuspension()" v-if="!system.updated" class="btn btn-outline-primary btn-block">Editar</button>
                                        <button v-on:click="redirectSeccionPrincipal()" v-else class="btn btn-outline-success btn-block">Volver</button>
                                    </div>
                                    <div v-else>
                                        <button v-on:click="actionSuspension()" class="btn btn-outline-primary btn-block">Agregar</button>
                                    </div>
                                </div>  
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="bg-light p-4" v-if="!system.updated">
                        <b-form-checkbox
                        id="checkbox-1"
                        v-model="addUltimoNro"
                        @input="ultNroFunc"
                        name="checkbox-1"
                        :value="true"
                        :unchecked-value="false"
                        >
                        Último número
                        </b-form-checkbox>
                    </div>
                    <div v-if="mensaje.visible" class="alert alert-dismissible mt-4" v-bind:class="mensaje.color">
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
                    </div>
                </div>
            </div>
        </div>

        <hr class="mt-5">
    </div>
</template>

<script>
import loading from '@/components/Loading'
import error from '@/components/Error'
import {mapGetters} from 'vuex'

export default {
    name: 'editPD',
    components: {
        loading,
        error
    },
    data() {
        return {
            system: {
                loading: true,
                error: false,
                updated: false,
                isAdd: true,
                pdSus: false,
                susprog: 'PS',
                nroprog: null,
                nroreun: null,
            },
            ultnro: -1,
            addUltimoNro: false,
            params: {
                NROPROG: this.$route.params.nroprog ? this.$route.params.nroprog : null,
                DIA: this.$route.params.dia,
                MES: this.$route.params.mes,
                ANHO: this.$route.params.anho,
                NROREUN: this.$route.params.nroreun ? this.$route.params.nroreun : null,
                REUNIONANO: this.$route.params.reunionano,
                PDITEM: this.$route.params.pditem
            },
            suspension: {
                NROPROG: null,
                FECHATRAS: null,
                TRASMPOR: null,
                NROREUN: null,
                REUNIONANO: null,
                PDITEM: null,
                SUSMOD: null,
                DESCRIP: null
            },
            mensaje: {
                visible: false,
                color: '',
                titulo: '',
                msg: '',
                lista: []
            }
        }
    },
    methods: {
        async ultNroFunc(){
            try {
                if(this.addUltimoNro){
                    // guaradar el numero anterior
                    this.system.nroprog = this.suspension.NROPROG
                    
                    // cambiar al ultimo numero
                    this.suspension.NROPROG = this.ultnro
                }else{
                    // cambiamos al numero guardado
                    this.suspension.NROPROG = this.system.nroprog
                }

            } catch (error) {
                console.log(error)
            }
           
        },
        async actionSuspension(){
            this.system.loading = true
            let suspension = JSON.parse(JSON.stringify(this.suspension))

            suspension = this.trimAndConversion(suspension)

            if(!!suspension.NROPROG && !!suspension.FECHATRAS && !!suspension.REUNIONANO && !!suspension.PDITEM)
            {
                
                if(this.verificacionDeCaracteres(suspension.NROPROG)
                    && this.verificacionDeCaracteres(suspension.NROREUN)
                    && this.verificacionDeCaracteres(suspension.REUNIONANO)
                    && this.verificacionDeCaracteres(suspension.PDITEM))
                {
                    this.mensaje.lista = []
                    if(!this.system.isAdd){
                        // editar
                        try {
                            const res = await this.axios.put(`/suspensionUpdate/${this.params.NROPROG}/${this.params.DIA}/${this.params.MES}/${this.params.ANHO}/${this.params.NROREUN}/${this.params.REUNIONANO}/${this.params.PDITEM}/${this.system.susprog}`, {
                                suspension
                            })
                            
                            if(!res.data.codigo.includes('Error')){
                                const jsonDataNew = JSON.parse(res.config.data)
                                this.mensaje.color = 'alert-success'
                                this.mensaje.titulo = 'Suspensión modificado'
                                this.mensaje.msg = res.data.mensaje
                                
                                this.mensaje.lista.push(jsonDataNew.suspension.NROPROG)
                                this.mensaje.lista.push(jsonDataNew.suspension.FECHATRAS)

                                this.alternarAlertaVisible(true)
                                this.system.updated = true
                            } else {
                                this.alternarAlertaVisible(true)
                                this.mensaje.color = 'alert-danger'
                                this.mensaje.titulo = 'No se modificado la suspensión'
                                this.mensaje.msg = res.data.mensaje
                            }

                        } catch (error) {
                            this.system.error = true
                            console.log(error)
                        } finally {
                            this.system.loading = false
                        }

                    }else{
                        // agregar
                        try {
                            const res = await this.axios.post(`/suspensionAdd/${this.system.susprog}`, {suspension})

                            if(!res.data.codigo.includes('Error')){
                                const jsonDataNew = JSON.parse(res.config.data)
                                this.mensaje.color = 'alert-success'
                                this.mensaje.titulo = 'Nueva suspensión'
                                this.mensaje.msg = res.data.mensaje
                                
                                this.mensaje.lista.push(jsonDataNew.suspension.NROPROG)
                                this.mensaje.lista.push(jsonDataNew.suspension.FECHATRAS)

                                this.alternarAlertaVisible(true)
                                this.suspension = {
                                    NROPROG: null,
                                    FECHATRAS: null,
                                    TRASMPOR: null,
                                    NROREUN: null,
                                    REUNIONANO: null,
                                    PDITEM: null,
                                    SUSMOD: null,
                                    DESCRIP: null
                                }
                            } else {
                                this.system.error = true
                                this.alternarAlertaVisible(true)
                                this.mensaje.color = 'alert-danger'
                                this.mensaje.titulo = 'No se agrego una suspensión'
                                this.mensaje.msg = res.data.mensaje
                            }

                        } catch (error) {
                            this.system.error = true
                            console.log(error)
                        } finally {
                            this.system.loading = false
                        }
                    }

                } else {
                    this.system.loading = false

                    this.alternarAlertaVisible(true)
                    this.mensaje.color = 'alert-danger'
                    this.mensaje.titulo = 'Hubo un problema'
                    this.mensaje.msg = 'No puede agregar datos con / \\.\nFavor usar -'
                }

            }else{
                this.system.loading = false
                
                this.alternarAlertaVisible(true)
                this.mensaje.color = 'alert-danger'
                this.mensaje.titulo = 'No se agrego el pedido'
                this.mensaje.msg = 'Debe agregar un número de suspensión, la fecha, el año de reunion y el pditem.'
                // console.log(res.config.data)
            }
        },
        cambiarTipoDeSuspencion(){
            if(this.system.pdSus){
                // guadamos el numero de nroreun
                console.log('PD')
                this.system.susprog = 'PD'
                this.system.nroreun = this.suspension.NROREUN
                this.suspension.NROREUN = ''
            } else {
                console.log('PS')
                this.system.susprog = 'PS'
                this.suspension.NROREUN = this.system.nroreun 
            }
        },
        redirectSeccionPrincipal(){
            this.$router.push('/suspensiones')
        },
        alternarAlertaVisible(visible){
            this.mensaje.visible = visible
        },
        verificacionDeCaracteres(myText){
            if(!!myText){
                if(myText.toString().includes('/') || myText.toString().includes('\\')){
                    return false
                }
            }

            return true
        },
        trimAndConversion(suspensionDatos){
            let suspension = JSON.parse(JSON.stringify(suspensionDatos))
            
            suspension.NROPROG = suspension.NROPROG ? parseInt(this.trim(suspension.NROPROG)) : null
            suspension.FECHATRAS = suspension.FECHATRAS ? this.trim(suspension.FECHATRAS) : null
            suspension.TRASMPOR = suspension.TRASMPOR ? this.trim(suspension.TRASMPOR) : null
            suspension.NROREUN = suspension.NROREUN ? parseInt(this.trim(suspension.NROREUN)) : null
            suspension.REUNIONANO = suspension.REUNIONANO ? parseInt(this.trim(suspension.REUNIONANO)) : null
            suspension.PDITEM = suspension.PDITEM ? parseInt(this.trim(suspension.PDITEM)) : null
            suspension.SUSMOD = suspension.SUSMOD ? this.trim(suspension.SUSMOD) : null
            suspension.DESCRIP = suspension.DESCRIP ? this.trim(suspension.DESCRIP) : null

            return suspension
        },
        trim(trim){
            return trim.toString().trim()
        },
    },
    async mounted(){
        try {
            console.log('this.$route.params', this.$route.params)
            console.log('this.$route.params.nroreun', this.$route.params.nroreun)

            this.system.isAdd = !this.$route.params.nroprog
            this.params.NROREUN = this.$route.params.nroreun ? this.$route.params.nroreun : null
            console.log('this.params', this.params)

            // ultimo numero
            const ultnro = await this.axios.post('/general/ultimoNumero')
            this.ultnro = ultnro.data.ultnro + 1

            // obtenemos los datos a modificar
            if(!this.system.isAdd){
                let aux = await this.axios.post(`/suspensionOne/${this.params.NROPROG}/${this.params.DIA}/${this.params.MES}/${this.params.ANHO}/${this.params.NROREUN}/${this.params.REUNIONANO}/${this.params.PDITEM}`)
                console.log('aux', aux)
                console.log('aux.data', aux.data)
                console.log('aux.data.respuesta[0]', aux.data.respuesta[0])
                this.suspension = aux.data.respuesta[0]

                // verificacion de si se suspende un PD
                this.system.pdSus = !this.suspension.NROREUN
                // this.cambiarTipoDeSuspencion()
                if(this.system.pdSus){
                    // guadamos el numero de nroreun
                    this.system.susprog = 'PD'
                } else {
                    this.system.susprog = 'PS'
                }

                // guardamos el numero actual de nroprog
                this.system.nroprog = parseInt(this.suspension.NROPROG)

                // guardamos el numero actual de nroreun
                this.system.nroreun = this.suspension.NROREUN

                // CONVERTIR LAS FECHAS PARA QUE RECONOZCA EL CALENDARIO
                if(this.suspension.FECHATRAS){
                    this.suspension.FECHATRAS = this.suspension.FECHATRAS.substring(0, 10)
                }
            }

        } catch (error) {
            this.system.error = true
            console.log(error)
        } finally {
            this.system.loading = false
            // console.log('finally')
        }
    },
    updated(){
        // this.pd.pdfecha = this.trasmision.fecha_context.selectedYMD.substring(8, 10) + '/' + this.trasmision.fecha_context.selectedYMD.substring(5, 7) + '/' + this.trasmision.fecha_context.selectedYMD.substring(0, 4) + ' 0:00:00'
        // this.pd.fechatra = this.trabajo.fecha_context.selectedYMD.substring(8, 10) + '/' + this.trabajo.fecha_context.selectedYMD.substring(5, 7) + '/' + this.trabajo.fecha_context.selectedYMD.substring(0, 4) + ' 0:00:00'
        // console.log(this.addUltimoNro)
        // console.log(this.pd)
    },
    computed: {
        ...mapGetters(['getSuspension'])
    }
}
</script>

<style>

</style>