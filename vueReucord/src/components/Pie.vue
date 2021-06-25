<template>
    <footer class="bg-primary text-white text-center text-lg-start general">
        <!-- Grid container -->
        <div class="container p-4">
            <!--Grid row-->
            <div class="row">
            <!--Grid column-->
            <div class="col-lg-6 col-md-12 mb-4 mb-md-0">
                <h5 class="text-uppercase text-white">Reucord</h5>

                <p>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Iste atque ea quis
                molestias. Fugiat pariatur maxime quis culpa corporis vitae repudiandae aliquam
                voluptatem veniam, est atque cumque eum delectus sint!
                </p>
            </div>
            <!--Grid column-->

            <!--Grid column-->
            <div class="col-lg-3 col-md-6 mb-4 mb-md-0">
                <h5 class="text-uppercase text-white">Programaciones</h5>

                <ul class="list-unstyled mt-3">
                    <li>
                        <router-link class="text-white" to="/pd">Pedido de disponibilidad</router-link>
                    </li>
                    <li>
                        <router-link class="text-white" to="/ps">Programación semanal</router-link>
                    </li>
                    <li>
                        <router-link class="text-white" to="/tratadas">Tratados</router-link>
                    </li>
                </ul>
            </div>
            <!--Grid column-->

            <!--Grid column-->
            <div class="col-lg-3 col-md-6 mb-4 mb-md-0">
                <h5 class="text-uppercase mb-0 text-white">Otros</h5>

                <ul class="list-unstyled mt-3">
                    <li>
                        <router-link class="text-white" to="/equipos">Equipos</router-link>
                    </li>
                    <li>
                        <router-link class="text-white" to="/reclamos">Reclamos</router-link>
                    </li>
                    <li>
                        <router-link class="text-white" to="/suspensiones">Suspenciones</router-link>
                    </li>
                </ul>
            </div>
            <!--Grid column-->
            </div>
            <!--Grid row-->
        </div>
        <!-- Grid container -->

        <!-- Copyright -->
        <div class="text-center p-3" style="background-color: rgba(0, 0, 0, 0.2)">
            Reucord - 
            <!-- <router-link class="text-white" to="/">sistemareclamosande2021.web.app</router-link> -->
            <a class="text-white" href="https://sistemareclamosande2021.web.app">sistemareclamosande2021.web.app</a>
        </div>
        <!-- Copyright -->
    </footer>
</template>

<script>
export default {
    name: 'pie'
}
</script>

<style>
    .general {
        margin-top: 75px !important;
    }
</style>