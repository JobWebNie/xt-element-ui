<template>
  <el-tooltip
    v-if="showTooltip && ellipsis"
    :content="displayTooltipContent"
    :placement="tooltipPlacement"
    :disabled="!isOverflow"
    effect="dark"
  >
    <span 
      ref="textRef"
      class="xt-text" 
      :class="[
        type ? 'xt-text--' + type : '',
        'xt-text--' + size,
        { 'xt-text--bold': bold },
        { 'xt-text--money': format === 'money' },
        { 'xt-text--ellipsis': ellipsis && ellipsisRows == 1 },
        { 'xt-text--ellipsis-multiline': ellipsis && ellipsisRows > 1 }
      ]"
      :style="customStyle"
      @mouseenter="handleMouseEnter"
    >
      <template v-if="$slots.prefix">
        <slot name="prefix"></slot>
      </template>
      <template v-else-if="prefix">{{ prefix }}</template>
      <slot>
        <template v-if="formattedValue !== undefined">{{ formattedValue }}</template>
      </slot>
      <template v-if="$slots.suffix">
        <slot name="suffix"></slot>
      </template>
      <template v-else-if="suffix">{{ suffix }}</template>
    </span>
  </el-tooltip>
  <span 
    v-else
    ref="textRef"
    class="xt-text" 
    :class="[
      type ? 'xt-text--' + type : '',
      'xt-text--' + size,
      { 'xt-text--bold': bold },
      { 'xt-text--money': format === 'money' },
      { 'xt-text--ellipsis': ellipsis && ellipsisRows == 1 },
      { 'xt-text--ellipsis-multiline': ellipsis && ellipsisRows > 1 }
    ]"
    :style="customStyle"
  >
    <template v-if="$slots.prefix">
      <slot name="prefix"></slot>
    </template>
    <template v-else-if="prefix">{{ prefix }}</template>
    <slot>
      <template v-if="formattedValue !== undefined">{{ formattedValue }}</template>
    </slot>
    <template v-if="$slots.suffix">
      <slot name="suffix"></slot>
    </template>
    <template v-else-if="suffix">{{ suffix }}</template>
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
      default: 'small',
      validator: (val) => ['extra-large', 'large', 'medium', 'small', 'mini', 'extra-small'].includes(val)
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
    showTooltip: {
      type: Boolean,
      default: true
    },
    tooltipPlacement: {
      type: String,
      default: 'top',
      validator: (val) => ['top', 'bottom', 'left', 'right', 'top-start', 'top-end', 'bottom-start', 'bottom-end', 'left-start', 'left-end', 'right-start', 'right-end'].includes(val)
    },
    tooltipContent: {
      type: String,
      default: ''
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
  data() {
    return {
      ellipsisWidth: undefined,
      isOverflow: false
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
        style.width = `${this.ellipsisWidth}px`
      }
      return style
    },

    displayTooltipContent() {
      if (this.tooltipContent) {
        return this.tooltipContent
      }
      if (this.formattedValue !== undefined) {
        return this.formattedValue
      }
      if (this.$slots.default && this.$slots.default.length > 0) {
        return this.extractSlotText(this.$slots.default)
      }
      return this.value
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
  },
  methods: {
    handleMouseEnter() {
      this.checkOverflow()
    },
    checkOverflow() {
      const el = this.$refs.textRef
      if (!el) {
        this.isOverflow = false
        return
      }

      if (this.ellipsisRows > 1) {
        this.isOverflow = el.scrollHeight > el.clientHeight
        this.ellipsisWidth =  el.clientWidth;
      } else {
        this.isOverflow = el.scrollWidth > el.clientWidth
      }
    },
    extractSlotText(nodes) {
      let text = ''
      nodes.forEach(node => {
        if (typeof node.children === 'string') {
          text += node.children
        } else if (typeof node.text === 'string') {
          text += node.text
        } else if (node.children && Array.isArray(node.children)) {
          text += this.extractSlotText(node.children)
        }
      })
      return text.trim()
    }
  },
  mounted() {
    if (this.ellipsis && this.showTooltip) {
      this.$nextTick(() => {
        this.checkOverflow()
      })
    }
    this._resizeObserver = new ResizeObserver(() => {
      if (this.ellipsis && this.showTooltip) {
        this.checkOverflow()
      }
    })
    this.$nextTick(() => {
      if (this.$refs.textRef) {
        this._resizeObserver.observe(this.$refs.textRef)
      }
    })
  },
  beforeDestroy() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect()
    }
  },
  watch: {
    value() {
      if (this.ellipsis && this.showTooltip) {
        this.$nextTick(() => {
          this.checkOverflow()
        })
      }
    },
    ellipsis(newVal) {
      if (newVal && this.showTooltip) {
        this.$nextTick(() => {
          this.checkOverflow()
        })
      }
    }
  }
}
</script>