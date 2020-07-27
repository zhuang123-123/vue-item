import { login } from '@/api/user'
import { setToken, getToken, getAccess, setAccess, setUser, getUser, setNumber, getNumber, expireLocalStorage } from '@/libs/util'

export default {
    state: {
        userName: getUser(),
        userId: '',
        avatorImgOath: 'https://i.loli.net/2017/08/21/599a521472424.jpg',
        token: getToken(),
        access: getAccess(),
        hasGetInfo: false,
        unreadCount: 0,
        messageUnreadList: [],
        messageReadedList: [],
        messageTrashList: [],
        userList: [],
        messageContentStore: {}
    },
    mutations: {
        setAvator (state, avatorPath) {
            state.avatorImgPath = avatorPath
        },
        setUserId (state, id) {
            state.userId = id
        },
        setUserName (state, name) {
            state.userName = name
            setUser(name)
        },
        setAccess (state, access) {
            state.access = access;
            setAccess(access)
        },
        setToken (state, token) {
            state.token = token
            setToken(token)
        },
        setNumber (state, number) {
            state.number = number
            setNumber(number)
        },
        setHasGetInfo (state, status) {
            state.hasGetInfo = status
        },
        setMessageCount (state, count) {
            state.unreadCount = count
        },
        setMessageUnreadList (state, list) {
            state.messageUnreadList = list
        },
        setMessageReadedList (state, list) {
            state.messageReadedList = list
        },
        setMessageTrashList (state, list) {
            state.messageTrashList = list
        },
        updateMessageContentStore (state, { msg_id, content}) {
            state.messageContentStore[msg_id] = content
        },
        moveMsg (state, { from, to, msg_id }) {
            const index = state[from].findIndex(_ => _.msg_id === msg_id)
            const msgItem = state[from].splice(index, 1)[0]
            msgItem.loading = false
            state[to].unshift(msgItem)
        }
    },
    getters: {
        messageUnreadCount: state => state.messageUnreadList.length,
        messageReadedCount: state => state.messageReadedList.length,
        messageTrashCount: state => state.messageTrashList.length
    },
    actions: {
        // 登录
        handleLogin ({ commit }, { userName, passWord }) {
            userName = userName.trim()
            return new Promise((resolve, reject) => {
                login({
                    userName,
                    passWord
                }).then(res => {
                    const data = res.data.data
                    commit('setToken', data.token)
                    commit('setAvator', 'https://i.loli.net/2017/08/21/599a521472424.jpg')
                    commit('setUserName', data.userName)
                    commit('setUserId', data.userId)
                    const perm = data.authority ? data.authority.split(',') : []
                    commit('setAccess', perm)
                    
                    localStorage.setItem('ms_menuStr', res.data.data,menuStr);
                    window.sessionStorage.setItem('menuStr', res.data.data.menuStr);
                    resolve()
                }).catch(err => {
                    reject(err)
                })
            })
        },
        // 推出登录
        handleLogOut ({state, commit }) {
            return new Promise((resolve, reject) => {
                sessionStorage.clear();
                commit('setToken', '')
                resolve()
            })
        }
    }
}