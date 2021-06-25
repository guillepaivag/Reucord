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
                            <label class="mt-2" for="">NROPROG:</label>
                            <input type="text" 
                            name="NROPROG"
                            v-on:keyup="filtro()"
                            v-model="input.NROPROG" 
                            class="form-control" 
                            placeholder="NROPROG">
                        </div>
                        <div class="col-md-6">
                            <b-form-group id="input-group-3" class="mt-2" label="SUSMOD:" label-for="input-3">
                                <b-form-select
                                id="input-3"
                                name="SUSMOD"
                                v-model="input.SUSMOD"
                                v-on:change="filtro()"
                                :options="list.susmodOption"
                                placeholder="SUSMOD"
                                required
                                ></b-form-select>
                            </b-form-group>
                            <!-- <label class="mt-2" for="">SUSMOD:</label>
                            <input type="text" 
                            name="SUSMOD"
                            v-on:keyup="filtro()"
                            v-model="input.SUSMOD" 
                            class="form-control" 
                            placeholder="SUSMOD"> -->
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

                    <div class="row">
                        <div class="col-md-6">
                            <label class="mt-2" for="">NROREUN:</label>
                            <input type="text" 
                            name="NROREUN"
                            v-on:keyup="filtro()"
                            v-model="input.NROREUN" 
                            class="form-control" 
                            placeholder="NROREUN">
                        </div>
                        <div class="col-md-6">
                            <label class="mt-2" for="">PDITEM:</label>
                            <input type="text" 
                            name="PDITEM"
                            v-on:keyup="filtro()"
                            v-model="input.PDITEM" 
                            class="form-control" 
                            placeholder="PDITEM">
                        </div>
                    </div>

                    <hr>

                    <label for="">La busqueda se hace mientras escribe.</label>
                </div>
                <div class="col-md-4">
                    <router-link
                        class="btn btn-outline-primary btn-block mt-3"
                        to="/suspensiones/agregarSuspension"
                    >Agregar una suspensión</router-link>

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
                    title="SUSPENSIONES"
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
                    <th scope="col">NROPROG</th>
                    <th scope="col">FECHATRAS</th>
                    <th scope="col">NROREUN</th>
                    <th scope="col">PDITEM</th>
                    <th scope="col">SUSMOD</th>
                    </tr>
                </thead>
                <tbody>
                    <tr class="table-secondary" 
                        v-for="(dato, index) in datos" :key="index"
                    >
                        <th scope="row">{{index+getStart()+1}}</th>
                        <th>{{dato.NROPROG}}</th>
                        <td>{{ dato.FECHATRAS ? dato.FECHATRAS.substring(0,10) : null }}</td>
                        <td>{{dato.NROREUN}}</td>
                        <td>{{dato.PDITEM}}</td>
                        <td>{{dato.SUSMOD}}</td>
                        <td>
                            <button type="button" class="btn btn-outline-info btn-block" @click="cargarDatos(datos[index], index)">Cargar datos</button>
                            <button type="button" class="btn btn-outline-primary btn-block" @click="showModalVista(datos[index], index)">Ver datos</button>
                            <button class="btn btn-outline-success btn-block" v-on:click="goToEditSuspension(datos[index], index)">Editar</button>
                            <button type="button" id="show-btn" @click="showModal(datos[index], index)" class="btn btn-outline-danger btn-block">Eliminar</button>
                        </td>
                    </tr>
                </tbody>
            </table>

            <b-modal ref="modalVistaSuspension" hide-footer title="Suspensión">
                <div class="d-block text-center">
                    <h3>Suspensión</h3>
                </div>
                <hr>
                    <ul>
                        <li>
                            NROPROG: {{getSuspension.NROPROG}}
                        </li>
                        <li>
                            FECHATRAS: {{ getSuspension.FECHATRAS ? getSuspension.FECHATRAS.substring(0,10) : null }}
                        </li>
                        <li>
                            TRASMPOR: {{getSuspension.TRASMPOR}}
                        </li>
                        <li>
                            NROREUN: {{getSuspension.NROREUN}}
                        </li>
                        <li>
                            REUNIONANO: {{getSuspension.REUNIONANO}}
                        </li>
                        <li>
                            PDITEM: {{getSuspension.PDITEM}}
                        </li>
                        <li>
                            SUSMOD: {{getSuspension.SUSMOD}}
                        </li>
                        <li>
                            DESCRIP: {{getSuspension.DESCRIP}}
                        </li>
                    </ul>
                    
                <hr>
                <div class="container">
                    <b-button class="mt-2" variant="outline-success" block @click="generarInforme">Generar informe</b-button>
                    <b-button class="mt-2" variant="outline-danger" block @click="hideModalVista">Volver</b-button>
                </div>
            </b-modal>

            <b-modal ref="modalElimSuspension" hide-footer title="Validación">
                <div class="d-block text-center">
                    <p class="h2">{{suspension.NROPROG}}</p>
                </div>
                <hr>
                Escriba el número de pedido para eliminar:
                <input type="text" v-model="input.CONFIRMACION_ELIM" class="form-control mt-2" placeholder="NROPROG">
                <hr>
                <div class="container">
                    <div class="row">
                        <div class="col-md-6">
                            <b-button class="mt-2" variant="outline-primary" v-if="validacionEliminacion" @click="eliminarSuspension()" block >Eliminar</b-button>
                        </div>
                        <div class="col-md-6">
                            <b-button class="mt-2" variant="outline-danger" block @click="hideModal">Cancelar</b-button>
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
                NROPROG: '',
                DIA: '',
                MES: '',
                ANHO: '',
                NROREUN: '',
                REUNIONANO: '',
                PDITEM: '',
                SUSMOD: ''
            },
            suspension: {
                NROPROG: '',
                DIA: '',
                MES: '',
                ANHO: '',
                NROREUN: '',
                REUNIONANO: '',
                PDITEM: ''
            },
            list: {
                susmodOption: [
                    { text: 'Mostrar todo', value: '' }, 
                    { text: 'Suspendido', value: 'S' }, 
                    { text: 'Modificado', value: 'M' }
                ],
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
        ...mapMutations(['setSuspensionMutation']),
        formatDate (date) {
            if (date) {
                return new Date( `${date.substring(0,10).replace('-', '/').replace('-', '/')} 01:00:00` )
            }

            return null
        },
        async mostrarTodo(){
            try {
                const res = await this.axios.post('/suspensiones')

                if(!res.data.codigo.includes('Error')){
                    this.datosTotal = res.data.respuesta
                    this.datosOp = res.data.respuesta
                } else {
                    this.system.error = true
                    console.log(error)
                }

            } catch (error) {
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
            console.log('dato.FECHATRAS', dato.FECHATRAS)
            this.input.NROPROG = dato.NROPROG
            const fechatras = this.formatDate(dato.FECHATRAS)
            this.input.DIA = fechatras.getDate()
            this.input.MES = fechatras.getMonth()+1
            this.input.ANHO = fechatras.getFullYear()
            this.input.NROREUN = dato.NROREUN
            this.input.PDITEM = dato.PDITEM
            this.input.SUSMOD = dato.SUSMOD

            this.aviso()
            this.filtro()
        },
        showModal(dato, index) {
            this.indexPD = index
            this.input.CONFIRMACION_ELIM = ''
            this.suspension.NROPROG = parseInt(dato.NROPROG)
            const fechatras = this.formatDate(dato.FECHATRAS)
            this.suspension.DIA = fechatras.getDate()
            this.suspension.MES = fechatras.getMonth()+1
            this.suspension.ANHO = fechatras.getFullYear()
            this.suspension.NROREUN = parseInt(dato.NROREUN)
            this.suspension.REUNIONANO = parseInt(dato.REUNIONANO)
            this.suspension.PDITEM = parseInt(dato.PDITEM)

            this.$refs['modalElimSuspension'].show()
        },
        hideModal() {
            this.$refs['modalElimSuspension'].hide()
        },
        async showModalVista(dato, index) {
           
            this.suspension.NROPROG = parseInt(dato.NROPROG)
            const fechatras = this.formatDate(dato.FECHATRAS)
            this.suspension.DIA = fechatras.getDate()
            this.suspension.MES = fechatras.getMonth()+1
            this.suspension.ANHO = fechatras.getFullYear()
            this.suspension.NROREUN = dato.NROREUN ? parseInt(dato.NROREUN) : null
            this.suspension.REUNIONANO = parseInt(dato.REUNIONANO)
            this.suspension.PDITEM = parseInt(dato.PDITEM)

            this.setSuspensionMutation(dato)

            this.$refs['modalVistaSuspension'].show()
        },
        hideModalVista() {
            this.$refs['modalVistaSuspension'].hide()
        },
        async generarInforme(){
            try {
                const res = await this.axios.get(`/suspensionInformeXLSX/${this.suspension.NROPROG}/${this.suspension.DIA}/${this.suspension.MES}/${this.suspension.ANHO}/${this.suspension.NROREUN}/${this.suspension.PDITEM}`,
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
                link.setAttribute("download", `ANDE_Informe_Suspension.xlsx`);
                document.body.appendChild(link);
                link.click();
                link.remove();
                
            } catch (error) {
                console.log(error)
            }
        },
        async eliminarSuspension(){
            try {
                const res = await this.axios.delete(`/suspensionDelete/${this.suspension.NROPROG}/${this.suspension.DIA}/${this.suspension.MES}/${this.suspension.ANHO}/${this.suspension.NROREUN}/${this.suspension.REUNIONANO}/${this.suspension.PDITEM}`)

                if(!res.data.codigo.includes('Error')){
                    this.hideModal()
                    this.mostrarTodo()
                    this.actualizarDatos()
                    console.log(res.data.mensaje)
                } else {
                    console.log(res.data.mensaje)
                }

                console.log(res.data)
                
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
            if(!(this.input.NROPROG || 
                this.input.DIA || 
                this.input.MES || 
                this.input.ANHO || 
                this.input.NROREUN || 
                this.input.PDITEM || 
                this.input.SUSMOD)
            ){
                this.mostrarTodo()
            }else{
                for(let i = 0; i < this.datosTotal.length; i++){
                    let dt = this.datosTotal[i]
                    const fechatras = this.formatDate(dt.FECHATRAS)
                    contiene = []

                    if(this.input.NROPROG){
                        if(dt.NROPROG){
                            if(parseInt(dt.NROPROG) == parseInt(this.input.NROPROG)){
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
                        if(dt.FECHATRAS){
                            if(fechatras.getDate() == parseInt(this.input.DIA)){
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
                        if(dt.FECHATRAS){
                            if(fechatras.getMonth()+1 == parseInt(this.input.MES)){
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
                        if(dt.FECHATRAS){
                            if(fechatras.getFullYear() == parseInt(this.input.ANHO)){
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

                    if(this.input.NROREUN){
                        if(dt.NROREUN){
                            if(parseInt(dt.NROREUN) == parseInt(this.input.NROREUN)){
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

                    if(this.input.PDITEM){
                        if(dt.PDITEM){
                            if(parseInt(dt.PDITEM) == parseInt(this.input.PDITEM)){
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

                    if(this.input.SUSMOD){
                        if(dt.SUSMOD){
                            if(dt.SUSMOD == this.input.SUSMOD){
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

                    if(!(contiene[0] == -1 || contiene[1] == -1 || contiene[2] == -1 || contiene[3] == -1 || contiene[4] == -1 || contiene[5] == -1 || contiene[6] == -1)){
                        if(contiene[0] == 1 || contiene[1] == 1 || contiene[2] == 1 || contiene[3] == 1 || contiene[4] == 1 || contiene[5] == 1 || contiene[6] == 1){
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
        async goToEditSuspension(dato, index){
            const fechatras = this.formatDate(dato.FECHATRAS)
            const dia = fechatras.getDate()
            const mes = fechatras.getMonth()+1
            const anho = fechatras.getFullYear()
            
            this.$router.push({ name: 'Suspensiones.Edit', params: { 
                nroprog: dato.NROPROG,
                dia: dia,
                mes: mes,
                anho: anho,
                nroreun: dato.NROREUN,
                reunionano: dato.REUNIONANO,
                pditem: dato.PDITEM
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
        this.setSuspensionMutation()
    },
    async created() {
        this.system.loading = true
        try {
            const res = await this.axios.post('/suspensiones')

            if(!res.data.codigo.includes('Error')){
                this.datosTotal = res.data.respuesta
                this.datosOp = res.data.respuesta
            } else {
                this.system.error = true
                console.log(error)
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
        ...mapGetters(['getSuspension']),
        totalRow() {
            return this.datosOp.length
        },
        validacionEliminacion() {
            return this.suspension.NROPROG == this.input.CONFIRMACION_ELIM
        }
    }
}
</script>

<style>

</style>