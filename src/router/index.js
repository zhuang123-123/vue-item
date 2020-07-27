import Vue from 'vue'
import Main from '../components/Main'
import VueRouter from 'vue-router'
// import { resolve } from 'core-js/fn/promise';
// import Home from '../views/Home.vue'
// import Scroll from '../views/Scroll.vue'

let head = document.getElementsByTagName('head');
let meta = document.createElement('meta');
meta.name = 'referrer';
//根据实际情况修改referrer的值，可选值参考上文
meta.content = 'no-referrer';
head[0].appendChild(meta);

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'login',
    meta: {
      title: '登录',
      hideInMenu: true
    },
    component: () => import('@/views/Login')
  },
  {
    path: '/',
    name: 'home',
    component: Main,
    redirect: '/home',
    meta: {
      hideInMenu: true,
      title: '首页',
    },
    children: [
      {
        path: '/home',
        name: 'home',
        props: true,
        component: () => import('@/views/Home'),
        meta:{
          title: '行业分类',
          access:['sector'],
        }
      },
      {
        path: '/new',
        name: 'new',
        component: () => import('@/views/new'),
      },
      {
        path: '/vuexCs',
        name: 'vuexCs',
        component: (resolve) => require(['../views/VuexCs'], resolve)
      },
      {
        path: '/vueTable',
        name: 'vueTable',
        component: (resolve) => require(['../views/VueTable'], resolve)
      },
      {
        path: '/vuedesignPar',
        name: 'vuedesignPar',
        component: (resolve) => require(['../views/vueDesignPar'], resolve)
      }
    ]
  },
  {
    path: '/',
    name: 'About',
    component: Main,
    children: [
      {
        path: '/about',
        name: 'about',
        component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
      }
    ]
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    //component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/scroll',
    name: 'Scroll',
    component: (resolve) => require(['../views/Scroll.vue'], resolve)
  },
  {
    path: '/par',
    name: 'Par',
    component: (resolve) => require(['../views/par.vue'], resolve)
  },
  {
    path: '/iview',
    name: 'Iview',
    component: (resolve) => require(['../views/Iview'], resolve)
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  // console.log(to)
  if (to.name !== 'login') {
    next()
    // next({
    //   name: 'home'
    // })
  } 
  else {
    next()
  }
})


export default router
