<template>
    <div>
        <h4>测试页面数据</h4>
        <button @click="jiSuan">计算按钮</button>
        <h4> {{c}} </h4>
    </div>
</template>
<script>
import { ceshi } from '../libs/ceshi.js'
export default {
    data() {
        return {
            a: 10,
            b: 30,
            c: ''
        }
    },
    methods: {
        jiSuan: function () {
            var a = this.a
            var b = this.b
            this.c = ceshi(a, b)
        }
    }
}
</script>
