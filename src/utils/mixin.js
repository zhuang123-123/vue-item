export default {
    data() {
        return {
            initData: 'mixin初始数据'
        }
    },
    mounted() {
        console.log('mixin的挂在输出')
    },
    methods: {
        doubleNum(num) {
            return num * 2
        }
    }
}