<template>
    <div class="container">
        <div v-if="system.loading">
            <loading></loading>
        </div>
        <div v-else-if="system.error">
            <error></error>
        </div>
        <div class="row mt-4" v-else>
            <div :class="system.operation === 'read' ? 'col-md-12' : 'col-md-9'">
                <div>
                    <div class="row">

                        <div class="col-md-4">
                            <label for="" class="mt-3">Reufecha:</label>
                            <input type="text" 
                                class="form-control" 
                                :disabled="system.updated || system.operation === 'read'" 
                                v-model="ps.REUFECHA" 
                                required 
                                placeholder="Reufecha"
                            >
                        </div>
                        
                        <div class="col-md-4">
                            <label for="" class="mt-3">Reunro:</label>
                            <input 
                                type="text" 
                                class="form-control" 
                                :disabled="system.updated || system.operation === 'read'" 
                                v-model="ps.REUNRO" 
                                required 
                                placeholder="Reunro"
                            >
                        </div>

                        <div class="col-md-4">
                            <label for="" class="mt-3">Item:</label>
                            <input 
                                type="text" 
                                class="form-control" 
                                :disabled="system.updated || system.operation === 'read'" 
                                v-model="ps.ITEM" 
                                required 
                                placeholder="Item"
                            >
                        </div>

                    </div>

                    <div class="row">
                        <div class="col-md-4">
                            <label for="" class="mt-3">Local:</label>
                            <b-form-input 
                                list="my-list-id" 
                                v-on:keyup="filtroLocal()" 
                                :disabled="system.updated || system.operation === 'read'" 
                                v-model="ps.LOCAL" 
                                placeholder="Local"
                            ></b-form-input>

                            <datalist id="my-list-id">
                                <option v-for="local in list.localesSubConjunto">{{ local }}</option>
                            </datalist>
                            
                        </div>
                        <div class="col-md-4">
                            <label for="" class="mt-3">Circuito:</label>
                            <b-form-input 
                                list="listCir" 
                                v-on:keyup="filtroCircuito()" 
                                :disabled="system.updated || system.operation === 'read'" 
                                v-model="ps.CIRCUITO" 
                                required 
                                placeholder="Circuito">
                            </b-form-input>

                            <datalist id="listCir">
                                <option v-for="circuito in list.circuito">{{ circuito }}</option>
                            </datalist>
                        </div>
                        <div class="col-md-4">
                            <label for="" class="mt-3">Equipo:</label>
                            <b-form-input 
                                list="listEq" 
                                v-on:keyup="filtroEquipo()" 
                                :disabled="system.updated || system.operation === 'read'" 
                                v-model="ps.EQUIPO" 
                                required 
                                placeholder="Equipo">
                            </b-form-input>

                            <datalist id="listEq">
                                <option v-for="equipo in list.equipo">{{ equipo }}</option>
                            </datalist>
                        </div>
                    </div>

                    <hr>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <label for="" class="mt-3">Aut:</label>
                            <input 
                                type="text" 
                                class="form-control" 
                                :disabled="system.updated || system.operation === 'read'" 
                                v-model="ps.AUT" 
                                placeholder="Aut"
                            >
                        </div>

                        <div class="col-md-6">
                            <label for="" class="mt-3">Estado:</label>
                            <input 
                                type="text" 
                                class="form-control" 
                                :disabled="system.updated || system.operation === 'read'" 
                                v-model="ps.ESTADO" 
                                placeholder="Estado"
                            >
                        </div>
                    </div>

                    <hr>

                    <div class="row">
                        <div class="col-md-6">
                            <label for="" class="mt-3">Responsable:</label>
                            <input 
                                type="text" 
                                class="form-control" 
                                :disabled="system.updated || system.operation === 'read'" 
                                v-model="ps.RESPONSABLE" 
                                placeholder="Responsable"
                            >
                        </div>

                        <div class="col-md-6">
                            <label for="" class="mt-3">Ampliación:</label>
                            <input 
                                type="text" 
                                class="form-control" 
                                :disabled="system.updated || system.operation === 'read'" 
                                v-model="ps.AMPLIACION" 
                                placeholder="Ampliación"
                            >
                        </div>
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <label for="" class="mt-3">Trabajo:</label>
                            <textarea
                                class="form-control" 
                                :disabled="system.updated || system.operation === 'read'" 
                                v-model="ps.TRABAJO" 
                                placeholder="Trabajo"
                                rows="4" cols="50"
                            >
                            </textarea>
                        </div>

                        <div class="col-md-6">
                            <label for="" class="mt-3">Observación:</label>
                            <textarea
                                class="form-control" 
                                :disabled="system.updated || system.operation === 'read'" 
                                v-model="ps.OBSERVAC" 
                                placeholder="Observación"
                                rows="4" cols="50"
                            >
                            </textarea>
                        </div>
                    </div>

                    <div class="">
                        <label for="" class="mt-3">Resultado:</label>
                        <textarea
                            class="form-control" 
                            :disabled="system.updated || system.operation === 'read'" 
                            v-model="ps.RESULTADO" 
                            placeholder="Resultado"
                            rows="4" cols="50"
                        >
                        </textarea>
                    </div>
                    
                    <!-- <label for="" class="">Trasmitido por:</label>
                    <input type="text" class="form-control" :disabled="system.updated" v-model="pd.PDTRASMI" placeholder="Trasmitido por">

                    <h5 class="mt-3">Fecha trasmitida:</h5> 
                    <b-calendar v-model="pd.PDFECHA" :disabled="system.updated" block locale="es-ES"></b-calendar>

                    <label for="" class="mt-3">Hora trasmitida:</label>
                    <b-form-timepicker v-model="pd.HORATRAS" :disabled="system.updated" show-seconds locale="es"></b-form-timepicker> -->

                    <hr>

                    <div class="row">

                        <!-- NRO_REC -->
                        <div class="col-md-6">
                            <label for="" class="mt-3">NRO_REC:</label>
                            <input 
                                type="number" 
                                class="form-control" 
                                :disabled="system.updated || system.operation === 'read'" 
                                v-model="ps.NRO_REC" 
                                placeholder="NRO_REC"
                            >
                        </div>

                        <!-- FECHA_REC -->
                        <div class="col-md-6">
                            <label for="" class="mt-3">FECHA_REC:</label>
                            <br>
                            <b-calendar 
                                block 
                                v-model="ps.FECHA_REC" 
                                locale="es-ES"
                                :disabled="system.updated || system.operation === 'read'" 
                                ></b-calendar>
                        </div>

                    </div>

                    <h5 class="mt-3">Fecha de trabajo:</h5> 
                    <button 
                        type="button" 
                        class="btn btn-outline-success" 
                        v-if="system.operation != 'read' && !system.updated" 
                        v-on:click="agregarTrabajo"
                    >
                        Agregar un nuevo trabajo
                    </button>

                    <div class="row mt-5" v-for="(trabajo, index) in psTrabajos" :key="index">
                        <hr>

                        <div class="col-md-7">
                            <b-calendar 
                                v-model="trabajo.FECHATRABA" 
                                :disabled="system.updated || system.operation === 'read'" 
                                block locale="es-ES"
                            ></b-calendar>
                        </div>    
                        
                        <div class="col-md-5">
                            <label for="" class="mt-3">Hora inicio:</label>
                        
                            <b-form-timepicker 
                                v-model="trabajo.HORADESDE" 
                                :disabled="system.updated || system.operation === 'read'" 
                                show-seconds locale="es"
                            ></b-form-timepicker>
                            
                            <hr>

                            <label for="" class="">Hora fin:</label>

                            <b-form-timepicker 
                                v-model="trabajo.HORAHASTA" 
                                :disabled="system.updated || system.operation === 'read'" 
                                show-seconds locale="es"
                            ></b-form-timepicker>

                            <hr>

                            <button 
                                type="button" 
                                class="btn btn-outline-danger mt-1" 
                                v-if="system.operation != 'read' && !system.updated" 
                                v-on:click="quitarTrabajo(index)"
                            >Quitar</button>
                        </div>

                        <hr>
                    </div>         

                    <div class="container mt-4" v-if=" system.operation != 'read' ">
                        <div class="container">
                            <div class="container">
                                <div v-if=" system.operation != 'create' ">
                                    <button v-on:click="actionPS()" v-if="!system.updated" class="btn btn-outline-primary btn-block">Editar</button>
                                    <button v-on:click="redirectPS()" v-if="system.updated" class="btn btn-outline-success btn-block">Elegir un PD</button>
                                </div>
                                <div v-else>
                                    <button v-on:click="actionPS()" class="btn btn-outline-primary btn-block">Agregar</button>
                                </div>
                                
                            </div>  
                        </div>
                    </div> 
                </div>
            </div>
            <div class="col-md-3" v-if=" system.operation != 'read' ">
                <div v-if="mensaje.visible" class="alert alert-dismissible mt-4" v-bind:class="mensaje.color">
                    <button type="button" class="close" v-on:click="alternarAlertaVisible(false)">&times;</button>
                    <h6 class="mt-2">{{mensaje.titulo}}</h6>
                    <hr>
                    {{mensaje.msg}}
                    <hr>
                    <div v-if="mensaje.color !== 'alert-danger'">
                        Agregado:
                        <ul>
                            <li v-for="(datoEquipo, index) in mensaje.lista" :key="index">
                                {{datoEquipo}}
                            </li>
                        </ul>
                        <hr>
                    </div>
                    <router-link to="/" class="alert-link">Reclamos ANDE</router-link>.
                </div>
            </div> 
        </div>

        <hr class="mt-5">

        <!-- <div v-if="system.pdAdded.length > 0">
            <pdAdded :listPdAdded="system.pdAdded"></pdAdded>
        </div> -->
    </div>
</template>

<script>
// import psAdded from '@/components/ps/PsAdded'
import loading from '@/components/Loading'
import error from '@/components/Error'

export default {
    name: 'AddEditPS',
    components: {
        loading,
        error,
        // psAdded
    },
    data() {
        return {
            system: {
                loading: true,
                error: false,
                updated: false,
                operation: '',
                psAdded: []
            },
            params: {
                REUFECHA: this.$route.params.reufecha,
                REUNRO: this.$route.params.reunro,
                ITEM: this.$route.params.item
            },
            ps: {
                REUFECHA: null,
                REUNRO: null,
                ITEM: null,
                LOCAL: null,
                CIRCUITO: null,
                EQUIPO: null,
                TRABAJO: null,
                AUT: null,
                ESTADO: null,
                OBSERVAC: null,
                RESULTADO: null,
                RESPONSABLE: null,
                AMPLIACION: null,
                NRO_REC: null,
                FECHA_REC: null
            },
            psTrabajos: [],
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
        agregarTrabajo(){
            this.psTrabajos.push({
                REUFECHA: null,
                REUNRO: null,
                ITEM: null,
                FECHATRABA: '0:00:00',
                HORADESDE: '0:00:00',
                HORAHASTA: '0:00:00'
            })
        },
        quitarTrabajo(index){
            this.psTrabajos.splice(index, 1)
        },
        async filtroLocal(){
            this.list.localesSubConjunto = []

            if(this.ps.LOCAL != ''){
                let cont = 0
                for(let i = 0; i < this.list.locales.length; i++){
                    if(cont < this.list.cantidadMostrar){
                        if(this.list.locales[i].includes(this.ps.LOCAL)){
                            this.list.localesSubConjunto.push(this.list.locales[i])
                            cont++
                        }
                    }
                }

                try {
                    // lista circuito
                    const circuitoDB = await this.axios.post(`/eq23kvCircuitoPorLocal/${this.ps.LOCAL}`)
                    if(!circuitoDB.data.codigo.includes('Error')){
                        this.list.circuito = await circuitoDB.data.respuesta

                        if(this.list.circuito.length != 0){
                            // pushs los n primeros
                            this.list.circuitoSubConjunto = []
                            for(let i = 0; i < this.list.cantidadMostrar; i++){
                                this.list.circuitoSubConjunto.push(this.list.circuito[i])
                            }
                        }else{
                            this.ps.CIRCUITO = ''
                            this.ps.EQUIPO = ''
                            this.list.circuitoSubConjunto = []
                            this.list.equipoSubConjunto = []
                        }
                    } else {
                        this.alternarAlertaVisible(true)
                        this.mensaje.color = 'alert-danger'
                        this.mensaje.titulo = 'Hubo un problema'
                        this.mensaje.msg = circuitoDB.data.mensaje
                    }
                    
                } catch (error) {
                    console.log(error)
                }

            }else{
                this.ps.CIRCUITO = ''
                this.ps.EQUIPO = ''
                this.list.circuitoSubConjunto = []
                this.list.equipoSubConjunto = []

                for(let i = 0; i < this.list.cantidadMostrar; i++){
                    this.list.localesSubConjunto.push(this.list.locales[i])
                }
            }
        },
        async filtroCircuito(){
            this.list.circuitoSubConjunto = []

            if(this.ps.CIRCUITO != ''){
                let cont = 0
                for(let i = 0; i < this.list.circuito.length; i++){
                    if(cont < this.list.cantidadMostrar){
                        if(this.list.circuito[i].includes(this.ps.CIRCUITO)){
                            this.list.circuitoSubConjunto.push(this.list.circuito[i])
                            cont++
                        }
                    }
                }

                // lista equipo
                const equipoDB = await this.axios.post(`/eq23kvEquipoPorLocalCircuito/${this.ps.LOCAL}/${this.ps.CIRCUITO}`)
                
                if(!equipoDB.data.codigo.includes('Error')){
                    this.list.equipo = await equipoDB.data.respuesta

                    if(this.list.equipo.length != 0){
                        // pushs los n primeros
                        this.list.equipoSubConjunto = []
                        for(let i = 0; i < this.list.cantidadMostrar; i++){
                            this.list.equipoSubConjunto.push(this.list.equipo[i])
                        }
                    }else{
                        this.ps.EQUIPO = ''
                        this.list.equipoSubConjunto = []
                    }
                } else {
                    this.alternarAlertaVisible(true)
                    this.mensaje.color = 'alert-danger'
                    this.mensaje.titulo = 'Hubo un problema'
                    this.mensaje.msg = equipoDB.data.mensaje
                }

            }else{
                this.ps.EQUIPO = ''
                this.list.equipoSubConjunto = []

                if(this.ps.LOCAL != ''){
                    for(let i = 0; i < this.list.cantidadMostrar; i++){
                        this.list.circuitoSubConjunto.push(this.list.circuito[i])
                    }
                }
            }
        },
        filtroEquipo(){
            this.list.equipoSubConjunto = []

            if(this.ps.EQUIPO != ''){
                let cont = 0
                for(let i = 0; i < this.list.equipo.length; i++){
                    if(cont < this.list.cantidadMostrar){
                        if(this.list.equipo[i].includes(this.ps.EQUIPO)){
                            this.list.equipoSubConjunto.push(this.list.equipo[i])
                            cont++
                        }
                    }
                }
            }else{
                if(this.ps.LOCAL != '' && this.ps.CIRCUITO != ''){
                    for(let i = 0; i < this.list.cantidadMostrar; i++){
                        this.list.equipoSubConjunto.push(this.list.equipo[i])
                    }
                }
            }
        },
        async actionPS(){
            console.log(this.system.operation === 'create' ? 'Agregar' : (this.system.operation === 'update' ? 'Actualizar' : 'Leer') )

            let psAux = JSON.parse(JSON.stringify(this.ps))
            let psTrabajosAux = JSON.parse(JSON.stringify(this.psTrabajos))
            
            let conversion = this.trimAndConversion(psAux, psTrabajosAux)
            
            console.log('conversion', conversion)
            
            psAux = conversion.ps
            psTrabajosAux = conversion.psTrabajos

            if(!!psAux.REUFECHA && !!psAux.REUNRO && !!psAux.ITEM){
                
                if(this.verificacionDeCaracteres(psAux.LOCAL)
                    && this.verificacionDeCaracteres(psAux.CIRCUITO)
                    && this.verificacionDeCaracteres(psAux.EQUIPO)
                    && this.verificacionDeCaracteres(psAux.REUFECHA)
                    && this.verificacionDeCaracteres(psAux.REUNRO)
                    && this.verificacionDeCaracteres(psAux.ITEM))
                {
                    try {
                        
                        this.mensaje.lista = []
                        
                        if( this.system.operation === 'update' ){
                            const res = await this.axios.put(`/psUpdate/${this.params.REUFECHA}/${this.params.REUNRO}/${this.params.ITEM}`, {ps: psAux, psTrabajos: psTrabajosAux})
                        
                            if(!res.data.codigo.includes('Error')) {
                                const jsonDataNew = JSON.parse(res.config.data)
                                this.mensaje.color = 'alert-success'
                                this.mensaje.titulo = 'Nuevo pedido'
                                this.mensaje.msg = res.data.mensaje
                                
                                this.mensaje.lista.push(jsonDataNew.ps.REUFECHA)
                                this.mensaje.lista.push(jsonDataNew.ps.REUNRO)
                                this.mensaje.lista.push(jsonDataNew.ps.ITEM)

                                this.alternarAlertaVisible(true)

                                this.system.updated = true
                            } else {
                                this.alternarAlertaVisible(true)
                                this.mensaje.color = 'alert-danger'
                                this.mensaje.titulo = 'No se agrego el pedido'
                                this.mensaje.msg = res.data.mensaje
                            }
                        }else {
                            const res = await this.axios.post('/psAdd', {ps: psAux, psTrabajos: psTrabajosAux})
                        
                            if(!res.data.codigo.includes('Error')){
                                const jsonDataNew = JSON.parse(res.config.data)
                                this.mensaje.color = 'alert-success'
                                this.mensaje.titulo = 'Nuevo pedido'
                                this.mensaje.msg = res.data.mensaje
                                
                                this.mensaje.lista.push(jsonDataNew.ps.REUFECHA)
                                this.mensaje.lista.push(jsonDataNew.ps.REUNRO)
                                this.mensaje.lista.push(jsonDataNew.ps.ITEM)

                                this.alternarAlertaVisible(true)

                                this.system.psAdded.push({
                                    REUFECHA: jsonDataNew.ps.REUFECHA,
                                    REUNRO: jsonDataNew.ps.REUNRO,
                                    ITEM: jsonDataNew.ps.ITEM,
                                })

                                this.ps = {
                                    REUFECHA: null,
                                    REUNRO: null,
                                    ITEM: null,
                                    LOCAL: null,
                                    CIRCUITO: null,
                                    EQUIPO: null,
                                    TRABAJO: null,
                                    AUT: null,
                                    ESTADO: null,
                                    OBSERVAC: null,
                                    RESULTADO: null,
                                    RESPONSABLE: null,
                                    AMPLIACION: null,
                                    NRO_REC: null,
                                    FECHA_REC: null
                                }

                                this.psTrabajos = []
                            } else {
                                this.alternarAlertaVisible(true)
                                this.mensaje.color = 'alert-danger'
                                this.mensaje.titulo = 'No se agrego el pedido'
                                this.mensaje.msg = res.data.mensaje
                            }
                        }

                    } catch (error) {
                        console.log(error)
                        this.system.error = true
                    }
                } else {
                    this.alternarAlertaVisible(true)
                    this.mensaje.color = 'alert-danger'
                    this.mensaje.titulo = 'No se agrego el pedido'
                    this.mensaje.msg = 'No puede agregar datos con / \\.\nFavor usar -'
                }

            }else{
                this.alternarAlertaVisible(true)
                this.mensaje.color = 'alert-danger'
                this.mensaje.titulo = 'No se agrego el pedido'
                this.mensaje.msg = 'Debe agregar un número de pedido de disponibilidad y la fecha de trasmitida.'
            }
        },
        redirectPS(){
            this.$router.push('/ps')
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
        trimAndConversion(psDatos, psTrabajosDatos){
            let ps = JSON.parse(JSON.stringify(psDatos))
            let psTrabajos = JSON.parse(JSON.stringify(psTrabajosDatos))

            ps.REUFECHA = ps.REUFECHA ? parseInt(this.trim(ps.REUFECHA)) : null
            ps.REUNRO = ps.REUNRO ? parseInt(this.trim(ps.REUNRO)) : null
            ps.ITEM = ps.ITEM ? parseInt(this.trim(ps.ITEM)) : null
            ps.LOCAL = ps.LOCAL ? this.trim(ps.LOCAL) : null
            ps.CIRCUITO = ps.CIRCUITO ? this.trim(ps.CIRCUITO) : null
            ps.EQUIPO = ps.EQUIPO ? this.trim(ps.EQUIPO) : null
            ps.TRABAJO = ps.TRABAJO ? this.trim(ps.TRABAJO) : null
            ps.AUT = ps.AUT ? this.trim(ps.AUT) : null
            ps.ESTADO = ps.ESTADO ? this.trim(ps.ESTADO) : null
            ps.OBSERVAC = ps.OBSERVAC ? this.trim(ps.OBSERVAC) : null
            ps.RESULTADO = ps.RESULTADO ? this.trim(ps.RESULTADO) : null
            ps.RESPONSABLE = ps.RESPONSABLE ? this.trim(ps.RESPONSABLE) : null
            ps.AMPLIACION = ps.AMPLIACION ? this.trim(ps.AMPLIACION) : null
            ps.NRO_REC = ps.NRO_REC ? parseInt(this.trim(ps.NRO_REC)) : null
            ps.FECHA_REC = ps.FECHA_REC ? this.trim(ps.FECHA_REC) : null

            for (let i = 0; i < psTrabajos.length; i++) {
                const element = psTrabajos[i];
                
                psTrabajos[i].REUFECHA = this.trim(ps.REUFECHA) ? parseInt(this.trim(ps.REUFECHA)) : null
                psTrabajos[i].REUNRO = this.trim(ps.REUNRO) ? parseInt(this.trim(ps.REUNRO)) : null
                psTrabajos[i].ITEM = this.trim(ps.ITEM) ? parseInt(this.trim(ps.ITEM)) : null
                psTrabajos[i].FECHATRABA = element.FECHATRABA ? this.trim(element.FECHATRABA) : null
                psTrabajos[i].HORADESDE = element.HORADESDE ? this.trim(element.HORADESDE) : null
                psTrabajos[i].HORAHASTA = element.HORAHASTA ? this.trim(element.HORAHASTA) : null
            }

            return {
                ps,
                psTrabajos
            }
        },
        trim(trim){
            return trim.toString().trim()
        },
    },
    async mounted(){
        try {
            if( window.location.pathname.split('/')[2] == 'agregarPs-aTratar') {
                this.system.operation = 'create'
            } else if ( window.location.pathname.split('/')[2] == 'editarPs-aTratar' ) {
                this.system.operation = 'update'
            } else {
                this.system.operation = 'read'
            }

            console.log('this.system.operation', this.system.operation)

            if ( this.system.operation != 'read' ) {
                // lista locales
                const localesDB = await this.axios.post('/locales')
                if(!localesDB.data.codigo.includes('Error')){
                    this.list.locales = await localesDB.data.respuesta

                    // pushs los n primeros
                    for(let i = 0; i < this.list.cantidadMostrar; i++){
                        this.list.localesSubConjunto.push(this.list.locales[i])
                    }

                }else {
                    this.system.error = true
                    console.log(localesDB.data.respuesta)
                }
            }

            if ( this.system.operation != 'create' ) {
                // obtenemos los datos a modificar
                let aux = await this.axios.post(`/psOne/${this.params.REUFECHA}/${this.params.REUNRO}/${this.params.ITEM}`)
                
                if(!aux.data.codigo.includes('Error')){
                    this.ps = aux.data.respuesta[0]

                    // CONVERTIR LAS FECHAS PARA QUE RECONOZCA EL CALENDARIO
                    if(this.ps.FECHA_REC){
                        this.ps.FECHA_REC = this.ps.FECHA_REC.substring(0, 10)
                    }
        
                } else {
                    this.system.error = true
                    console.log(aux.data.respuesta)
                }

                aux = await this.axios.post(`/psOneTrabajos/${this.params.REUFECHA}/${this.params.REUNRO}/${this.params.ITEM}`)
                if(!aux.data.codigo.includes('Error')){
                    this.psTrabajos = aux.data.respuesta

                    // CONVERTIR LAS FECHAS PARA QUE RECONOZCA EL CALENDARIO
                    for (let i = 0; i < this.psTrabajos.length; i++) {
                        const element = this.psTrabajos[i];
                        
                        if(this.psTrabajos[i].FECHATRABA){
                            this.psTrabajos[i].FECHATRABA = element.FECHATRABA.substring(0, 10)
                        }

                    }
                } else {
                    this.system.error = true
                    console.log(aux.data.respuesta)
                }

            }

        } catch (error) {
            this.system.error = true
            console.log(error)
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