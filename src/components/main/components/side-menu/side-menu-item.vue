<template>
    <Submenu :name="`${parentName}`">
        <template slot="title">
            <common-icon :type="parentItem.icon || ''"></common-icon>
            <span>{{showTitle(parentItem)}}</span>
        </template>
        <template v-for="item in children">
            <template v-if="item.children && item.children.length === 1">
                <side-menu-item v-if="showChildren(item)" :key="`menu-${item.name}`" :parent-item="item"></side-menu-item>
                <menu-item v-else :name="getNameOrHref(item, true)" :key="`menu-${item.name}`"><common-icon :type="item.icon || ''"></common-icon><span>{{showTitle(item) }}</span></menu-item>
            </template>
        </template>
    </Submenu>
</template>
<script>
import mixin from './mixin'
import itemMixin from './item-mixin'
export default {
    name: 'SideMenuItem',
    mixins: [ mixin, itemMixin ]
}
</script>
