import axios from 'axios';
const httpService = axios.create({
    baseURL: process.env.BASE_API,
    timeout: 3000
});

httpService.interceptors.request.use(
    config => {
        if (true) {
            config.headers['User-Token'] = '';
        }
        return config
    },
    error => {
        Promise.reject(error);
    }
)

httpService.interceptors.response.use(
    response => {
        const res = response.data;
        if (res.statuscode != 1) {
            return Promise.reject({
                status: res.statuscode,
                message: res.message
            });
        } else {
            return response.data;
        }
    },
    error => {
        if (error && error.response) {
            switch (error.response.status) {
                case 400:
                    error.message = '';
                    break;
                case 401:
                    error.message = '';
                    break;
                case 403:
                    error.message = '';
                    break;
                case 404:
                    error.message = '';
                    break;
                default:
                    error.message = `${error.response.status}`;
            }
        } else {
            error.message = '链接到服务器失败'
        }
        return Promise.reject(error);
    }
)

export function get(url, params = {}) {
    return new Promise((resolve, reject) => {
        httpService({
            url: url,
            method: 'get',
            params: params
        }).then(response => {
            resolve(response);
        }).catch(error => {
            reject(error);
        })
    })
}

export function post (url,params = {}) {
    return new Promise((resolve, reject) => {
        httpService({
            url: url,
            method: 'post',
            data: params
        }).then(response => {
            resolve(response)
        }).catch(error => {
            reject(error);
        })
    })
}

export function fileUpload (url, params = {}) {
    return new Promise((resolve, reject) => {
        httpService({
            url: url,
            method: 'post',
            data: params,
            headers: {'Content-Type': 'multipart/form-data'}
        }).then(response => {
            resolve(response);
        }).catch(error => {
            reject(error);
        })
    })
}

export default {
    get,
    post,
    fileUpload
}