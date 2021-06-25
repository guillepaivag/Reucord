import Vue from 'vue'
import VueRouter from 'vue-router'
import firebase from 'firebase'

import store from '@/store'

Vue.use(VueRouter)



const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "about" */ '../views/Home.vue'),
    meta: {
      title: 'Inicio - Reucord',
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
    component: () => import(/* webpackChunkName: "about" */ '../views/Login.vue'),
    meta: {
      title: 'Login - Reucord',
      requiresAuth: false
    },
    // beforeEnter: (to, from, next) => beforeEnter(to, from, next)
  },
  {
    path: '/reclamos',
    name: 'Reclamos',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AppsViews/AppReclamos.vue'),
    meta: {
      title: 'Reclamos - Reucord',
      requiresAuth: false
    },
    children: [
      {
        name: 'Reclamos.Home',
        path: '',
        component: () => import('../views/reclamos/index.vue'),
        meta: {
          title: 'Reclamos - Reucord',
          requiresAuth: true
        }
      },
      {
        name: 'Reclamos.Add',
        path: 'agregarReclamo',
        component: () => import('../views/reclamos/AddEdit.vue'),
        meta: {
          title: 'Agregar un reclamo - Reucord',
          requiresAuth: true,
          add: 'add'
        },
      },
      {
        name: 'Reclamos.Edit',
        path: 'editarReclamo/:dmednro/:dia/:mes/:anho',
        component: () => import('../views/reclamos/AddEdit.vue'),
        meta: {
          title: 'Editar un reclamo - Reucord',
          requiresAuth: true,
          add: 'edit'
        }
      }
    ]
    // beforeEnter: (to, from, next) => beforeEnter(to, from, next)
  },
  {
    path: '/equipos',
    name: 'Equipos',
    component: () => import(/* webpackChunkName: "about" */ '../views/AppsViews/AppEquipos.vue'),
    meta: {
      requiresAuth: true
    },
    // beforeEnter: (to, from, next) => beforeEnter(to, from, next),
    children: [
      {
        name: 'Equipos.Home',
        path: '',
        component: () => import('../views/equipos/Index.vue'), 
        meta: {
          title: 'Equipos - Reucord',
          requiresAuth: true
        },
      },
      {
        name: 'Equipos.Add',
        path: 'agregarEquipo',
        component: () => import('../views/equipos/AddEquipos.vue'),
        meta: {
          title: 'Agregar un equipo - Reucord',
          requiresAuth: true
        },
      },
      {
        name: 'Equipos.Edit',
        path: 'modificarEquipo/:local/:circuito/:equipo',
        component: () => import('../views/equipos/EditEquipos.vue'),
        meta: {
          title: 'Modificar un equipo - Reucord',
          requiresAuth: true
        }
      },
      {
        name: 'Equipos.Analisis',
        path: 'analisis',
        component: () => import('../views/equipos/Analisis.vue'),
        meta: {
          title: 'Analisis de equipo - Reucord',
          requiresAuth: true
        }
      }
    ]
  },
  {
    path: '/pd',
    name: 'Pd',
    component: () => import('../views/AppsViews/AppPD.vue'),
    meta: {
      requiresAuth: true
    },
    children: [
      {
        name: 'Pd.home',
        path: '',
        component: () => import('../views/pd/index.vue'),
        meta: {
          title: 'Pedido de disponibiliad - Reucord',
          requiresAuth: true
        }
      },
      {
        name: 'Pd.viewPd',
        path: 'verPd-aTratar/:nroprog/:dia/:mes/:anho',
        component: () => import('../views/pd/AddEdit.vue'),
        meta: {
          title: 'Ver un pedido de disponibilidad - Reucord',
          requiresAuth: true
        },
      },
      {
        name: 'Pd.addPd',
        path: 'agregarPd-aTratar',
        component: () => import('../views/pd/AddEdit.vue'),
        meta: {
          title: 'Agregar un pedido de disponibilidad - Reucord',
          requiresAuth: true
        },
      },
      {
        name: 'Pd.editPd',
        path: 'editarPd-aTratar/:nroprog/:dia/:mes/:anho',
        component: () => import('../views/pd/AddEdit.vue'),
        meta: {
          title: 'Editar un pedido de disponibilidad - Reucord',
          requiresAuth: true
        },
      }
    ]
  },
  {
    path: '/ps',
    name: 'Ps',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AppsViews/AppPS.vue'),
    meta: {
      title: 'Programación semanal - Reucord',
      requiresAuth: false
    },
    children: [
      {
        name: 'Ps.Home',
        path: '',
        component: () => import('../views/ps/index.vue'),
        meta: {
          title: 'Programación semanal - Reucord',
          requiresAuth: true
        }
      },
      {
        name: 'Ps.viewPs',
        path: 'verPs-aTratar/:reufecha/:reunro/:item',
        component: () => import('../views/ps/AddEdit.vue'),
        meta: {
          title: 'Ver una programación semanal - Reucord',
          requiresAuth: true
        },
      },
      {
        name: 'Ps.AddPs',
        path: 'agregarPs-aTratar',
        component: () => import('../views/ps/AddEdit.vue'),
        meta: {
          title: 'Agregar una programación semanal - Reucord',
          requiresAuth: true
        },
      },
      {
        name: 'Ps.EditPs',
        path: 'editarPs-aTratar/:reufecha/:reunro/:item',
        component: () => import('../views/ps/AddEdit.vue'),
        meta: {
          title: 'Editar una programación semanal - Reucord',
          requiresAuth: true
        },
      }
    ],
    // beforeEnter: (to, from, next) => beforeEnter(to, from, next)
  },
  {
    path: '/programaciones',
    name: 'programaciones',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AppsViews/AppProgramaciones.vue'),
    meta: {
      title: 'Programaciones - Reucord',
      requiresAuth: false
    },
    children: [
      {
        name: 'Prog.Home',
        path: '',
        component: () => import('../views/programaciones/index.vue'),
        meta: {
          title: 'Programaciones - Reucord',
          requiresAuth: true
        }
      },
      {
        name: 'Prog.Locales',
        path: 'local',
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
    ],
    // beforeEnter: (to, from, next) => beforeEnter(to, from, next)
  },
  {
    path: '/suspensiones',
    name: 'Suspensiones',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AppsViews/AppSuspensiones.vue'),
    meta: {
      title: 'Suspensiones - Reucord',
      requiresAuth: false
    },
    children: [
      {
        path: '',
        name: 'Suspensiones.Home',
        component: () => import('../views/suspensiones/index.vue'),
        meta: {
          title: 'Suspensiones - Reucord',
          requiresAuth: true
        }
      },
      {
        name: 'Suspensiones.Add',
        path: 'agregarSuspension',
        component: () => import('../views/suspensiones/AddEdit.vue'),
        meta: {
          title: 'Agregar un reclamo - Reucord',
          requiresAuth: true,
          add: 'add'
        },
      },
      {
        name: 'Suspensiones.Edit',
        path: 'editarSuspension/:nroprog/:dia/:mes/:anho/:reunionano/:nroreun?/:pditem',
        component: () => import('../views/suspensiones/AddEdit.vue'),
        meta: {
          title: 'Editar una suspensión - Reucord',
          requiresAuth: true,
          add: 'edit'
        }
      }
    ]
    // beforeEnter: (to, from, next) => beforeEnter(to, from, next)
  },
  {
    path: '/tratadas',
    name: 'Tratadas',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AppsViews/AppProgTra.vue'),
    meta: {
      title: 'Programaciones tratadas - Reucord',
      requiresAuth: false
    },
    // beforeEnter: (to, from, next) => beforeEnter(to, from, next)
  },
  {
    path: '/enlistamientos',
    name: 'Enlistamientos',
    component: () => import('../views/AppsViews/AppEnlistamientos.vue'),
    meta: {
      title: 'Enlistamientos - Reucord'
    }
  },
  {
    path: '/pam',
    name: 'Pam',
    component: () => import('../views/AppsViews/AppPam.vue'),
    meta: {
      title: 'Pam - Reucord'
    }
  }
  
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
    if (store.state.user.logeado) {
      next()
    } else {
      next({ name: "Login" });
    }
  } else {
    if(name === 'Login'){
      if(store.state.user.logeado){
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
