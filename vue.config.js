const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
    // 关闭生产环境 sourcemap
    productionSourceMap: false,
  
    // 单页面标准入口配置
    pages: {
      index: {
        entry: './examples/main.js',
        template: './examples/index.html',
        filename: 'index.html'
      }
    },
  
    // 路径别名配置（开发和生产环境都生效）
    configureWebpack: {
      resolve: {
        alias: {
          '@': resolve('src')
        }
      },
      externals(id) {
        // 匹配 src/enhance 资源，标记为外部依赖，不打入产物
        if (/src[\\/]enhance/.test(id)) {
          return 'skip-enhance'
        }
      }
    },
  
    css: {
      extract: true,
      sourceMap: false,
      loaderOptions: {
        scss: {
          // 使用相对路径避免别名问题
          additionalData: `@import "./src/styles/variables.scss";`
        }
      }
    },
  
    // 组件库打包配置
    chainWebpack: (config) => {
      if (process.env.NODE_ENV === "production") {
        // 入口改为组件库总入口
        config.entry("index").clear().add("./src/index.js").end();
        
      // 排除enhance下所有资源进入打包
        config.module
          .rule('exclude-enhance')
          .test(/src[\\/]enhance[\\/]/)
          .use('null-loader')

        // 输出 UMD 格式
        config.output
          .filename("index.js")
          .library("xt-element-ui")
          .libraryTarget("umd")
          .umdNamedDefine(true);
        
        // 只在生产环境配置 externals
        config.externals({
          vue: {
            commonjs: 'vue',
            commonjs2: 'vue',
            amd: 'vue',
            root: 'Vue' // 仅全局CDN用大写Vue
          },
          "element-ui": {
            commonjs: 'element-ui',
            commonjs2: 'element-ui',
            amd: 'element-ui',
            root: 'ElementUI'
          }
        })
      }
    },
  };