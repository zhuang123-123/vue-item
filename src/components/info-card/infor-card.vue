<template>
    <Card :shadow="shadow" class="info-card-wrapper" :padding="0">
        <div class="content-con">
            <div class="left-area" :style="{background: color, width: leftWidth}">
                <common-icon class="icon" :type="icon" :size="iconSize" color="#fff"></common-icon>
            </div>
            <div class="right-area" :style="{width: rightWidth}">
                <div>
                    <slot></slot>
                </div>
            </div>
        </div>
    </Card>
</template>

<script>
import CommonIcon from '_c/common-icon'
export default {
    name: 'InforCard',
    components: {
        CommonIcon
    },
    props: {
        left: {
            type: Number,
            default: 36
        },
        color: {
            type: String,
            default: '#2d8cf0'
        },
        icon: {
            type: String,
            default: ''
        },
        iconSize: {
            type: Number,
            default: 20
        },
        shadow: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        leftWidth() {
            return `${this.left}%`
        },
        rightWidth() {
            return `${100 - this.left}%`
        }
    }
}
</script>
