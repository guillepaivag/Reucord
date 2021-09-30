<template>
  <div class="home">
    <div v-if="system.loading">
      <loading></loading>
    </div>

    <div v-else>
      <b-jumbotron class="jumbo">
        <h1 class="titulo">Reucord <samp>Beta</samp></h1>

        <label class="subtitulo">Carga los datos en Reucord.</label>

        <hr width="90%" class="my-4" style="float: left;" />

        <div class="mt-5" v-if="!getLogeo">
          <router-link class="btn btn-primary mt-3" to="/login"
            >Iniciar sesión</router-link
          >
        </div>
        <div v-else>
          <div class="listbtn">
            <ul id="lista">
              <li>
                <router-link to="/equipos" class="btn btn-outline-primary mt-3"
                  >Equipos</router-link
                >
              </li>
              <li>
                <div class="btn-group" role="group">
                  <button
                    id="btnGroupDrop1"
                    type="button"
                    class="btn btn-outline-primary dropdown-toggle mt-3"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    Programaciones a tratar
                  </button>
                  <div class="dropdown-menu" aria-labelledby="btnGroupDrop1">
                    <router-link to="/pd" class="dropdown-item"
                      >Pedido de disponibilidad</router-link
                    >
                    <router-link to="/ps" class="dropdown-item"
                      >Programación semanal</router-link
                    >
                  </div>
                </div>
              </li>
              <li>
                <router-link to="/tratadas" class="btn btn-outline-primary mt-3"
                  >Programaciones tratadas</router-link
                >
              </li>
            </ul>
          </div>
        </div>
        <!-- <b-button variant="success" href="#">Do Something Else</b-button> -->
      </b-jumbotron>

      <hr />

      <div class="mt-4">
        <div class="container">
          <div class="row">
            <div class="col-md-4">
              <div class="card border-danger mb-3" style="max-width: 18rem;">
                <div class="card-header">Header</div>
                <div class="card-body text-danger">
                  <h5 class="card-title">Primary card title</h5>
                  <p class="card-text">
                    Some quick example text to build on the card title and make
                    up the bulk of the card's content.
                  </p>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card border-secondary mb-3" style="max-width: 18rem;">
                <div class="card-header">Header</div>
                <div class="card-body text-secondary">
                  <h5 class="card-title">Success card title</h5>
                  <p class="card-text">
                    Some quick example text to build on the card title and make
                    up the bulk of the card's content.
                  </p>
                </div>
              </div>
            </div>
            <div class="col-md-4">
              <div class="card border-info mb-3" style="max-width: 18rem;">
                <div class="card-header">Header</div>
                <div class="card-body text-info">
                  <h5 class="card-title">Danger card title</h5>
                  <p class="card-text">
                    Some quick example text to build on the card title and make
                    up the bulk of the card's content.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <hr />

          <div class="">
            <div
              class="accordion"
              id="accordionExample"
              v-if="system.completed != false"
            >
              <div v-for="(dia, index) in nombreDias" :key="index">
                <div class="card">
                  <div class="card-header" id="headingOne">
                    <h2 class="mb-0">
                      <button
                        class="btn btn-link btn-block text-left"
                        type="button"
                        data-toggle="collapse"
                        :data-target="`#collapse${index}`"
                        aria-expanded="true"
                        :aria-controls="`collapse${index}`"
                      >
                        {{ trabajos.pdTrabajos[index].paraFormatoFecha }} - {{ trabajos.pdTrabajos[index].paraFormatoTexto }}
                      </button>
                    </h2>
                  </div>

                  <div
                    :id="`collapse${index}`"
                    :class="`collapse ${index === 0 ? 'show' : ''}` "
                    aria-labelledby="headingOne"
                    data-parent="#accordionExample"
                  >
                    <div class="card-body">
                      <div class="row">
                        <div class="col-md-6">
                          <h5> {{ trabajos.pdTrabajos[index].tipo }}: </h5>
                          <hr />
                          <ul v-if="trabajos.pdTrabajos[index].datosTrabajos.length > 0">
                            <li
                              class="listaTrabajos__ul__li"
                              v-for="(item, index) in trabajos.pdTrabajos[index].datosTrabajos"
                              :key="index"
                            >
                              <div class="">
                                <samp>Trabajo n°{{ index + 1 }}</samp> |
                                <b-button
                                  size="sm"
                                  pill 
                                  variant="outline-primary"
                                  v-on:click="
                                    verDatosPD(
                                      item.NROPROG,
                                      item.PDFECHA.substring(0, 10)
                                    )
                                  "
                                >
                                  Ver datos
                                </b-button>
                                <hr />
                                <p>Nro: {{ item.NROPROG }}</p>
                                <p>
                                  Fecha: {{ item.PDFECHA.substring(0, 10) }}
                                </p>
                                <p>
                                  FechaTrabajo:
                                  {{ item.FECHATRA.substring(0, 10) }}
                                </p>
                              </div>
                            </li>
                          </ul>
                          <p v-else>No hay trabajo</p>
                        </div>
                        <div class="col-md-6">
                          <h5>PS:</h5>
                          <hr />
                          <ul v-if="trabajos.psTrabajos[index].datosTrabajos.length > 0">
                            <li
                              class="listaTrabajos__ul__li"
                              v-for="(item, index) in trabajos.psTrabajos[index].datosTrabajos"
                              :key="index"
                            >
                              <div class="">
                                <samp>Trabajo n°{{ index + 1 }}</samp> |
                                <b-button
                                  size="sm"
                                  pill 
                                  variant="outline-primary"
                                  v-on:click="
                                    verDatosPS(
                                      item.REUFECHA,
                                      item.REUNRO,
                                      item.ITEM
                                    )
                                  "
                                >
                                  Ver datos
                                </b-button>
                                <hr />
                                <p>Reufecha: {{ item.REUFECHA }}</p>
                                <p>Reunro: {{ item.REUNRO }}</p>
                                <p>Item: {{ item.ITEM }}</p>
                                <p>
                                  Fecha:
                                  {{ item.FECHATRABA.substring(0, 10) }}
                                </p>
                              </div>
                            </li>
                          </ul>
                          <p v-else>No hay trabajo</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else>
              <b>
                Buscando trabajos para estos dias:
              </b>
              <div class="spinner-border ml-3 mt-2" role="status">
                <span class="sr-only">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <b-modal ref="modalVistaPd" hide-footer title="Pedido de disponibilidad">

      <div v-if="system.loadingModal">
        CARGANDO...
      </div>

      <div v-else>
        <div class="d-block text-center">
          <h3>PD</h3>
        </div>
        <hr />
        <ul>
          <li>LOCAL: {{ pd.LOCAL }}</li>
          <li>CIRCUITO: {{ pd.CIRCUITO }}</li>
          <li>EQUIPO: {{ pd.EQUIPO }}</li>
          <li>NROPROG: {{ pd.NROPROG }}</li>
          <li>PDTRASMI: {{ pd.PDTRASMI }}</li>
          <li>PDFECHA: {{ pd.PDFECHA ? pd.PDFECHA.substring(0, 10) : '' }}</li>
          <li>HORA TRASMITIDA: {{ pd.HORATRAS }}</li>
          <li>ESTADO: {{ pd.ESTADO }}</li>
          <li>TRABAJO: {{ pd.TRABAJO }}</li>
          <li>RESPONSABLE: {{ pd.RESPONSABLE }}</li>
          <li>OBSERVACION: {{ pd.OBSERVACION }}</li>
          <li>JEFATURA: {{ pd.JEFATURA }}</li>
          <li>NRO_REC: {{ pd.NRO_REC }}</li>
          <li>FECHA_REC: {{ pd.FECHA_REC ? pd.FECHA_REC.substring(0, 10) : '' }}</li>
          <li>RECIBIDO POR: {{ pd.RECIBIDO }}</li>
          <li>RESULTADO: {{ pd.RESULTADO }}</li>
          <hr />
          <li>
            Trabajos:
            <div class="container" v-if="pdTrabajos.length > 0">
              <ul v-for="(trabajo, index) in pdTrabajos" :key="index">
                <li>
                  {{ trabajo.FECHATRA ? trabajo.FECHATRA.substring(0, 10) : '' }}
                </li>
                <li>
                  {{ trabajo.HORAINI }}
                </li>
                <li>
                  {{ trabajo.HORAFIN }}
                </li>
                <hr />
              </ul>
            </div>
            <div class="container" v-else>
              <label class="mt-2"
                >No hay trabajos para este pedido de disponibilidad</label
              >
            </div>
          </li>
        </ul>

        <hr />
        <div class="container">
          <!-- <b-button
            class="mt-2"
            variant="outline-success"
            block
            @click="generarInforme"
            >Generar informe</b-button
          > -->
          <b-button
            class="mt-2"
            variant="outline-danger"
            block
            @click="hideModalVista('modalVistaPd')"
            >Volver</b-button
          >
        </div>
      </div>

    </b-modal>

    <b-modal ref="modalVistaPs" hide-footer title="Programación semanal">
        <div v-if="system.loadingModal">
          CARGANDO...
        </div>

        <div v-else>
          <div class="d-block text-center">
            <h3>PS</h3>
          </div>
          <hr>
              <ul>
                  <li>
                      Reufecha: {{ps.REUFECHA}}
                  </li>
                  <li>
                      Reunro: {{ps.REUNRO}}
                  </li>
                  <li>
                      Item: {{ps.ITEM}}
                  </li>
                  <li>
                      Local: {{ps.LOCAL}}
                  </li>
                  <li>
                      Circuito: {{ps.CIRCUITO}}
                  </li>
                  <li>
                      Equipo: {{ps.EQUIPO}}
                  </li>
                  <li>
                      Trabajo: {{ps.TRABAJO}}
                  </li>
                  <li>
                      Aut: {{ps.AUT}}
                  </li>
                  <li>
                      Estado: {{ps.ESTADO}}
                  </li>
                  <li>
                      Observación: {{ps.OBSERVAC}}
                  </li>
                  <li>
                      Resultado: {{ps.RESULTADO}}
                  </li>
                  <li>
                      Responsable: {{ps.RESPONSABLE}}
                  </li>
                  <li>
                      Ampliación: {{ps.AMPLIACION}}
                  </li>
                  <li>
                      Nro de reclamo: {{ps.NRO_REC}}
                  </li>
                  <li>
                      Fecha de reclamo: {{ ps.FECHA_REC ? ps.FECHA_REC.substring(0, 10) : '' }}
                  </li>
                  <hr />
                  <li>
                    Trabajos:
                    <div class="container" v-if="psTrabajos.length > 0">
                      <ul v-for="(trabajo, index) in psTrabajos" :key="index">
                        <li>
                            Fecha de trabajo: {{ trabajo.FECHATRABA ? trabajo.FECHATRABA.substring(0, 10) : '' }}
                        </li>
                        <li>
                            Hora inicio: {{trabajo.HORADESDE}}
                        </li>
                        <li>
                            Hora fin: {{trabajo.HORAHASTA}}
                        </li>  
                        <hr />
                      </ul>
                    </div>
                    <div class="container" v-else>
                      <label class="mt-2"
                        >No hay trabajos para este pedido de disponibilidad</label
                      >
                    </div>
                  </li>
              </ul>  

          <hr>

          <div class="container">
              <!-- <b-button class="mt-2" variant="outline-success" block @click="generarInforme">Generar informe</b-button> -->
              <b-button class="mt-2" variant="outline-danger" block @click="hideModalVista('modalVistaPs')">Volver</b-button>
          </div>
        </div>

    </b-modal>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapMutations, mapActions, mapGetters } from "vuex";
import loading from "@/components/Loading";

export default {
  name: "Home",
  data() {
    return {
      datos: [],
      system: {
        completed: false,
        loading: false,
        loadingModal: false
      },
      nombreDias: ['Hoy', 'Mañana', 'Pasado mañana'],
      trabajos: {
        pdTrabajos: [],
        psTrabajos: []
      },
      pd: {},
      pdTrabajos: [],
      ps: {},
      psTrabajos: []
    }
  },
  components: {
    loading,
  },
  methods: {
    ...mapMutations(['setPsState', "setPdState", "setPdTrabajosState"]),
    async verDatosPD(nro, fecha) {
      try {
        this.system.loadingModal = true
        this.$refs["modalVistaPd"].show()

        const nroprog = parseInt(nro)
        const pdfecha = new Date(`${fecha}T13:00:00.000Z`)

        let dia = pdfecha.getDate()
        let mes = pdfecha.getMonth() + 1
        let anho = pdfecha.getFullYear()

        this.pd = await this.$store.dispatch('getPd', {
          nroprog, dia, mes, anho
        })

        this.pdTrabajos = await this.$store.dispatch('getPdTrabajo', {
          nroprog, dia, mes, anho
        })

      } catch (error) {
        console.log('error', error)
      } finally {
        this.system.loadingModal = false
      }
    },
    async verDatosPS(reufecha, reunro, item) {
      try {
        this.system.loadingModal = true
        this.$refs["modalVistaPs"].show();

        this.ps = await this.$store.dispatch('getPs', {
          reufecha, reunro, item
        })

        this.psTrabajos = await this.$store.dispatch('getPsTrabajo', {
          reufecha, reunro, item
        })

      } catch (error) {
        console.log('error', error)
        this.$store.dispatch('setError', error)
      } finally {
        this.system.loadingModal = false
      }
    },
    hideModalVista(modalVista) {
      this.$refs[modalVista].hide();
    }
  },
  async created() {
    try {
      this.loading = true
      
      this.trabajos = await this.$store.dispatch('listaDeTrabajosPorDia')

      this.system.completed = true

    } catch (error) {
      console.log(error)
      this.$store.dispatch('setError', error)
    } finally {
      this.loading = false;
    }
  },
  computed: {
    ...mapGetters(['getPs', "getPd", "getPdTrabajos", "getPsTrabajos", "getLogeo"]),
  }
};
</script>

<style scoped>
.titulo {
  margin-top: 60px;
  font-size: 50px;
}
.subtitulo {
  font-size: 20px;
  margin-bottom: 30px;
}
.listbtn {
  margin-top: 50px;
}
.jumbo {
  padding-bottom: 10em;
}

#lista {
  list-style: none;
  margin-left: -40px;
}

#lista li {
  display: inline;
  margin-right: 20px;
}

.listCardHor li {
  display: inline;
}

.listaTrabajos__ul__li {
  margin: 5px 0px;
}

@media only screen and (max-width: 380px) {
  .titulo {
    margin-top: 60px;
    font-size: 30px;
  }
}
</style>
