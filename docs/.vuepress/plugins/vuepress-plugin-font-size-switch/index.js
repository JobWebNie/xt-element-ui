const path = require('path')

module.exports = (options, context) => {
  const defaultOptions = {
    defaultSize: 'medium',
    sizes: ['small', 'medium', 'large'],
    sizeLabels: {
      small: '小号',
      medium: '中号',
      large: '大号'
    },
    position: 'right'
  }

  const opts = { ...defaultOptions, ...options }

  return {
    name: 'vuepress-plugin-font-size-switch',
    version: '1.0.0',
    
    define() {
      return {
        FONT_SIZE_OPTIONS: JSON.stringify(opts)
      }
    },

    enhanceAppFiles: [
      path.resolve(__dirname, 'clientEnhance.js')
    ]
  }
}
