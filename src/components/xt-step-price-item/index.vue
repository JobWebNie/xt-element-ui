<template>
  <div class="xt-step-price-item">
    <div class="xt-step-price-item__range">
      <span class="xt-step-price-item__bracket">[</span>
      <el-input
        v-model.number="minInput"
        :disabled="disabled || minLocked"
        size="small"
        class="xt-step-price-item__input"
        @blur="onMinBlur"
      />
      <span class="xt-step-price-item__comma">,</span>
      <el-input
        v-if="!isLast"
        v-model.number="maxInput"
        :disabled="disabled"
        size="small"
        class="xt-step-price-item__input"
        @blur="onMaxBlur"
      />
      <span v-else class="xt-step-price-item__infinity">+∞</span>
      <span class="xt-step-price-item__bracket">{{ isLast ? ')' : ']' }}</span>
    </div>

    <span class="xt-step-price-item__arrow">→</span>

    <div class="xt-step-price-item__price">
      <el-input
        v-model.number="priceInput"
        :disabled="disabled"
        size="small"
        placeholder="价格"
        class="xt-step-price-item__input xt-step-price-item__input--price"
        @blur="onPriceBlur"
      />
      <span class="xt-step-price-item__unit">{{ unit }}</span>
    </div>

    <el-button
      v-if="!disabled && (removable || itemsLength > 1)"
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
    index: { type: Number, default: 0 },
    isFirst: { type: Boolean, default: false },
    isLast: { type: Boolean, default: false },
    itemsLength: { type: Number, default: 1 },
    removable: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false },
    minLocked: { type: Boolean, default: false },
    unit: { type: String, default: '元' },
    precision: { type: Number, default: 2 }
  },

  data() {
    return {
      minInput: this.normalize(this.value.min),
      maxInput: this.normalize(this.value.max),
      priceInput: this.normalize(this.value.price)
    }
  },

  watch: {
    value: {
      deep: true,
      handler(val) {
        this.minInput = this.normalize(val.min)
        this.maxInput = this.normalize(val.max)
        this.priceInput = this.normalize(val.price)
      }
    }
  },

  methods: {
    normalize(v) {
      if (v === null || v === undefined || v === '' || v === Infinity) return v
      const n = Number(v)
      return isNaN(n) ? v : n
    },

    emitChange(partial) {
      const next = {
        min: this.minInput,
        max: this.maxInput,
        price: this.priceInput,
        ...partial
      }
      this.$emit('input', next)
      this.$emit('change', next, this.index)
    },

    onMinBlur() {
      let v = Number(this.minInput)
      if (isNaN(v) || v < 0) v = 0
      this.minInput = v
      this.$emit('min-change', v, this.index)
      this.emitChange({ min: v })
    },

    onMaxBlur() {
      if (this.isLast) return
      let v = Number(this.maxInput)
      // 保证 max 严格大于 min（若等于或小于，则提示为 min + 1）
      if (isNaN(v) || v <= this.minInput) {
        v = Number(this.minInput) + 1
      }
      this.maxInput = v
      this.$emit('max-change', v, this.index)
      this.emitChange({ max: v })
    },

    onPriceBlur() {
      let v = Number(this.priceInput)
      if (isNaN(v) || v < 0) v = 0
      v = Number(v.toFixed(this.precision))
      this.priceInput = v
      this.emitChange({ price: v })
    },

    onDelete() {
      this.$emit('delete', this.index)
    }
  }
}
</script>
