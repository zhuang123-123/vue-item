<template>
    <div>
        <div v-show="visible" class="my-modvl-mask">
            <div v-show="visible" class="my-modvl" :class="{fullscreen: isFullscreen}">
                <header class="my-modvl-header">
                    <h4>{{title}} </h4>
                    <div class="icon-wrap">
                        <Icon @click.native="cancel" :size="35" type="ios-close" style="cursor: pointer;" />
                    </div>
                </header>
                <div id="d1" class="my-modvl-content" :class="{'full-content': isFullscreen}">
                    <slot></slot>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapGetters } from 'vuex'
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
    data() {
        return {
            isFullscreen: false,
            visible: false
        }
    },
    methods: {
        cancel() {
            this.visible = false;
            this.$emit('input', false);
            this.$emit('on-cancel');
        },
        ok() {
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
