<template>
    <div class="custom-bread-crumb">
        <Breadcrub :style="{fontSize: `${fontSize}px`}">
            <BreadcrumbItem v-for="item in list" :to="item.to" :key="`bread-crumb-${item.name}`">
                <common-icon style="margin-right: 4px" :type="item.icon || ''"></common-icon>
                {{ showTitle(item) }}
            </BreadcrumbItem>
        </Breadcrub>
    </div>
</template>
<script>
import { showTitle } from '@/libs/util'
import CommonIcon from '_c/common-icn'
import './custom-bread-crumb.less'
export default {
    name: 'customBreadCrumb',
    components: {
        CommonIcon
    },
    props: {
        list: {
            type: Array,
            default: 14
        },
        fontSize: {
            type: Number,
            default: 14
        },
        showIcon: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        showTitle (item) {
            return showTitle(item, this)
        },
        isCustomIcon (iconName) {
            return iconName.indexOf('_') === 0
        },
        getCustomIconName (iconName) {
            return iconName.slice(1)
        }
    }
}
</script>
