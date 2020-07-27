//vue init webpack-simple packname;
export default {
    name: 'chanyeyunFooter',
}
// src创建一个文件index.js作为入口文件
// index.js
import chanyeyunHeader from ''
import chanyeyunFooter from ''
const chanyeyun = {
    install (Vue, options) {
        Vue.component(chanyeyunHeader.name, chanyeyunHeader);
        Vue.component(chanyeyunFooter.name, chanyeyunFooter);
    }
}
if (typeof window !== 'undefined' && window.Vue) {
    window.Vue.use(chanyeyun)
}
export default chanyeyun

// 模拟引入 查看效果
import chanyeyunUI from '/index.js'
Vue.use(chanyeyunUI)

// webpack模拟
entry: '',
output: {
    path: path.resolve(_dirname, './dist'),
    publicPath: '/dist',
    filename: 'build.js'
},

// npm run build 前修改 webpack.config.js  入口文件修改为index.js
entry: '',
output: {
    path: path.resolve(_dirname, ''),
    publicPath: 'www',
    filename: 'vue-chanyeyun,js',  // 打包生成文件的名字
    library: 'Chanyeyun',  // reqire引入的名字
    libraryTarget: 'umd',
    umdNamedDefine: true
},

// 上传包之前修改package.json文件
"name": 'chanyeyun-ui',  // 包名
"main": '',  // dist打包后地址
"private": false, 
"repository": {
    "type": 'git',
    "url": "http://116.196.109.204/nana/chanyeyun-ui.git"  // git仓库地址
}

// npm账号登录cmd
npm login
baina *nana*523862! 495964946@qq.com

// npm 发布
npm publish .

// 使用安装  npm install chanyeyun-ui --save  (包名)
// main.js
import chanyeyunUi from 'chanyeyun-ui'
Vue.use(chanyeyunUi)

// 页面使用
<chanyeyun-footer></chanyeyun-footer>

