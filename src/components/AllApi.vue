<template>
    <div id="mount-point">
        <input type="text" v-model="message">
        {{message | capitalize }}
    </div>
</template>

<script>
// export default {
//     data() {
//         return {
//             firstName: 'Walter',
//             lastName: 'White',
//             alias: 'Heisenberg',
//             message: ''
//         }
//     },
//     filters: {
//         capitalize: function (value) {
//             if (!value) return ''
//             value = value.toString()
//             return value.charAt(0).toUpperCase() + value.slice(1)
//         }
//     },
//     methods: {
//         first: () => {
//             Vue.set(target, propertyName/index, value)
//             Vue.delete(target, propertyName/index)
//             // ##Vue.firective(id, [definition])
//             Vue.directive('my-directive', {
//                 bind: function() {},
//                 inserted: function() {},
//                 update: function () {},
//                 componentUpdated: function () {},
//                 unbind: function () {}
//             })
//             // 注册(指令函数)
//             Vue.directive('my-directive', function () {
//                 // 这里将会被  `bind` 和 `update`调用
//             })

//             // getter，返回已经注册的指令
//             var myDirective = Vue.directive('my-directive')

//             Vue.filter('my-filter', function (value) {
//                 // 返回处理后的值
//             })
//         }
//     }
// }
</script>

