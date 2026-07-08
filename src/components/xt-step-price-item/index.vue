<template>
  <div class="xt-step-price-item">
    <div class="xt-step-price-item__range">
      <span class="xt-step-price-item__bracket">{{ finalLeftBracket }}</span>
      <span v-if="itemsLength > 1" class="xt-step-price-item__name">第{{ index + 1 }}{{stepName}}</span>
      <span class="xt-step-price-item__bracket">{{ finalRightBracket }}</span>
      <xt-input
        v-model.number="minInput"
        :disabled="disabled || minLocked"
        size="small"
        placeholder="下限"
        class="xt-step-price-item__input"
        @blur="(e) => { onMinBlur(); onBlur(e) }"
      />
      <span class="xt-step-price-item__comma">-</span>
      <xt-input
        v-if="!isLast"
        v-model.number="maxInput"
        type="number"
        :disabled="disabled"
        size="small"
        placeholder="上限"
        class="xt-step-price-item__input"
        @blur="(e) => { onMaxBlur(); onBlur(e) }"
      />
      <span v-else class="xt-step-price-item__infinity">+∞</span>
    </div>


    <div class="xt-step-price-item__price">
      <xt-input
        v-model.number="priceInput"
        type="number"
        :disabled="disabled"
        size="small"
        placeholder="价格"
        class="xt-step-price-item__input xt-step-price-item__input--price"
        @blur="(e) => { onPriceBlur(); onBlur(e) }"
      />
      <span class="xt-step-price-item__unit">{{ unit }}</span>
    </div>

    <xt-button
      v-if="!disabled && removable && itemsLength > 1"
      type="text"
      icon="el-icon-delete"
      class="xt-step-price-item__delete"
      @click="onDelete"
    />
  </div>
</template>

<script>
export default {
  name: 'XtStepPriceItem',

  props: {
    value: {
      type: Object,
      required: true,
      default: () => ({ min: 0, max: null, price: 0 })
    },
    stepName: { type: String, default: '阶梯' },
    index: { type: Number, default: 0 },
    isFirst: { type: Boolean, default: false },
    isLast: { type: Boolean, default: false },
    itemsLength: { type: Number, default: 1 },
    removable: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false },
    allowNegative: { type: Boolean, default: false },
    minLocked: { type: Boolean, default: false },
    unit: { type: String, default: '元' },
    precision: { type: Number, default: 2 },
    // 阶梯增量：控制新增/校正时的区间跨度，默认 1
    step: { type: Number, default: 1 },
    // 左括号：默认 '['，传空则不显示
    leftBracket: { type: String, default: '[' },
    // 右括号：默认 null，走内置规则（只有1条为 ']'，多条为 ')'）；传值则强制使用
    rightBracket: { type: String, default: null },
    // 字段名映射：{ min, max, price }，允许传入的 value 使用自定义字段名
    fieldKeys: {
      type: Object,
      default: () => ({ min: 'min', max: 'max', price: 'price' })
    }
  },

  computed: {
    keyMin() { return (this.fieldKeys && this.fieldKeys.min) || 'min' },
    keyMax() { return (this.fieldKeys && this.fieldKeys.max) || 'max' },
    keyPrice() { return (this.fieldKeys && this.fieldKeys.price) || 'price' },
    finalRightBracket() {
      if (this.rightBracket !== null && this.rightBracket !== undefined && this.rightBracket !== '') return this.rightBracket
      return this.isLast ? ']' : ')'
    },
    finalLeftBracket() {
      return (this.leftBracket === null || this.leftBracket === undefined) ? '[' : this.leftBracket
    }
  },

  data() {
    const { minVal, maxVal, priceVal } = this.getPriceItem(this.value)
    return {
      minInput: minVal,
      maxInput: maxVal,
      priceInput: priceVal
    }
  },

  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(val) {
        const { minVal, maxVal, priceVal } = this.getPriceItem(val)
        this.minInput = minVal
        this.maxInput = maxVal
        this.priceInput = priceVal
      }
    },
    isLast(val) {
      if (val) {
        this.maxInput = null
      } else {
        const minVal = this.safeNumber(this.minInput, 0)
        const v = this.value
        this.maxInput = this.safeNumber(v && v[this.keyMax], minVal + 1)
      }
    }
  },

  methods: {
    getPriceItem(value) {
      const v = value
      const minVal = this.safeNumber(v && v[this.keyMin], 0)
      const maxVal = this.isLast ? null : this.safeNumber(v && v[this.keyMax], minVal + 1)
      const priceVal = this.safeNumber(v && v[this.keyPrice], 0)
      return {
        minVal,
        maxVal,
        priceVal
      }
    },
    // 统一兜底：非数字输入一律转为 fallback（默认 0）
    safeNumber(v, fallback = 0) {
      if (v === null || v === undefined || v === '' || v === Infinity || v === -Infinity) return fallback
      const n = Number(v)
      return isNaN(n) ? fallback : n
    },

    emitChange(partial) {
      const next = {
        [this.keyMin]: this.minInput,
        [this.keyMax]: this.isLast ? null : this.maxInput,
        [this.keyPrice]: this.priceInput,
        ...partial
      }
      this.$emit('input', next)
      this.$emit('change', next, this.index)
    },

    onMinBlur() {
      let v = this.safeNumber(this.minInput, 0)
      if (v !== 0) {
        v = Number(v.toFixed(this.precision))
      }
      this.minInput = v
      this.$emit('min-change', v, this.index)
      this.emitChange({ [this.keyMin]: v })
    },

    onMaxBlur() {
      if (this.isLast) return
      const minVal = this.safeNumber(this.minInput, 0)
      const stepVal = this.safeNumber(this.step, 1)
      let v = this.safeNumber(this.maxInput, minVal + stepVal)
      if (v <= minVal) v = minVal + stepVal
      v = Number(v.toFixed(this.precision))
      this.maxInput = v
      this.$emit('max-change', v, this.index)
      this.emitChange({ [this.keyMax]: v })
    },

    onPriceBlur() {
      const rawVal = this.priceInput
      if (rawVal === null || rawVal === undefined || rawVal === '' || isNaN(rawVal)) {
        this.priceInput = ''
        this.emitChange({ [this.keyPrice]: '' })
        return
      }
      let v = this.safeNumber(rawVal, 0)
      if (v < 0 && !this.allowNegative) v = 0
      v = Number(v.toFixed(this.precision))
      this.priceInput = v
      this.emitChange({ [this.keyPrice]: v })
    },

    onBlur(e) {
      this.$emit('blur', e)
    },

    onDelete() {
      this.$emit('delete', this.index)
    }
  }
}
</script>
