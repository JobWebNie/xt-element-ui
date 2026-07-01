<template>
  <div class="xt-step-price" :class="{ 'is-disabled': disabled }">
    <div v-if="title || $slots.header" class="xt-step-price__header">
      <xt-text v-if="title" bold size="medium">{{ title }}</xt-text>
      <slot name="header" />
      <xt-button
        v-if="!disabled && !isLimitReached"
        type="primary"
        size="small"
        icon="el-icon-plus"
        plain
        @click="onAdd"
      >新增{{stepName}}</xt-button>
      <xt-text v-if="isLimitReached" size="small" type-color="info">已达上限（{{ localItems.length }}/{{ limit }}）</xt-text>
    </div>

    <div class="xt-step-price__list">
      <XtStepPriceItem
        v-for="(item, idx) in localItems"
        :key="idx"
        :value="item"
        :index="idx"
        :is-first="idx === 0"
        :is-last="idx === localItems.length - 1"
        :items-length="localItems.length"
        :removable="idx !== 0"
        :min-locked="idx !== 0 ? true : false"
        :unit="unit"
        :precision="precision"
        :step-name="stepName"
        :step="step"
        :left-bracket="leftBracket"
        :right-bracket="rightBracket"
        :field-keys="fieldKeys"
        :disabled="disabled"
        @input="(val) => onItemInput(val, idx)"
        @max-change="onMaxChange"
        @min-change="onMinChange"
        @delete="onDelete"
        @blur="onFieldBlur"
      />
    </div>

    <div v-if="localItems.length === 0" class="xt-step-price__empty">
      <span>暂无数据，点击右上角「新增{{stepName}}」开始配置</span>
    </div>

    <div v-if="tip || $slots.tip" class="xt-step-price__tip">
      <slot name="tip">
        <xt-text size="small" type-color="warning">{{ tip }}</xt-text>
      </slot>
    </div>
  </div>
</template>

<script>
import XtStepPriceItem from '../xt-step-price-item/index.vue'

export default {
  name: 'XtStepPrice',

  components: { XtStepPriceItem },

  inject: {
    elFormItem: {
      default: ''
    }
  },

  computed: {
    keyMin() { return (this.fieldKeys && this.fieldKeys.min) || 'min' },
    keyMax() { return (this.fieldKeys && this.fieldKeys.max) || 'max' },
    keyPrice() { return (this.fieldKeys && this.fieldKeys.price) || 'price' },
    isLimitReached() {
      const lim = Number(this.limit)
      return lim > 0 && this.localItems.length >= lim
    }
  },

  props: {
    value: {
      type: Array,
      default: () => []
    },
    title: { type: String, default: '' },
    unit: { type: String, default: '元' },
    stepName: { type: String, default: '阶梯' },
    precision: { type: Number, default: 2 },
    // 左括号：默认 '['，传空字符串则不显示
    leftBracket: { type: String, default: '[' },
    // 右括号：默认 null，走内置逻辑（只有1条为 ']'，多条为 ')'）；传具体值则强制使用
    rightBracket: { type: String, default: null },
    // 字段名映射：{ min, max, price }，允许传入的 value 使用自定义字段名
    fieldKeys: {
      type: Object,
      default: () => ({ min: 'min', max: 'max', price: 'price' })
    },
    // 阶梯数量上限；<= 0 表示不限制
    limit: { type: Number, default: 0 },
    // 阶梯增量：新增/校正时，下一条阶梯的 min = 当前 max = 当前 min + step（默认 1）
    step: { type: Number, default: 10 },
    disabled: { type: Boolean, default: false },
    tip: {
      type: String,
      default: '区间左闭右闭 [min, max]，最后一级为 [min, +∞)，保证连续且不重叠。'
    },
    // 默认初始值：当传入空数组时，是否自动生成首条默认阶梯 [0, +∞)
    defaultFirst: { type: Boolean, default: true }
  },

  data() {
    return {
      localItems: this.normalize(this.value)
    }
  },

  watch: {
    value: {
      deep: true,
      immediate: true,
      handler(val) {
        this.localItems = this.normalize(val)
      }
    }
  },

  methods: {
    // 统一数字转换：空值/非法值一律转为 fallback（默认 0）
    safeNumber(v, fallback = 0) {
      if (v === null || v === undefined || v === '' || v === Infinity || v === -Infinity) return fallback
      const n = Number(v)
      return isNaN(n) ? fallback : n
    },

    cloneItems(items) {
      if (!Array.isArray(items)) return []
      return items.map((it) => {
        const price = (it && it[this.keyPrice])
        return {
          [this.keyMin]: this.safeNumber(it && it[this.keyMin], 0),
          [this.keyMax]: (it && it[this.keyMax] == null) || (it && it[this.keyMax] === '') ? null : this.safeNumber(it[this.keyMax], null),
          [this.keyPrice]: (price === null || price === undefined || price === '') ? '' : this.safeNumber(price, 0)
        }
      })
    },

    normalize(items) {
      const list = this.cloneItems(items)
      if (list.length === 0 && this.defaultFirst) {
        list.push({ [this.keyMin]: 0, [this.keyMax]: null, [this.keyPrice]: 0 })
      }
      this.ensureContinuity(list)
      return list
    },

    // 保证 items 连续且不重叠：items[i].max === items[i+1].min，首条 min === 0，末条 max === null
    ensureContinuity(list) {
      if (!Array.isArray(list) || list.length === 0) return
      list[0][this.keyMin] = 0
      const stepVal = this.safeNumber(this.step, 1)

      for (let i = 0; i < list.length; i++) {
        const cur = list[i]
        const next = list[i + 1]
        const curMin = this.safeNumber(cur[this.keyMin], 0)
        if (next) {
          let curMax = this.safeNumber(cur[this.keyMax], curMin + stepVal)
          if (curMax <= curMin) curMax = curMin + stepVal
          curMax = Number(curMax.toFixed(this.precision))
          cur[this.keyMax] = curMax
          next[this.keyMin] = curMax
        } else {
          cur[this.keyMax] = null
        }
        const price = cur[this.keyPrice]
        cur[this.keyPrice] = (price === null || price === undefined || price === '') ? '' : this.safeNumber(price, 0)
      }
    },

    emit() {
      this.ensureContinuity(this.localItems)
      const cloned = this.cloneItems(this.localItems)
      this.$emit('input', cloned)
      this.$emit('change', cloned)
      this.dispatchFormEvent('el.form.change', cloned)
    },

    dispatchFormEvent(eventName, value) {
      if (this.elFormItem) {
        this.elFormItem.$emit(eventName, value)
      }
    },

    onFieldBlur() {
      this.dispatchFormEvent('el.form.blur', this.localItems)
    },

    validate(callback) {
      const list = this.localItems
      if (!Array.isArray(list) || list.length === 0) {
        callback && callback(false, [{ field: 'stepPrice', message: `请配置${this.stepName}`, type: 'error' }])
        return false
      }

      const errors = []
      for (let i = 0; i < list.length; i++) {
        const item = list[i]
        const rawPrice = item[this.keyPrice]
        const rawMin = item[this.keyMin]
        const rawMax = item[this.keyMax]
        const price = this.safeNumber(rawPrice, 0)
        const min = this.safeNumber(rawMin, 0)

        if (rawPrice === null || rawPrice === undefined || rawPrice === '') {
          errors.push({
            field: `stepPrice[${i}].price`,
            message: `第${i + 1}${this.stepName}价格不能为空`,
            type: 'error'
          })
        } else if (price < 0) {
          errors.push({
            field: `stepPrice[${i}].price`,
            message: `第${i + 1}${this.stepName}价格不能为负数`,
            type: 'error'
          })
        }

        if (rawMin === null || rawMin === undefined || rawMin === '') {
          errors.push({
            field: `stepPrice[${i}].min`,
            message: `第${i + 1}${this.stepName}下限不能为空`,
            type: 'error'
          })
        } else if (min < 0) {
          errors.push({
            field: `stepPrice[${i}].min`,
            message: `第${i + 1}${this.stepName}下限不能为负数`,
            type: 'error'
          })
        }

        if (!this.isLast(i)) {
          if (rawMax === null || rawMax === undefined || rawMax === '') {
            errors.push({
              field: `stepPrice[${i}].max`,
              message: `第${i + 1}${this.stepName}上限不能为空`,
              type: 'error'
            })
          } else if (this.safeNumber(rawMax, 0) <= min) {
            errors.push({
              field: `stepPrice[${i}].max`,
              message: `第${i + 1}${this.stepName}上限必须大于下限`,
              type: 'error'
            })
          }
        }

        if (i > 0) {
          const prev = list[i - 1]
          const prevMax = prev[this.keyMax]
          if (prevMax !== null && this.safeNumber(prevMax, 0) !== min) {
            errors.push({
              field: `stepPrice[${i}].min`,
              message: `第${i + 1}${this.stepName}下限必须等于上一${this.stepName}上限`,
              type: 'error'
            })
          }
        }
      }

      if (errors.length > 0) {
        callback && callback(false, errors)
        return false
      }

      callback && callback(true)
      return true
    },

    isLast(idx) {
      return idx === this.localItems.length - 1
    },

    onItemInput(val, idx) {
      const cur = this.localItems[idx]
      if (!cur) return
      if (val && val[this.keyPrice] !== undefined) {
        const p = val[this.keyPrice]
        if (p === null || p === undefined || p === '') {
          cur[this.keyPrice] = ''
        } else {
          let num = this.safeNumber(p, 0)
          num = Number(num.toFixed(this.precision))
          cur[this.keyPrice] = num
        }
        this.emit()
      }
    },

    onMaxChange(val, idx) {
      const cur = this.localItems[idx]
      if (!cur) return
      const stepVal = this.safeNumber(this.step, 1)
      let n = this.safeNumber(val, this.safeNumber(cur[this.keyMin], 0) + stepVal)
      n = Number(n.toFixed(this.precision))
      cur[this.keyMax] = n
      const next = this.localItems[idx + 1]
      if (next) next[this.keyMin] = n
      this.emit()
    },

    onMinChange(val, idx) {
      const cur = this.localItems[idx]
      if (!cur) return
      if (idx === 0) {
        cur[this.keyMin] = 0
      } else {
        let n = this.safeNumber(val, this.safeNumber(cur[this.keyMin], 0))
        if (n !== 0) {
          n = Number(n.toFixed(this.precision))
        }
        cur[this.keyMin] = n
        const prev = this.localItems[idx - 1]
        if (prev) prev[this.keyMax] = n
      }
      this.emit()
    },

    onAdd() {
      const list = this.localItems
      const lim = Number(this.limit)
      if (lim > 0 && list.length >= lim) return
      const stepVal = this.safeNumber(this.step, 1)

      // 场景 1：空数组 —— 直接 push 一条 [0, +∞)
      if (list.length === 0) {
        list.push({
          [this.keyMin]: 0,
          [this.keyMax]: null,
          [this.keyPrice]: 10
        })
        this.emit()
        return
      }

      // 场景 2：已有数据 —— 在末条前插入新条，新条的 max = 末条 min + step
      const last = list[list.length - 1]
      const newMin = this.safeNumber(last[this.keyMin], 0)
      const newMax = newMin + stepVal

      // 新条 price：使用默认值，由用户自行填写
      let newPrice = 0

      const newArr = [
        ...list.slice(0, -1),
        {
          [this.keyMin]: newMin,
          [this.keyMax]: newMax,
          [this.keyPrice]: newPrice
        },
        {
          [this.keyMin]: newMax,
          [this.keyMax]: null,
          [this.keyPrice]: newPrice
        }
      ]

      this.localItems = newArr
      this.emit()
    },

    onDelete(idx) {
      const list = this.localItems
      if (list.length <= 1) return // 至少保留一条
      if (idx === 0) return // 首条不允许删除，保证区间起点始终为 0
      const cur = list[idx]
      const prev = list[idx - 1]
      const next = list[idx + 1]
      if (prev && next) {
        prev[this.keyMax] = cur[this.keyMax] == null ? null : Number(cur[this.keyMax])
      } else if (prev && !next) {
        prev[this.keyMax] = null
      } else if (!prev && next) {
        next[this.keyMin] = 0
      }
      list.splice(idx, 1)
      this.emit()
    }
  }
}
</script>
