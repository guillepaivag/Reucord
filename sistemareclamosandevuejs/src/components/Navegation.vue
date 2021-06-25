<template>
  <div>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <router-link class="navbar-brand" to="/">Reucord <samp>Beta</samp></router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarColor01"
        aria-controls="navbarColor01"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarColor01">
        <ul class="navbar-nav mr-auto"></ul>

        <div class="nav-item derecha">
            <router-link class="btn btn-outline-light" to="/login">
                INICIAR SESIÓN
            </router-link>
        </div>

        <!-- <form class="form-inline my-2 my-lg-0">
          <input
            class="form-control mr-sm-2"
            type="text"
            placeholder="Search"
          />
          <button class="btn btn-secondary my-2 my-sm-0" type="submit">
            Search
          </button>
        </form> -->
      </div>
    </nav>
    <!-- and (max-width : 700px) -->
  </div>
</template>

<script>
export default {
  name: "navegation"
};
</script>

<style>
@media only screen and (min-width : 992px)  {
    .derecha{
        float: right;
    }
}
@media only screen and (max-width : 991px) {
    .derecha{
        margin-top: 20px;
        float: left;
    }
}
</style>