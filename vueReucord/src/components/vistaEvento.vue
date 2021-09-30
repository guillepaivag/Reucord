<template>
    <div>
        <div v-if="getLoading">
            <loading />
        </div>

        <div v-if="getError">
            <error />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import error from '@/components/Error.vue'
import loading from '@/components/Loading.vue'
export default {
    name: 'vistaEvento',
    data() {
        return {
            
        }
    },
    components: {
        loading, 
        error
    },
    computed: {
        ...mapGetters(['getLoading', 'getError']),
    }
}
</script>

<style>

</style>