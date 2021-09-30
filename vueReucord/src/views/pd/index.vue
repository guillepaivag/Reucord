<template>
    <div class="container">
        <div v-if="system.loading">
            <loading></loading>
        </div>

        <div v-else>
            <div class="row mb-3 mt-3">
                <div class="col-md-8">
                    <div class="row">
                        <div class="col-md-6">
                            <label class="mt-2" for="">Nro de pedido de disponibilidad:</label>
                            <input type="text" 
                            name="pdnro"
                            v-on:keyup="filtro()"
                            v-model="input.NROPROG" 
                            class="form-control" 
                            placeholder="Número de pedido de disponibilidad">
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

                    <label class="" for="">Fecha:</label>
                    <div class="row">
                        <div class="col-md-4">
                            <label class="mt-2" for=""><i>Día</i></label>
                            <input type="text" 
                            name="circuito"
                            v-on:keyup="filtro()"
                            v-model="input.DIA" 
                            class="form-control" 
                            placeholder="Día">
                        </div>
                        <div class="col-md-4">
                            <label class="mt-2" for=""><i>Mes</i></label>
                            <input type="text" 
                            name="equipo"
                            v-on:keyup="filtro()"
                            v-model="input.MES" 
                            class="form-control" 
                            placeholder="Mes">
                        </div>
                        <div class="col-md-4">
                            <label class="mt-2" for=""><i>Año</i></label>
                            <input type="text"
                            name="barra"
                            v-on:keyup="filtro()"
                            v-model="input.ANHO" 
                            class="form-control" 
                            placeholder="Año">
                        </div>
                    </div>

                    <hr>

                    <label for="">La busqueda se hace mientras escribe.</label>
                </div>
                <div class="col-md-4">
                    <router-link
                        class="btn btn-outline-primary btn-block mt-3"
                        to="/pd/agregarPd-aTratar"
                    >Agregar un pedido de disponibilidad</router-link>

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
                    title="PD"
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
                    <th scope="col">NRO PROG</th>
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
                        <th>{{ dato.NROPROG }}</th>
                        <td>{{ dato.PDFECHA ? new Date(dato.PDFECHA).toISOString().substring(0,10) : null }}</td>
                        <td>{{ dato.LOCAL }}</td>
                        <td>
                            <button type="button" class="btn btn-outline-info btn-block" @click="cargarDatos(datos[index], index)">Cargar datos</button>
                            <button type="button" class="btn btn-outline-primary btn-block" @click="showModalVista(datos[index], index)">Ver datos</button>
                            <button class="btn btn-outline-success btn-block" v-on:click="goToEditPd(dato.NROPROG, dato.PDFECHA)">Editar</button>
                            <button type="button" id="show-btn" @click="showModalElim(datos[index], index)" class="btn btn-outline-danger btn-block">Eliminar</button>
                            <!-- <button type="button" class="btn btn-outline-primary btn-block" @click="showModalVista(datos[index], index)">Ver datos</button> -->
                            <!-- <button class="btn btn-outline-success btn-block" v-on:click="equipoAddStore(dato)">Editar</button> -->
                            <!-- <button type="button" id="show-btn" @click="showModalElim(datos[index], index)" class="btn btn-outline-danger btn-block">Eliminar</button> -->
                        </td>
                    </tr>
                </tbody>
            </table>

            <b-modal ref="modalVistaPd" hide-footer title="Pedido de disponibilidad">
                <div class="d-block text-center">
                    <h3>PD</h3>
                </div>
                <hr>
                    <ul>
                        <li>
                            LOCAL: {{pdDatos.LOCAL}}
                        </li>
                        <li>
                            CIRCUITO: {{pdDatos.CIRCUITO}}
                        </li>
                        <li>
                            EQUIPO: {{pdDatos.EQUIPO}}
                        </li>
                        <li>
                            NROPROG: {{pdDatos.NROPROG}}
                        </li>
                        <li>
                            PDTRASMI: {{pdDatos.PDTRASMI}}
                        </li>
                        <li>
                            PDFECHA: {{ pdDatos.PDFECHA ? new Date(pdDatos.PDFECHA).toISOString().substring(0,10) : null }}
                        </li>
                        <li>
                            HORA TRASMITIDA: {{pdDatos.HORATRAS}}
                        </li>
                        <li>
                            ESTADO: {{pdDatos.ESTADO}}
                        </li>
                        <li>
                            SUSPENDIDO/MODIFICADO: {{pdDatos.SUSMOD}}
                        </li>
                        <li>
                            TRABAJO: {{pdDatos.TRABAJO}}
                        </li>
                        <li>
                            RESPONSABLE: {{pdDatos.RESPONSABLE}}
                        </li>
                        <li>
                            OBSERVACION: {{pdDatos.OBSERVACION}}
                        </li>
                        <li>
                            JEFATURA: {{pdDatos.JEFATURA}}
                        </li>
                        <li>
                            NRO_REC: {{pdDatos.NRO_REC}}
                        </li>
                        <li>
                            FECHA_REC: {{pdDatos.FECHA_REC}}
                        </li>
                        <li>
                            RECIBIDO POR: {{pdDatos.RECIBIDO}}
                        </li>
                        <li>
                            RESULTADO: {{pdDatos.RESULTADO}}
                        </li>
                        <hr>
                        <li>
                            Trabajos:
                            <div class="container" v-if="pdDatosTrabajos.length > 0">
                                <ul v-for="(trabajo, index) in pdDatosTrabajos" :key="index">
                                    <li>
                                        {{ trabajo.FECHATRA ? new Date(trabajo.FECHATRA).toISOString().substring(0,10) : null }}
                                    </li>
                                    <li>
                                        {{trabajo.HORAINI}}
                                    </li>
                                    <li>
                                        {{trabajo.HORAFIN}}
                                    </li>
                                    <hr>
                                </ul>
                            </div>
                            <div class="container" v-else>
                                <label class="mt-2">No hay trabajos para este pedido de disponibilidad</label>
                            </div>
                        </li>
                    </ul>
                    
                <hr>
                <div class="container">
                    <b-button class="mt-2" variant="outline-success" block @click="goToViewPd()">Ver datos</b-button>
                    <b-button class="mt-2" variant="outline-success" block @click="generarInforme">Generar informe</b-button>
                    <b-button class="mt-2" variant="outline-danger" block @click="hideModalVista">Volver</b-button>
                </div>
            </b-modal>

            <b-modal ref="modalElimPd" hide-footer title="Validación">
                <div class="d-block text-center">
                    <p class="h2">{{pd.NROPROG}}</p>
                </div>
                <hr>
                Escriba el número de pedido para eliminar:
                <input type="text" v-model="input.CONFIRMACION_ELIM" class="form-control mt-2" placeholder="Número pedido de disponibilidad">
                <hr>
                <div class="container">
                    <div class="row">
                        <div class="col-md-6">
                            <b-button class="mt-2" variant="outline-primary" v-if="validacionEliminacion" @click="eliminarPD()" block >Eliminar</b-button>
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
import XLSX from 'xlsx'
import download from 'js-file-download';
 
import {mapMutations, mapActions, mapGetters} from 'vuex'

export default {
    name: 'pd',
    data() {
        return {
            system: {
                loading: true,
            },
            indexPD: 0,
            nombreExcel: '',
            input: {
                CONFIRMACION_ELIM: '',
                NROPROG: '',
                DIA: '',
                MES: '',
                ANHO: '',
                LOCAL: ''
            },
            pd: {
                NROPROG: '',
                DIA: '',
                MES: '',
                ANHO: ''
            },
            pdDatos: {},
            pdDatosTrabajos: {},
            datos: [],
            datosOp: [],
            datosTotal: [],
            currentPage: 1,
            perPage: 10
        }
    },
    components: {
        loading,
    },
    methods: {
        formatDate (date) {
            if (date) {
                return new Date(`${date.substring(0,10)}T13:00:00`)
            }

            return null
        },
        // get data
        async mostrarTodo(){
            try {
                const res = await this.$store.dispatch('getListaPd')
                this.datosTotal = res
                this.datosOp = res
            } catch (error) {
                console.log(error)
            }
        },
        // mostrar avisos
        aviso(variant = null){
            this.$bvToast.toast('Se a agregado los datos correctamente', {
                title: 'Datos cargados',
                variant: variant,
                solid: true
            })
        },
        // cargar datos
        cargarDatos(dato, index){
            this.input.NROPROG = dato.NROPROG

            const pdfecha = this.formatDate(dato.PDFECHA)
            this.input.DIA = pdfecha.getDate()
            this.input.MES = pdfecha.getMonth()+1
            this.input.ANHO = pdfecha.getFullYear()
            this.input.LOCAL = dato.LOCAL

            this.aviso()
            this.filtro()
        },
        // cargar ref local
        // vista de eliminacion
        showModalElim(dato, index) {
            this.indexPD = index
            this.input.CONFIRMACION_ELIM = ''
            this.pd.NROPROG = dato.NROPROG
            const pdfecha = this.formatDate(dato.PDFECHA)
            this.pd.DIA = pdfecha.getDate()
            this.pd.MES = pdfecha.getMonth()+1
            this.pd.ANHO = pdfecha.getFullYear()
            this.$refs['modalElimPd'].show()
        },
        // cerrar vista de eliminacion
        hideModalElim() {
            this.$refs['modalElimPd'].hide()
        },
        // cargar ref local
        // inserta los datos
        // mostrar vista de vista de datos
        async showModalVista(dato, index) {
            this.pd.NROPROG = dato.NROPROG
            const pdfecha = this.formatDate(dato.PDFECHA)
            this.pd.DIA = pdfecha.getDate()
            this.pd.MES = pdfecha.getMonth()+1
            this.pd.ANHO = pdfecha.getFullYear()

            this.pdDatos = dato
            
            try {
                const rows = await this.$store.dispatch('getPdTrabajo', {
                    nroprog: this.pd.NROPROG,
                    dia: this.pd.DIA,
                    mes: this.pd.MES,
                    anho: this.pd.ANHO,
                })
                this.pdDatosTrabajos = rows
                
            } catch (error) {
                console.log(error)
            }

            this.$refs['modalVistaPd'].show()
        },
        // quitar vista de vista de datos
        hideModalVista() {
            this.$refs['modalVistaPd'].hide()
        },
        // generar informes
        async generarInforme(){
            try {
                console.log('this.pd', this.pd)

                const res = await this.$store.dispatch('genenrarExcel', this.pd)
                
                const fileName = res.headers['x-processed-filename']; // <= cabezera personalizada
                const url = window.URL.createObjectURL(new Blob([res.data]));
                const link = document.createElement('a');
                link.href = url;
                // link.setAttribute('download', fileName);
                link.setAttribute("download", `ANDE_Informe_PedidoDisponibilidad.xlsx`);
                document.body.appendChild(link);
                link.click();
                link.remove();
            } catch (error) {
                console.log(error)
            }
        },
        // funcion de eliminacion
        async eliminarPD(){
            try {
                await this.$store.dispatch('eliminarPdAction', {
                    nroprog: this.pd.NROPROG,
                    dia: this.pd.DIA,
                    mes: this.pd.MES,
                    anho: this.pd.ANHO,
                })
                this.hideModalElim()
                this.mostrarTodo()
                this.actualizarDatos()
                
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
                this.input.LOCAL)
            ){
                this.mostrarTodo()
            }else{
                for(let i = 0; i < this.datosTotal.length; i++){
                    let dt = this.datosTotal[i]
                    const pdfecha = this.formatDate(dt.PDFECHA)
                    contiene = []

                    if(this.input.NROPROG){
                        if(dt.NROPROG){
                            if(dt.NROPROG == parseInt(this.input.NROPROG)){
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
                        if(dt.PDFECHA){
                            if(pdfecha.getDate() == parseInt(this.input.DIA)){
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
                        if(dt.PDFECHA){
                            if(pdfecha.getMonth()+1 == parseInt(this.input.MES)){
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
                        if(dt.PDFECHA){
                            if((pdfecha.getFullYear()).toString().includes(this.input.ANHO)){
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
        // envia en la zona de edicion
        async goToEditPd(nro, fecha){
            const pdfecha = this.formatDate(fecha)
            const dia = pdfecha.getDate()
            const mes = pdfecha.getMonth() + 1
            const anho = pdfecha.getFullYear()
            
            // this.$router.push('/pd/editarPd-aTratar')
            this.$router.push({ name: 'Pd.editPd', params: { 
                nroprog: nro,
                dia: dia,
                mes: mes,
                anho: anho
            }})
        },
        // envia en la zona de vista
        async goToViewPd(){
      
            // this.$router.push('/pd/editarPd-aTratar')
            this.$router.push({ name: 'Pd.viewPd', params: { 
                nroprog: this.pd.NROPROG,
                dia: this.pd.DIA,
                mes: this.pd.MES,
                anho: this.pd.ANHO
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
    async created() {
        try {
            const res = await this.$store.dispatch('getListaPd')
            this.datosTotal = res
            this.datosOp = res
        } catch (error) {
            console.log(error)
        } finally{
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
            return this.pd.NROPROG == this.input.CONFIRMACION_ELIM
        }
    }
}
</script>

<style>

</style>