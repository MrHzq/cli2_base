'use strict'
const path = require('path')
const config = require('../config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const packageConfig = require('../package.json')

exports.assetsPath = function(_path) {
    const assetsSubDirectory =
        process.env.NODE_ENV === 'production'
            ? config.build.assetsSubDirectory
            : config.dev.assetsSubDirectory

    return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function(options) {
    options = options || {}

    const cssLoader = {
        loader: 'css-loader',
        options: {
            sourceMap: options.sourceMap
        }
    }

    const postcssLoader = {
        loader: 'postcss-loader',
        options: {
            sourceMap: options.sourceMap
        }
    }

    // generate loader string to be used with extract text plugin
    function generateLoaders(loader, loaderOptions) {
        const loaders = options.usePostCSS
            ? [cssLoader, postcssLoader]
            : [cssLoader]

        if (loader) {
            loaders.push({
                loader: loader + '-loader',
                options: Object.assign({}, loaderOptions, {
                    sourceMap: options.sourceMap
                })
            })
        }

        // Extract CSS when that option is specified
        // (which is the case during production build)
        if (options.extract) {
            return ExtractTextPlugin.extract({
                use: loaders,
                fallback: 'vue-style-loader'
            })
        } else {
            return ['vue-style-loader'].concat(loaders)
        }
    }

    // https://vue-loader.vuejs.org/en/configurations/extract-css.html
    return {
        css: generateLoaders(),
        postcss: generateLoaders(),
        less: generateLoaders('less'),
        sass: generateLoaders('sass', { indentedSyntax: true }),
        scss: generateLoaders('sass').concat({
            loader: 'sass-resources-loader',
            options: {
                resources: [path.resolve(__dirname, '../src/style/app.scss')]
            }
        }),
        stylus: generateLoaders('stylus'),
        styl: generateLoaders('stylus')
    }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function(options) {
    const output = []
    const loaders = exports.cssLoaders(options)

    for (const extension in loaders) {
        const loader = loaders[extension]
        output.push({
            test: new RegExp('\\.' + extension + '$'),
            use: loader
        })
    }

    return output
}

exports.createNotifierCallback = () => {
    const notifier = require('node-notifier')

    return (severity, errors) => {
        if (severity !== 'error') return

        const error = errors[0]
        const filename = error.file && error.file.split('!').pop()

        notifier.notify({
            title: packageConfig.name,
            message: severity + ': ' + error.name,
            subtitle: filename || '',
            icon: path.join(__dirname, 'logo.png')
        })
    }
}

/**------------------ 下面是新增 ------------------*/

// 国内免费cdn镜像源
const cdnBaseHttp = 'https://cdn.staticfile.org'

// 是否使用cnd的js，默认：dev不使用，prod使用
const isExternalJs = process.env.NODE_ENV === 'production'
// process.env.NODE_ENV === 'production'

/* cdn配置
name：模块名称，与package.json同名，如：element-ui
scope：模块作用域命名，对应window里面挂载的变量名称，如：ELEMENT
js：js地址，是从版本号后面开始的，如：完整js cnd为 https://cdn.staticfile.org/element-ui/2.4.11/index.js，则应该填写的为：index.js
css：css地址，是从版本号后面开始的，如：完整css cnd为 https://cdn.staticfile.org/element-ui/2.4.11/theme-chalk/index.css，则应该填写的为：theme-chalk/index.css
*/
const cdnConfig = [
    { name: 'vue', scope: 'Vue', js: 'vue.min.js' },
    {
        name: 'vue-router',
        scope: 'VueRouter',
        js: 'vue-router.min.js',
        cndHttp: 'https://cdn.bootcss.com' // 当不使用默认的cnd镜像源时，可以配置这个
    },
    { name: 'vuex', scope: 'Vuex', js: 'vuex.min.js' }

    // {
    //     name: 'element-ui',
    //     scope: 'ELEMENT',
    //     js: 'index.js',
    //     css: 'theme-chalk/index.css',
    //     cndHttp: 'https://cdn.bootcss.com'
    // }
]

// 获取模块版本号
function getModulesVersion() {
    let mvs = {}
    let regexp = /^npm_package_.{0,3}dependencies_/gi
    for (let m in process.env) {
        // 从node内置参数中读取，也可直接import 项目文件进来
        if (regexp.test(m)) {
            // 匹配模块
            // 获取到模块版本号
            mvs[m.replace(regexp, '').replace(/_/g, '-')] = process.env[
                m
            ].replace(/(~|\^)/g, '')
        }
    }
    return mvs
}

// 1、生成完成的cdnConfig；2、处理忽略的资源
function getExternalModules(config) {
    let externalModules = {} // 要忽略的资源，如 {vue: 'Vue'}
    let dependencieModules = getModulesVersion() // 获取全部的模块和版本号
    config = config || cdnConfig // 默认使用utils下的配置
    config.forEach(item => {
        // 遍历配置
        if (item.name in dependencieModules) {
            let version = dependencieModules[item.name]
            let currCdnHttp = item.cndHttp || cdnBaseHttp
            // 拼接完整 css 的链接
            item.css =
                item.css &&
                [currCdnHttp, item.name, version, item.css].join('/')
            // 拼接完整 js 的链接
            item.js =
                item.js && [currCdnHttp, item.name, version, item.js].join('/')
            // 新增要忽略的资源
            externalModules[item.name] = item.scope
        } else {
            throw new Error(item.name + ' 未安装，请执行cnpm i -S' + item.name)
        }
    })
    // 根据isExternalJs，判断是否真正要忽略
    return isExternalJs ? externalModules : {}
}

// 用在 webpack.base.conf.js 里面
exports.externalModules = getExternalModules()

// 用在 webpack.dev.conf.js/webpack.prod.conf.js 里面
exports.cdnConfig = cdnConfig

// 用在 webpack.dev.conf.js/webpack.prod.conf.js 里面
exports.isExternalJs = isExternalJs
/**------------------ 上面是新增 ------------------*/
