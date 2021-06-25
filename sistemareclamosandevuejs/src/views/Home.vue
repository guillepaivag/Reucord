<template>
  <div class="home">
    <div v-if="system.loading">
      <loading></loading>
    </div>

    <div v-else-if="system.error">
      <error></error>
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
              <!-- HOY -->
              <div class="card">
                <div class="card-header" id="headingOne">
                  <h2 class="mb-0">
                    <button
                      class="btn btn-link btn-block text-left"
                      type="button"
                      data-toggle="collapse"
                      data-target="#collapseOne"
                      aria-expanded="true"
                      aria-controls="collapseOne"
                    >
                      {{ dates.todayDate }} - Hoy
                    </button>
                  </h2>
                </div>

                <div
                  id="collapseOne"
                  class="collapse show"
                  aria-labelledby="headingOne"
                  data-parent="#accordionExample"
                >
                  <div class="card-body">
                    <div class="row">
                      <div class="col-md-6">
                        <h5>PD:</h5>
                        <hr />
                        <ul v-if="todayPd.length > 0">
                          <li
                            class="listaTrabajos__ul__li"
                            v-for="(item, index) in todayPd"
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
                                    item.dato.NROPROG,
                                    item.dato.PDFECHA.substring(0, 10)
                                  )
                                "
                              >
                                Ver datos
                              </b-button>
                              <hr />
                              <p>Nro: {{ item.dato.NROPROG }}</p>
                              <p>
                                Fecha: {{ item.dato.PDFECHA.substring(0, 10) }}
                              </p>
                              <p>
                                FechaTrabajo:
                                {{ item.dato.FECHATRA.substring(0, 10) }}
                              </p>
                            </div>
                          </li>
                        </ul>
                        <p v-else>No hay trabajo</p>
                      </div>
                      <div class="col-md-6">
                        <h5>PS:</h5>
                        <hr />
                        <ul v-if="todayPs.length > 0">
                          <li
                            class="listaTrabajos__ul__li"
                            v-for="(item, index) in todayPs"
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
                                    item.dato.REUFECHA,
                                    item.dato.REUNRO,
                                    item.dato.ITEM,
                                    item.dato.FECHATRABA.substring(0, 10)
                                  )
                                "
                              >
                                Ver datos
                              </b-button>
                              <hr />
                              <p>Reufecha: {{ item.dato.REUFECHA }}</p>
                              <p>Reunro: {{ item.dato.REUNRO }}</p>
                              <p>Item: {{ item.dato.ITEM }}</p>
                              <p>
                                Fecha:
                                {{ item.dato.FECHATRABA.substring(0, 10) }}
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

              <!-- MAÑANA -->
              <div class="card">
                <div class="card-header" id="headingTwo">
                  <h2 class="mb-0">
                    <button
                      class="btn btn-link btn-block text-left collapsed"
                      type="button"
                      data-toggle="collapse"
                      data-target="#collapseTwo"
                      aria-expanded="false"
                      aria-controls="collapseTwo"
                    >
                      {{ dates.tomorrowDate }} - Mañana
                    </button>
                  </h2>
                </div>
                <div
                  id="collapseTwo"
                  class="collapse"
                  aria-labelledby="headingTwo"
                  data-parent="#accordionExample"
                >
                  <div class="card-body">
                    <div class="row">
                      <div class="col-md-6">
                        <h5>PD:</h5>
                        <hr />
                        <ul v-if="tomorrowPd.length > 0">
                          <li
                            class="listaTrabajos__ul__li"
                            v-for="(item, index) in tomorrowPd"
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
                                    item.dato.NROPROG,
                                    item.dato.PDFECHA.substring(0, 10)
                                  )
                                "
                                >Ver datos</b-button
                              >
                              <hr />
                              <p>Nro: {{ item.dato.NROPROG }}</p>
                              <p>
                                Fecha: {{ item.dato.PDFECHA.substring(0, 10) }}
                              </p>
                              <p>
                                FechaTrabajo:
                                {{ item.dato.FECHATRA.substring(0, 10) }}
                              </p>
                            </div>
                          </li>
                        </ul>
                        <p v-else>No hay trabajo</p>
                      </div>
                      <div class="col-md-6">
                        <h5>PS:</h5>
                        <hr />
                        <ul v-if="tomorrowPs.length > 0">
                          <li
                            class="listaTrabajos__ul__li"
                            v-for="(item, index) in tomorrowPs"
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
                                    item.dato.REUFECHA,
                                    item.dato.REUNRO,
                                    item.dato.ITEM,
                                    item.dato.FECHATRABA.substring(0, 10)
                                  )
                                "
                              >
                                Ver datos
                              </b-button>
                              <hr />
                              <p>Reufecha: {{ item.dato.REUFECHA }}</p>
                              <p>Reunro: {{ item.dato.REUNRO }}</p>
                              <p>Item: {{ item.dato.ITEM }}</p>
                              <p>
                                Fecha:
                                {{ item.dato.FECHATRABA.substring(0, 10) }}
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

              <!-- PASADO MAÑANA -->
              <div class="card">
                <div class="card-header" id="headingThree">
                  <h2 class="mb-0">
                    <button
                      class="btn btn-link btn-block text-left collapsed"
                      type="button"
                      data-toggle="collapse"
                      data-target="#collapseThree"
                      aria-expanded="false"
                      aria-controls="collapseThree"
                    >
                      {{ dates.dayAfterTomorrowDate }} - Pasado mañana
                    </button>
                  </h2>
                </div>
                <div
                  id="collapseThree"
                  class="collapse"
                  aria-labelledby="headingThree"
                  data-parent="#accordionExample"
                >
                  <div class="card-body">
                    <div class="row">
                      <div class="col-md-6">
                        <h5>PD:</h5>
                        <hr />
                        <ul v-if="dayAfterTomorrowPd.length > 0">
                          <li
                            class="listaTrabajos__ul__li"
                            v-for="(item, index) in dayAfterTomorrowPd"
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
                                    item.dato.NROPROG,
                                    item.dato.PDFECHA.substring(0, 10)
                                  )
                                "
                                >Ver datos</b-button
                              >
                              <hr />
                              <p>Nro: {{ item.dato.NROPROG }}</p>
                              <p>
                                Fecha: {{ item.dato.PDFECHA.substring(0, 10) }}
                              </p>
                              <p>
                                FechaTrabajo:
                                {{ item.dato.FECHATRA.substring(0, 10) }}
                              </p>
                            </div>
                          </li>
                        </ul>
                        <p v-else>No hay trabajo</p>
                      </div>
                      <div class="col-md-6">
                        <h5>PS:</h5>
                        <hr />
                        <ul v-if="dayAfterTomorrowPs.length > 0">
                          <li
                            class="listaTrabajos__ul__li"
                            v-for="(item, index) in dayAfterTomorrowPs"
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
                                    item.dato.REUFECHA,
                                    item.dato.REUNRO,
                                    item.dato.ITEM,
                                    item.dato.FECHATRABA.substring(0, 10)
                                  )
                                "
                              >
                                Ver datos
                              </b-button>
                              <hr />
                              <p>Reufecha: {{ item.dato.REUFECHA }}</p>
                              <p>Reunro: {{ item.dato.REUNRO }}</p>
                              <p>Item: {{ item.dato.ITEM }}</p>
                              <p>
                                Fecha:
                                {{ item.dato.FECHATRABA.substring(0, 10) }}
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
          <li>LOCAL: {{ getPd.LOCAL }}</li>
          <li>CIRCUITO: {{ getPd.CIRCUITO }}</li>
          <li>EQUIPO: {{ getPd.EQUIPO }}</li>
          <li>NROPROG: {{ getPd.NROPROG }}</li>
          <li>PDTRASMI: {{ getPd.PDTRASMI }}</li>
          <li>PDFECHA: {{ getPd.PDFECHA }}</li>
          <li>HORA TRASMITIDA: {{ getPd.HORATRAS }}</li>
          <li>ESTADO: {{ getPd.ESTADO }}</li>
          <li>TRABAJO: {{ getPd.TRABAJO }}</li>
          <li>RESPONSABLE: {{ getPd.RESPONSABLE }}</li>
          <li>OBSERVACION: {{ getPd.OBSERVACION }}</li>
          <li>JEFATURA: {{ getPd.JEFATURA }}</li>
          <li>NRO_REC: {{ getPd.NRO_REC }}</li>
          <li>FECHA_REC: {{ getPd.FECHA_REC }}</li>
          <li>RECIBIDO POR: {{ getPd.RECIBIDO }}</li>
          <li>RESULTADO: {{ getPd.RESULTADO }}</li>
          <hr />
          <li>
            Trabajos:
            <div class="container" v-if="getPdTrabajos.length > 0">
              <ul v-for="(trabajo, index) in getPdTrabajos" :key="index">
                <li>
                  {{ trabajo.FECHATRA }}
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
                      Fecha de trabajo: {{getPs.FECHATRABA}}
                  </li>
                  <li>
                      Hora inicio: {{getPs.HORADESDE}}
                  </li>
                  <li>
                      Hora fin: {{getPs.HORAHASTA}}
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
                      Fecha de reclamo: {{getPs.FECHA_REC}}
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
import error from "@/components/Error";

export default {
  name: "Home",
  data() {
    return {
      datos: [],
      system: {
        completed: false,
        loading: false,
        error: false,
        loadingModal: false
      },

      dates: {
        todayDate: "",
        tomorrowDate: "",
        dayAfterTomorrowDate: ""
      },

      allPdTrabajosForDate: {
        today: [],
        tomorrow: [],
        dayAfterTomorrow: []
      },

      allPdDatosForDate: [],

      allPsTrabajosForDate: {
        today: [],
        tomorrow: [],
        dayAfterTomorrow: []
      }
    };
  },
  components: {
    loading,
    error
  },
  async created() {
    try {
      this.loading = true;
      const res = await this.axios.get("/getListWorksForDate");

      if (!res.data.codigo.includes("Error")) {
        this.system.completed = res.data.respuesta.completed;
        this.dates = res.data.respuesta.dates;
        this.allPdTrabajosForDate = res.data.respuesta.pd;
        this.allPdDatosForDate = res.data.respuesta.allPdDatosForDate;
        this.allPsTrabajosForDate = res.data.respuesta.ps;
      } else {
      }
    } catch (error) {
      this.error = true;
    } finally {
      this.loading = false;
    }
  },
  methods: {
    ...mapMutations(['setPsState', "setPdState", "setPdTrabajosState"]),
    async verDatosPD(nro, fecha) {
      try {
        this.system.loadingModal = true
        this.$refs["modalVistaPd"].show();

        console.log(nro, fecha)

        let dia = fecha.substring(0, 2);
        let mes = fecha.substring(3, 5);
        let anho = fecha.substring(6, 10);

        const res = await this.axios.post(`pdOne/${nro}/${dia}/${mes}/${anho}`);

        const resTra = await this.axios.post(
          `/pdOneTrabajos/${nro}/${dia}/${mes}/${anho}`
        );

        if (
          !res.data.codigo.includes("Error") &&
          !resTra.data.codigo.includes("Error")
        ) {
          this.setPdState(res.data.respuesta[0]);
          this.setPdTrabajosState(resTra.data.respuesta);
        } else {
        }
      } catch (error) {
        console.log('error', error)
      } finally {
        this.system.loadingModal = false
      }
    },
    async verDatosPS(reufecha, reunro, item, fecha) {
      try {
        this.system.loadingModal = true
        this.$refs["modalVistaPs"].show();

        console.log(reufecha, reunro, item, fecha)

        let dia = fecha.substring(8, 10);
        let mes = fecha.substring(5, 7);
        let anho = fecha.substring(0, 4);

        const res = await this.axios.post(`psOne/${reufecha}/${reunro}/${item}/${dia}/${mes}/${anho}`);

        if ( !res.data.codigo.includes("Error") ) {
          this.setPsState(res.data.respuesta[0]);
        } else {
        }
      } catch (error) {
        console.log('error', error)
      } finally {
        this.system.loadingModal = false
      }
    },
    hideModalVista(modalVista) {
      this.$refs[modalVista].hide();
    }
  },
  computed: {
    ...mapGetters(['getPs', "getPd", "getPdTrabajos", "getLogeo"]),
    todayPd: function() {
      return this.allPdTrabajosForDate.today.filter(
        item => item.suspendido == false
      );
    },
    tomorrowPd: function() {
      return this.allPdTrabajosForDate.tomorrow.filter(
        item => item.suspendido == false
      );
    },
    dayAfterTomorrowPd: function() {
      return this.allPdTrabajosForDate.dayAfterTomorrow.filter(
        item => item.suspendido == false
      );
    },
    todayPs: function() {
      return this.allPsTrabajosForDate.today.filter(
        item => item.suspendido == false
      );
    },
    tomorrowPs: function() {
      return this.allPsTrabajosForDate.tomorrow.filter(
        item => item.suspendido == false
      );
    },
    dayAfterTomorrowPs: function() {
      return this.allPsTrabajosForDate.dayAfterTomorrow.filter(
        item => item.suspendido == false
      );
    }
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
