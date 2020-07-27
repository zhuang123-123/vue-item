import axios from 'axios'
import store from '@/store'
import code from './code'
import router from '../router'
import { Spin, Message, Modal } from 'view-design'
import { setToken, getToken, setNumber, getNumber } from '@/libs/util'
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
            }],
            headers: {
                'Content-Type': "application/x-www-form-urlencoded;charset=UTF-8",
            }
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
                config.headers['token'] = getToken();
                config.headers['Login-Serial-Number'] = getNumber();
            }
            // 添加全局的loading...
            if (!Object.keys(this.queue).length) {
                // Spin.show()  // 不建议开启，因为界面不友好
            }
            this.queue[url] = true
            return config
        }, error => {
            return Promise.reject(error)
        })
        // 响应拦截
        instance.interceptors.response.use(res => {
            this.destroy(url)
            const { data, status } = res
            if (data.code === '200' || data.code === '2000') {
                return { data, status }
            } else {
                // token无效或者过期
                if (data.code === '31000') {
                    Modal.confirm({
                        title: '提示',
                        content: '登录已失效，请重新登录！',
                        onOk: () => {
                            setToken('')
                            setNumber('')
                            router.push('/login')
                        },
                    });
                } else if (data.code === '5000') {
                    Message.error(data.message)
                } else {
                    Message.error(data.message)
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
                    request: {responseURL: config.url }
                }
            }
            // Message.error('未知的错误')
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