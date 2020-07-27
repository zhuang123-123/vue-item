export default {
    /**
     * @description 配置显示在浏览器的title
    */
    title: '',
    /**
        * @description token在Cookie中存储的天数，默认1天
    */
    cookieExpires: 1,
    /**
     * @description 受否使用国际化，默认为false
     *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
     *              用来在菜单中显示文字
     */
    useI18n: false,
    /**
     * @description api请求基础路径
     * dev  // 本地环境
     * deve  // 开发环境--对应根目录(.env.dev)
     * beta  // 测试环境--对应根目录(.env.beta)
     * prod  // 生产(线上) 环境--对应根目录(.env.prod)
     * pro  // 生产(线上) 环境--
     */
    baseUrl: {
        dev: 'http://sandbox.neo.dsp.admin.com/adm',
        prod: '/adm'
    },
    /**
     * @description 默认打开的首页的路由name值，默认为home
    */
   homeName: 'home',
   /**
    * @description 需要加载的插件
   */
    plugin: {
        'error-store': {
            showInHeader: false, // 设为false后不回在顶部显示错误日志徽标
            developmentOff: true  // 设为true后在开发环境不回手机错误信息，方便开发中排查错误
        }
    }
}