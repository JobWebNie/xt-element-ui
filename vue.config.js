const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
    productionSourceMap: false,

    pages: {
      index: {
        entry: './public/main.js',
        template: './public/index.html',
        filename: 'index.html'
      }
    },

    configureWebpack: {
      resolve: {
        alias: {
          '@': resolve('src')
        }
      }
    },

    css: {
      extract: true,
      sourceMap: false,
      loaderOptions: {
        scss: {
          additionalData: `@import "./src/styles/variables.scss";`
        }
      }
    },

    chainWebpack: (config) => {
      // 仅在生产构建时设置 externals，避免影响开发服务器的热更新
      if (process.env.NODE_ENV === 'production') {
        config.externals({
          'element-ui': {
            commonjs: 'element-ui',
            commonjs2: 'element-ui',
            amd: 'element-ui',
            root: 'ElementUI'
          },
          'vue': {
            commonjs: 'vue',
            commonjs2: 'vue',
            amd: 'vue',
            root: 'Vue'
          },
          'echarts': {
            commonjs: 'echarts',
            commonjs2: 'echarts',
            amd: 'echarts',
            root: 'echarts'
          }
        })
      }
    }
}