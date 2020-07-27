import axios from 'axios'
import store from '@/store'
import router from '../router'
import { Message, Modal } from 'view-design'
import { setToken, getToken } from '@/libs/util'
const addErrorLog = errorInfo => {
    const { statusText, status, request: { responseURL } } = errorInfo
    let info = {
        type: 'ajax',
        code: status,
        mes: statusText,
        url: responseURL
    }
    if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
}
class HttpRequest {
    constructor (baseUrl = baseURL) {
        this.baseUrl = baseUrl
        this.queue = {}
    }
    getInsideConfig () {
        const config = {
            baseURL: this.baseUrl,
            transformRequest: [function (data) {
                let ret = ''
                for (let it in data) {
                    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                }
                if (ret && ret[ret.length -1] === '&') {
                    ret = ret.substr(0, ret.length-1)
                }
                return ret
            }]
        }
        return config
    }
    destroy (url) {
        delete this.queue[url]
        if (!Object.keys(this.queue).length) {
            // Spin.hide()
        }
    }
    interceptors (instance, url) {
        // 请求拦截
        instance.interceptors.request.use(config => {
            if (config.url !== 'user/login') {
                config.headers['X-MAXIMUM-KEY'] = getToken()
            }
            // 添加全局的loading...
            if (!Object.keys(this.quequ).length) {
                // Spin.show() // 不建议开启， 因为界面不够友好
            }
            this.quequ[url] = true
            return config
        }, error => {
            return Promise.reject(error)
        })
        // 响应拦截
        instance.interceptors.response.use(res => {
            function parseJSON (text) {
                let res = text.replace(/(\\"[^"]*\\"\s*:\s*)(\d{16,})/g, '$1\\"$2\\"').replace(/("[^"]*"\s*:\s*)(\d{16,})/g, '$1"$2"')
                return JSON.parse(res)
            }
            this.destroy(url)
            // const { data, status } = res
            let response = parseJSON(res.request.response)
            let data = response
            if (data.code === 200) {
                return { data, status }
            } else {
                // token无效或者过期
                if (data.code === 1001 || data.code === 1002) {
                    Modal.confirm({
                        title: '提示',
                        content: '登录已失效， 请重新登录！',
                        onOk: () => {
                            sessionStorage.clear();
                            setToken('')
                            router.push('/login')
                        }
                    })
                } else {
                    Message.error(data.msg)
                }
                return Promise.reject(data)
            }
        }, error => {
            this.destroy(url)
            let errorInfo = error.response
            if (!errorInfo) {
                const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
                errorInfo = {
                    statusText,
                    status,
                    request: { responseURL: config.url }
                }
            }
            // Message.error('未知错误')
            // addErrorLog(errorInfo)
            return Promise.reject(error)
        })
    }
    request (options) {
        const instance = axios.create()
        options = Object.assign(this.getInsideConfig(), options)
        this.interceptors(instance, options.url)
        return instance(options)
    }
}
export default HttpRequest