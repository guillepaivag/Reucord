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
                            <label class="mt-2" for="">Año de la reunión:</label>
                            <input type="number" 
                            name="reunro"
                            v-on:keyup="filtro()"
                            v-model="input.REUFECHA" 
                            class="form-control" 
                            placeholder="Año de la reunión">
                        </div>
                        <div class="col-md-6">
                            <label class="mt-2" for="">Nro de programación semanal:</label>
                            <input type="number" 
                            name="reunro"
                            v-on:keyup="filtro()"
                            v-model="input.REUNRO" 
                            class="form-control" 
                            placeholder="Número de programación semanal">
                        </div>
                    </div>

                    <hr>

                    <div class="row">
                        <div class="col-md-6">
                            <label class="mt-2" for="">Item:</label>
                            <input type="number" 
                            name="item"
                            v-on:keyup="filtro()"
                            v-model="input.ITEM" 
                            class="form-control" 
                            placeholder="Item">
                        </div>
                        <div class="col-md-6">
                            <label class="mt-2" for="">Local:</label>
                            <input type="text" 
                            name="local"
                            v-on:keyup="filtro()"
                            v-model="input.LOCAL" 
                            class="form-control" 
                            placeholder="Local">
                        </div>
                    </div>

                    <hr>

                    <label for="">La busqueda se hace mientras escribe.</label>
                </div>
                <div class="col-md-4">
                    <router-link
                        class="btn btn-outline-primary btn-block mt-3"
                        to="/ps/agregarPs-aTratar"
                    >Agregar una programación semanal</router-link>

                    <b-button 
                        class="btn btn-outline-primary btn-block mt-3"
                        v-b-toggle.sidebar-backdrop
                    >Ver herramientas</b-button>

                    <!-- <b-button 
                        class="btn btn-outline-primary btn-block mt-3"
                        to="/ps/analisis"
                    >Analisis de equipos</b-button> -->

                    <b-sidebar
                    id="sidebar-backdrop"
                    title="PS"
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
                            <b-button 
                                class="btn btn-outline-primary btn-block"
                                v-on:click="cargarDatos()"
                            >Limpiar</b-button>
                            <hr>
                            <label for="idNombreExcelPs">Generador de excel:</label>
                            <input type="text" id="idNombreExcelPs" class="form-control mb-3" v-model="nombreExcel" placeholder="Nombre de excel">
                            <b-button 
                                class="btn btn-outline-primary btn-block"
                                v-on:click="exportExcel"
                            >Generar excel</b-button>
                            <label for="" v-if="!nombreExcel" class="mt-3">Agregar un nombre para exportar el excel.</label>
                            <hr>
                            <label for="idNombreExcelPs">Año de reunión:</label>
                            <input type="number" id="idNombreExcelPs" class="form-control mb-3" v-model="input.ANHO_REU" placeholder="Año de reunión">
                            <label for="idNombreExcelPs">Número de reunión:</label>
                            <input type="number" id="idNombreExcelPs" class="form-control mb-3" v-model="input.NUMERO_REU" placeholder="Número de reunión">
                            <b-button 
                                class="btn btn-outline-primary btn-block"
                                v-on:click="generarInforme"
                            >Generar informe de excel</b-button>
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
                    <th scope="col">REUFECHA</th>
                    <th scope="col">REUNRO</th>
                    <th scope="col">ITEM</th>
                    <th scope="col">LOCAL</th>
                    <th scope="col">ACCIONES</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="table-secondary" 
                        v-for="(dato, index) in datos" :key="index"
                    >
                        <th scope="row">{{index+getStart()+1}}</th>
                        <th>{{dato.REUFECHA}}</th>
                        <th>{{dato.REUNRO}}</th>
                        <th>{{dato.ITEM}}</th>
                        <td>{{dato.LOCAL}}</td>
                        <td>
                            <button type="button" class="btn btn-outline-info btn-block" @click="cargarDatos(datos[index], index)">Cargar datos</button>
                            <button type="button" class="btn btn-outline-primary btn-block" @click="showModalVista(datos[index], index)">Ver datos</button>
                            <button class="btn btn-outline-success btn-block" v-on:click="goToEditPs(dato)">Editar</button>
                            <button type="button" id="show-btn" @click="showModalEliminacion(datos[index], index)" class="btn btn-outline-danger btn-block">Eliminar</button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <b-modal ref="modalVistaPs" hide-footer title="Programación semanal">
                <div class="d-block text-center">
                    <h3>PS</h3>
                </div>
                <hr>
                    <ul>
                        <li>
                            Reufecha: {{getPs.REUFECHA}}
                        </li>
                        <li>
                            Reunro: {{getPs.REUNRO}}
                        </li>
                        <li>
                            Item: {{getPs.ITEM}}
                        </li>
                        <li>
                            Local: {{getPs.LOCAL}}
                        </li>
                        <li>
                            Circuito: {{getPs.CIRCUITO}}
                        </li>
                        <li>
                            Equipo: {{getPs.EQUIPO}}
                        </li>
                        <li>
                            Trabajo: {{getPs.TRABAJO}}
                        </li>
                        <li>
                            Aut: {{getPs.AUT}}
                        </li>
                        <li>
                            Estado: {{getPs.ESTADO}}
                        </li>
                        
                        <li>
                            Observación: {{getPs.OBSERVAC}}
                        </li>
                        <li>
                            Resultado: {{getPs.RESULTADO}}
                        </li>
                        <li>
                            Responsable: {{getPs.RESPONSABLE}}
                        </li>
                        <li>
                            Ampliación: {{getPs.AMPLIACION}}
                        </li>
                        <li>
                            Nro de reclamo: {{getPs.NRO_REC}}
                        </li>
                        <li>
                            Fecha de reclamo: {{ getPs.FECHA_REC ? getPs.FECHA_REC.substring(0,10) : null }}
                        </li>

                        <hr>

                        <li>
                            Trabajos:
                            <div class="container" v-if="getPsTrabajos.length > 0">
                                <ul v-for="(trabajo, index) in getPsTrabajos" :key="index">
                                    <li>
                                        {{ trabajo.FECHATRABA ? trabajo.FECHATRABA.substring(0,10) : null }}
                                    </li>
                                    <li>
                                        {{trabajo.HORADESDE}}
                                    </li>
                                    <li>
                                        {{trabajo.HORAHASTA}}
                                    </li>
                                    <hr>
                                </ul>
                            </div>
                            <div class="container" v-else>
                                <label class="mt-2">No hay trabajos para esta programación semanal.</label>
                            </div>
                        </li>
                    </ul>       
                <hr>
                <div class="container">
                    <b-button class="mt-2" variant="outline-success" block @click="goToViewPs()">Ver datos</b-button>
                    <b-button class="mt-2" variant="outline-danger" block @click="hideModalVista">Volver</b-button>
                </div>
            </b-modal>

            <b-modal ref="modalElimPs" hide-footer title="Validación">
                <div class="d-block text-center">
                    <p class="h2">{{ps.REUNRO}}</p>
                </div>
                <hr>
                Escriba el número de la programación para eliminar:
                <input type="text" v-model="input.CONFIRMACION_ELIM" class="form-control mt-2" placeholder="Número programación semanal">
                <hr>
                <div class="container">
                    <div class="row">
                        <div class="col-md-6">
                            <b-button class="mt-2" variant="outline-primary" v-if="validacionEliminacion" @click="eliminarPS()" block >Eliminar</b-button>
                        </div>
                        <div class="col-md-6">
                            <b-button class="mt-2" variant="outline-danger" block @click="hideModalEliminacion">Cancelar</b-button>
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
 
import {mapMutations, mapGetters} from 'vuex'

export default {
    name: 'ps',
    data() {
        return {
            system: {
                loading: true,
                error: false,
            },
            indexPS: 0,
            nombreExcel: '',
            input: {
                CONFIRMACION_ELIM: '',
                REUFECHA: '',
                REUNRO: '',
                ITEM: '',
                LOCAL: '',
                NUMERO_REU: '',
                ANHO_REU: ''
            },
            ps: {
                REUFECHA: '',
                REUNRO: '',
                ITEM: '',
            },
            datos: [],
            datosSubTotal: [],
            datosOp: [],
            currentPage: 1,
            perPage: 10
        }
    },
    components: {
        loading,
        error
    },
    methods: {
        ...mapMutations(['setPsState', 'setPsTrabajosState']),
        formatDate (date) {
            if (date) {
                return new Date( `${date.substring(0,10).replace('-', '/').replace('-', '/')} 01:00:00` )
            }

            return null
        },
        async mostrarTodo(){
            try {
                const res = await this.axios.post('/ps')
            
                if(!res.data.codigo.includes('Error')){
                    console.log(res)
                    this.datosTotal = res.data.respuesta
                    this.datosOp = res.data.respuesta
                }else {
                    console.log(error)
                    this.system.error = true
                }
            } catch(error) {
                console.log(error)
                this.system.error = true
            } finally {
                this.system.loading = false
            }
        },
        async generarInforme() {
            try {
                const res = await this.axios.get(`/psInformeXLSX/${this.input.ANHO_REU}/${this.input.NUMERO_REU}`,
                    {
                        responseType: 'blob',
                        headers: {
                            Accept: 'application/octet-stream'
                        }
                    }
                )
                const fileName = res.headers['x-processed-filename']; // <= cabezera personalizada
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                // link.setAttribute('download', fileName);
                link.setAttribute("download", `ANDE_Informe_ProgramacionSemanal.xlsx`);
                document.body.appendChild(link);
                link.click();
                link.remove();
                
            } catch (error) {
                console.log(error)
            }
        },
        cargarDatos(dato, index){
            if(dato){
                this.input.REUFECHA = dato.REUFECHA
                this.input.REUNRO = dato.REUNRO
                this.input.ITEM = dato.ITEM
                this.input.LOCAL = dato.LOCAL

                this.aviso()
            }else{
                this.input.REUFECHA = ''
                this.input.REUNRO = ''
                this.input.ITEM = ''
                this.input.LOCAL = ''
            }

            this.filtro()
        },
        aviso(variant = null){
            this.$bvToast.toast('Se a agregado los datos correctamente', {
                title: 'Datos cargados',
                variant: variant,
                solid: true
            })
        },
        async showModalVista(dato, index) {
            this.ps.REUFECHA = dato.REUFECHA
            this.ps.REUNRO = dato.REUNRO
            this.ps.ITEM = dato.ITEM
            
            this.setPsState(dato)

            try {
                const rows = await this.axios.post(`/psOneTrabajos/${this.ps.REUFECHA}/${this.ps.REUNRO}/${this.ps.ITEM}`)
                console.log('rows.data', rows.data)
                this.setPsTrabajosState(rows.data.respuesta)
            } catch (error) {
                console.log(error)
            }

            this.$refs['modalVistaPs'].show()
        },
        hideModalVista() {
            this.ps = {
                REUFECHA: '',
                REUNRO: '',
                ITEM: ''
            }

            this.$refs['modalVistaPs'].hide()
        },
        showModalEliminacion(dato, index) {
            this.indexPS = index
            this.input.CONFIRMACION_ELIM = ''
            this.ps.REUFECHA = dato.REUFECHA
            this.ps.REUNRO = dato.REUNRO
            this.ps.ITEM = dato.ITEM
            
            this.$refs['modalElimPs'].show()
        },
        hideModalEliminacion() {
            this.ps = {
                REUFECHA: '',
                REUNRO: '',
                ITEM: ''
            }

            this.$refs['modalElimPs'].hide()
        },
        async eliminarPS(){
            try {
                const res = await this.axios.delete(`/psDelete/${this.ps.REUFECHA}/${this.ps.REUNRO}/${this.ps.ITEM}`)
                
                if(!res.data.codigo.includes('Error')){
                    this.hideModalEliminacion()
                    this.mostrarTodo()
                    this.actualizarDatos()
                } else {
                    this.system.error = true
                }
                
            } catch (error) {
                this.system.error = true
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

            if(!(this.input.REUFECHA ||
                this.input.REUNRO ||
                this.input.ITEM || 
                this.input.LOCAL)
            ){
                this.mostrarTodo()
            }else{
                for(let i = 0; i < this.datosTotal.length; i++){
                    let dt = this.datosTotal[i]
                    contiene = []

                    if(this.input.REUFECHA){
                        if(dt.REUFECHA){
                            if(dt.REUFECHA == this.input.REUFECHA){
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

                    if(this.input.REUNRO){
                        if(dt.REUNRO){
                            if(dt.REUNRO == this.input.REUNRO){
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

                    if(this.input.ITEM){
                        if(dt.ITEM){
                            if(dt.ITEM == this.input.ITEM){
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

                    if(!(contiene[0] == -1 || contiene[1] == -1 || contiene[2] == -1 || contiene[3] == -1)){
                        if(contiene[0] == 1 || contiene[1] == 1 || contiene[2] == 1 || contiene[3] == 1){
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
        // envia en la zona de vista
        async goToViewPs(){
      
            // this.$router.push('/pd/editarPd-aTratar')
            this.$router.push({ name: 'Ps.viewPs', params: { 
                reufecha: this.ps.REUFECHA,
                reunro: this.ps.REUNRO,
                item: this.ps.ITEM,
            }})

        },
        async goToEditPs(ps){

            this.$router.push({
                name: 'Ps.EditPs',
                params: {
                    reufecha: ps.REUFECHA,
                    reunro: ps.REUNRO,
                    item: ps.ITEM
                }
            })
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
        this.setPsState()
    },
    async created() {
        this.mostrarTodo()
    },
    beforeUpdate() {
        this.actualizarDatos()
    },
    computed: {
        ...mapGetters(['getPs', 'getPsTrabajos']),
        totalRow() {
            return this.datosOp.length
        },
        validacionEliminacion() {
            return this.input.CONFIRMACION_ELIM == this.ps.REUNRO
        },
    }
}
</script>

<style>

</style>