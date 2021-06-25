<template>
  <div class="container">
        <div v-if="system.loading">
            <loading></loading>
        </div>
        <div v-else-if="system.error">
            <error></error>
        </div>
        <div class="row mt-4" v-else>
            <div class="col-md-9 mb-4">
                <div>
                    <label for="" class="mt-3">Local:</label>
                    <b-form-input list="my-list-id" v-on:keyup="filtroLocal()" :disabled="system.updated" v-model="eq23kv.LOCAL" placeholder="Local"></b-form-input>

                    <datalist id="my-list-id">
                        <option v-for="local in list.localesSubConjunto">{{ local }}</option>
                    </datalist>
                    <!-- <input type="text" class="form-control" v-model="eq23kv.local" placeholder="Local"> -->
                    <label for="" class="mt-3">Circuito:</label>
                    <b-form-input list="listCir" v-on:keyup="filtroCircuito()" :disabled="system.updated" v-model="eq23kv.CIRCUITO" required placeholder="Circuito"></b-form-input>

                    <datalist id="listCir">
                        <option v-for="circuito in list.circuito">{{ circuito }}</option>
                    </datalist>
                    <!-- <input type="text" class="form-control" v-model="eq23kv.circuito" placeholder="Circuito"> -->
                    <label for="" class="mt-3">Equipo:</label>
                    <b-form-input list="listEq" v-on:keyup="filtroEquipo()" :disabled="system.updated" v-model="eq23kv.EQUIPO" required placeholder="Equipo"></b-form-input>

                    <datalist id="listEq">
                        <option v-for="equipo in list.equipo">{{ equipo }}</option>
                    </datalist>
                    <!-- <input type="text" class="form-control" v-model="eq23kv.equipo" placeholder="Equipo"> -->
                    <label for="" class="mt-3">Barra:</label>
                    <input type="text" class="form-control" :disabled="system.updated" v-model="eq23kv.BARRA" placeholder="Barra">
                    <div class="container mt-4">
                        <div class="container">
                            <div class="container">
                                <button v-on:click="editEquipo()" v-if="!system.updated" class="btn btn-outline-primary btn-block">Actualizar</button>
                                <button class="btn btn-outline-danger btn-block" v-on:click="cancelar()">Volver</button>
                            </div>  
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3 mb-4">
                <div class="card text-white bg-primary mb-3">
                    <div class="card-header">Tu equipo a modificar</div>
                    <div class="card-body">
                        <!-- <h4 class="card-title">Primary card title</h4> -->
                        <p class="card-text" v-if="!(this.eq23kv.LOCAL === '' && this.eq23kv.CIRCUITO === '' && this.eq23kv.EQUIPO === '')">
                            <ul>
                                <li>
                                    Local: {{eq23kv.LOCAL}}
                                </li>
                                <li>
                                    Circuito: {{eq23kv.CIRCUITO}}
                                </li>
                                <li>
                                    Equipo: {{eq23kv.EQUIPO}}
                                </li>
                                <li>
                                    Barra: {{eq23kv.BARRA}}
                                </li>
                            </ul>
                        </p>
                        <p class="card-text" v-else>
                            No tienes equipo que modificar.
                            Si quieres modificar otro elige un equipo <router-link style="color: #fff;" to="/equipos"><i>aqui.</i></router-link>
                        </p>

                    </div>
                </div>
                <div v-if="mensaje.visible" class="alert alert-dismissible mt-4" v-bind:class="mensaje.color">
                    <button type="button" class="close" v-on:click="alternarAlertaVisible(false)">&times;</button>
                    <h6 class="mt-2">{{mensaje.titulo}}</h6>
                    <hr>
                    {{mensaje.msg}}
                    <hr v-if="mensaje.tipo == 1">
                    <label for="" v-if="mensaje.tipo == 1">Modificado:</label>
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
                updated: false
            },
            params: {
                LOCAL: this.$route.params.local,
                CIRCUITO: this.$route.params.circuito,
                EQUIPO: this.$route.params.equipo,
            },
            eq23kv: {
                LOCAL: '',
                CIRCUITO: '',
                EQUIPO: '',
                BARRA: ''
            },
            mensaje: {
                tipo: 0,
                visible: false,
                color: '',
                titulo: '',
                msg: '',
                lista: []
            },
            cambio: false,
            list: {
                cantidadMostrar: 5,
                locales: [],
                localesSubConjunto: [],
                circuito: [],
                circuitoSubConjunto: [],
                equipo: [],
                equipoSubConjunto: []
            }
        }
    },
    methods: {
        async filtroLocal(){
            this.list.localesSubConjunto = []

            if(this.eq23kv.LOCAL != ''){
                let cont = 0
                for(let i = 0; i < this.list.locales.length; i++){
                    if(cont < this.list.cantidadMostrar){
                        if(this.list.locales[i].includes(this.eq23kv.LOCAL)){
                            this.list.localesSubConjunto.push(this.list.locales[i])
                            cont++
                        }
                    }
                }

                // lista circuito
                const circuitoDB = await this.axios.post(`/eq23kvCircuitoPorLocal/${this.eq23kv.LOCAL}`)
                this.list.circuito = await circuitoDB.data
                
                if(this.list.circuito.length != 0){
                    // pushs los n primeros
                    this.list.circuitoSubConjunto = []
                    for(let i = 0; i < this.list.cantidadMostrar; i++){
                        this.list.circuitoSubConjunto.push(this.list.circuito[i])
                    }
                }else{
                    this.eq23kv.CIRCUITO = ''
                    this.eq23kv.EQUIPO = ''
                    this.list.circuitoSubConjunto = []
                    this.list.equipoSubConjunto = []
                }

            }else{
                this.eq23kv.CIRCUITO = ''
                this.eq23kv.EQUIPO = ''
                this.list.circuitoSubConjunto = []
                this.list.equipoSubConjunto = []

                for(let i = 0; i < this.list.cantidadMostrar; i++){
                    this.list.localesSubConjunto.push(this.list.locales[i])
                }
            }
        },
        async filtroCircuito(){
            this.list.circuitoSubConjunto = []

            if(this.eq23kv.CIRCUITO != ''){
                let cont = 0
                for(let i = 0; i < this.list.circuito.length; i++){
                    if(cont < this.list.cantidadMostrar){
                        if(this.list.circuito[i].includes(this.eq23kv.CIRCUITO)){
                            this.list.circuitoSubConjunto.push(this.list.circuito[i])
                            cont++
                        }
                    }
                }

                // lista equipo
                const equipoDB = await this.axios.post(`/eq23kvEquipoPorLocalCircuito/${this.eq23kv.LOCAL}/${this.eq23kv.CIRCUITO}`)
                this.list.equipo = await equipoDB.data

                if(this.list.equipo.length != 0){
                    // pushs los n primeros
                    this.list.equipoSubConjunto = []
                    for(let i = 0; i < this.list.cantidadMostrar; i++){
                        this.list.equipoSubConjunto.push(this.list.equipo[i])
                    }
                }else{
                    this.eq23kv.EQUIPO = ''
                    this.list.equipoSubConjunto = []
                }

            }else{
                this.eq23kv.EQUIPO = ''
                this.list.equipoSubConjunto = []

                if(this.eq23kv.LOCAL != ''){
                    for(let i = 0; i < this.list.cantidadMostrar; i++){
                        this.list.circuitoSubConjunto.push(this.list.circuito[i])
                    }
                }
            }
        },
        filtroEquipo(){
            this.list.equipoSubConjunto = []

            if(this.eq23kv.EQUIPO != ''){
                let cont = 0
                for(let i = 0; i < this.list.equipo.length; i++){
                    if(cont < this.list.cantidadMostrar){
                        if(this.list.equipo[i].includes(this.eq23kv.EQUIPO)){
                            this.list.equipoSubConjunto.push(this.list.equipo[i])
                            cont++
                        }
                    }
                }
            }else{
                if(this.eq23kv.LOCAL != '' && this.eq23kv.CIRCUITO != ''){
                    for(let i = 0; i < this.list.cantidadMostrar; i++){
                        this.list.equipoSubConjunto.push(this.list.equipo[i])
                    }
                }
            }
        },
        async editEquipo(){
            this.mensaje.lista = []
            
            if((!!this.eq23kv.LOCAL
                && !!this.eq23kv.CIRCUITO
                && !!this.eq23kv.EQUIPO) && (this.eq23kv.LOCAL != ''
                && this.eq23kv.CIRCUITO != ''
                && this.eq23kv.EQUIPO != ''))
            {
                
                if(this.verificacionDeCaracteres(this.eq23kv.LOCAL)
                    && this.verificacionDeCaracteres(this.eq23kv.CIRCUITO)
                    && this.verificacionDeCaracteres(this.eq23kv.EQUIPO)
                    && this.verificacionDeCaracteres(this.eq23kv.BARRA))
                {
                    try {
                        this.eq23kvDatosTrim()

                        const res = await this.axios.put(`/eq23kvEdit/${this.params.LOCAL}/${this.params.CIRCUITO}/${this.params.EQUIPO}`, this.eq23kv)
                    
                        if(!res.data.codigo.includes('Error')) {
                            const jsonDataNew = JSON.parse(res.config.data)
                            this.alternarAlertaVisible(true)
                            this.mensaje.tipo = 1
                            this.mensaje.color = 'alert-success'
                            this.mensaje.titulo = 'Equipo modificado'
                            this.mensaje.msg = res.data.mensaje
                            
                            this.mensaje.lista.push(jsonDataNew.LOCAL)
                            this.mensaje.lista.push(jsonDataNew.CIRCUITO)
                            this.mensaje.lista.push(jsonDataNew.EQUIPO)
                            this.mensaje.lista.push(jsonDataNew.BARRA)

                            this.system.updated = true
                        } else {
                            this.alternarAlertaVisible(true)
                            this.mensaje.tipo = 2
                            this.mensaje.color = 'alert-danger'
                            this.mensaje.titulo = 'No se ha modificado el equipo'
                            this.mensaje.msg = res.data.mensaje
                        }
                    } catch (error) {
                        this.system.error = true
                    
                    } 
                    
                } else {
                    this.alternarAlertaVisible(true)
                    this.mensaje.color = 'alert-danger'
                    this.mensaje.titulo = 'No se agrego el equipo'
                    this.mensaje.msg = 'No se puede agregar datos con caracteres como: / \\'
                }
            }else{
                this.alternarAlertaVisible(true)
                this.mensaje.tipo = 3
                this.mensaje.color = 'alert-danger'
                this.mensaje.titulo = 'No se puede modificar el equipo'
                this.mensaje.msg = 'No se puede modificar el equipo, debe seleccionar uno.'
            }
        },
        alternarAlertaVisible(visible){
            this.mensaje.visible = visible
            if(!visible){
                lista = []
            }
        },
        cancelar(){
            this.$router.push('/equipos')
        },
        verificacionDeCaracteres(myText){
            if(!!myText){
                if(myText.toString().includes('/') || myText.toString().includes('\\')){
                    return false
                }
            }

            return true
        },
        eq23kvDatosTrim(){
            if(!!this.eq23kv.LOCAL) {
                this.eq23kv.LOCAL = this.eq23kv.LOCAL.toString().trim()
            }
            if(!!this.eq23kv.CIRCUITO) {
                this.eq23kv.CIRCUITO = this.eq23kv.CIRCUITO.toString().trim()
            }
            if(!!this.eq23kv.EQUIPO) {
                this.eq23kv.EQUIPO = this.eq23kv.EQUIPO.toString().trim()
            }
            if(!!this.eq23kv.BARRA) {
                this.eq23kv.BARRA = this.eq23kv.BARRA.toString().trim()
            }
        }
    },
    async mounted(){
        try {
            // console.log('this.params')
            // console.log(this.params)

            // cambiamos el string que contenga '/' por '~' 
            // console.log('encodeURIComponent')
            // console.log(encodeURIComponent("/eq23kvOne/"+this.params.LOCAL+"/"+this.params.CIRCUITO+"/"+this.params.EQUIPO+""))
            // console.log(`/eq23kvOne/${this.params.LOCAL.replace('/', '~')}/${this.params.CIRCUITO.replace('/', '~')}/${this.params.EQUIPO.replace('/', '~')}`)
            const eq23kv = await this.axios.post(`/eq23kvOne/${this.params.LOCAL}/${this.params.CIRCUITO}/${this.params.EQUIPO}`)
            
            if(!eq23kv.data.codigo.includes('Error')){
                this.eq23kv.LOCAL = await eq23kv.data.respuesta[0].LOCAL
                this.eq23kv.CIRCUITO = await eq23kv.data.respuesta[0].CIRCUITO
                this.eq23kv.EQUIPO = await eq23kv.data.respuesta[0].EQUIPO
                this.eq23kv.BARRA = await eq23kv.data.respuesta[0].BARRA
            
                const localesDB = await this.axios.post('/locales')
                
                if(!localesDB.data.codigo.includes('Error')){
                    this.list.locales = await localesDB.data.respuesta

                    for(let i = 0; i < this.list.cantidadMostrar; i++){
                        this.list.localesSubConjunto.push(this.list.locales[i])
                    }
                } else {
                    this.system.error = true
                    console.log(error)
                }
            } else {
                this.system.error = true
                console.log(error)
            }

        } catch (error) {
            this.system.error = true
            console.log(error)
        } finally {
            this.system.loading = false
        }
    },
    computed: {}
}
</script>

<style>

</style>