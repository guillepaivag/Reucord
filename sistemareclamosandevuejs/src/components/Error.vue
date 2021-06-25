<template>
    <div class="posicion">
        <h2>HUBO UN PROBLEMA...</h2>
        <!-- <p v-if="direccionPrincipal"><router-link :to="'/'+direccionPrincipal"></router-link></p> -->
    </div>
</template>

<script>
export default {
    name: 'errores',
    props: {
        codigo: String,
        titulo: String,
        mensaje: String,
        direccionPrincipal: String
    }
}
</script>

<style scoped>
    .posicion{
        text-align: center;
        margin-top: 60vh;
    }
</style>