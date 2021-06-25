<template>
    <div class="container">
        <div class="row positionButton">
            <div class="col-md-12 mt-5" v-for="(item, index) in listDataProgramming" :key="index">
                <b-button variant="outline-primary" class="btnListProgramming" :disabled="item.disabled" :to="item.to"> {{ item.text }} </b-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: '',
    data() {
        return {
            listDataProgramming: [
                {
                    text: 'Pedido de disponibilidad',
                    to: '/pd',
                    disabled: false
                },
                {
                    text: 'Programación semanal',
                    to: '/ps',
                    disabled: false
                },
                {
                    text: 'Programaciones por local',
                    to: '/programaciones/local',
                    disabled: false
                },
                {
                    text: 'Programaciones por equipo',
                    to: '/programaciones/equipo',
                    disabled: true
                }
            ]
        }
    },
}
</script>

<style>
    .positionButton {
        text-align: center;
    }
</style>