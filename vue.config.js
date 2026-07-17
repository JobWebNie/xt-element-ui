const path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
    productionSourceMap: false,

    pages: {
      index: {
        entry: './examples/main.js',
        template: './examples/index.html',
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
      // 将 element-ui 标记为外部依赖，避免打包进组件库
      config.externals({
        'element-ui': {
          commonjs: 'element-ui',
          commonjs2: 'element-ui',
          amd: 'element-ui',
          root: 'ElementUI'
        }
      })
    }
}