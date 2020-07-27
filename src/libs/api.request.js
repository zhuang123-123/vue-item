import HttpRequest from '@/libs/axios'
import HttpRequestForm from '@/libs/axiosForm'
import config from '@/config'
if (process.env.NODE_ENV === 'development') {
    baseUrl = config.baseUrl.dev;
} else if (process.env.Vue_App_ENV == "'deve'" || process.env.VUE_APP_ENV == 'deve') {
    baseUrl = config.baseUrl.deve;
} else if (process.env.VUE_APP_ENV == "'beta'" || process.env.VUE_APP_ENV == 'beta') {
    baseUrl = config.baseUrl.beta;
} else if (process.env.VUE_APP_ENV == "'prod'" || process.env.VUE_APP_ENV == 'prod') {
    baseUrl = config.baseUrl.prod;
}
const baseUrl = process.env.NODE_ENV === 'production'
    ? config.baseUrl.prod
    : config.baseUrl.dev
const axios = new HttpRequest(baseUrl)
const axiosForm = new HttpRequestForm(baseUrl)
export default {
    axios,
    axiosForm,
    baseUrl
}