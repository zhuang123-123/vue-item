<template>
    <div>
        <h5 class="content-header"></h5>
        <div class="image-list">
            <div style="text-align: center" ref="divGenres" class="list-default-img" v-show="isPhoto" @click.stop="addPic">
                <img src="" alt="">
                <input type="file" accept="" capture="camera" @change="onFileChange" style="display: none;">
            </div>
            <ul class="list-ul" v-show="!isPhoto">
                <li class="list-li" v-for="(iu, index) in imgUrls">
                    <a class="list-link" @click="previewImage(iu)">
                        <img :src="iu" alt="">
                    </a>
                    <span class="list-img-close" @click="delImage(index)"></span>
                </li>
            </ul>
        </div>
        <div class="add-preview" v-show="isPreview" @click.self="closePreview">
            <img :src="previewImg" alt="">
        </div>
        <div style="font: 0px/0px sans-serif; clear: both; display: block"></div>
    </div>
</template>

<script>
import lrz from 'lrz'
export default {
    data() {
        return {
            show: false,
            imgUrls: [],
            urlArr: [],
            isPhoto: true,
            btnTitle: '',
            isModify: false,
            previewImg: '',
            isPreview: false,
            lat: 0,
            lng: 0,
        }
    },
    watch: {
        imgUrls: 'toggleAddPic'
    },
    methods: {
        toggleAddPic: function () {
            let vm = this;
            if (vm.imgUrls.length >= 1) {
                vm.isPhoto = false;
            } else {
                vm.isPhoto = true;
            }
        },
        addPic: function (e) {
            let els = this.$refs.divGenres.querySelectorAll('input[type=file]')
            els[0].click()
            return false
        },
        // 选择图片
        onFileChange: function (e) {
            var files = e.target.files || e.dataTransfer.files;
            if (!files.length) return ;
            this.createImage(files, e); 
        },
        // 图片压缩转为base64
        createImage: function (file, e) {
            let vm = this;
            lrz(file[0], {
                width: 480
            }).then(function (rst) {
                vm.imgUrls.push(rst.base64);
                let urlArr = [],
                imgUrls = vm.imgUrls;
                for (let i = 0; i < imgUrls.length; i++) {
                    if (imgUrls[i].indexOf('file') == -1) {
                        urlArr.push(imgUrls[i].split(',')[1]);
                    } else {
                        urlArr.push(imgUrls[i]);
                    }
                }
                console.log(urlArr.length);
                console.log(urlArr[0])
            }).always(function () {
                // 清空文件上传控件的值
                e.target.value = null;
            });
        },
        delImage: function (index) {
            let vm = this;
            vm.imgUrls.splice(index, 1);
        },
        previewImage: function (url) {
            let vm = this;
            vm.isPreview = true;
            vm.previewImg = url;
        },
        closePreview: function () {
            let vm = this;
            vm.isPreview = false;
            vm.previewImg = '';
        }
    }
}

var unwatch = vm.$watch(
    'value',
    function () {
        doSomething()
        if (unwatch) {
            unwatch()
        }
    },
    {immediate: true}
)
vm.$on('test', function (msg) {
    console.log(msg)
})
vm.$emit('test', 'hi')

Vue.component('magic-eight-ball', {
    data: function () {
        return {
            possibleAdvice: ['Yes', 'No', 'Maybe']
        }
    },
    methods: {
        giveAdvice: function () {
            var randomAdviceIndex = Math.floor(Math.random() * this.possibleAdvice.length)
            this.$emit('give-advice', this.possibleAdvice[randimAdviceIndex])
        },
        example: function() {
            // 修改数据
            this.message = 'changed'
            // DOM 还没有更新
            this.$nextTick(function () {
                // DOM 现在更新了
                // `this`绑定到当前实例
                this.doSomeThingElse()
            })
        }
    }
})

import Vue from 'vue'
import upperFirst from 'lodash/upperFirst'
import camelCase from 'lodash/camelCase'
import { setTimeout } from 'timers';

const requireComponent = require.context(
    // 其组件目录的相对路径
    './components',
    // 是否查询其子目录
    false,
    // 匹配基础组件文件命的正则表达式
    /Base[A-Z]\w+\.(vue|js)$/
)
requireComponent.keys().forEach(fileName => {
    // 获取组件配置
    const componentConfig = requireComponent(fileName)

    // 获取组件的PascalCase命名
    const componentName = upperFirst(
        camelCase(
            // 获取和目录深度无关的文件名
            fileName
                .split('/')
                .pop()
                .replace(/\.w+$/, '')
        )
    )
    Vue.component(
        componentName,
        // 如果这个组件选项是通过`export default` 导出的，
        // 那么就会优先使用 `.default`,
        // 否则回退到使用模块的根。
        componentConfig.default || componentConfig
    )
})

Vue.component('my-component', {
    props: {
        // 基础的类型检查 （`null`和`undefined` 会通过任何类型验证）
        propA: Number,
        // 多个可能的类型
        propB: [String, Number],
        // 必填的字符串
        propC: {
            type: String,
            required: true
        },
        // 带有默认值的数字
        propD: {
            type: Number,
            default: 100
        },
        // 带有默认值的对象
        propE: {
            type: Object,
            // 对象或者数组默认值必须从一个工厂函数获取
            default: function () {
                return {message: 'hello'}
            }
        },
        // 自定义验证函数
        propF: {
            validator: function (value) {
                // 这个值必须匹配下列字符串中的一个
                return ['success', 'warning', 'danger'].indexOf(value) !== -1
            }
        }
    }
})

function Person (firstName, lastName) {
    this.firstName = firstName
    this.lastName = lastName
}
Vue.component('blog-post', {
    props: {
        author: Person
    }
})

Vue.component('base-checkbox', {
    model: {
        prop: 'checked',
        event: 'change'
    },
    props: {
        checked: Boolean
    },

})

Vue.component('base-input', {
    inheritAttrs: false,
    props: ['label', 'value'],
    computed: {
        inputListeners: function () {
            var vm = this
            // `Object.assign` 将所有的对象合并为一个新对象
            return Object.assign({}, 
                // 我们从父级添加所有的监听器
                this.$listeners,
                // 然后我们添加自定义监听器，
                // 或者写一些监听器的行为
                {
                    // 这里确保组件配合 `v-model` 的工作
                    input: function (event) {
                        vm.$emit(`input`, event.target.value)
                    }
                }
            )
        }
    }
})

Vue.component('async-example', function (resolve, reject) {
    setTimeout(function () {
        resolve({
            template: '<div>I am async!! </div>'
        })
    })
})

new Vue({
    data: {
        foo: 1
    },
    computed: {
        bar: function () { /* ... */}
    },
    methods: {
        baz: function () { /* ... */}
    },
    mounted: function () {
        // Pikaday 是一个第三方日期选则的库
        this.picker = new Pikaday({
            field: this.$refs.input,
            format: 'YYYY-MM-DD'
        })
    },
    beforeDestroy: function () {
        this.picker.destroy()
    },
    mounted: function () {
        var picker = new Pikaday({
            field: this,$refs.input,
            format: 'YYYY-MM-DD'
        })
        this.$once('hook:beforeDestroy', function () {
            picker.destroy()
        })
    },
    mounted: function () {
        this.attachDatepicker('startDateInput')
        this.attachDatepicker('endDateInput')
    },
    methods: {
        attachDatepicker: function () {
            var picker = new Pikaday({
                field: this.$refs[refName],
                format: 'YYYY-MM-DD'
            })
            this.$once('hook:beforeDestroy', function() {
                picker.destroy()
            })
        },
        beforeEnter: function (el) {
            // ...
        },
        enter: function (el, done) {
            // 
            done()
        },
        afterEnter: function (el) {
            // ...
        },
        enterCancelled: function (el) {
            // ...
        },

        beforeLeave: function (el) {

        },
        leave: function (el, done) {
            done()
        },
        afterleave: function (el) {
            // ...
        },
        leaveCancelled: function (el) {
            // ...
        }
    }
})

new Vue({
    el: '#example-4',
    data: {
        show: false
    },
    methods: {
        beforeEnter: function (el) {
            el.style.opacity = 0
            el.style.transformOrigin = 'left'
        },
        enter: function (el, done) {
            Velocity(el, {opacity: 1, fontSize: '1.4em'}, {duration: 300 })
            Velocity(el, {fontSize: '1em'}, {complete: done })
        },
        leave: function (el, done) {
            Velocity(el, {translateX: '15px', rotateZ: '50deg'}, {duration: 600 })
            Velocity(el, {rotateZ: '100deg' }, { loop: 2})
            Velocity(el, {
                rotateZ: '45deg',
                translateY: '30px',
                translateX: '30px',
                opacity: 0
            }, {complete: done})
        }
    }
})
new Vue({
    el: '#transition-components-demo',
    data: {
        view: 'v-a'
    },
    components: {
        'v-a': {
            template: '<div>Component A</div>'
        },
        'v-b': {
            template: '<div>Component B</div>'
        }
    }
})

new Vue({
    el: '#list-demo',
    data: {
        items: [1, 2, 3],
        nextNum: 10
    },
    methods: {
        randomIndex: function () {
            return Math.floor(Math.random() * this.items.length)
        },
        add: function () {
            this.items.splice(this.randomIndex(), 0, this.nextNum++)
        },
        remove: function() {
            this.items.splice(this.randomIndex(), 1)
        }
    }
})
new Vue({
    el: '#flip-list-demo',
    data: {
        items: [1, 2, 3]
    },
    methods: {
        shuffle: function () {
            this.items = _.shuffle(this.items)
        }
    }
})

new Vue({
    el: '#list-complete-demo',
    data: {
        items: [1, 2, 3, 4],
        nextNum: 10
    },
    methods: {
        randomIndex: function () {
            return Math.floor(Math.random() * this.items.length)
        },
        add: function () {
            this.items.splice(this.randomIndex(), 0, this.nextNum++)
        },
        remove: function() {
            this.items.splice(this.randomIndex(), 1)
        },
        shuffle: function () {
            this.items = _.shuffle(this.items)
        }
    }
})

new Vue({
    el: '#staggered-list-demo',
    data: {
        query: '',
        list: [
            {msg: 'Bruce Lee'},
            {msg: 'Jackie Chan'},
            {msg: 'Chuck Norris'},
            {msg: 'Jet Li'},
            {msg: 'Kung Fury'}
        ]
    },
    computed: {
        computedList: function () {
            var vm = this
            return this.list.filter(function (item) {
                return item.msg.toLowerCase().indexOf(vm.query.toLowerCase()) !== -1
            })
        }
    },
    methods: {
        beforeEnter: function (el) {
            el.style.opacity = 0
            el.style.height = 0
        },
        enter: function (el, done) {
            var delay = el.dataset.index * 150
            setTimeout(function () {
                Velocity(
                    el,
                    { opacity: 1, height: '1.6em'},
                    { complete: done }
                )
            }, delay)
        },
        leave: function (el, done) {
            var delay = el.dataset.index * 150
            setTimeout(function () {
                Velocity(
                    el,
                    {opacity: 0, height: 0},
                    {complete: done}
                )
            }, delay)
        }
    }
})

Vue.component('my-special-transition', {
    functional: true,
    render: function (createElement, context) {
        var data = {
            props: {
                name: 'very-special-transition',
                mode: 'out-in'
            },
            on: {
                beforeEnter: function (el) {
                    // ...
                },
                afterEnter: function (el) {
                    // ...
                }
            }
        }
        return createElement('transition', data, context.children)
    }
})

new Vue({
    el: '#dynamic-fade-demo',
    data: {
        show: true,
        fadeInDuration: 1000,
        fadeOutDuration: 1000,
        maxFadeDuration: 1500,
        stop: true
    },
    mounted: function() {
        this.show = false
    },
    methods: {
        beforeEnter: function (el) {
            el.style.opacity = 0
        },
        enter: function (el, done) {
            var vm = this
            Velocity(el,
            {opacity: 1},
            {
                duration: this.fadeInduration,
                complete: function () {
                    done() {
                        if (!vm.stop) vm.show = false 
                    }
                }
            })
        },
        leave: function (el, done) {
            var vm = this
            Velocity(el,
            {opacity: 0},
            {
                duration: this.fadeOutDuration,
                complete: function () {
                    done()
                    vm.show = true
                }
            })
        }
    }
})

new Vue({
    el: '#animated-number-demo',
    data: {
        number: 0,
        tweenedNumber: 0
    },
    computed: {
        animatedNumber: function() {
            return this.tweenedNumber.toFixed(0);
        }
    },
    watch: {
        number: function (newValue) {
            gsap.to(this.$data, {duration: 0.5, tweenedNumber: newValue });
        }
    }
})

new Vue({
    el: '#example-7',
    data: {
        color: {
            red: 0,
            green: 0,
            blue: 0,
            alpha: 1
        },
        tweenedColor: {}
    },
    created: function () {
        this.tweenedColor = Object.assign({}, this.color)
    },
    watch: {
        color: function () {
            function animate () {
                if (TWEEN.update()) {
                    requestAnimationFrame(animate)
                }
            }

            new TWEEN.Tween(this.tweenedColor)
                .to(this.color, 750)
                .start()
                
            animate()
        }
    },
    computed: {
        tweenedCssColor: function () {
            return new Color({
                red: this.tweenedColor.red,
                green: this.tweenedColor.green,
                blue: this.tweenedColor.blue,
                alpha: this.tweenedColor.alpha
            }).toCSS()
        }
    },
    methods: {
        updateColor: function () {
            this.color = new Color(this.colorQuery).toRGB()
            this.colorQuery = ''
        }
    }
})

Vue.component('animated-integer', {
    template: '<span> {{tweeningValue }} </span>',
    props: {
        value: {
            type: Number,
            required: true
        }
    },
    data: function () {
        return {
            tweeningValue: 0
        }
    },
    watch: {
        value: function (newValue, oldValue) {
            this.tween(oldValue, newValue)
        }
    },
    mounted: function () {
        this.tween(0, this.value)
    },
    methods: {
        tween: function (statrValue, endValue) {
            var vm = this
            function animate() {
                if (WEEEN.update()) {
                    requestAnimationFrame(animate)
                }
            }

            new TWEEN.Tween({tweeningValue: statrValue})
                .to({ tweeningValue: endValue }, 500)
                .onUpdate(function () {
                    vm.tweeningValue = this.tweeningValue.toFixed(0)
                })
                .start()
            animate()
        }
    }
})
new Vue({
    el: '#example-8',
    data: {
        firstNamber: 20,
        secondNumber: 40
    },
    computed: {
        result: function () {
            return this.firstNumber + this.secondNumber
        }
    }
})
</script>
