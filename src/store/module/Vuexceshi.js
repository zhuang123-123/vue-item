export default {
    state: {
        names: 'vuex123',
        nameFu: 'VuexFuzhu',
        count: 123
    },
    mutations: {
        ceshiMutation: function (state, data) {
            console.log(data)
            state.names = data.name
        },
        ceshiMutation2: function (state, data) {
            state.names = data.name
        },
        ceshiactionMu: function (state, data) {
            console.log(data)
            state.names = data.data.name
        },
        ceshiactionMu2: function (state, data) {
            state.names = data.data.name
        },

        // 辅助工具
        muFuMutation: function (state) {
            state.count = 456789789789798
        },
        ceshiMyfuc: function (state, data) {
            state.count += data
        }
    },
    actions: {
        ceshiaction: function ({ commit }, data) {
            // console.log(data)
            // content.state.names = '123123'
            commit('ceshiactionMu', {data: data})
        },
        ceshiaction2: function (context, data) {
            context.commit('ceshiactionMu2', {data: data})
        },
        myFuActions: function (context, data) {
            context.commit('ceshiMyfuc', data)
        }
    },
    getters: {
        changeState: function (state) {
            console.log(state)
            return '123456Fuzhugongju'
            // state.nameFu = '辅助工具Vuex-mapGetters'
        }
    }
}