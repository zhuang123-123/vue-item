import Vue from 'vue'
import Vuex from 'Vuex'
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        name: 'dangyunlong',
        age: 30,
        index: {}  // 首页信息
    },
    getters: {
        // getters 相当于是vuex的计算属性，主要作用是对state中的值进行处理
        jia(state, num) {
            return state.age + 1;
        },
        jian(state, num) {
            return state.age - 1;
        }
    },
    mutations: {
        // Vuex用于修改state中数据的方法
        gaiming(state, name) {
            state.name = name
        },
        getIndex(state, indexData) {
            state.index = indexData
        }
    },
    actions: {
        // actions 用于异步执行vuex mutations中的方法他不会直接修改state而是作用于mutations
        // actions中的方法可以接收一个context参数，这里的context就是值vuex
        increment (context) {
            setTimeout(function () {
                // 调用方式跟在,vue中一样
                context.commit('gaiming', 'abc')
                // 1秒后调用mutations中的gaiming方法，名字已经修改了
                console.log(context.state.name)
            }, 1000)
        }
    },
    modules: {
        // 子状态数
        a: model1
    }
})