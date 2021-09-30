<template>
    <div class="container">
        <div v-if="system.loading">
            <loading></loading>
        </div>
        
        <div class="row mt-4" v-else>
            <div class="col-md-9">
                <div>
                    <label for="" class="mt-3">LOCAL:</label>
                    <b-form-input list="my-list-id" v-on:keyup="filtro()" :disabled="system.updated" v-model="reclamo.LOCAL" placeholder="LOCAL"></b-form-input>

                    <datalist id="my-list-id">
                        <option v-for="local in list.localesSubConjunto">{{ local }}</option>
                    </datalist>

                    <div class="row">
                        <div class="col-md-6">
                            <label for="" class="mt-3">OTRADEP:</label>
                            <input type="text" class="form-control" v-model="reclamo.OTRADEP" :disabled="system.updated" placeholder="OTRADEP">
                        </div>
                        <div class="col-md-6">
                            <label for="" class="mt-3">NROOTRADE:</label>
                            <input type="number" class="form-control" v-model="reclamo.NROOTRADE" :disabled="system.updated" placeholder="NROOTRADE">
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <label for="" class="mt-3">DMED:</label>
                            <input type="text" class="form-control" v-model="reclamo.DMED" :disabled="system.updated" placeholder="DMED">
                        </div>
                        <div class="col-md-6">
                            <label for="" class="mt-3">DMEDNRO:</label>
                            <input type="number" class="form-control" v-model="reclamo.DMEDNRO" :disabled="system.updated" placeholder="DMEDNRO">
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <label for="" class="mt-3">FECHATRASM:</label>
                            <b-calendar v-model="reclamo.FECHATRASM" :disabled="system.updated" block locale="es-ES"></b-calendar>
                        </div>
                        <div class="col-md-6">
                            <label for="" class="mt-3">HORATRASM:</label>
                            <b-form-timepicker v-model="reclamo.HORATRASM" :disabled="system.updated" show-seconds locale="es"></b-form-timepicker>
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <label for="" class="mt-3">TRASMPOR:</label>
                            <input type="text" class="form-control" v-model="reclamo.TRASMPOR" :disabled="system.updated" placeholder="TRASMPOR">
                        </div>
                        <div class="col-md-6">
                            <label for="" class="mt-3">RECIBPOR:</label>
                            <input type="text" class="form-control" v-model="reclamo.RECIBPOR" :disabled="system.updated" placeholder="RECIBPOR">
                        </div>
                    </div>

                    <hr>
                    
                    <label for="exampleFormControlTextarea1" class="">RECLAMO:</label>
                    <textarea type="text" class="form-control" v-model="reclamo.RECLAMO" id="exampleFormControlTextarea1" :disabled="system.updated" placeholder="RECLAMO" rows="5"></textarea>                
                    
                    <hr>

                    <div class="container mt-4">
                        <div class="container">
                            <div class="container">
                                <div v-if="!this.system.isAdd">
                                    <button v-on:click="actionReclamo()" v-if="!system.updated" class="btn btn-outline-primary btn-block">Editar</button>
                                    <button v-on:click="redirectReclamo()" v-if="system.updated" class="btn btn-outline-success btn-block">Volver</button>
                                </div>
                                <div v-else>
                                    <button v-on:click="actionReclamo()" class="btn btn-outline-primary btn-block">Agregar</button>
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
                    v-model="selectUltimoNro"
                    @input="agregarUltimoNumero"
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
                    <hr>
                    Agregado:
                    <ul>
                        <li v-for="(datoEquipo, index) in mensaje.lista" :key="index">
                            {{datoEquipo}}
                        </li>
                    </ul>
                    <hr>
                    <router-link to="/" class="alert-link">Reclamos ANDE</router-link>.
                </div>
            </div>
        </div>

        <hr class="mt-5">
    </div>
</template>

<script>
import loading from '@/components/Loading'
import {mapMutations, mapActions, mapGetters} from 'vuex'

export default {
    name: 'editPD',
    components: {
        loading,
    },
    data() {
        return {
            system: {
                loading: true,
                updated: false,
                isAdd: true,
                nroprog: null,
            },
            numeroSiguienteProgramacion: -1,
            selectUltimoNro: false,
            nroAct: 0,
            params: {
                DMEDNRO: this.$route.params.dmednro,
                DIA: this.$route.params.dia,
                MES: this.$route.params.mes,
                ANHO: this.$route.params.anho
            },
            reclamo: {
                LOCAL: null,
                OTRADEP: null,
                NROOTRADE: null,
                DMEDNRO: null,
                DMED: null,
                HORATRASM: '0:00:00',
                FECHATRASM: null,
                TRASMPOR: null,
                RECIBPOR: null,
                RECLAMO: null
            },
            mensaje: {
                visible: false,
                color: '',
                titulo: '',
                msg: '',
                lista: []
            },
            list: {
                cantidadMostrar: 5,
                locales: [],
                localesSubConjunto: []
            }
        }
    },
    methods: {
        async agregarUltimoNumero(){
            try {
                if(this.selectUltimoNro){
                    // guaradar el numero anterior
                    this.system.nroprog = this.reclamo.DMEDNRO
                    
                    // cambiar al ultimo numero
                    this.reclamo.DMEDNRO = this.numeroSiguienteProgramacion
                }else{
                    // cambiamos al numero guardado
                    this.reclamo.DMEDNRO = this.system.nroprog
                }

            } catch (error) {
                console.log(error)
            }
           
        },
        filtro(){
            this.list.localesSubConjunto = []

            if(this.reclamo.LOCAL != ''){
                let cont = 0
                for(let i = 0; i < this.list.locales.length; i++){
                    if(cont < this.list.cantidadMostrar){
                        if(this.list.locales[i].includes(this.reclamo.LOCAL)){
                            this.list.localesSubConjunto.push(this.list.locales[i])
                            cont++
                        }
                    }
                }
            }else{
                for(let i = 0; i < this.list.cantidadMostrar; i++){
                    this.list.localesSubConjunto.push(this.list.locales[i])
                }
            }
        },
        async actionReclamo(){
            this.system.loading = true
            
            let reclamo = JSON.parse(JSON.stringify(this.reclamo))
            
            reclamo = this.trimAndConversion(reclamo)
            console.log('reclamo', reclamo)

            if(!!reclamo.DMEDNRO && !!reclamo.FECHATRASM)
            {
                if(this.verificacionDeCaracteres(reclamo.LOCAL)
                    && this.verificacionDeCaracteres(reclamo.NROOTRADE)
                    && this.verificacionDeCaracteres(reclamo.DMEDNRO))
                {   
                    this.mensaje.lista = []

                    if(!this.system.isAdd){
                        // Para editar
                        try {
                            
                            const res = await this.$store.dispatch('actualizarReclamo', {
                                params: {
                                    dmednro: this.params.DMEDNRO,
                                    dia: this.params.DIA,
                                    mes: this.params.MES,
                                    anho: this.params.ANHO
                                },
                                reclamo
                            })

                            this.mensaje.color = 'alert-success'
                            this.mensaje.titulo = 'Reclamo modificado'
                            this.mensaje.msg = res.mensaje
                            
                            this.mensaje.lista.push(reclamo.DMEDNRO)
                            this.mensaje.lista.push(reclamo.FECHATRASM)

                            this.alternarAlertaVisible(true)
                            this.system.updated = true

                        } catch (error) {
                            console.log(error)
                        
                        } finally {
                            this.system.loading = false
                        
                        }

                    }else{
                        // Para agregar
                        try {
                            const res = await this.$store.dispatch('agregarReclamo', {
                                reclamo
                            })

                            this.mensaje.color = 'alert-success'
                            this.mensaje.titulo = 'Nuevo reclamo'
                            this.mensaje.msg = res.mensaje
                            
                            this.mensaje.lista.push(reclamo.DMEDNRO)
                            this.mensaje.lista.push(reclamo.FECHATRASM)

                            this.alternarAlertaVisible(true)
                            this.reclamo = {
                                LOCAL: null,
                                OTRADEP: null,
                                NROOTRADE: null,
                                DMEDNRO: null,
                                DMED: null,
                                HORATRASM: null,
                                FECHATRASM: null,
                                TRASMPOR: null,
                                RECIBPOR: null,
                                RECLAMO: null
                            }

                        } catch (error) {
                            console.log(error)
                        
                        } finally {
                            this.system.loading = false
                        
                        }
                        
                    }

                }else{
                    this.system.loading = false

                    this.alternarAlertaVisible(true)
                    this.mensaje.color = 'alert-danger'
                    this.mensaje.titulo = 'Hubo un problema'
                    this.mensaje.msg = 'No puede agregar datos con / \\.\nFavor usar -'
                }
            } else{
                this.system.loading = false

                this.alternarAlertaVisible(true)
                this.mensaje.color = 'alert-danger'
                this.mensaje.titulo = 'Hubo un problema'
                this.mensaje.msg = 'Debe agregar un número de reclamo y una fecha trasmitida.'
            }
        },
        redirectReclamo(){
            this.$router.push('/reclamos')
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
        trimAndConversion(reclamoDatos){
            let reclamo = JSON.parse(JSON.stringify(reclamoDatos))

            reclamo.LOCAL = reclamo.LOCAL ? this.trim(reclamo.LOCAL) : null
            reclamo.OTRADEP = reclamo.OTRADEP ? this.trim(reclamo.OTRADEP) : null
            reclamo.NROOTRADE = reclamo.NROOTRADE ? parseInt(this.trim(reclamo.NROOTRADE)) : null
            reclamo.DMEDNRO = reclamo.DMEDNRO ? parseInt(this.trim(reclamo.DMEDNRO)) : null
            reclamo.DMED = reclamo.DMED ? this.trim(reclamo.DMED) : null
            reclamo.HORATRASM = reclamo.HORATRASM ? this.trim(reclamo.HORATRASM) : null
            reclamo.FECHATRASM = reclamo.FECHATRASM ? this.trim(reclamo.FECHATRASM) : null
            reclamo.TRASMPOR = reclamo.TRASMPOR ? this.trim(reclamo.TRASMPOR) : null
            reclamo.RECIBPOR = reclamo.RECIBPOR ? this.trim(reclamo.RECIBPOR) : null
            reclamo.RECLAMO = reclamo.RECLAMO ? this.trim(reclamo.RECLAMO) : null

            return reclamo
        },
        trim(trim){
            return trim.toString().trim()
        },
    },
    async mounted(){
        try {
            this.system.isAdd = !!!this.$route.params.dmednro

            // ultimo numero
            this.numeroSiguienteProgramacion = await this.$store.dispatch('ultimoNumero')
            this.numeroSiguienteProgramacion++

            // lista locales
            this.list.locales = await this.$store.dispatch('listaLocales') ?? []
            
            // pushs los n primeros
            for(let i = 0; i < this.list.cantidadMostrar; i++){
                this.list.localesSubConjunto.push(this.list.locales[i])
            }

            // obtenemos los datos a modificar
            if(!this.system.isAdd){
                this.reclamo = await this.$store.dispatch('obtenerUnReclamo', {
                    dmednro: this.params.DMEDNRO,
                    dia: this.params.DIA,
                    mes: this.params.MES,
                    anho: this.params.ANHO,
                })
                
                this.reclamo.FECHATRASM = this.reclamo.FECHATRASM.substring(0, 10)

                // guardamos el numero actual de nroprog
                this.system.nroprog = parseInt(this.reclamo.DMEDNRO)
            } 

        } catch (error) {
            console.log('error', error)
        } finally {
            this.system.loading = false
        }
    },
    updated(){},
    computed: {}
}
</script>

<style>

</style>