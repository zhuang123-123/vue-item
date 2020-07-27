<template>
    <div class="sidebar">
        <slot></slot>
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#515a6e"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.children">
                    <el-submenu :index="item.menuUrl" :key="item.menuUrl">
                        <template slot="title">
                            <Icon style="margin: 0 10px 0 0;" :size="20" :type="item.moduleIcon"></Icon>
                            <span slot="title">{{item.moduleName}}</span>
                        </template>
                        <template v-for="subItem in item.children">
                            <el-menu-item class="entr" :index="subItem.menuUrl" :key="subItem.menuUrl">
                                {{subItem.moduleName}}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template> 
                <template v-else>
                    <el-menu-item :index="item.menuUrl" :key="item.menuUrl">
                        <Icon style="color: rgb(191, 203, 217); margin: 0 10px 0 0;" :size="20" :type="item.moduleIcon"></Icon>
                    </el-menu-item>
                </template>
            </template>    
        </el-menu>
    </div>
</template>
<script>
import {getUserMenu } from '@/api/user'
export default {
    data() {
        return {
            collapse: false,
            items: []
        }
    },
    computed: {
        onRoutes() {
            return this.$route.path.replace('/', '');
        }
    },
    created() {
        this.menu();
        // 通过Event Bus 进行组件间通信，来折叠侧边栏
        this.$vueRoom.$on('collapse', msg => {
            this.collapse = msg;
        })
    },
    methods: {
        menu() {
            const self = this
            getUserMenu().then(res => {
                self.items = res.data.data;
            })
        },
        menu() {
            const self = this
            getUserMenu().then(res => {
                self.items = res.data.data;
            })
        }
    }
}
</script>
<style scoped>
.entr {
    background: #363E4F !important;
}
.sidebar {
    display: block;
    position: absolute;
    left: 0;
    top: 0px;
    bottom: 0;
    overflow-y: scroll;
    z-index: 2000;
}
@media screen and (min-width: 320px) and (max-width: 1000px) {
    .sidebar {
        display: block;
        position: fixed;
        left: 0;
        top: 70px;
        bottom: 0;
        overflow-y: scroll;
        z-index: 2000;
    }
}
.sidebar::-webkit-scrollbar {
    width: 0;
}
.sidebar-el-menu:not(.el-menu--collapse) {
    width: 257px;
}
.sidebar > ul {
    height: 100%;
}
.el-submenu_title i {
    color: rgb(191, 203, 217);
}
.el-menu-item.is-active {
    color: #7fc1fc !important;
}
</style>
