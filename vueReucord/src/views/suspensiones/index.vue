<template>
    <div class="container">
        <div v-if="getLoading">
            <loading></loading>
        </div>

        <div v-else>
            <div class="row mb-3 mt-3">
                <div class="col-md-9">
                    <div class="row">
                        <div class="col-md-12">
                            <label class="mt-2" for="">NROPROG:</label>
                            <input type="number" 
                            name="NROPROG"
                            v-on:keyup="filtro()"
                            v-model="input.NROPROG" 
                            class="form-control" 
                            placeholder="NROPROG">
                        </div>
                    </div>

                    <hr>

                    <div class="row">
                        <div class="col-md-4">
                            <label class="mt-2" for=""><i>DIA DE TRASMISIÓN:</i></label>
                            <input type="text" 
                            name="dia"
                            v-on:keyup="filtro()"
                            v-model="input.DIA" 
                            class="form-control" 
                            placeholder="DIA">
                        </div>
                        <div class="col-md-4">
                            <label class="mt-2" for=""><i>MES DE TRASMISIÓN:</i></label>
                            <input type="text" 
                            name="mes"
                            v-on:keyup="filtro()"
                            v-model="input.MES" 
                            class="form-control" 
                            placeholder="MES">
                        </div>
                        <div class="col-md-4">
                            <label class="mt-2" for=""><i>AÑO DE TRASMISIÓN:</i></label>
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
                        <div class="col-md-4">
                            <label class="mt-2" for="">NROREUN:</label>
                            <input type="text" 
                            name="NROREUN"
                            v-on:keyup="filtro()"
                            v-model="input.NROREUN" 
                            class="form-control" 
                            placeholder="NROREUN">
                        </div>
                        <div class="col-md-4">
                            <label class="mt-2" for="">REUNIONANO:</label>
                            <input type="text" 
                            name="REUNIONANO"
                            v-on:keyup="filtro()"
                            v-model="input.REUNIONANO" 
                            class="form-control" 
                            placeholder="REUNIONANO">
                        </div>
                        <div class="col-md-4">
                            <label class="mt-2" for="">PDITEM:</label>
                            <input type="text" 
                            name="PDITEM"
                            v-on:keyup="filtro()"
                            v-model="input.PDITEM" 
                            class="form-control" 
                            placeholder="PDITEM">
                        </div>
                    </div>

                </div>
                <div class="col-md-3">
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
                        </div>
                    </b-sidebar>
                </div>
            </div>

            <hr>
            <div>
                <div class="col-md-9" v-if="totalRow == 1">Hay {{totalRow}} dato</div>
                <div class="col-md-9" v-else>Hay {{totalRow}} datos</div>

                <table class="table table-hover table-responsive-xl mt-3">
                    <thead>
                        <tr>
                        <th scope="col">N°</th>
                        <th scope="col">NROPROG</th>
                        <th scope="col">FECHATRAS</th>
                        <th scope="col">NROREUN</th>
                        <th scope="col">REUNIONANO</th>
                        <th scope="col">PDITEM</th>
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
                            <td>{{dato.REUNIONANO}}</td>
                            <td>{{dato.PDITEM}}</td>
                            <td>
                                <button type="button" class="btn btn-outline-info btn-block" @click="cargarDatos(datos[index], index)">Cargar datos</button>
                                <button type="button" class="btn btn-outline-primary btn-block" @click="showModalVista(datos[index], index)">Ver datos</button>
                                <button class="btn btn-outline-success btn-block" v-on:click="goToEditSuspension(datos[index], index)">Editar</button>
                                <button type="button" id="show-btn" @click="showModalEliminacion(datos[index], index)" class="btn btn-outline-danger btn-block">Eliminar</button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div class="mx-auto">
                    <b-pagination
                        v-model="currentPage"
                        v-on:input="actualizarDatos"
                        :total-rows="totalRow"
                        :per-page="perPage"
                    ></b-pagination>
                </div>
            </div>

            <b-modal ref="modalVistaSuspension" hide-footer title="Suspensión">
                <div class="d-block text-center">
                    <h3>Suspensión</h3>
                </div>
                <hr>
                    
                    <ul>
                        <li>
                            NROPROG: {{suspension.NROPROG}}
                        </li>
                        <li>
                            FECHATRAS: {{ suspension.FECHATRAS ? suspension.FECHATRAS.toISOString().substring(0,10) : null }}
                        </li>
                        <li>
                            SUSMOD: {{suspension.HORATRAS}}
                        </li>
                        <li>
                            TRASMPOR: {{suspension.TRASMPOR}}
                        </li>
                        <li>
                            NROREUN: {{suspension.NROREUN}}
                        </li>
                        <li>
                            REUNIONANO: {{suspension.REUNIONANO}}
                        </li>
                        <li>
                            PDITEM: {{suspension.PDITEM}}
                        </li>
                        <li>
                            DESCRIP: {{suspension.DESCRIP}}
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
import XLSX from 'xlsx'
import download from 'js-file-download';
 
import { mapActions, mapMutations, mapGetters } from 'vuex'

export default {
    name: 'suspensiones',
    components: {
        loading
    },
    data() {
        return {
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
                PDITEM: ''
            },
            suspension: {
                NROPROG: null,
                FECHATRAS: null,
                HORATRAS: null,
                TRASMPOR: null,
                NROREUN: null,
                REUNIONANO: null,
                PDITEM: null,
                DESCRIP: null
            },
            datos: [],
            datosFiltrados: [],
            datosTotal: [],
            currentPage: 1,
            perPage: 10
        }
    },
    methods: {
        ...mapMutations(['setSuspensionMutation']),
        formatDate (date) {
            if (date) {
                return new Date( `${date.substring(0,10)}T13:00:00.000Z` )
            }

            return null
        },
        async mostrarTodo(){
            try {
                const suspensiones = await this.$store.dispatch('obtenerTodasLasSuspensiones')

                this.datosTotal = suspensiones
                this.datosFiltrados = suspensiones

                this.actualizarDatos()

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
            const fechatras = this.formatDate(dato.FECHATRAS)

            this.input.NROPROG = dato.NROPROG
            this.input.DIA = fechatras.getDate()
            this.input.MES = fechatras.getMonth()+1
            this.input.ANHO = fechatras.getFullYear()
            this.input.NROREUN = dato.NROREUN
            this.input.REUNIONANO = dato.REUNIONANO
            this.input.PDITEM = dato.PDITEM

            this.aviso()
            this.filtro()
        },
        showModalEliminacion(dato, index) {
            this.indexPD = index
            this.input.CONFIRMACION_ELIM = ''

            this.suspension = JSON.parse( JSON.stringify(dato) )

            this.suspension.NROPROG = parseInt(dato.NROPROG)
            this.suspension.FECHATRAS = this.formatDate(dato.FECHATRAS)
            this.suspension.NROREUN = dato.NROREUN ? parseInt(dato.NROREUN) : null
            this.suspension.REUNIONANO = parseInt(dato.REUNIONANO)
            this.suspension.PDITEM = parseInt(dato.PDITEM)

            this.$refs['modalElimSuspension'].show()
        },
        hideModalEliminacion() {
            this.$refs['modalElimSuspension'].hide()
        },
        async showModalVista(dato, index) {
            this.suspension = JSON.parse( JSON.stringify(dato) )

            this.suspension.NROPROG = parseInt(dato.NROPROG)
            this.suspension.FECHATRAS = this.formatDate(dato.FECHATRAS)
            this.suspension.NROREUN = dato.NROREUN ? parseInt(dato.NROREUN) : null
            this.suspension.REUNIONANO = parseInt(dato.REUNIONANO)
            this.suspension.PDITEM = parseInt(dato.PDITEM)

            this.$refs['modalVistaSuspension'].show()
        },
        hideModalVista() {
            this.$refs['modalVistaSuspension'].hide()
        },
        async generarInforme(){
            try {
                const refSuspension = this.getReferenciaSuspension(this.suspension)
                const { NROPROG, FECHATRAS, NROREUN, REUNIONANO, PDITEM } = refSuspension

                const DIA = FECHATRAS.getDate()
                const MES = FECHATRAS.getMonth() + 1
                const ANHO = FECHATRAS.getFullYear()

                const stringRefSusMod = `${NROPROG}/${DIA}/${MES}/${ANHO}/${NROREUN}/${REUNIONANO}/${PDITEM}`
                const res = await this.axios.get(`/suspensiones/informe/XLSX/${stringRefSusMod}`,
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

                const refSuspension = this.getReferenciaSuspension(this.suspension)

                const suspensionEliminada = await this.$store.dispatch('eliminarSuspension', {
                    idSuspension: refSuspension
                })

                await this.mostrarTodo()
                
                this.hideModalEliminacion()

            } catch (error) {
                console.log(error)
            }
        },
        getReferenciaSuspension(suspension) {
            const { NROPROG, FECHATRAS, NROREUN, REUNIONANO, PDITEM } = suspension

            return { NROPROG, FECHATRAS, NROREUN, REUNIONANO, PDITEM }
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
            this.datosFiltrados = []
            let contiene = []
            if(!(this.input.NROPROG || 
                this.input.DIA || 
                this.input.MES || 
                this.input.ANHO || 
                this.input.NROREUN ||
                this.input.REUNIONANO || 
                this.input.PDITEM)
            ){
                this.mostrarTodo()
            }else{
                for (let i = 0; i < this.datosTotal.length; i++) {
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

                    if(this.input.REUNIONANO){
                        if(dt.REUNIONANO){
                            if(dt.REUNIONANO == this.input.REUNIONANO){
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

                    if(!(contiene[0] == -1 || contiene[1] == -1 || contiene[2] == -1 || contiene[3] == -1 || contiene[4] == -1 || contiene[5] == -1 || contiene[6] == -1)){
                        if(contiene[0] == 1 || contiene[1] == 1 || contiene[2] == 1 || contiene[3] == 1 || contiene[4] == 1 || contiene[5] == 1 || contiene[6] == 1){
                            this.datosFiltrados.push(dt)
                        }
                    }
                }

                this.actualizarDatos()
            }
        },
        actualizarDatos(){
            this.datos = []
            for(let i = this.getStart(); (i <= this.getEnd()) && (i < this.datosFiltrados.length); i++){
                this.datos.push(this.datosFiltrados[i])
            }
        },
        async goToEditSuspension(dato, index){
            const suspensionPd = dato.NROREUN === null
            const namePath = suspensionPd ? 'Suspensiones.EditPd' : 'Suspensiones.EditPs'

            const fechatras = this.formatDate(dato.FECHATRAS)
            const dia = fechatras.getDate()
            const mes = fechatras.getMonth()+1
            const anho = fechatras.getFullYear()
            
            const paramsDeSuspensionRef = { 
                nroprog: dato.NROPROG,
                dia: dia,
                mes: mes,
                anho: anho,
                pditem: suspensionPd ? dato.PDITEM : null,
                reunionano: dato.REUNIONANO,
                nroreun: suspensionPd ? null : dato.NROREUN
            }

            this.$router.push({ 
                name: namePath,
                params: paramsDeSuspensionRef
            })

        },
        exportExcel: function () {
            if(this.nombreExcel){
                let data = XLSX.utils.json_to_sheet(this.datosFiltrados)
                const workbook = XLSX.utils.book_new()
                const filename = this.nombreExcel
                XLSX.utils.book_append_sheet(workbook, data, filename)
                XLSX.writeFile(workbook, `${filename}.xlsx`)
            }else{

            }
        }
    },
    async mounted() {
        try {
            this.$store.dispatch('setLoading', true)
            this.mostrarTodo()
        } catch (error) {
            console.log(error)
        } finally {
            this.$store.dispatch('setLoading', false)
        }
    },
    // beforeUpdate() {
    //     this.actualizarDatos()
    // },
    computed: {
        ...mapGetters(['getLoading']),
        totalRow() {
            return this.datosFiltrados.length
        },
        validacionEliminacion() {
            return this.suspension.NROPROG == this.input.CONFIRMACION_ELIM
        }
    }
}
</script>

<style>

</style>