<script>
import EchartsUtil from '../xt-chart/utils.js'

// SSR 兼容：Node.js 环境中 HTMLElement 不存在
const HTMLElementType = typeof HTMLElement !== 'undefined' ? HTMLElement : Object

export default {
  name: 'XtConfigProvider',
  inheritAttrs: false,
  data() {
    return {
      xtConfig: {
        theme: this.theme,
        size: this.size,
        primaryColor: this.primaryColor,
        brand: this.brand
      }
    }
  },
  provide() {
    return {
      xtConfig: this.xtConfig
    }
  },
  watch: {
    theme(newVal) {
      this.xtConfig.theme = newVal
      this.updateConfig()
    },
    size(newVal) {
      this.xtConfig.size = newVal
      this.updateConfig()
    },
    primaryColor(newVal) {
      this.xtConfig.primaryColor = newVal
      this.updateConfig()
    },
    brand(newVal) {
      this.xtConfig.brand = newVal
      this.updateConfig()
    }
  },
  render(h) {
    const slotContent = this.$slots.default

    if (this.tag === 'template' || this.proxyElement) {
      if (!slotContent || slotContent.length === 0) {
        return h('div')
      }

      if (slotContent.length === 1) {
        return slotContent[0]
      }

      return h('div', {
        class: 'xt-config-provider-wrapper',
        attrs: {
          'data-theme': this.theme,
          'data-brand': this.brand
        }
      }, slotContent)
    }

    return h(this.tag, {
      style: this.mergedStyle,
      class: this.computedClass,
      attrs: {
        ...this.customAttrs,
        'data-theme': this.theme,
        'data-brand': this.brand
      }
    }, this.$slots.default)
  },
  props: {
    theme: {
      type: String,
      default: 'light',
      validator: (value) => {
        return ['light', 'dark', 'auto'].includes(value)
      }
    },
    size: {
      type: String,
      default: 'medium',
      validator: (value) => {
        return ['small', 'medium', 'large'].includes(value)
      }
    },
    primaryColor: {
      type: String,
      default: '#1890ff'
    },
    brand: {
      type: String,
      default: '',
      validator: (value) => {
        return ['', 'water', 'electricity', 'gas'].includes(value)
      }
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
      type: [HTMLElementType, String, Object],
      default: null,
      description: '代理元素，将样式应用到该元素上。支持 HTMLElement、CSS选择器字符串或 ref 对象'
    },
    onThemeChange: {
      type: Function,
      default: null,
      description: '主题改变时的钩子函数，接收参数: { theme, size, primaryColor, brand }'
    },
    onStyleApplied: {
      type: Function,
      default: null,
      description: '样式应用完成时的钩子函数，接收参数: { element, style, theme, brand }'
    }
  },
  computed: {
    mergedStyle() {
      const result = { ...this.vars }
      
      if (this.primaryColor) {
        const color = this.normalizeColor(this.primaryColor)
        result['--xt-color-primary'] = color
        result['--xt-color-primary-light-3'] = this.lightenColor(color, 30)
        result['--xt-color-primary-light-5'] = this.lightenColor(color, 50)
        result['--xt-color-primary-light-7'] = this.lightenColor(color, 70)
        result['--xt-color-primary-light-8'] = this.lightenColor(color, 80)
        result['--xt-color-primary-light-9'] = this.lightenColor(color, 90)
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
          result.backgroundColor = result['--xt-bg-color'] || '#141414'
        }
        if (this.injectColor) {
          result.color = result['--xt-text-color-primary'] || '#E5EAF3'
        }
      } else {
        if (this.injectBackground) {
          result.backgroundColor = result['--xt-bg-color'] || '#ffffff'
        }
        if (this.injectColor) {
          result.color = result['--xt-text-color-primary'] || '#303133'
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
      const props = ['theme', 'size', 'primaryColor', 'brand', 'vars', 'tag', 'injectBackground', 'injectColor', 'proxyElement']
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
    updateConfig() {
      this.applyProxyElementStyle()
    },
    
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
      
      const ratio = percent / 100
      const r = Math.round(rgb.r * (1 - ratio) + 255 * ratio)
      const g = Math.round(rgb.g * (1 - ratio) + 255 * ratio)
      const b = Math.round(rgb.b * (1 - ratio) + 255 * ratio)
      
      return this.rgbToHex(r, g, b)
    },
    
    darkenColor(hex, percent) {
      const rgb = this.hexToRgb(hex)
      if (!rgb) return hex

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
      const prevBrand = element.getAttribute('data-brand')
      
      for (const key in style) {
        element.style.setProperty(key, style[key])
      }
      
      element.setAttribute('data-theme', this.theme)
      element.setAttribute('data-brand', this.brand)

      EchartsUtil.changeAllTheme(this.theme, this.size, this.primaryColor, this.brand)
      
      if (prevTheme !== this.theme && typeof this.onThemeChange === 'function') {
        this.onThemeChange({
          theme: this.theme,
          size: this.size,
          primaryColor: this.primaryColor,
          brand: this.brand,
          prevTheme: prevTheme,
          prevBrand: prevBrand
        })
      }
      
      if (typeof this.onStyleApplied === 'function') {
        this.onStyleApplied({
          element: element,
          style: style,
          theme: this.theme,
          size: this.size,
          primaryColor: this.primaryColor,
          brand: this.brand
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

      element.removeAttribute('data-theme')
      element.removeAttribute('data-brand')
    }
  }
}
</script>

<style scoped>
.xt-config-provider-wrapper {
  width: 100%;
  height: 100%;
}
</style>