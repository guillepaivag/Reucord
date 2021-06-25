<template>
    <div class="container">
        <div v-if="system.loading">
            <loading></loading>
        </div>
        
        <div v-else-if="system.error">
            <error></error>
        </div>
        
        <div v-else>
            <div class="row mb-3 mt-3">
                <div class="col-md-8">
                    <div class="row">
                        <div class="col-md-6">
                            <label class="mt-2" for="">DMEDNRO:</label>
                            <input type="text" 
                            name="dmednro"
                            v-on:keyup="filtro()"
                            v-model="input.DMEDNRO" 
                            class="form-control" 
                            placeholder="DMEDNRO">
                        </div>
                        <div class="col-md-6">
                            <label class="mt-2" for="">LOCAL:</label>
                            <input type="text" 
                            name="local"
                            v-on:keyup="filtro()"
                            v-model="input.LOCAL" 
                            class="form-control" 
                            placeholder="LOCAL">
                        </div>
                    </div>

                    <hr>

                    <label class="" for="">Fecha:</label>
                    <div class="row">
                        <div class="col-md-4">
                            <label class="mt-2" for=""><i>DIA</i></label>
                            <input type="text" 
                            name="dia"
                            v-on:keyup="filtro()"
                            v-model="input.DIA" 
                            class="form-control" 
                            placeholder="DIA">
                        </div>
                        <div class="col-md-4">
                            <label class="mt-2" for=""><i>MES</i></label>
                            <input type="text" 
                            name="mes"
                            v-on:keyup="filtro()"
                            v-model="input.MES" 
                            class="form-control" 
                            placeholder="MES">
                        </div>
                        <div class="col-md-4">
                            <label class="mt-2" for=""><i>AÑO</i></label>
                            <input type="text"
                            name="anho"
                            v-on:keyup="filtro()"
                            v-model="input.ANHO" 
                            class="form-control" 
                            placeholder="AÑO">
                        </div>
                    </div>

                    <hr>

                    <label for="">La busqueda se hace mientras escribe.</label>
                </div>
                <div class="col-md-4">
                    <router-link
                        class="btn btn-outline-primary btn-block mt-3"
                        to="/reclamos/agregarReclamo"
                    >Agregar un reclamo</router-link>

                    <b-button 
                        class="btn btn-outline-primary btn-block mt-3"
                        v-b-toggle.sidebar-backdrop
                    >Ver herramientas</b-button>

                    <!-- <b-button 
                        class="btn btn-outline-primary btn-block mt-3"
                        to="/pd/analisis"
                    >Analisis de equipos</b-button> -->

                    <b-sidebar
                    id="sidebar-backdrop"
                    title="RECLAMOS"
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
                            <label for="idNombreExcelPd">Generador de excel:</label>
                            <input type="text" id="idNombreExcelPd" class="form-control mb-3" v-model="nombreExcel" placeholder="Nombre de excel">
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
                    <th scope="col">DMEDNRO</th>
                    <th scope="col">FECHA</th>
                    <th scope="col">LOCAL</th>
                    <th scope="col">ACCIONES</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="table-secondary" 
                        v-for="(dato, index) in datos" :key="index"
                    >
                        <th scope="row">{{index+getStart()+1}}</th>
                        <th>{{dato.DMEDNRO}}</th>
                        <td>{{ dato.FECHATRASM ? new Date(dato.FECHATRASM).toISOString().substring(0,10) : null }}</td>
                        <td>{{dato.LOCAL}}</td>
                        <td>
                            <button type="button" class="btn btn-outline-info btn-block" @click="cargarDatos(datos[index], index)">Cargar datos</button>
                            <button type="button" class="btn btn-outline-primary btn-block" @click="showModalVista(datos[index], index)">Ver datos</button>
                            <button class="btn btn-outline-success btn-block" v-on:click="goToEditReclamos(dato.DMEDNRO, dato.FECHATRASM)">Editar</button>
                            <button type="button" id="show-btn" @click="showModalElim(datos[index], index)" class="btn btn-outline-danger btn-block">Eliminar</button>
                            <!-- <button type="button" class="btn btn-outline-primary btn-block" @click="showModalVista(datos[index], index)">Ver datos</button> -->
                            <!-- <button class="btn btn-outline-success btn-block" v-on:click="equipoAddStore(dato)">Editar</button> -->
                            <!-- <button type="button" id="show-btn" @click="showModalElim(datos[index], index)" class="btn btn-outline-danger btn-block">Eliminar</button> -->
                        </td>
                    </tr>
                </tbody>
            </table>

            <b-modal ref="modalVistaReclamo" hide-footer title="Pedido de disponibilidad">
                <div class="d-block text-center">
                    <h3>Reclamos</h3>
                </div>
                <hr>
                    <ul>
                        <li>
                            LOCAL: {{getReclamo.LOCAL}}
                        </li>
                        <li>
                            OTRADEP: {{getReclamo.OTRADEP}}
                        </li>
                        <li>
                            NROOTRADE: {{getReclamo.NROOTRADE}}
                        </li>
                        <li>
                            DMEDNRO: {{getReclamo.DMEDNRO}}
                        </li>
                        <li>
                            DMED: {{getReclamo.DMED}}
                        </li>
                        <li>
                            HORATRASM: {{getReclamo.HORATRASM}}
                        </li>
                        <li>
                            FECHATRASM: {{ getReclamo.FECHATRASM ? new Date(getReclamo.FECHATRASM).toISOString().substring(0,10) : null }}
                        </li>
                        <li>
                            TRASMPOR: {{getReclamo.TRASMPOR}}
                        </li>
                        <li>
                            RECIBPOR: {{getReclamo.RECIBPOR}}
                        </li>
                        <li>
                            RECLAMO: {{getReclamo.RECLAMO}}
                        </li>
                    </ul>
                    
                <hr>
                <div class="container">
                    <b-button class="mt-2" variant="outline-success" block @click="generarInforme">Generar informe</b-button>
                    <b-button class="mt-2" variant="outline-danger" block @click="hideModalVista">Volver</b-button>
                </div>
            </b-modal>

            <b-modal ref="modalElimReclamo" hide-footer title="Validación">
                <div class="d-block text-center">
                    <p class="h2">{{reclamo.DMEDNRO}}</p>
                </div>
                <hr>
                Escriba el número de pedido para eliminar:
                <input type="text" v-model="input.CONFIRMACION_ELIM" class="form-control mt-2" placeholder="DMEDNRO">
                <hr>
                <div class="container">
                    <div class="row">
                        <div class="col-md-6">
                            <b-button class="mt-2" variant="outline-primary" v-if="validacionEliminacion" @click="eliminarReclamo()" block >Eliminar</b-button>
                        </div>
                        <div class="col-md-6">
                            <b-button class="mt-2" variant="outline-danger" block @click="hideModalElim">Cancelar</b-button>
                        </div>
                    </div>
                </div>
            </b-modal>
        </div>

    </div>
</template>

<script>
import loading from '@/components/Loading'
import error from '@/components/Error'
import XLSX from 'xlsx'
import download from 'js-file-download';
 
import {mapActions, mapMutations, mapGetters} from 'vuex'

export default {
    name: 'pd',
    data() {
        return {
            system: {
                loading: true,
                error: false,
            },
            indexPD: 0,
            nombreExcel: '',
            input: {
                CONFIRMACION_ELIM: '',
                DMEDNRO: '',
                DIA: '',
                MES: '',
                ANHO: '',
                LOCAL: ''
            },
            reclamo: {
                DMEDNRO: '',
                DIA: '',
                MES: '',
                ANHO: ''
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
        ...mapMutations(['setReclamoMutation']),
        formatDate (date) {
            
            if (date) {
                return new Date( `${date.substring(0,10).replace('-', '/').replace('-', '/')} 01:00:00` )
            }

            return null
        },
        async mostrarTodo(){
            try {
                const res = await this.axios.post('/reclamos')
                console.log(res)

                if(!res.data.codigo.includes('Error')){
                    this.datosTotal = res.data.respuesta
                    this.datosOp = res.data.respuesta
                } else {
                    console.log(error)
                    this.system.error = true
                }
            } catch (error) {
                this.system.error = true
                console.log(error)
            } 
        },
        aviso(variant = null){
            this.$bvToast.toast('Se a agregado los datos correctamente', {
                title: 'Datos cargados',
                variant: variant,
                solid: true
            })
        },
        cargarDatos(dato, index){
            this.input.DMEDNRO = dato.DMEDNRO

            const fechatrasm = this.formatDate(dato.FECHATRASM)
            this.input.DIA = fechatrasm.getDate()
            this.input.MES = fechatrasm.getMonth()+1
            this.input.ANHO = fechatrasm.getFullYear()
            this.input.LOCAL = dato.LOCAL

            this.aviso()
            this.filtro()
        },
        showModalElim(dato, index) {
            this.indexPD = index
            this.input.CONFIRMACION_ELIM = ''
            this.reclamo.DMEDNRO = dato.DMEDNRO

            const fechatrasm = this.formatDate(dato.FECHATRASM)
            this.reclamo.DIA = fechatrasm.getDate()
            this.reclamo.MES = fechatrasm.getMonth()+1
            this.reclamo.ANHO = fechatrasm.getFullYear()
            console.log(this.reclamo)
            this.$refs['modalElimReclamo'].show()
        },
        hideModalElim() {
            this.$refs['modalElimReclamo'].hide()
        },
        async showModalVista(dato, index) {
           
            console.log('dato.FECHATRASM', dato.FECHATRASM)

            this.reclamo.DMEDNRO = dato.DMEDNRO
            const fechatrasm = this.formatDate(dato.FECHATRASM)
            this.reclamo.DIA = fechatrasm.getDate()
            this.reclamo.MES = fechatrasm.getMonth()+1
            this.reclamo.ANHO = fechatrasm.getFullYear()
            console.log(this.reclamo)

            this.setReclamoMutation(dato)

            this.$refs['modalVistaReclamo'].show()
        },
        hideModalVista() {
            this.$refs['modalVistaReclamo'].hide()
        },
        async generarInforme(){
            try {
                const res = await this.axios.get(`/reclamosInformeXLSX/${this.reclamo.DMEDNRO}/${this.reclamo.DIA}/${this.reclamo.MES}/${this.reclamo.ANHO}`, {
                    responseType: 'blob',
                    headers: {
                        Accept: 'application/octet-stream'
                    }
                })
                const fileName = res.headers['x-processed-filename']; // <= cabezera personalizada
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute("download", `ANDE_Informe_Reclamos.xlsx`);
                document.body.appendChild(link);
                link.click();
                link.remove();
                
            } catch (error) {
                this.system.error = true
                console.log(error)
            }
        },
        async eliminarReclamo(){
            try {
                const res = await this.axios.delete(`/reclamoDelete/${this.reclamo.DMEDNRO}/${this.reclamo.DIA}/${this.reclamo.MES}/${this.reclamo.ANHO}`)
                console.log(res)
                this.hideModalElim()
                
                if(!res.data.codigo.includes('Error')){
                    // No hay error
                    this.mostrarTodo()
                    this.actualizarDatos()
                }else {
                    // Si hay error
                    console.log(res.data.codigo)
                    console.log(res.data.mensaje)
                }
                
            } catch (error) {
                console.log(error)
            }
        },
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
        filtro(){
            this.datosOp = []
            let contiene = []
            if(!(this.input.DMEDNRO || 
                this.input.DIA || 
                this.input.MES || 
                this.input.ANHO || 
                this.input.LOCAL)
            ){
                this.mostrarTodo()
            }else{
                for(let i = 0; i < this.datosTotal.length; i++){
                    let dt = this.datosTotal[i]
                    const fechatrasm = this.formatDate(dt.FECHATRASM)
                    contiene = []

                    if(this.input.DMEDNRO){
                        if(dt.DMEDNRO){
                            if(dt.DMEDNRO == parseInt(this.input.DMEDNRO)) {
                                contiene.push(1)
                            }else{
                                contiene.push(-1)
                            }
                        }else{
                            contiene.push(-1)
                        }
                    }else{
                        contiene.push(0)
                    }

                    if(this.input.DIA){
                        if(dt.FECHATRASM){
                            
                            if(fechatrasm.getDate() == parseInt(this.input.DIA)){
                                contiene.push(1)
                            }else{
                                contiene.push(-1)
                            }
                        }else{
                            contiene.push(-1)
                        }
                    }else{
                        contiene.push(0)
                    }

                    if(this.input.MES){
                        if(dt.FECHATRASM){
                            if(fechatrasm.getMonth()+1 == parseInt(this.input.MES)){
                                contiene.push(1)
                            }else{
                                contiene.push(-1)
                            }
                        }else{
                            contiene.push(-1)
                        }
                    }else{
                        contiene.push(0)
                    }

                    if(this.input.ANHO){
                        if(dt.FECHATRASM){
                            if((fechatrasm.getFullYear()).toString().includes(this.input.ANHO)){
                                contiene.push(1)
                            }else{
                                contiene.push(-1)
                            }
                        }else{
                            contiene.push(-1)
                        }
                    }else{
                        contiene.push(0)
                    }

                    if(this.input.LOCAL){
                        if(dt.LOCAL){
                            if(dt.LOCAL.includes(this.input.LOCAL)){
                                contiene.push(1)
                            }else{
                                contiene.push(-1)
                            }
                        }else{
                            contiene.push(-1)
                        }
                    }else{
                        contiene.push(0)
                    }

                    if(!(contiene[0] == -1 || contiene[1] == -1 || contiene[2] == -1 || contiene[3] == -1 || contiene[4] == -1)){
                        if(contiene[0] == 1 || contiene[1] == 1 || contiene[2] == 1 || contiene[3] == 1 || contiene[4] == 1){
                            this.datosOp.push(dt)
                        }
                    }
                }
            }
        },
        actualizarDatos(){
            this.datos = []
            for(let i = this.getStart(); (i <= this.getEnd()) && (i < this.datosOp.length); i++){
                this.datos.push(this.datosOp[i])
            }
        },
        async goToEditReclamos(nro, fecha){
            
            const fechaDate = this.formatDate(fecha)

            const dia = fechaDate.getDate()
            const mes = fechaDate.getMonth()+1
            const anho = fechaDate.getFullYear()

            this.$router.push({ name: 'Reclamos.Edit', params: { 
                dmednro: nro,
                dia: dia,
                mes: mes,
                anho: anho
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
        }
    },
    mounted(){
        this.setReclamoMutation()
    },
    async created() {
        this.system.loading = true
        try {
            const res = await this.axios.post('/reclamos')

            if(!res.data.codigo.includes('Error')){
                this.datosTotal = res.data.respuesta
                this.datosOp = res.data.respuesta
            } else {
                console.log(error)
                this.system.error = true
            }
        } catch (error) {
            this.system.error = true
            console.log(error)
        } finally{
            this.system.loading = false
        }
    },
    beforeUpdate() {
        this.actualizarDatos()
    },
    computed: {
        ...mapGetters(['getReclamo']),
        totalRow() {
            return this.datosOp.length
        },
        validacionEliminacion() {
            return this.reclamo.DMEDNRO == this.input.CONFIRMACION_ELIM
        }
    }
}
</script>

<style>

</style>