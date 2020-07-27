import axios from 'axios'
export const getList = () => {
    return axios.request({
        url: 'http://123.59.85.60/datacenter/pcbasedata/actual02',
        params: {
            callbackparam: 'jQuery112406461467470090052_1593401110400',
            _: 1593401111426
        },
        method: 'get'
    })
}