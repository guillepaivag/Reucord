<template>
    <div class="container">
        <div v-if="system.loading">
            <loading></loading>
        </div>
        <div v-else-if="system.error">
            <error></error>
        </div>
        <div class="row mt-4" v-else>
            <div class="col-md-9">
                <div>
                    <label for="" class="mt-3">Local:</label>
                    <b-form-input list="my-list-id" v-on:keyup="filtroLocal()" v-model="eq23kv.LOCAL" placeholder="Local"></b-form-input>

                    <datalist id="my-list-id">
                        <option v-for="local in list.localesSubConjunto">{{ local }}</option>
                    </datalist>
                    <!-- <input type="text" class="form-control" v-model="eq23kv.local" placeholder="Local"> -->
                    <label for="" class="mt-3">Circuito:</label>
                    <b-form-input list="listCir" v-on:keyup="filtroCircuito()" v-model="eq23kv.CIRCUITO" required placeholder="Circuito"></b-form-input>

                    <datalist id="listCir">
                        <option v-for="circuito in list.circuito">{{ circuito }}</option>
                    </datalist>
                    <!-- <input type="text" class="form-control" v-model="eq23kv.circuito" placeholder="Circuito"> -->
                    <label for="" class="mt-3">Equipo:</label>
                    <b-form-input list="listEq" v-on:keyup="filtroEquipo()" v-model="eq23kv.EQUIPO" required placeholder="Equipo"></b-form-input>

                    <datalist id="listEq">
                        <option v-for="equipo in list.equipo">{{ equipo }}</option>
                    </datalist>
                    <!-- <input type="text" class="form-control" v-model="eq23kv.equipo" placeholder="Equipo"> -->
                    <label for="" class="mt-3">Barra:</label>
                    <input type="text" class="form-control" v-model="eq23kv.BARRA" placeholder="Barra">
                    <div class="container mt-4">
                        <div class="container">
                            <div class="container">
                                <button v-on:click="addEquipo()" class="btn btn-outline-primary btn-block">Agregar</button>
                            </div>  
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3">
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
import error from '@/components/Error'

export default {
    name: 'addEquipo',
     components: {
        loading,
        error
    },
    data() {
        return {
            system: {
                loading: true,
                error: false
            },
            eq23kv: {
                LOCAL: '',
                CIRCUITO: '',
                EQUIPO: '',
                BARRA: ''
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

            if(this.eq23kv.local != ''){
                let cont = 0
                for(let i = 0; i < this.list.locales.length; i++){
                    if(cont < this.list.cantidadMostrar){
                        if(this.list.locales[i].includes(this.eq23kv.LOCAL)){
                            this.list.localesSubConjunto.push(this.list.locales[i])
                            cont++
                        }
                    }
                }

                try {
                    // lista circuito
                    const circuitoDB = await this.axios.post(`/eq23kvCircuitoPorLocal/${this.eq23kv.LOCAL}`)
                    if(!circuitoDB.data.codigo.includes('Error')){
                        this.list.circuito = await circuitoDB.data.respuesta
                    
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
                    } else {
                        console.log(circuitoDB.data.mensaje)
                        console.log(circuitoDB.data.respuesta)
                    }
                } catch (error) {
                    console.log(error)
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

                try {
                    // lista equipo
                    const equipoDB = await this.axios.post(`/eq23kvEquipoPorLocalCircuito/${this.eq23kv.LOCAL}/${this.eq23kv.CIRCUITO}`)
                    if(!equipoDB.data.codigo.includes('Error')){
                        this.list.equipo = await equipoDB.data.respuesta

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
                    } else {
                        console.log(equipoDB.data.mensaje)
                        console.log(equipoDB.data.respuesta)
                    }
                } catch (error) {
                    console.log(error)
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
        async addEquipo(){
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

                        const res = await this.axios.post('/eq23kvAdd', this.eq23kv)
                        
                        if(!res.data.codigo.includes('Error')){
                            const jsonDataNew = JSON.parse(res.config.data)
                            this.alternarAlertaVisible(true)
                            this.mensaje.color = 'alert-success'
                            this.mensaje.titulo = 'Nuevo equipo'
                            this.mensaje.msg = res.data.mensaje
                            
                            this.mensaje.lista.push(jsonDataNew.LOCAL)
                            this.mensaje.lista.push(jsonDataNew.CIRCUITO)
                            this.mensaje.lista.push(jsonDataNew.EQUIPO)
                            this.mensaje.lista.push(jsonDataNew.BARRA)
                        } else {
                            this.alternarAlertaVisible(true)
                            this.mensaje.color = 'alert-danger'
                            this.mensaje.titulo = 'No se agrego el equipo'
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
            } else {
                this.alternarAlertaVisible(true)
                this.mensaje.color = 'alert-danger'
                this.mensaje.titulo = 'No se agrego el equipo'
                this.mensaje.msg = 'Agregue los datos de local, circuito, equipo.'
            }
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
    async mounted() {
        try {
            const localesDB = await this.axios.post('/locales')
            
            if(!localesDB.data.codigo.includes('Error')){
                this.list.locales = await localesDB.data.respuesta

                for(let i = 0; i < this.list.cantidadMostrar; i++){
                    this.list.localesSubConjunto.push(this.list.locales[i])
                }
            } else {
                this.system.error = true
                console.log(localesDB.data.codigo)
                console.log(localesDB.data.mensaje)
                console.log(localesDB.data.respuesta)
            }

        } catch (error) {
            this.system.error = true
            console.log(error)
        } finally {
            this.system.loading = false
        }
    }
}
</script>

<style>

</style>