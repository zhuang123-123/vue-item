import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

import $ from 'jquery'
// Vue.use($)
Vue.prototype.$ = $

import Cookie from 'js-cookie'
Vue.prototype.cookie = Cookie

// view框架
import iView from 'view-design'
import 'view-design/dist/styles/iview.css'
Vue.use(iView)
Vue.prototype.axios = axios

// ant-design-vue框架
import Ant from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
Vue.use(Ant)

// vue-lazyload图片懒加载处理
// npm install vue-lazyload --save-dev

// import VueLazyload from 'vue-lazyload'
// Vue.use(VueLazyload, {
//   error: './static/error.png',
//   loading: './static/loading.jpg'
// })
// // <img v-lazy="item.img">

// Vue.config.productionTip = true  // 阻止vue在启动时生成生产提示


// // ##
// Vue.config.silent = true

// Vue.config.optionMergeStrategies._my_option = function (parent, child, vm) {
//   return child + 1
// }
// const Profile = Vue.extend({
//   _my_option: 1
// })

// Vue.config.devtools = true

// Vue.config.errorHandler = function (err, vm, info) {
//   //指定组件的渲染和观察期间未捕获错误的处理函数，函数被调用时，可获取错误信息和Vue实例
// }

// Vue.config.warnHandler = function (msg, vm, trace) {
//   // `trace`是组件的继承关系追踪
//   // 为Vue的运行时警告服于一个自定义处理函数
// }

// Vue.config.ignoredElements = [
//   'my-custom-web-component',
//   'another-web-component',
//   // 使Vue忽略在Vue之外的自定义元素
// ]

// Vue.config.keyCodes = {
//   v: 86,
//   f1: 112,
//   mediaPlayPause: 179,
//   'media-play-pause': 179,
//   up: [38, 87]
//   // 给v-on自定义键位别名
// }

// Vue.filter('capitalize', function (value) {
//   if (!value) return ''
//   value = value.toString()
//   return value.charAt(0).toUpperCase() + value.slice(1) 
// })
// Vue.filter('my-filter', function (value) {
//   // 返回处理后的值 
// })

// var vm = mew Vue({
//   data: { a: 1 },
//   computed: {
//     aDouble: function () {
//       return this.a * 2
//     },
//     aPlus: {
//       get: function () {
//         return this,a + 1
//       },
//       set: function () {
//         this.a = v - 1
//       }
//     }
//   }
// })








new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
