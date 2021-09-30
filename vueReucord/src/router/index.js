import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from 'firebase'

import store from '@/store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: {
      title: 'Inicio - Reucord',
      requiresAuth: false
    },
    // beforeEnter: (to, from, next) => beforeEnter(to, from, next)
  },
  {
    path: '/hubo-un-problema',
    name: 'Error',
    component: () => import('../views/Error.vue'),
    meta: {
      title: 'Hubo un problema - Reucord',
      requiresAuth: false
    },
    // beforeEnter: (to, from, next) => beforeEnter(to, from, next)
  },
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/Login.vue'),
    meta: {
      title: 'Login - Reucord',
      requiresAuth: false
    },
    // beforeEnter: (to, from, next) => beforeEnter(to, from, next)
  },
  {
    path: '/reclamos',
    name: 'Reclamos.Home',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/reclamos/index.vue'),
    meta: {
      title: 'Reclamos - Reucord',
      requiresAuth: false
    },
  },
  {
    name: 'Reclamos.Add',
    path: '/reclamos/agregarReclamo',
    component: () => import('../views/reclamos/AddEdit.vue'),
    meta: {
      title: 'Agregar un reclamo - Reucord',
      requiresAuth: true,
      add: 'add'
    },
  },
  {
    name: 'Reclamos.Edit',
    path: '/reclamos/editarReclamo/:dmednro/:dia/:mes/:anho',
    component: () => import('../views/reclamos/AddEdit.vue'),
    meta: {
      title: 'Editar un reclamo - Reucord',
      requiresAuth: true,
      add: 'edit'
    }
  },
  {
    path: '/equipos',
    name: 'Equipos.Home',
    component: () => import('../views/equipos/Index.vue'),
    meta: {
      title: 'Equipos - Reucord',
      requiresAuth: true
    },
  },
  {
    name: 'Equipos.Add',
    path: '/equipos/agregarEquipo',
    component: () => import('../views/equipos/AddEquipos.vue'),
    meta: {
      title: 'Agregar un equipo - Reucord',
      requiresAuth: true
    },
  },
  {
    name: 'Equipos.Edit',
    path: '/equipos/modificarEquipo/:local/:circuito/:equipo',
    component: () => import('../views/equipos/EditEquipos.vue'),
    meta: {
      title: 'Modificar un equipo - Reucord',
      requiresAuth: true
    }
  },
  {
    name: 'Equipos.Analisis',
    path: '/equipos/analisis',
    component: () => import('../views/equipos/Analisis.vue'),
    meta: {
      title: 'Analisis de equipo - Reucord',
      requiresAuth: true
    }
  },
  {
    name: 'Equipos.Trabajos',
    path: '/equipos/trabajos',
    component: () => import('../views/equipos/Trabajos.vue'),
    meta: {
      title: 'Trabajos - Reucord',
      requiresAuth: true
    }
  },
  {
    path: '/pd',
    name: 'Pd.home',
    component: () => import('../views/pd/index.vue'),
    meta: {
      title: 'Pedido de disponibiliad - Reucord',
      requiresAuth: true
    },
  },
  {
    name: 'Pd.viewPd',
    path: '/pd/verPd-aTratar/:nroprog/:dia/:mes/:anho',
    component: () => import('../views/pd/AddEdit.vue'),
    meta: {
      title: 'Ver un pedido de disponibilidad - Reucord',
      requiresAuth: true
    },
  },
  {
    name: 'Pd.addPd',
    path: '/pd/agregarPd-aTratar',
    component: () => import('../views/pd/AddEdit.vue'),
    meta: {
      title: 'Agregar un pedido de disponibilidad - Reucord',
      requiresAuth: true
    },
  },
  {
    name: 'Pd.editPd',
    path: '/pd/editarPd-aTratar/:nroprog/:dia/:mes/:anho',
    component: () => import('../views/pd/AddEdit.vue'),
    meta: {
      title: 'Editar un pedido de disponibilidad - Reucord',
      requiresAuth: true
    },
  },
  {
    path: '/ps',
    name: 'Ps.Home',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/ps/index.vue'),
    meta: {
      title: 'Programación semanal - Reucord',
      requiresAuth: false
    },
  },
  {
    name: 'Ps.viewPs',
    path: '/ps/verPs-aTratar/:reufecha/:reunro/:item',
    component: () => import('../views/ps/AddEdit.vue'),
    meta: {
      title: 'Ver una programación semanal - Reucord',
      requiresAuth: true
    },
  },
  {
    name: 'Ps.AddPs',
    path: '/ps/agregarPs-aTratar',
    component: () => import('../views/ps/AddEdit.vue'),
    meta: {
      title: 'Agregar una programación semanal - Reucord',
      requiresAuth: true
    },
  },
  {
    name: 'Ps.EditPs',
    path: '/ps/editarPs-aTratar/:reufecha/:reunro/:item',
    component: () => import('../views/ps/AddEdit.vue'),
    meta: {
      title: 'Editar una programación semanal - Reucord',
      requiresAuth: true
    },
  },
  {
    path: '/programaciones',
    name: 'Prog.Home',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/programaciones/index.vue'),
    meta: {
      title: 'Programaciones - Reucord',
      requiresAuth: false
    },
  },
  {
    name: 'Prog.Locales',
    path: '/programaciones/local',
    component: () => import('../views/programaciones/locales.vue'),
    meta: {
      title: 'Programaciones - Reucord',
      requiresAuth: true
    },
    children: [
      {
        name: 'Prog.Local',
        props: true,
        path: ':local',
        component: () => import('../views/programaciones/local.vue'),
        meta: {
          title: 'Programaciones - Reucord',
          requiresAuth: true
        }
      },
    ]
  },
  {
    path: '/suspensiones',
    name: 'Suspensiones.Home',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/suspensiones/index.vue'),
    meta: {
      title: 'Suspensiones - Reucord',
      requiresAuth: false
    },
  },
  {
    name: 'Suspensiones.Add',
    path: '/suspensiones/agregarSuspension',
    component: () => import('../views/suspensiones/cruSuspension.vue'),
    meta: {
      title: 'Agregar un reclamo - Reucord',
      requiresAuth: true,
      add: 'add'
    },
  },
  {
    name: 'Suspensiones.EditPd',
    path: '/suspensiones/editarSuspensionPd/:nroprog/:dia/:mes/:anho/:reunionano/:pditem',
    component: () => import('../views/suspensiones/cruSuspension.vue'),
    meta: {
      title: 'Editar una suspensión - Reucord',
      requiresAuth: true,
      add: 'edit'
    }
  },
  {
    name: 'Suspensiones.EditPs',
    path: '/suspensiones/editarSuspensionPs/:nroprog/:dia/:mes/:anho/:reunionano/:nroreun',
    component: () => import('../views/suspensiones/cruSuspension.vue'),
    meta: {
      title: 'Editar una suspensión - Reucord',
      requiresAuth: true,
      add: 'edit'
    }
  },
  
]

const router = new VueRouter({
  mode: 'history',
  // history: createWebHistory(),
  base: process.env.BASE_URL,
  routes
})

router.afterEach((to, from, next) => {
  const name = to.matched.some(record => record.name)
  
})

router.beforeEach((to, from, next) => {
  window.document.title = to.meta.title
  const name = to.matched.some(record => record.name)
  const requireAuth = to.matched.some(record => record.meta.requiresAuth)
  if (requireAuth) {
    if (store.state.usuario.logeado) {
      next()
    } else {
      next({ name: "Login" });
    }
  } else {
    if(name === 'Login'){
      if(store.state.usuario.logeado){
        next({ name: "Home" });
      }else{
        next();
      }
    }else{
      next();
    }
  }
});

export default router
