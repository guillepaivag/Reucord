<template>
    <div class="container">

        <div class="row mt-3 mb-3">
            <div class="col-xl-4">
                <label for="" class="mt-3">Fecha desde:</label>
                <br>
                <b-calendar 
                    block 
                    v-model="fechaDesde" 
                    locale="es-ES"
                ></b-calendar>
                
            </div>
            <div class="col-xl-4">
                <label for="" class="mt-3">Fecha hasta:</label>
                <br>
                <b-calendar 
                    block 
                    v-model="fechaHasta" 
                    locale="es-ES"
                ></b-calendar>

            </div>
            <div class="col-xl-4">
                <label for="" class="mt-3">Local:</label>
                <b-form-input 
                    list="my-list-id" 
                    v-on:keyup="filtroLocal()" 
                    v-model="input.local" 
                    placeholder="Local"
                ></b-form-input>

                <datalist id="my-list-id">
                    <option v-for="local in list.localesSubConjunto">{{ local }}</option>
                </datalist>

                <label for="" class="mt-3">Circuito:</label>
                <b-form-input 
                    list="listCir" 
                    v-on:keyup="filtroCircuito()" 
                    v-model="input.circuito" 
                    required 
                    :disabled="!list.circuitoSubConjunto.length"
                    placeholder="Circuito">
                </b-form-input>

                <datalist id="listCir">
                    <option v-for="circuito in list.circuito">{{ circuito }}</option>
                </datalist>

                <label for="" class="mt-3">Equipo:</label>
                <b-form-input 
                    list="listEq" 
                    v-on:keyup="filtroEquipo()" 
                    v-model="input.equipo" 
                    required 
                    :disabled="!list.equipoSubConjunto.length"
                    placeholder="Equipo">
                </b-form-input>

                <datalist id="listEq">
                    <option v-for="equipo in list.equipo">{{ equipo }}</option>
                </datalist>

                <div class="mt-4">
                    <b-button
                        variant="outline-dark"
                        block 
                        :disabled="!fechaDesde || !fechaHasta"
                        v-on:click="buscarTrabajos"
                    >
                        Buscar trabajos
                    </b-button>
                </div>

            </div>
        </div>

        <hr class="mt-5 mb-5">

        <table class="table table-hover table-responsive-xl mt-3">
            <thead>
                <tr>             
                    <th scope="col">Fecha/Reunion año</th>
                    <th scope="col">Número Reunión (PS)</th>
                    <th scope="col">Numero/Item</th>
                    <th scope="col">Fecha de trabajo</th>
                    <th scope="col">Hora desde</th>
                    <th scope="col">Hora hasta</th>
                    <th scope="col">Ver programación</th>
                </tr>
            </thead>
            <tbody>
                <tr 
                    class="table-secondary text-center" 
                    v-for="(trabajo, index) in listaTrabajos" :key="index"
                >
                    <th>{{ esPedidoDispobibilidad(trabajo) ? trabajo.PDFECHA.substr(0, 10) : trabajo.REUFECHA }}</th>
                    <th>{{ esPedidoDispobibilidad(trabajo) ? null : trabajo.REUNRO }}</th>
                    <th>{{ esPedidoDispobibilidad(trabajo) ? trabajo.NROPROG : trabajo.ITEM }}</th>
                    <th>{{ esPedidoDispobibilidad(trabajo) ? trabajo.FECHATRA.substr(0, 10) : trabajo.FECHATRABA.substr(0, 10) }}</th>
                    <th>{{ esPedidoDispobibilidad(trabajo) ? trabajo.HORAINI : trabajo.HORADESDE }}</th>
                    <th>{{ esPedidoDispobibilidad(trabajo) ? trabajo.HORAFIN : trabajo.HORAHASTA }}</th>
                    <th>
                        <b-button 
                            variant="outline-primary"
                            :to="obtenerLinkProgramacion(trabajo)"
                            target= '_blank'
                        >
                            Ver datos
                        </b-button>
                    </th>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    name: '',
    data() {
        return {
            input: {
                local: '',
                circuito: '',
                equipo: '',
            },
            list: {
                cantidadMostrar: 5,
                locales: [],
                localesSubConjunto: [],
                circuito: [],
                circuitoSubConjunto: [],
                equipo: [],
                equipoSubConjunto: []
            },
            fechaDesde: '',
            fechaHasta: '',
            listaTrabajos: []
        }
    },
    methods: {
        async filtroLocal(){
            this.list.localesSubConjunto = []

            if(this.input.local != ''){
                let cont = 0
                for(let i = 0; i < this.list.locales.length; i++){
                    if(cont < this.list.cantidadMostrar){
                        if(this.list.locales[i].includes(this.input.local)){
                            this.list.localesSubConjunto.push(this.list.locales[i])
                            cont++
                        }
                    }
                }

                try {
                    // lista circuito
                    this.list.circuito = await this.$store.dispatch('listaCircuitoPorLocal', {
                        local: this.input.local
                    }) ?? []
                    
                    if(this.list.circuito.length != 0){
                        // pushs los n primeros
                        this.list.circuitoSubConjunto = []
                        for(let i = 0; i < this.list.cantidadMostrar; i++){
                            this.list.circuitoSubConjunto.push(this.list.circuito[i])
                        }
                    }else{
                        this.input.circuito = ''
                        this.input.equipo = ''
                        this.list.circuitoSubConjunto = []
                        this.list.equipoSubConjunto = []
                    }
                    
                } catch (error) {
                    console.log(error)
                }

            }else{
                this.input.circuito = ''
                this.input.equipo = ''
                this.list.circuitoSubConjunto = []
                this.list.equipoSubConjunto = []

                for(let i = 0; i < this.list.cantidadMostrar; i++){
                    this.list.localesSubConjunto.push(this.list.locales[i])
                }
            }
        },
        async filtroCircuito(){
            this.list.circuitoSubConjunto = []

            if(this.input.circuito != ''){
                let cont = 0
                for(let i = 0; i < this.list.circuito.length; i++){
                    if(cont < this.list.cantidadMostrar){
                        if(this.list.circuito[i].includes(this.input.circuito)){
                            this.list.circuitoSubConjunto.push(this.list.circuito[i])
                            cont++
                        }
                    }
                }

                // lista equipo
                this.list.equipo = await this.$store.dispatch('listaEquipoPorLocalCircuito', {
                    local: this.input.local,
                    circuito: this.input.circuito
                }) ?? []
                
                if(this.list.equipo.length != 0){
                    // pushs los n primeros
                    this.list.equipoSubConjunto = []
                    for(let i = 0; i < this.list.cantidadMostrar; i++){
                        this.list.equipoSubConjunto.push(this.list.equipo[i])
                    }
                }else{
                    this.input.equipo = ''
                    this.list.equipoSubConjunto = []
                }

            }else{
                this.input.equipo = ''
                this.list.equipoSubConjunto = []

                if(this.input.local != ''){
                    for(let i = 0; i < this.list.cantidadMostrar; i++){
                        this.list.circuitoSubConjunto.push(this.list.circuito[i])
                    }
                }
            }
        },
        filtroEquipo(){
            this.list.equipoSubConjunto = []

            if(this.input.equipo != ''){
                let cont = 0
                for(let i = 0; i < this.list.equipo.length; i++){
                    if(cont < this.list.cantidadMostrar){
                        if(this.list.equipo[i].includes(this.input.equipo)){
                            this.list.equipoSubConjunto.push(this.list.equipo[i])
                            cont++
                        }
                    }
                }
            }else{
                if(this.input.local != '' && this.input.circuito != ''){
                    for(let i = 0; i < this.list.cantidadMostrar; i++){
                        this.list.equipoSubConjunto.push(this.list.equipo[i])
                    }
                }
            }
        },
        async buscarTrabajos () {
            try {
                this.listaTrabajos = []
                
                const fechaDesde = this.fechaDesde
                const fechaHasta = this.fechaHasta
                const opciones = {}

                this.input.local ? opciones.local = this.input.local : ''
                this.input.circuito ? opciones.circuito = this.input.circuito : ''
                this.input.equipo ? opciones.equipo = this.input.equipo : ''

                console.log('data', {
                    fechaDesde, fechaHasta, opciones
                })

                const {
                    listaTrabajosPs,
                    listaTrabajosPd,
                } = await this.$store.dispatch('trabajosPorRangoDeTiempo', {
                    fechaDesde, fechaHasta, opciones
                })

                this.listaTrabajos.push(...listaTrabajosPs)
                this.listaTrabajos.push(...listaTrabajosPd)

                console.log('this.listaTrabajos', this.listaTrabajos)
            } catch (error) {
                console.log(error)
            }
        },
        esPedidoDispobibilidad ( trabajo ) {
            return !!trabajo.PDFECHA
        },
        obtenerLinkProgramacion ( trabajo ) {
            if ( this.esPedidoDispobibilidad(trabajo) ) {
                
                const pdFecha = new Date( `${trabajo.PDFECHA.substring(0,10)}T13:00:00.000Z` )

                const NROPROG = trabajo.NROPROG
                const PDFECHA = pdFecha.toISOString().substr(0, 10)
                const DAY = pdFecha.getDate()
                const MONTH = pdFecha.getMonth()+1
                const YEAR = pdFecha.getFullYear()

                return `/pd/verPd-aTratar/${NROPROG}/${DAY}/${MONTH}/${YEAR}`
            }

            const REUFECHA = trabajo.REUFECHA
            const REUNRO = trabajo.REUNRO
            const ITEM = trabajo.ITEM

            return `/ps/verPs-aTratar/${REUFECHA}/${REUNRO}/${ITEM}`
        }
    },
    async created() {
        try {
            // lista locales
            this.list.locales = await this.$store.dispatch('listaLocales') ?? []
            
            // pushs los n primeros
            for(let i = 0; i < this.list.cantidadMostrar; i++){
                this.list.localesSubConjunto.push(this.list.locales[i])
            }

        } catch (error) {
            
        }
    },
    computed: {
        
    }
}
</script>

<style>

</style>