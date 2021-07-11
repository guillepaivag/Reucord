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
                        <div class="col-md-6">
                            <label for="" class="mt-3">Local:</label>
                            <b-form-input list="my-list-id" v-on:keyup="filtroLocal()" :disabled="system.updated || system.operation === 'read'" v-model="pd.LOCAL" placeholder="Local"></b-form-input>

                            <datalist id="my-list-id">
                                <option v-for="local in list.localesSubConjunto">{{ local }}</option>
                            </datalist>
                            <!-- <input type="text" class="form-control" v-model="pd.LOCAL" placeholder="Local"> -->
                        </div>
                        <div class="col-md-6">
                            <label for="" class="mt-3">Circuito:</label>
                            <b-form-input list="listCir" v-on:keyup="filtroCircuito()" :disabled="system.updated || system.operation === 'read'" v-model="pd.CIRCUITO" required placeholder="Circuito"></b-form-input>

                            <datalist id="listCir">
                                <option v-for="circuito in list.circuito">{{ circuito }}</option>
                            </datalist>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-6">
                            <label for="" class="mt-3">Equipo:</label>
                            <b-form-input list="listEq" v-on:keyup="filtroEquipo()" :disabled="system.updated || system.operation === 'read'" v-model="pd.EQUIPO" required placeholder="Equipo"></b-form-input>

                            <datalist id="listEq">
                                <option v-for="equipo in list.equipo">{{ equipo }}</option>
                            </datalist>
                        </div>
                        <div class="col-md-6">
                            <label for="" class="mt-3">Nro de programación:</label>
                            <input type="text" class="form-control" v-if="addUltimoNroPD" v-model="pd.NROPROG" disabled required placeholder="Número de programación">
                            <input type="text" class="form-control" :disabled="system.updated || system.operation === 'read'" v-else v-model="pd.NROPROG" required placeholder="Número de programación">
                        </div>
                    </div>

                    <hr>
                    
                    <label for="" class="">Trasmitido por:</label>
                    <input type="text" class="form-control" :disabled="system.updated || system.operation === 'read'" v-model="pd.PDTRASMI" placeholder="Trasmitido por">

                    <h5 class="mt-3">Fecha trasmitida:</h5> 
                    <b-calendar v-model="pd.PDFECHA" :disabled="system.updated || system.operation === 'read'" block locale="es-ES"></b-calendar>

                    <label for="" class="mt-3">Hora trasmitida:</label>
                    <b-form-timepicker v-model="pd.HORATRAS" :disabled="system.updated || system.operation === 'read'" show-seconds locale="es"></b-form-timepicker>
                    
                    <hr>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <label for="" class="mt-3">Estado:</label>
                            <input type="text" class="form-control" :disabled="system.updated || system.operation === 'read'" v-model="pd.ESTADO" placeholder="Estado">
                        </div>
                        <div class="col-md-6">
                            <label for="" class="mt-3">Suspendido/Modificado:</label>
                            <input type="text" class="form-control" :disabled="system.updated || system.operation === 'read'" v-model="pd.SUSMOD" placeholder="Suspendido/Modificado">
                        </div>
                    </div>

                    <label for="" class="mt-3">Trabajo:</label>
                    <input type="text" class="form-control" :disabled="system.updated || system.operation === 'read'" v-model="pd.TRABAJO" placeholder="Trabajo">

                    <div class="row">
                        <div class="col-md-6">
                            <label for="" class="mt-3">Responsable:</label>
                            <input type="text" class="form-control" :disabled="system.updated || system.operation === 'read'" v-model="pd.RESPONSABLE" placeholder="Estado">
                        </div>
                        <div class="col-md-6">
                            <label for="" class="mt-3">Observación:</label>
                            <input type="text" class="form-control" :disabled="system.updated || system.operation === 'read'" v-model="pd.OBSERVACION" placeholder="Trabajo">
                        </div>
                    </div>

                    <div>
                        <label for="" class="mt-3">Jefatura:</label>
                        <input type="text" class="form-control" :disabled="system.updated || system.operation === 'read'" v-model="pd.JEFATURA" placeholder="Estado">
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <label for="" class="mt-3">Nro del reclamo:</label>
                            <input type="text" class="form-control" :disabled="system.updated || system.operation === 'read'" v-model="pd.NRO_REC" placeholder="Estado">
                        </div>
                        <div class="col-md-6">
                            <label for="" class="mt-3">Fecha del reclamo:</label>
                            <b-calendar v-model="pd.FECHA_REC" :disabled="system.updated || system.operation === 'read'" block locale="es-ES"></b-calendar>
                        </div>
                    </div>

                    <div class="">
                        <label for="" class="mt-3">Recibido:</label>
                        <input type="text" class="form-control" :disabled="system.updated || system.operation === 'read'" v-model="pd.RECIBIDO" placeholder="Estado">
                    </div>

                    <div class="">
                        <label for="" class="mt-3">Resultado:</label>
                        <textarea type="text" class="form-control" v-model="pd.RESULTADO" id="exampleFormControlTextarea1" :disabled="system.updated || system.operation === 'read'" placeholder="Resultado" rows="5"></textarea>
                    </div>

                    <hr>

                    <h5 class="mt-3">Fecha de trabajo:</h5> 
                    <div v-if="system.operation != 'read'">
                        <button type="button" class="btn btn-outline-success" v-if="!system.updated" v-on:click="agregarTrabajo">Agregar un nuevo trabajo</button>
                    </div>

                    <div class="row mt-5" v-for="(trabajo, index) in pdTrabajos" :key="index">
                        <hr>

                        <div class="col-md-7">
                            <!-- @context="onContextTrabajo" -->
                            <b-calendar v-model="trabajo.FECHATRA" :disabled="system.updated || system.operation === 'read'" block locale="es-ES"></b-calendar>
                        </div>    
                        
                        <div class="col-md-5">
                            <label for="" class="mt-3">Hora inicio:</label>
                            <!-- <input type="text" class="form-control" v-model="pd.horaInicio" placeholder="Barra"> -->
                            <b-form-timepicker v-model="trabajo.HORAINI" :disabled="system.updated || system.operation === 'read'" show-seconds locale="es"></b-form-timepicker>
                            <!-- <div class="mt-2">Value: '{{ trabajo.hora_inicio_value }}'</div> -->
                            
                            <hr>

                            <label for="" class="">Hora fin:</label>
                            <!-- <input type="text" class="form-control" v-model="pd.horaFin" placeholder="Barra"> -->
                            <b-form-timepicker v-model="trabajo.HORAFIN" :disabled="system.updated || system.operation === 'read'" show-seconds locale="es"></b-form-timepicker>
                            <!-- <div class="mt-2">Value: '{{ trabajo.hora_fin_value }}'</div> -->

                            <hr>

                            <div v-if="system.operation != 'read'">
                                <button type="button" class="btn btn-outline-danger mt-1" v-if="!system.updated" v-on:click="quitarTrabajo(index)">Quitar</button>
                            </div>
                        </div>

                        <hr>
                    </div>         

                    <div class="container mt-4" v-if="system.operation != 'read'">
                        <div class="container">
                            <div class="container">
                                <div v-if="this.system.operation === 'update'">
                                    <button v-on:click="actionPD()" v-if="!system.updated" class="btn btn-outline-primary btn-block">Editar</button>
                                    <button v-on:click="redirectPD()" v-if="system.updated" class="btn btn-outline-success btn-block">Elegir un PD</button>
                                </div>
                                <div v-else>
                                    <button v-on:click="actionPD()" class="btn btn-outline-primary btn-block">Agregar</button>
                                </div>
                                
                            </div>  
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-3" v-if="system.operation != 'read'">
                <div class="bg-light p-4" v-if="!system.updated">
                    <b-form-checkbox
                    id="checkbox-1"
                    v-model="addUltimoNroPD"
                    @input="ultNroFunc"
                    name="checkbox-1"
                    :value="true"
                    :unchecked-value="false"
                    >
                    Último número de pedido de disponibilidad
                    </b-form-checkbox>
                </div>
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

        <!-- system.pdAdded.length -->
        <div v-if="system.operation != 'read' && system.pdAdded.length > 0">
            <!-- <div class="wrapper">
                <div class="pdAdded" v-for="(item, index) in [1,1,1,1,1,1,1,1,1,1]" :key="index">
                    <h2>{item.NROPROG}</h2>
                    <h2>{item.PDFECHA}</h2>
                </div>
            </div> -->
            <pdAdded :listPdAdded="system.pdAdded"></pdAdded>
        </div>
    </div>
</template>

<script>
import pdAdded from '@/views/pd/Elements/PdAdded'
import loading from '@/components/Loading'
import error from '@/components/Error'

export default {
    name: 'AddEditPD',
    components: {
        loading,
        error,
        pdAdded
    },
    data() {
        return {
            system: {
                loading: true,
                error: false,
                updated: false,
                nroprog: null,
                isAdd: true,
                operation: '',
                pdAdded: []
            },
            ultnro: -1,
            addUltimoNroPD: false,
            params: {
                NROPROG: this.$route.params.nroprog,
                DIA: this.$route.params.dia,
                MES: this.$route.params.mes,
                ANHO: this.$route.params.anho
            },
            pd: {
                LOCAL: null,
                CIRCUITO: null,
                EQUIPO: null,
                NROPROG: null,
                PDTRASMI: null,
                PDFECHA: null,
                HORATRAS: '0:00:00',
                ESTADO: null,
                SUSMOD: null,
                TRABAJO: null,
                RESPONSABLE: null,
                OBSERVACION: null,
                JEFATURA: null,
                NRO_REC: null,
                FECHA_REC: null,
                RECIBIDO: null,
                RESULTADO: null
            },
            pdTrabajos: [],
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
        async ultNroFunc(){
            try {
                if(this.addUltimoNroPD){
                    // guaradar el numero anterior
                    this.system.nroprog = this.pd.NROPROG
                    
                    // cambiar al ultimo numero
                    this.pd.NROPROG = this.ultnro
                }else{
                    // cambiamos al numero guardado
                    this.pd.NROPROG = this.system.nroprog
                }

            } catch (error) {
                console.log(error)
            }
        },
        agregarTrabajo(){
            this.pdTrabajos.push({
                NROPROG: null,
                PDFECHA: null,
                FECHATRA: null,
                HORAINI: '0:00:00',
                HORAFIN: '0:00:00'
            })
            // console.log(this.pdTrabajos)
        },
        quitarTrabajo(index){
            this.pdTrabajos.splice(index, 1)
        },
        async filtroLocal(){
            this.list.localesSubConjunto = []

            if(this.pd.LOCAL != ''){
                let cont = 0
                for(let i = 0; i < this.list.locales.length; i++){
                    if(cont < this.list.cantidadMostrar){
                        if(this.list.locales[i].includes(this.pd.LOCAL)){
                            this.list.localesSubConjunto.push(this.list.locales[i])
                            cont++
                        }
                    }
                }

                try {
                    // lista circuito
                    const circuitoDB = await this.axios.post(`/eq23kvCircuitoPorLocal/${this.pd.LOCAL}`)
                    if(!circuitoDB.data.codigo.includes('Error')){
                        this.list.circuito = await circuitoDB.data.respuesta

                        if(this.list.circuito.length != 0){
                            // pushs los n primeros
                            this.list.circuitoSubConjunto = []
                            for(let i = 0; i < this.list.cantidadMostrar; i++){
                                this.list.circuitoSubConjunto.push(this.list.circuito[i])
                            }
                        }else{
                            this.pd.CIRCUITO = ''
                            this.pd.EQUIPO = ''
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
                this.pd.CIRCUITO = ''
                this.pd.EQUIPO = ''
                this.list.circuitoSubConjunto = []
                this.list.equipoSubConjunto = []

                for(let i = 0; i < this.list.cantidadMostrar; i++){
                    this.list.localesSubConjunto.push(this.list.locales[i])
                }
            }
        },
        async filtroCircuito(){
            this.list.circuitoSubConjunto = []

            if(this.pd.CIRCUITO != ''){
                let cont = 0
                for(let i = 0; i < this.list.circuito.length; i++){
                    if(cont < this.list.cantidadMostrar){
                        if(this.list.circuito[i].includes(this.pd.CIRCUITO)){
                            this.list.circuitoSubConjunto.push(this.list.circuito[i])
                            cont++
                        }
                    }
                }

                // lista equipo
                const equipoDB = await this.axios.post(`/eq23kvEquipoPorLocalCircuito/${this.pd.LOCAL}/${this.pd.CIRCUITO}`)
                
                if(!equipoDB.data.codigo.includes('Error')){
                    this.list.equipo = await equipoDB.data.respuesta

                    if(this.list.equipo.length != 0){
                        // pushs los n primeros
                        this.list.equipoSubConjunto = []
                        for(let i = 0; i < this.list.cantidadMostrar; i++){
                            this.list.equipoSubConjunto.push(this.list.equipo[i])
                        }
                    }else{
                        this.pd.EQUIPO = ''
                        this.list.equipoSubConjunto = []
                    }
                } else {
                    this.alternarAlertaVisible(true)
                    this.mensaje.color = 'alert-danger'
                    this.mensaje.titulo = 'Hubo un problema'
                    this.mensaje.msg = equipoDB.data.mensaje
                }

            }else{
                this.pd.EQUIPO = ''
                this.list.equipoSubConjunto = []

                if(this.pd.LOCAL != ''){
                    for(let i = 0; i < this.list.cantidadMostrar; i++){
                        this.list.circuitoSubConjunto.push(this.list.circuito[i])
                    }
                }
            }
        },
        filtroEquipo(){
            this.list.equipoSubConjunto = []

            if(this.pd.EQUIPO != ''){
                let cont = 0
                for(let i = 0; i < this.list.equipo.length; i++){
                    if(cont < this.list.cantidadMostrar){
                        if(this.list.equipo[i].includes(this.pd.EQUIPO)){
                            this.list.equipoSubConjunto.push(this.list.equipo[i])
                            cont++
                        }
                    }
                }
            }else{
                if(this.pd.LOCAL != '' && this.pd.CIRCUITO != ''){
                    for(let i = 0; i < this.list.cantidadMostrar; i++){
                        this.list.equipoSubConjunto.push(this.list.equipo[i])
                    }
                }
            }
        },
        async actionPD(){
            console.log(this.system.operation === 'create' ? 'Agregar' : 'Editar')

            console.log('this.pd', this.pd)
            console.log('this.pdTrabajos', this.pdTrabajos)

            let pdAux = JSON.parse(JSON.stringify(this.pd))
            let pdTrabajosAux = JSON.parse(JSON.stringify(this.pdTrabajos))
            
            console.log('pdAux', pdAux)
            console.log('pdTrabajosAux', pdTrabajosAux)

            let conversion = this.trimAndConversion(pdAux, pdTrabajosAux)
            
            console.log('conversion', conversion)
            
            pdAux = conversion.pddatos
            pdTrabajosAux = conversion.pd

            console.log('pdAux', pdAux)
            console.log('pdTrabajosAux', pdTrabajosAux)

            if(!!pdAux.NROPROG && !!pdAux.PDFECHA){
                
                if(this.verificacionDeCaracteres(pdAux.LOCAL)
                    && this.verificacionDeCaracteres(pdAux.CIRCUITO)
                    && this.verificacionDeCaracteres(pdAux.EQUIPO)
                    && this.verificacionDeCaracteres(pdAux.NROPROG)
                    && this.verificacionDeCaracteres(pdAux.NRO_REC))
                {
                    try {
                        
                        this.mensaje.lista = []
                        
                        if( this.system.operation === 'update' ){
                            const res = await this.axios.put(`/pdUpdate/${this.params.NROPROG}/${this.params.DIA}/${this.params.MES}/${this.params.ANHO}`, {pd: pdAux, pdTrabajos: pdTrabajosAux})

                            if(!res.data.codigo.includes('Error')) {
                                const jsonDataNew = JSON.parse(res.config.data)
                                this.mensaje.color = 'alert-success'
                                this.mensaje.titulo = 'Nuevo pedido'
                                this.mensaje.msg = res.data.mensaje
                                
                                this.mensaje.lista.push(jsonDataNew.pd.NROPROG)
                                this.mensaje.lista.push(jsonDataNew.pd.PDFECHA)

                                this.alternarAlertaVisible(true)

                                this.system.updated = true
                            } else {
                                this.alternarAlertaVisible(true)
                                this.mensaje.color = 'alert-danger'
                                this.mensaje.titulo = 'No se agrego el pedido'
                                this.mensaje.msg = res.data.mensaje
                            }
                        }else {
                            const res = await this.axios.post('/pdAdd', {pd: pdAux, pdTrabajos: pdTrabajosAux})
                        
                            if(!res.data.codigo.includes('Error')){
                                const jsonDataNew = JSON.parse(res.config.data)
                                this.mensaje.color = 'alert-success'
                                this.mensaje.titulo = 'Nuevo pedido'
                                this.mensaje.msg = res.data.mensaje
                                
                                this.mensaje.lista.push(jsonDataNew.pd.NROPROG)
                                this.mensaje.lista.push(jsonDataNew.pd.PDFECHA)

                                this.alternarAlertaVisible(true)

                                this.system.pdAdded.push({
                                    NROPROG: jsonDataNew.pd.NROPROG,
                                    PDFECHA: jsonDataNew.pd.PDFECHA,
                                })

                                this.pd = {
                                    LOCAL: null,
                                    CIRCUITO: null,
                                    EQUIPO: null,
                                    NROPROG: null,
                                    PDTRASMI: null,
                                    PDFECHA: null,
                                    HORATRAS: '0:00:00',
                                    ESTADO: null,
                                    SUSMOD: null,
                                    TRABAJO: null,
                                    RESPONSABLE: null,
                                    OBSERVACION: null,
                                    JEFATURA: null,
                                    NRO_REC: null,
                                    FECHA_REC: null,
                                    RECIBIDO: null,
                                    RESULTADO: null
                                }

                                this.pdTrabajos = []
                            } else {
                                this.alternarAlertaVisible(true)
                                this.mensaje.color = 'alert-danger'
                                this.mensaje.titulo = 'No se agrego el pedido'
                                this.mensaje.msg = res.data.mensaje
                            }
                        }

                    } catch (error) {
                        console.log('error', error)
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
        redirectPD(){
            this.$router.push('/pd')
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
        trimAndConversion(pddatosDatos, pdDatos){
            let pddatos = JSON.parse(JSON.stringify(pddatosDatos))
            let pd = JSON.parse(JSON.stringify(pdDatos))

            pddatos.LOCAL = pddatos.LOCAL ? this.trim(pddatos.LOCAL) : null
            pddatos.CIRCUITO = pddatos.CIRCUITO ? this.trim(pddatos.CIRCUITO) : null
            pddatos.EQUIPO = pddatos.EQUIPO ? this.trim(pddatos.EQUIPO) : null
            pddatos.NROPROG = pddatos.NROPROG ? parseInt(this.trim(pddatos.NROPROG)) : null
            pddatos.PDTRASMI = pddatos.PDTRASMI ? this.trim(pddatos.PDTRASMI) : null
            pddatos.PDFECHA = pddatos.PDFECHA ? this.trim(pddatos.PDFECHA) : null
            pddatos.HORATRAS = pddatos.HORATRAS ? this.trim(pddatos.HORATRAS) : null
            pddatos.ESTADO = pddatos.ESTADO ? this.trim(pddatos.ESTADO) : null
            pddatos.SUSMOD = pddatos.SUSMOD ? this.trim(pddatos.SUSMOD) : null
            pddatos.TRABAJO = pddatos.TRABAJO ? this.trim(pddatos.TRABAJO) : null
            pddatos.RESPONSABLE = pddatos.RESPONSABLE ? this.trim(pddatos.RESPONSABLE) : null
            pddatos.OBSERVACION = pddatos.OBSERVACION ? this.trim(pddatos.OBSERVACION) : null
            pddatos.JEFATURA = pddatos.JEFATURA ? this.trim(pddatos.JEFATURA) : null
            pddatos.NRO_REC = pddatos.NRO_REC ? parseInt(this.trim(pddatos.NRO_REC)) : null
            pddatos.FECHA_REC = pddatos.FECHA_REC ? this.trim(pddatos.FECHA_REC) : null
            pddatos.RECIBIDO = pddatos.RECIBIDO ? this.trim(pddatos.RECIBIDO) : null
            pddatos.RESULTADO = pddatos.RESULTADO ? this.trim(pddatos.RESULTADO) : null

            for (let i = 0; i < pd.length; i++) {
                const element = pd[i];
                
                pd[i].NROPROG = this.trim(pddatos.NROPROG) ? parseInt(this.trim(pddatos.NROPROG)) : null
                pd[i].PDFECHA = this.trim(pddatos.PDFECHA) ? this.trim(pddatos.PDFECHA) : null
                pd[i].FECHATRA = element.FECHATRA ? this.trim(element.FECHATRA) : null
                pd[i].HORAINI = element.HORAINI ? this.trim(element.HORAINI) : null
                pd[i].HORAFIN = element.HORAFIN ? this.trim(element.HORAFIN) : null
            }

            return {
                pddatos,
                pd
            }
        },
        trim(trim){
            return trim.toString().trim()
        },
    },
    async mounted(){
        try {
            if( window.location.pathname.split('/')[2] == 'agregarPd-aTratar') {
                this.system.operation = 'create'
            } else if ( window.location.pathname.split('/')[2] == 'editarPd-aTratar' ) {
                this.system.operation = 'update'
            } else {
                this.system.operation = 'read'
            }
            
            let ultnro
            let localesDB

            if (this.system.operation != 'read') {
                // ultimo numero
                ultnro = await this.axios.post('/general/ultimoNumero')
                this.ultnro = ultnro.data.ultnro + 1

                // lista locales
                localesDB = await this.axios.post('/locales')
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

            if ( this.system.operation === 'update' || this.system.operation === 'read') {
                // obtenemos los datos a modificar
                let aux = await this.axios.post('/pdOne/' + this.params.NROPROG + '/' + this.params.DIA + '/' + this.params.MES + '/' + this.params.ANHO)
                if(!aux.data.codigo.includes('Error')){
                    this.pd = aux.data.respuesta[0]

                    // CONVERTIR LAS FECHAS PARA QUE RECONOZCA EL CALENDARIO
                    if(this.pd.PDFECHA){
                        this.pd.PDFECHA = this.pd.PDFECHA.substring(0, 10)
                    }

                    if(this.pd.FECHA_REC){
                        this.pd.FECHA_REC = this.pd.FECHA_REC.substring(0, 10)
                    }
                } else {
                    this.system.error = true
                    console.log(aux.data.respuesta)
                }

                aux = await this.axios.post('/pdOneTrabajos/' + this.params.NROPROG + '/' + this.params.DIA + '/' + this.params.MES + '/' + this.params.ANHO)
                if(!aux.data.codigo.includes('Error')){
                    this.pdTrabajos = aux.data.respuesta

                    // CONVERTIR LAS FECHAS PARA QUE RECONOZCA EL CALENDARIO
                    for (let i = 0; i < this.pdTrabajos.length; i++) {
                        const element = this.pdTrabajos[i];
                        
                        if(this.pdTrabajos[i].PDFECHA){
                            this.pdTrabajos[i].PDFECHA = element.PDFECHA.substring(0, 10)
                        }
                        if(this.pdTrabajos[i].FECHATRA){
                            this.pdTrabajos[i].FECHATRA = element.FECHATRA.substring(0, 10)
                        }

                    }
                } else {
                    this.system.error = true
                    console.log(aux.data.respuesta)
                }

                // guardamos el numero actual de nroprog
                this.system.nroprog = parseInt(this.pd.NROPROG)

                for (let i = 0; i < this.pdTrabajos.length; i++) {
                    if(this.pd.PDFECHA){
                        this.pdTrabajos[i].PDFECHA = this.pd.PDFECHA
                    }
                    if(this.pdTrabajos[i].FECHATRA){
                        this.pdTrabajos[i].FECHATRA = this.pdTrabajos[i].FECHATRA.substring(0, 10)
                    }
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