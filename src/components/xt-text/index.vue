<template>
  <span 
    class="xt-text" 
    :class="[
      type ? 'xt-text--' + type : '',
      'xt-text--' + size,
      { 'xt-text--bold': bold },
      { 'xt-text--money': format === 'money' },
      { 'xt-text--ellipsis': ellipsis },
      { 'xt-text--ellipsis-multiline': ellipsis && ellipsisRows > 1 }
    ]"
    :style="customStyle"
  >
    <slot name="prefix">{{ prefix }}</slot>
    <slot>
      <template v-if="formattedValue !== undefined">{{ formattedValue }}</template>
    </slot>
    <slot name="suffix">{{ suffix }}</slot> 
  </span>
</template>

<script>
export default {
  name: 'XtText',
  model: {
    prop: 'value',
    event: 'input'
  },
  props: {
    type: {
      type: String,
      default: '',
      validator: (val) => ['', 'primary', 'success', 'warning', 'danger'].includes(val)
    },
    size: {
      type: String,
      default: 'base',
      validator: (val) => ['extra-large', 'large', 'medium', 'base', 'small', 'extra-small'].includes(val)
    },
    bold: {
      type: Boolean,
      default: false
    },
    letterSpacing: {
      type: [String, Number],
      default: ''
    },
    ellipsis: {
      type: Boolean,
      default: false
    },
    ellipsisRows: {
      type: Number,
      default: 1,
      validator: (val) => val >= 1 && val <= 10
    },

    // 格式化模式：normal 普通 | thousand 千分位 | money 金额
    format: {
      type: String,
      default: 'normal',
      validator: (val) => ['normal', 'thousand', 'money'].includes(val)
    },

    // 兼容旧属性 money（老项目继续使用）
    money: {
      type: Boolean,
      default: false
    },
    value: {
      type: [Number, String],
      default: ''
    },
    currency: {
      type: String,
      default: 'CNY',
      validator: (val) => ['CNY', 'USD', 'EUR', 'JPY', 'GBP', 'AUD', 'CAD'].includes(val)
    },
    decimals: {
      type: Number,
      default: 2,
      validator: (val) => val >= 0 && val <= 10
    },
    locale: {
      type: String,
      default: 'zh-CN'
    },
    showSign: {
      type: Boolean,
      default: false
    },
    prefix: {
      type: String,
      default: ''
    },
    suffix: {
      type: String,
      default: ''
    }
  },
  computed: {
    // 兼容旧 money 属性：如果传了 money=true，自动切为金额模式
    realFormat() {
      return this.money ? 'money' : this.format
    },

    customStyle() {
      const style = {}
      if (this.letterSpacing) {
        style.letterSpacing = typeof this.letterSpacing === 'number' ? `${this.letterSpacing}px` : this.letterSpacing
      }
      if (this.ellipsis && this.ellipsisRows > 1) {
        style.WebkitLineClamp = this.ellipsisRows
      }
      return style
    },

    formattedValue() {
      const fmt = this.realFormat
      const { value } = this

      if (value === '' || value === undefined || value === null) {
        return undefined
      }

      const numValue = typeof value === 'string' ? parseFloat(value) : value
      if (isNaN(numValue)) {
        return value
      }

      try {
        let result = ''
        const signOpt = this.showSign ? 'always' : 'auto'

        switch (fmt) {
          // 千分位格式化（纯数字）
          case 'thousand':
            result = new Intl.NumberFormat(this.locale, {
              minimumFractionDigits: this.decimals,
              maximumFractionDigits: this.decimals,
              signDisplay: signOpt
            }).format(numValue)
            break

          // 金额格式化（原有逻辑）
          case 'money':
            result = new Intl.NumberFormat(this.locale, {
              style: 'currency',
              currency: this.currency,
              minimumFractionDigits: this.decimals,
              maximumFractionDigits: this.decimals,
              signDisplay: signOpt
            }).format(numValue)
            break

          // 普通文本，直接返回原值
          default:
            return undefined
        }

        return result
      } catch (e) {
        return value
      }
    }
  }
}
</script>