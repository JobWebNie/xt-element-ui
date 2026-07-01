<template>
  <div
    class="xt-input"
    :class="[
      size ? 'xt-input--' + size : '',
      { 'is-disabled': disabled }
    ]"
  >
    <el-input
      :value="displayValue"
      :placeholder="placeholder"
      :type="isNumberType ? 'text' : type"
      :size="size"
      :disabled="disabled"
      :readonly="readonly"
      :style="inputStyle"
      @input="handleInput"
      @change="handleChange"
      @focus="handleFocus"
      @blur="handleBlur"
    />
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
      default: 'text'
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
    }
  },
  data() {
    return {
      currentStr: '',
      isFocused: false
    }
  },
  computed: {
    isNumberType() {
      return this.type === 'number'
    },
    displayValue() {
      if (this.isNumberType) {
        return this.currentStr
      }
      return this.value
    },
    inputStyle() {
      if (this.color) {
        return {
          '--xt-input-focus-color': this.color
        }
      }
      return {}
    }
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        if (this.isNumberType && !this.isFocused) {
          this.currentStr = val === null || val === undefined || val === '' ? '' : String(val)
        }
      }
    }
  },
  methods: {
    isValidNumber(str) {
      return /^[+-]?\d*\.?\d*$/.test(str)
    },
    handleInput(val) {
      if (this.isNumberType) {
        if (this.isValidNumber(val)) {
          this.currentStr = val
          const num = this.parseToNumber(val)
          if (num !== undefined) {
            this.$emit('input', num)
          }
        }
      } else {
        this.$emit('input', val)
      }
    },
    handleChange(val) {
      if (this.isNumberType) {
        const num = this.parseToNumber(val)
        this.$emit('change', num)
      } else {
        this.$emit('change', val)
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
        this.$emit('blur', num, e)
        if (num !== undefined) {
          this.currentStr = String(num)
          this.$emit('input', num)
        } else {
          if (this.currentStr !== '') {
            this.currentStr = ''
            this.$emit('input', undefined)
          }
        }
      } else {
        this.$emit('blur', e)
      }
    },
    parseToNumber(str) {
      if (!str || str === '+' || str === '-' || str === '.' || str === '+.' || str === '-.' || str === '-.') {
        return undefined
      }
      const num = parseFloat(str)
      return isNaN(num) ? undefined : num
    }
  }
}
</script>
