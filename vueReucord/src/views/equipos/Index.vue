<template>
    <div>
        <div v-if="system.loading">
            <loading></loading>
        </div>
        
        <div v-else-if="system.error">
            <error></error>
        </div>
        <div class="container" v-else>
            <hr class="mt-4">
            <div class="row mb-3">
                <div class="col-md-8">
                    <label class="mt-2" for="">Local:</label>
                    <input type="text" 
                    name="local"
                    v-on:keyup="filtro()"
                    v-model="eq23kv.LOCAL" 
                    class="form-control" 
                    placeholder="Local">

                    <label class="mt-3" for="">Circuito:</label>
                    <input type="text" 
                    name="circuito"
                    v-on:keyup="filtro()"
                    v-model="eq23kv.CIRCUITO" 
                    class="form-control" 
                    placeholder="Circuito">

                    <label class="mt-3" for="">Equipo:</label>
                    <input type="text" 
                    name="equipo"
                    v-on:keyup="filtro()"
                    v-model="eq23kv.EQUIPO" 
                    class="form-control" 
                    placeholder="Equipo">

                    <label class="mt-3" for="">Barra:</label>
                    <input type="text"
                    name="barra"
                    v-on:keyup="filtro()"
                    v-model="eq23kv.BARRA" 
                    class="form-control" 
                    placeholder="Barra">

                    <hr>

                    <label for="">La busqueda se hace mientras escribe.</label>
                </div>
                <div class="col-md-4">
                    <router-link
                        class="btn btn-outline-primary btn-block mt-3"
                        to="/equipos/agregarEquipo"
                    >Agregar un equipo</router-link>

                    <b-button 
                        class="btn btn-outline-primary btn-block mt-3"
                        v-b-toggle.sidebar-backdrop
                    >Ver herramientas</b-button>

                    <b-button 
                        class="btn btn-outline-primary btn-block mt-3"
                        to="/equipos/analisis"
                    >Analisis de equipos</b-button>

                    <b-sidebar
                    id="sidebar-backdrop"
                    title="EQ23KV"
                    backdrop
                    shadow
                    >
                        <div class="container">
                            <hr>
                            <label for="">Vista de datos:</label>
                            <b-button 
                                class="btn btn-outline-primary btn-block"
                                v-on:click="mostrarTodo"
                            >Mostrar todo</b-button>
                            <hr>
                            <label for="idNombreExcelEquipo">Generador de excel:</label>
                            <input type="text" id="idNombreExcelEquipo" class="form-control mb-3" v-model="nombreExcel" placeholder="Nombre de excel">
                            <b-button 
                                class="btn btn-outline-primary btn-block"
                                v-on:click="exportExcel"
                            >Generar excel</b-button>
                            <label for="" v-if="!nombreExcel" class="mt-3">Agregar un nombre para exportar el excel.</label>
                            <hr>
                            <!-- <label for="">Ordenaciones:</label>
                            <br>
                             <span class="mt-2">Tipo de ordenación: </span>
                            <select v-model="tipoOrd" class="mt-3 mb-4">
                                <option>Ascendente</option>
                                <option>Descendente</option>
                            </select> 
                            <b-button 
                                class="btn btn-outline-primary btn-block"
                                v-on:click="sort('LOCAL')"
                            >Ordenar por local</b-button>
                            <b-button 
                                class="btn btn-outline-primary btn-block mt-3"
                                v-on:click="sort('CIRCUITO')"
                            >Ordenar por circuito</b-button>
                            <b-button 
                                class="btn btn-outline-primary btn-block mt-3"
                                v-on:click="sort('EQUIPO')"
                            >Ordenar por equipo</b-button>
                            <b-button 
                                class="btn btn-outline-primary btn-block mt-3"
                                v-on:click="sort('BARRA')"
                            >Ordenar por barra</b-button> -->
                        </div>
                    </b-sidebar>
                </div>
            </div>
            
            <hr>

            <div class="mt-3">
                <div class="row">
                    <div class="col-md-3">
                        <label for="nroDatosPorPag" class="mr-1">Número por paginas: </label>
                        <input type="number" class="form-control" id="nroDatosPorPag" v-model="perPage" placeholder="Número por paginas">
                    </div>
                    <div class="col-md-7">
                        <b-pagination
                            v-model="currentPage"
                            :total-rows="totalRow"
                            :per-page="perPage"
                        ></b-pagination>
                    </div>
                    <div class="col-md-2" v-if="totalRow == 1">Hay {{totalRow}} dato</div>
                    <div class="col-md-2" v-else>Hay {{totalRow}} datos</div>
                    
                </div>

                <table class="table table-hover table-responsive-xl mt-3">
                <thead>
                    <tr>
                    <th scope="col">N°</th>
                    <th scope="col">LOCAL</th>
                    <th scope="col">CIRCUITO</th>
                    <th scope="col">EQUIPO</th>
                    <th scope="col">BARRA</th>
                    <th scope="col">ACCIONES</th>
                    </tr>
                </thead>
                    <tbody>
                        <tr class="table-secondary" 
                            v-for="(dato, index) in datos" :key="index"
                        >
                            <th scope="row">{{index+getStart()+1}}</th>
                            <th>{{dato.LOCAL}}</th>
                            <td>{{dato.CIRCUITO}}</td>
                            <td>{{dato.EQUIPO}}</td>
                            <td>{{dato.BARRA}}</td>
                            <td>
                                <button type="button" class="btn btn-outline-info btn-block" @click="cargarDatos(datos[index], index)">Cargar datos</button>
                                <button type="button" class="btn btn-outline-primary btn-block" @click="showModalVista(datos[index], index)">Ver datos</button>
                                <button class="btn btn-outline-success btn-block" v-on:click="goToEditEq23kv(dato)">Editar</button>
                                <button type="button" id="show-btn" @click="showModal(datos[index], index)" class="btn btn-outline-danger btn-block">Eliminar</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <b-modal ref="equipoVista" hide-footer title="Validación">
                    <div class="d-block text-center">
                        <h3>Equipo</h3>
                    </div>
                    <hr>
                        <ul>
                            <li>
                                Local: {{eq23kvAux.LOCAL}}
                            </li>
                            <li>
                                Circuito: {{eq23kvAux.CIRCUITO}}
                            </li>
                            <li>
                                Equipo: {{eq23kvAux.EQUIPO}}
                            </li>
                            <li>
                                Barra: {{eq23kvAux.BARRA}}
                            </li>
                        </ul>
                    <hr>
                    <div class="container">
                        <b-button class="mt-2" variant="outline-success" block @click="hideModalVista">Volver</b-button>
                    </div>
                </b-modal>
                <b-modal ref="my-modal" hide-footer title="Validación">
                    <div class="d-block text-center">
                        <p class="h2">{{eq23kvAux.LOCAL}}</p>
                    </div>
                    <hr>
                    Escriba el local para eliminar:
                    <input type="text" v-model="eq23kvAux.confirmacionEliminacion" class="form-control mt-2" placeholder="LOCAL">
                    <hr>
                    <div class="container">
                        <div class="row">
                            <div class="col-md-6">
                                <b-button class="mt-2" variant="outline-primary" v-if="validacionEliminacion" block @click="eliminarEquipo()">Eliminar</b-button>
                            </div>
                            <div class="col-md-6">
                                <b-button class="mt-2" variant="outline-danger" block @click="hideModal">Cancelar</b-button>
                            </div>
                        </div>
                    </div>
                </b-modal>
                <b-pagination
                    v-model="currentPage"
                    :total-rows="totalRow"
                    :per-page="perPage"
                    style="float: right;"
                ></b-pagination>
            </div>
        </div>
        
    </div>
</template>

<script>
import loading from '@/components/Loading'
import error from '@/components/Error'
import XLSX from 'xlsx'

export default {
    name: 'equipos',
    data() {
        return {
            system: {
                loading: true,
                error: false,
            },
            tipoOrd: 'Ascendente',
            nombreExcel: '',
            eq23kv: {
                LOCAL: '',
                CIRCUITO: '',
                EQUIPO: '',
                BARRA: ''
            },
            eq23kvAux: {
                LOCAL: '',
                CIRCUITO: '',
                EQUIPO: '',
                BARRA: '',
                confirmacionEliminacion: '',
                indexEquipo: 0
            },
            datos: [],
            datosOp: [],
            datosTotal: [],
            currentPage: 1,
            perPage: 10
        }
    },
    components: {
        loading,
        error
    },
    methods: {
        getStart(){
            if(this.currentPage == 1){
                return 0
            }else{
                return this.perPage*(this.currentPage-1)
            }
        },
        getEnd(){
            return this.perPage*this.currentPage-1
        },
        cargarDatos(dato, index){
            this.eq23kv = {
                LOCAL: dato.LOCAL,
                CIRCUITO: dato.CIRCUITO,
                EQUIPO: dato.EQUIPO,
                BARRA: dato.BARRA
            }
        },
        actualizarDatos(){
            this.datos = []
            for(let i = this.getStart(); (i <= this.getEnd()) && (i < this.datosOp.length); i++){
                this.datos.push(this.datosOp[i])
            }
        },
        async mostrarTodo(){
            try {
                const res = await this.axios.post('/eq23kv')
                if(!res.data.codigo.includes('Error')){
                    this.datosTotal = res.data.respuesta
                    this.datosOp = this.datosTotal
                } else {
                    console.log(res.data.mensaje)
                    console.log(res.data.respuesta)
                    this.system.error = true
                }
            } catch (error) {
                console.log(error)
            }
        },
        filtro(){
            this.datosOp = []
            let contiene = []
            if(!(this.eq23kv.LOCAL || 
                this.eq23kv.CIRCUITO || 
                this.eq23kv.EQUIPO || 
                this.eq23kv.BARRA)
            ){
                this.mostrarTodo()
            }else{
                for(let i = 0; i < this.datosTotal.length; i++){
                    let dt = this.datosTotal[i]
                    contiene = []

                    if(this.eq23kv.LOCAL){
                        if(dt.LOCAL){
                            if(dt.LOCAL.includes(this.eq23kv.LOCAL)){
                                contiene.push(1)
                            }else{
                                contiene.push(-1)
                            }
                        }
                    }else{
                        contiene.push(0)
                    }

                    if(this.eq23kv.CIRCUITO){
                        if(dt.CIRCUITO){
                            if(dt.CIRCUITO.includes(this.eq23kv.CIRCUITO)){
                                contiene.push(1)
                            }else{
                                contiene.push(-1)
                            }
                        }
                    }else{
                        contiene.push(0)
                    }

                    if(this.eq23kv.EQUIPO){
                        if(dt.EQUIPO){
                            if(dt.EQUIPO.includes(this.eq23kv.EQUIPO)){
                                contiene.push(1)
                            }else{
                                contiene.push(-1)
                            }
                        }
                    }else{
                        contiene.push(0)
                    }

                    if(this.eq23kv.BARRA){
                        if(dt.BARRA){
                            if(dt.BARRA.includes(this.eq23kv.BARRA)){
                                contiene.push(1)
                            }else{
                                contiene.push(-1)
                            }
                        }
                    }else{
                        contiene.push(0)
                    }

                    if(!(contiene[0] == -1 || contiene[1] == -1 || contiene[2] == -1 || contiene[3] == -1)){
                        if(contiene[0] == 1 || contiene[1] == 1 || contiene[2] == 1 || contiene[3] == 1){
                            this.datosOp.push(dt)
                        }
                    }
                }
            }
        },
        showModal(dato, index) {
            this.indexEquipo = index
            this.eq23kvAux.confirmacionEliminacion = ''
            this.eq23kvAux.LOCAL = dato.LOCAL
            this.eq23kvAux.CIRCUITO = dato.CIRCUITO
            this.eq23kvAux.EQUIPO = dato.EQUIPO
            this.eq23kvAux.BARRA = dato.BARRA
            this.$refs['my-modal'].show()
        },
        hideModal() {
            this.$refs['my-modal'].hide()
        },
        showModalVista(dato, index) {
            this.indexEquipo = index
            this.eq23kvAux.LOCAL = dato.LOCAL
            this.eq23kvAux.CIRCUITO = dato.CIRCUITO
            this.eq23kvAux.EQUIPO = dato.EQUIPO
            this.eq23kvAux.BARRA = dato.BARRA
            this.$refs['equipoVista'].show()
        },
        hideModalVista() {
            this.$refs['equipoVista'].hide()
        },
        async eliminarEquipo(){
            try {
                const res = await this.axios.delete(`/eq23kvDelete/${this.eq23kvAux.LOCAL}/${this.eq23kvAux.CIRCUITO}/${this.eq23kvAux.EQUIPO}`)
                if(!res.data.codigo.includes('Error')){
                    console.log(res)
                    this.hideModal()
                    this.mostrarTodo()
                    // this.datosTotal.splice(this.indexEquipo, 1)
                    // this.datosOp = this.datosTotal
                    this.actualizarDatos()
                } else {
                    console.log('Problemas al eliminar')
                }
                
            } catch (error) {
                console.log(error)
            }
        },
        goToEditEq23kv(eq23kv){
            // this.setEquipo({
            //     local: eq23kv.LOCAL,
            //     circuito: eq23kv.CIRCUITO,
            //     equipo: eq23kv.EQUIPO,
            //     barra: eq23kv.BARRA
            // })
            // this.$router.push('/equipos/modificarEquipo')
            this.$router.push({name: 'Equipos.Edit', params: {
                local: eq23kv.LOCAL,
                circuito: eq23kv.CIRCUITO,
                equipo: eq23kv.EQUIPO
            }})
        },
        exportExcel: function () {
            if(this.nombreExcel){
                let data = XLSX.utils.json_to_sheet(this.datosOp)
                const workbook = XLSX.utils.book_new()
                const filename = this.nombreExcel
                XLSX.utils.book_append_sheet(workbook, data, filename)
                XLSX.writeFile(workbook, `${filename}.xlsx`)
            }else{

            }
        },
        sort(sortFor){
            // let upward = this.tipoOrd === 'Ascendente'
            // var len  = this.datosOp.length
            // var gapSize =  Math.floor(len/2)
        
            // while(gapSize > 0){
            //     for(var i = gapSize; i < len; i++) {
        
            //         var temp = this.datosOp[i]
            //         var j = i
        
            //         while(j >= gapSize && this.conditionUpward(this.datosOp[j - gapSize], temp, upward, sortFor)) {
            //             this.datosOp[j] = this.datosOp[j - gapSize]
            //             j -= gapSize
            //         }
            //         this.datosOp[j] = temp
            //     }
            //     gapSize = Math.floor(gapSize/2)
            // }

            // this.actualizarDatos()
        },
        conditionUpward(array, temp, upward, sortFor){
            // console.log('entro para cambio')
            // if(upward){
            //     if(sortFor === 'LOCAL'){
            //         return array.LOCAL > temp.LOCAL
            //     }else if(sortFor === 'CIRCUITO'){
            //         return array.CIRCUITO > temp.CIRCUITO
            //     }else if(sortFor === 'EQUIPO'){
            //         return array.EQUIPO > temp.EQUIPO
            //     }else if(sortFor === 'BARRA'){
            //         return array.BARRA > temp.BARRA
            //     }
                
            // }else{
            //     if(sortFor === 'LOCAL'){
            //         return array.LOCAL < temp.LOCAL
            //     }else if(sortFor === 'CIRCUITO'){
            //         return array.CIRCUITO < temp.CIRCUITO
            //     }else if(sortFor === 'EQUIPO'){
            //         return array.EQUIPO < temp.EQUIPO
            //     }else if(sortFor === 'BARRA'){
            //         return array.BARRA < temp.BARRA
            //     }
            // }
        }
    },
    async created() {
        try {
            const res = await this.axios.post('/eq23kv')
            if(!res.data.codigo.includes('Error')){
                this.datosTotal = res.data.respuesta
                this.datosOp = this.datosTotal
            } else {
                console.log(res.data.mensaje)
                console.log(res.data.respuesta)
                this.system.error = true
            }
        } catch (error) {
            this.system.error = true
            console.log(error)
        } finally {
            this.system.loading = false
        }
    },
    beforeUpdate() {
        this.actualizarDatos()
    },
    computed: {
        totalRow() {
            return this.datosOp.length
        },
        validacionEliminacion() {
            return this.eq23kvAux.confirmacionEliminacion == this.eq23kvAux.LOCAL
        }
    }
}
</script>

<style>

</style>