<script>
import EchartsUtil from '../ex-chart/utils.js'
export default {
  name: 'XtConfigProvider',
  inheritAttrs: false,
  provide() {
    return {
      xtConfig: {
        theme: this.theme,
        size: this.size,
        primaryColor: this.primaryColor
      }
    }
  },
  watch: {
    theme(newVal) {
      this.xtConfig ={
        theme: newVal,
        size: this.size,
        primaryColor: this.primaryColor
      }
    },
    size(newVal) {
      this.xtConfig ={
        theme: newVal,
        size: this.size,
        primaryColor: this.primaryColor
      }
    },
    primaryColor(newVal) {
      this.xtConfig ={
        theme: newVal,
        size: this.size,
        primaryColor: this.primaryColor
      }
    }
  },
  render(h) {
    // Vue 2 不支持 Fragment，当 tag="template" 时需要特殊处理
    // 如果设置了 proxyElement，则不渲染包裹元素，只渲染 slot 内容
    if (this.tag === 'template' || this.proxyElement) {
      // 渲染 slot 内容，如果只有一个元素则直接返回，否则包裹一个 div
      const slotContent = this.$slots.default

      if (!slotContent || slotContent.length === 0) {
        return h('div')
      }

      // 如果 slot 只有一个元素，直接返回该元素
      if (slotContent.length === 1) {
        return slotContent[0]
      }

      // Vue 2 不支持多根节点，需要包裹一个 div
      // 使用普通的 div 包裹，避免 display: contents 的兼容性问题
      return h('div', {
        class: 'xt-config-provider-wrapper',
        attrs: {
          'data-theme': this.theme
        }
      }, slotContent)
    }

    // 正常渲染包裹元素
    return h(this.tag, {
      style: this.mergedStyle,
      class: this.computedClass,
      attrs: {
        ...this.customAttrs,
        'data-theme': this.theme
      }
    }, this.$slots.default)
  },
  props: {
    theme: {
      type: String,
      default: 'white',
      validator: (value) => {
        return ['white', 'dark', 'auto'].includes(value)
      }
    },
    size: {
      type: String,
      default: 'medium'
    },
    primaryColor: {
      type: String,
      default: '#1890ff'
    },
    vars: {
      type: Object,
      default: () => ({})
    },
    tag: {
      type: String,
      default: 'div',
      validator: (value) => {
        return ['div', 'span', 'section', 'main', 'template', 'article', 'aside'].includes(value)
      }
    },
    injectBackground: {
      type: Boolean,
      default: false
    },
    injectColor: {
      type: Boolean,
      default: false
    },
    proxyElement: {
      type: [HTMLElement, String, Object],
      default: null,
      description: '代理元素，将样式应用到该元素上。支持 HTMLElement、CSS选择器字符串或 ref 对象'
    },
    onThemeChange: {
      type: Function,
      default: null,
      description: '主题改变时的钩子函数，接收参数: { theme, size, primaryColor }'
    },
    onStyleApplied: {
      type: Function,
      default: null,
      description: '样式应用完成时的钩子函数，接收参数: { element, style, theme }'
    }
  },
  computed: {
    mergedStyle() {
      const result = { ...this.vars }
      
      if (this.primaryColor) {
        const color = this.normalizeColor(this.primaryColor)
        result['--xt-color-primary'] = color
        // 浅色系列（与 css-variables.scss 保持一致）
        result['--xt-color-primary-light-3'] = this.lightenColor(color, 30)
        result['--xt-color-primary-light-5'] = this.lightenColor(color, 50)
        result['--xt-color-primary-light-7'] = this.lightenColor(color, 70)
        result['--xt-color-primary-light-8'] = this.lightenColor(color, 80)
        result['--xt-color-primary-light-9'] = this.lightenColor(color, 90)
        // 深色系列
        result['--xt-color-primary-dark-2'] = this.darkenColor(color, 20)
      }
      
      const sizeMap = {
        small: '14px',
        medium: '16px',
        large: '18px'
      }
      if (sizeMap[this.size]) {
        result['--xt-font-size-base'] = sizeMap[this.size]
      }
      
      if (this.theme === 'dark') {
        if (this.injectBackground) {
          result.backgroundColor = result['--xt-color-bg-primary'] || '#141414'
        }
        if (this.injectColor) {
          result.color = result['--xt-color-text-primary'] || '#E5EAF3'
        }
      } else {
        // 恢复默认主题颜色（light 主题）
        if (this.injectBackground) {
          result.backgroundColor = result['--xt-color-bg-primary'] || '#ffffff'
        }
        if (this.injectColor) {
          result.color = result['--xt-color-text-primary'] || '#2c3e50'
        }
      }
      
      return result
    },
    computedClass() {
      const classes = []
      
      if (this.tag !== 'template') {
        classes.push('xt-config-provider')
      }
      
      return classes
    },
    customAttrs() {
      const props = ['theme', 'size', 'primaryColor', 'vars', 'tag', 'injectBackground', 'injectColor', 'proxyElement']
      const attrs = {}

      for (const key in this.$attrs) {
        if (!props.includes(key)) {
          attrs[key] = this.$attrs[key]
        }
      }

      return attrs
    }
  },
  mounted() {
    this.applyProxyElementStyle()
  },
  updated() {
    this.applyProxyElementStyle()
  },
  beforeUnmount() {
    this.clearProxyElementStyle()
  },
  methods: {
    normalizeColor(color) {
      if (!color) return '#1890ff'
      
      if (/^#[0-9A-Fa-f]{6}$/.test(color)) {
        return color
      }
      
      if (/^#[0-9A-Fa-f]{3}$/.test(color)) {
        return '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3]
      }
      
      if (/^#[0-9A-Fa-f]{8}$/.test(color)) {
        return color.substring(0, 7)
      }
      
      const rgbaMatch = color.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/i)
      if (rgbaMatch) {
        const r = parseInt(rgbaMatch[1])
        const g = parseInt(rgbaMatch[2])
        const b = parseInt(rgbaMatch[3])
        return this.rgbToHex(r, g, b)
      }
      
      console.warn('[XtConfigProvider] 无法识别的颜色格式:', color)
      return '#1890ff'
    },
    
    hexToRgb(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null
    },
    
    rgbToHex(r, g, b) {
      return '#' + [r, g, b].map(x => {
        const hex = x.toString(16)
        return hex.length === 1 ? '0' + hex : hex
      }).join('')
    },
    
    lightenColor(hex, percent) {
      const rgb = this.hexToRgb(hex)
      if (!rgb) return hex
      
      // 使用与 Element Plus 一致的算法：将颜色与白色按比例混合
      // percent 表示混合白色的比例（0-100），即 (1 - percent/100) 是原色比例
      const ratio = percent / 100
      const r = Math.round(rgb.r * (1 - ratio) + 255 * ratio)
      const g = Math.round(rgb.g * (1 - ratio) + 255 * ratio)
      const b = Math.round(rgb.b * (1 - ratio) + 255 * ratio)
      
      return this.rgbToHex(r, g, b)
    },
    
    darkenColor(hex, percent) {
      const rgb = this.hexToRgb(hex)
      if (!rgb) return hex

      // 使用按比例混合黑色的方式变暗
      // percent 表示混合黑色的比例（0-100）
      const ratio = percent / 100
      const r = Math.max(0, Math.round(rgb.r * (1 - ratio)))
      const g = Math.max(0, Math.round(rgb.g * (1 - ratio)))
      const b = Math.max(0, Math.round(rgb.b * (1 - ratio)))

      return this.rgbToHex(r, g, b)
    },
    
    getProxyElement() {
      const { proxyElement } = this
      
      if (!proxyElement) return null
      
      if (proxyElement instanceof HTMLElement) {
        return proxyElement
      }
      
      if (typeof proxyElement === 'string') {
        return document.querySelector(proxyElement)
      }
      
      if (proxyElement.$el) {
        return proxyElement.$el
      }
      
      if (proxyElement.value && proxyElement.value instanceof HTMLElement) {
        return proxyElement.value
      }
      
      console.warn('[XtConfigProvider] 无法解析 proxyElement:', proxyElement)
      return null
    },
    
    applyProxyElementStyle() {
      const element = this.getProxyElement()
      if (!element) return
      
      const style = this.mergedStyle
      const prevTheme = element.getAttribute('data-theme')
      
      // 应用样式到代理元素
      for (const key in style) {
        element.style.setProperty(key, style[key])
      }
      
      // 设置 data-theme 属性
      element.setAttribute('data-theme', this.theme)

      // 更新图表颜色
      EchartsUtil.changeAllTheme(this.theme, this.size, this.primaryColor)
      
      // 触发主题改变钩子（当主题实际发生变化时）
      if (prevTheme !== this.theme && typeof this.onThemeChange === 'function') {
        this.onThemeChange({
          theme: this.theme,
          size: this.size,
          primaryColor: this.primaryColor,
          prevTheme: prevTheme
        })
      }
      
      // 触发样式应用完成钩子
      if (typeof this.onStyleApplied === 'function') {
        this.onStyleApplied({
          element: element,
          style: style,
          theme: this.theme,
          size: this.size,
          primaryColor: this.primaryColor
        })
      }
      
    },
    
    clearProxyElementStyle() {
      const element = this.getProxyElement()
      if (!element) return
      
      const style = this.mergedStyle

      for (const key in style) {
        element.style.removeProperty(key)
      }

      // 移除 data-theme 属性
      element.removeAttribute('data-theme')
    }
  }
}
</script>

<style scoped>
/* 包裹容器样式 - 最小化影响布局 */
.xt-config-provider-wrapper {
  width: 100%;
  height: 100%;
}
</style>
