<template>
  <div
    class="xt-input"
    :class="[
      size ? 'xt-input--' + size : '',
      { 'is-disabled': disabled },
      { 'is-error': hasError }
    ]"
  >
    <el-input
      :value="displayValue"
      :placeholder="placeholder"
      :type="inputType"
      :size="size"
      :disabled="disabled"
      :readonly="readonly"
      :style="inputStyle"
      :maxlength="maxlength"
      :show-word-limit="showWordLimit"
      :prefix-icon="prefixIcon"
      :suffix-icon="suffixIcon"
      @input="handleInput"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
      @clear="handleClear"
    >
      <template v-if="$slots.prefix" #prefix>
        <slot name="prefix"></slot>
      </template>
      <template v-if="$slots.suffix" #suffix>
        <slot name="suffix"></slot>
      </template>
    </el-input>
  </div>
</template>

<script>
export default {
  name: 'XtInput',
  props: {
    value: [String, Number],
    placeholder: {
      type: String,
      default: '请输入内容'
    },
    type: {
      type: String,
      default: 'text',
      validator: (val) => ['text', 'number', 'integer', 'decimal', 'money', 'phone', 'email', 'idcard', 'password', 'textarea'].includes(val)
    },
    size: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: ''
    },
    precision: {
      type: Number,
      default: 2,
      validator: (val) => val >= 0 && val <= 10
    },
    min: {
      type: Number,
      default: undefined
    },
    max: {
      type: Number,
      default: undefined
    },
    allowNegative: {
      type: Boolean,
      default: false
    },
    thousandSeparator: {
      type: Boolean,
      default: false
    },
    maxlength: {
      type: Number,
      default: undefined
    },
    showWordLimit: {
      type: Boolean,
      default: false
    },
    prefixIcon: {
      type: String,
      default: ''
    },
    suffixIcon: {
      type: String,
      default: ''
    },
    trim: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentStr: '',
      isFocused: false,
      hasError: false
    }
  },
  computed: {
    inputType() {
      if (this.type === 'textarea') {
        return 'textarea'
      }
      if (this.type === 'password') {
        return 'password'
      }
      if (this.isNumberType) {
        return 'text'
      }
      return 'text'
    },
    isNumberType() {
      return ['number', 'integer', 'decimal', 'money'].includes(this.type)
    },
    displayValue() {
      if (this.isNumberType) {
        if (this.thousandSeparator && this.currentStr) {
          return this.formatThousand(this.currentStr)
        }
        return this.currentStr
      }
      return this.value
    },
    inputStyle() {
      const style = {}
      if (this.color) {
        style['--xt-input-focus-color'] = this.color
      }
      return style
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        if (this.isNumberType && !this.isFocused) {
          if (val === null || val === undefined || val === '') {
            this.currentStr = ''
          } else {
            const strVal = String(val)
            if (this.thousandSeparator) {
              this.currentStr = this.parseThousand(strVal)
            } else {
              this.currentStr = strVal
            }
          }
        }
      }
    }
  },
  methods: {
    isValidNumber(str) {
      if (!str) return true
      const negativePattern = this.allowNegative ? '[-+]?' : ''
      if (this.type === 'integer') {
        return new RegExp(`^${negativePattern}\\d*$`).test(str)
      }
      if (this.type === 'decimal' || this.type === 'number') {
        if (this.precision === 0) {
          return new RegExp(`^${negativePattern}\\d*$`).test(str)
        }
        return new RegExp(`^${negativePattern}\\d*\\.?\\d{0,${this.precision}}$`).test(str)
      }
      if (this.type === 'money') {
        return new RegExp(`^${negativePattern}\\d*\\.?\\d{0,${this.precision}}$`).test(str)
      }
      return true
    },
    isValidPhone(str) {
      return /^1[3-9]\d{0,9}$/.test(str)
    },
    isValidEmail(str) {
      if (!str) return true
      return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(str)
    },
    isValidIdCard(str) {
      return /^[1-9]\d{0,17}$/.test(str)
    },
    formatThousand(str) {
      if (!str) return ''
      const parts = str.split('.')
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
      return parts.join('.')
    },
    parseThousand(str) {
      return str.replace(/,/g, '')
    },
    parseToNumber(str) {
      if (!str || str === '+' || str === '-' || str === '.' || str === '+.' || str === '-.' || str === '-.') {
        return undefined
      }
      const num = parseFloat(str)
      return isNaN(num) ? undefined : num
    },
    handleInput(val) {
      let inputVal = val
      
      if (this.thousandSeparator && this.isNumberType) {
        inputVal = this.parseThousand(val)
      }

      if (this.type === 'phone') {
        inputVal = val.replace(/[^\d]/g, '')
        if (!this.isValidPhone(inputVal)) {
          inputVal = inputVal.slice(0, -1)
        }
        this.$emit('input', inputVal)
        return
      }

      if (this.type === 'idcard') {
        inputVal = val.replace(/[^\dXx]/g, '')
        if (!this.isValidIdCard(inputVal)) {
          inputVal = inputVal.slice(0, -1)
        }
        this.$emit('input', inputVal.toUpperCase())
        return
      }

      if (this.type === 'email') {
        if (!this.isValidEmail(inputVal)) {
          this.hasError = true
        } else {
          this.hasError = false
        }
        this.$emit('input', inputVal)
        return
      }

      if (this.isNumberType) {
        if (this.isValidNumber(inputVal)) {
          this.currentStr = inputVal
          const num = this.parseToNumber(inputVal)
          if (num !== undefined) {
            let finalNum = num
            if (this.min !== undefined && num < this.min) {
              finalNum = this.min
              this.currentStr = String(finalNum)
            }
            if (this.max !== undefined && num > this.max) {
              finalNum = this.max
              this.currentStr = String(finalNum)
            }
            this.$emit('input', finalNum)
            this.hasError = false
          } else {
            this.$emit('input', undefined)
          }
        }
      } else {
        if (this.trim) {
          inputVal = inputVal.trim()
        }
        this.$emit('input', inputVal)
      }
    },
    handleChange(val) {
      let changeVal = val
      
      if (this.thousandSeparator && this.isNumberType) {
        changeVal = this.parseThousand(val)
      }

      if (this.isNumberType) {
        const num = this.parseToNumber(changeVal)
        this.$emit('change', num)
      } else {
        if (this.trim) {
          changeVal = changeVal.trim()
        }
        this.$emit('change', changeVal)
      }
    },
    handleFocus(e) {
      this.isFocused = true
      this.$emit('focus', e)
    },
    handleBlur(e) {
      this.isFocused = false
      
      if (this.isNumberType) {
        const num = this.parseToNumber(this.currentStr)
        if (num !== undefined) {
          let finalNum = num
          if (this.precision > 0) {
            finalNum = Number(num.toFixed(this.precision))
          }
          this.currentStr = String(finalNum)
          this.$emit('input', finalNum)
          this.$emit('blur', finalNum, e)
          this.hasError = false
        } else {
          if (this.currentStr !== '') {
            this.currentStr = ''
            this.$emit('input', undefined)
          }
          this.$emit('blur', undefined, e)
          this.hasError = false
        }
      } else {
        if (this.type === 'email') {
          if (!this.isValidEmail(this.value)) {
            this.hasError = true
          }
        }
        this.$emit('blur', e)
      }
    },
    handleClear() {
      if (this.isNumberType) {
        this.currentStr = ''
      }
      this.hasError = false
      this.$emit('input', this.isNumberType ? undefined : '')
      this.$emit('clear')
    },
    reset() {
      this.currentStr = ''
      this.hasError = false
      this.$emit('input', this.isNumberType ? undefined : '')
    }
  }
}
</script>