<template>
    <Layout style="height: 100%" class="main">
        <Sider hide-trigger collapsible :width="256" :collapsed-width="64" v-model="collapsed" class="left-sider" :style="{overflow: 'hidden'}">
            <side-menu accordion ref="sideMenu" :active-name="$route.name" :collapsed="collapsed" @on-select="turnToPage" :menu-list="menuList">
                    <!-- 需要放在菜单上的内容，如Logo，卸载side-menu标签内部 -->
                    <div class="logo-con">
                        <img v-show="true" :src="minLogo" key="min-logo" alt="">
                        <div class="title" v-show="!collapsed"></div>
                    </div>
            </side-menu>
        </Sider>
        <Layout>
            <Header class="header-con">
                <header-bar :collapsed="collapsed" @on-coll-change="handleCollapsedChange">
                    <user :message-unread-count="unreadCount" :user-avator="userAvator" :user-name="userName"></user>
                </header-bar>
            </Header>
            <Content class="main-content-con">
                <Layout class="main-layout-con">
                    <div class="tag-nav-wrapper">

                    </div>
                    <Content class="content-wrapper">
                        <keep-alive>
                            <router-view></router-view>
                        </keep-alive>
                    </Content>
                </Layout>
            </Content>
        </Layout>
    </Layout>
</template>

<script>
import SideMenu from './components/side-menu'
import HeaderBar from './components/header-bar'
import TagsNav from './components/tags-nav'
import User from './components/user'
import ABackTop from './components/a-back-top'
import Fullscreen from './components/fullscreen'
import Language from './components/language'
import ErrorStore from './components/error-store'
import { mapMutations, mapActions, mapGetters } from 'vuex'
import { getUser, getNewTagList, getNextRoute, routeEqual } from '@/libs/util'
import routers from '@/router/routers'
import minLogo from '@/assets/images/logo-min.png'
import maxLogo from '@/assets/images/logo.jpg'
import './main.less'

export default {
    name: 'Main',
    components: {
        SideMenu,
        HeaderBar,
        Language,
        TagsNav,
        Fullscreen,
        ErrorStore,
        User,
        ABackTop
    },
    data() {
        return {
            minLogo,
            maxLogo,
            isFullscreen: false
        }
    },
    computed: {
        ...mapGetters([
            'errorCount',
            'collapsed'
        ]),
        tagNavList () {
            return this.$store.state.app.tagNavList
        },
        tagRouter () {
            return this.$store.state.app.tagRouter
        },
        userAvator () {
            return this.$store.state.user.avatorImgPath
        },
        cacheList () {
            return ['ParentView', ...this.tagNavList.length ? this.tagNavList.filter(item => !(item.meta && item.meta.notCache)).map(item => item.name) : []]
        },
        menuList () {
            return this.$store.getters.menuList
        },
        local () {
            return this.$store.state.app.local
        },
        hasReadErrorPage () {
            return this.$store.state.app.hasReadErrorPage
        },
        unreadCount () {
            return this.$store.state.user.unreadCount
        },
        userName () {
            return this.$store.state.user.userName
        }
    },
    methods: {
        ...mapMutations([
            'setBreadCrumb',
            'setTagNavList',
            'addTag',
            'setLocal',
            'setHomeRoute',
            'setCollapsed'
        ]),
        ...mapActions([
            'handleLogin',
            'getUnreadMessageCount',
            'getConfigDictDataAll'
        ]),
        turnToPage (route) {
            let { name, params, query } = {}
            if (typeof route === 'string') name = route
            else {
                name = route.name
                params = route.params
                query = route.query
            }
            
        }
    }
}
</script>
