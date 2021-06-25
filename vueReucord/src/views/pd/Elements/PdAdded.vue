<template>
    <div class="wrapper">
        <div class="pdAdded" v-for="(item, index) in listPdAdded" :key="index">
            <div class="pdref">
                <h2>{{item.NROPROG}}</h2>
                <h2>{{item.PDFECHA}}</h2>
                <!-- <h4>999</h4>
                <h4>99/99/9999</h4> -->
            </div>
            <hr>
            <div class="btnInforme">
                <button type="button" v-on:click="generarInforme(item.NROPROG, item.PDFECHA)" class="btn btn-outline-primary">Generar informe</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'pdAdded',
    props: {
        listPdAdded: Array
    },
    methods: {
        async generarInforme(nroprog, pdfecha) {
            const dia = new Date(pdfecha + ' 0:00:00').getDate()
            const mes = new Date(pdfecha + ' 0:00:00').getMonth() + 1
            const anho = new Date(pdfecha + ' 0:00:00').getFullYear()
            try {
                // console.log('a enviar:')
                // console.log(this.pdRefAux.nro)
                // console.log(this.pdRefAux.dia)
                // console.log(this.pdRefAux.mes)
                // console.log(this.pdRefAux.anho)
                const res = await this.axios.get(`/pdInformeXLSX/${nroprog}/${dia}/${mes}/${anho}`,
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
                link.setAttribute("download", `ANDE_Informe_PedidoDisponibilidad.xlsx`);
                document.body.appendChild(link);
                link.click();
                link.remove();

                // download(res.data, 'Informe pedido de disponibilidad.xlsx')
                
                // console.log('informe generado:')
                // console.log(res)
                
                // this.hideModal()
                // this.mostrarTodo()
                // this.datosTotal.splice(this.indexEquipo, 1)
                // this.datosOp = this.datosTotal
                // this.actualizarDatos()
                
            } catch (error) {
                console.log(error)
            }
        }
    }
}
</script>

<style>
    .wrapper {
        max-width: 100%;
        border: 1px solid white;
        display: flex;
        overflow-x: auto;
    }

    /* .wrapper::-webkit-scrollbar {
        display: none;
    }  */

    .pdAdded {
        min-width: 250px;
        height: 350px;
        line-height: 220px;
        text-align: center;
        border: .5px solid black;
        background-color: white;
        margin-right: 2px;
    }

    .pdref {
        margin-top: 20px;
    }

    .btnInforme {
        margin-top: -20px;
    }
</style>