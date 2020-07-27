<template>
    <div>
        <div v-show="visible" class="my-modalent-mask">
            <div v-show="visible" class="my-modalent" :class="{fullscreen: isFullscreen}">
                <header class="my-modalent-header">
                    <h4>{{title}} </h4>
                    <div class="icon-wrap">
                        <Icon @click.vative="cancel" :size="35" type="ios-close" style="cursor: pointer;"></Icon>
                    </div>
                </header>
                <div id="d1" class="my-modalent-content" :class="{'full-content': isFullscreen}">
                    <slot></slot>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'MyModal',
    props: {
        title: {
            type: String,
            default: ''
        },
        value: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            isFullscreen: false,
            visible: false
        }
    },
    methods: {
        cancel () {
            this.visible = false;
            this.$emit('input', false);
            this.$emit('on-cancel');
        },
        ok () {
            this.visible = false;
            this.$emit('input', false);
            this.$emit('on-ok');
        }
    },
    watch: {
        value (val) {
            document.getElementById('d1').scrollTop = 0;  // 通过scrollTop设置滚动到0位置
            this.visible = val;
        }
    },
    computed: {

    }
}
</script>
<style lang="postcss">
    .my-modalent {
        position: absolute;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        min-width: 500px;
        background-color: #fff;
        background-clip: padding-box;
        border-radius: 6px;
        z-index: 1001;
    }
    .my-modalent-content {
        padding: 25px 25px 150px 25px;
        font-size: 12px;
        line-height: 1.5;
        max-height: 550px;
        overflow: auto;
    }
    .full-content {
        max-height: 100px;
    }
    .my-modalent-header {
        border-bottom: 1px solid #e8eaec;
        padding: 5px 16px;
        line-height: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .icon-wrap a {
        margin-left: 20px;
    }
    .my-modalent-mask {
        position: fixed;
        top: 100px;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: rgba(55, 55, 55, .6);
        height: 100%;
        z-index: 1000;
    }
    .toggle {
        left: 64px;
    }
    .fullscreen {
        width: 100%;
        height: 100%;
        top: 2px;
    }
</style>
