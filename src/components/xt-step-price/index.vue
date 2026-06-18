<template>
  <div class="xt-step-price" :class="{ 'is-disabled': disabled }">
    <div v-if="title || $slots.header" class="xt-step-price__header">
      <xt-text v-if="title" bold size="medium">{{ title }}</xt-text>
      <slot name="header" />
      <el-button
        v-if="!disabled"
        type="primary"
        size="small"
        icon="el-icon-plus"
        plain
        @click="onAdd"
      >新增阶梯</el-button>
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
        :min-locked="idx !== 0 ? true : false"
        :unit="unit"
        :precision="precision"
        :disabled="disabled"
        @input="(val) => onItemInput(val, idx)"
        @max-change="onMaxChange"
        @min-change="onMinChange"
        @delete="onDelete"
      />
    </div>

    <div v-if="localItems.length === 0" class="xt-step-price__empty">
      <span>暂无数据，点击右上角「新增阶梯」开始配置</span>
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

function cloneItems(items) {
  if (!Array.isArray(items)) return []
  return items.map((it) => ({
    min: it.min == null ? 0 : Number(it.min),
    max: it.max == null || it.max === '' ? null : Number(it.max),
    price: it.price == null ? 0 : Number(it.price)
  }))
}

export default {
  name: 'XtStepPrice',

  components: { XtStepPriceItem },

  props: {
    value: {
      type: Array,
      default: () => []
    },
    title: { type: String, default: '' },
    unit: { type: String, default: '元' },
    precision: { type: Number, default: 2 },
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
      handler(val) {
        this.localItems = this.normalize(val)
      }
    }
  },

  methods: {
    normalize(items) {
      const list = cloneItems(items)
      // 空数组时自动生成首条默认阶梯 [0, +∞)
      if (list.length === 0 && this.defaultFirst) {
        list.push({ min: 0, max: null, price: 0 })
      }
      this.ensureContinuity(list)
      return list
    },

    // 保证 items 连续且不重叠：items[i].max === items[i+1].min，首条 min === 0，末条 max === null
    ensureContinuity(list) {
      if (!Array.isArray(list) || list.length === 0) return
      // 首条 min 强制为 0
      if (list[0].min !== 0) list[0].min = 0

      for (let i = 0; i < list.length; i++) {
        const cur = list[i]
        const next = list[i + 1]
        // 非末条：若 max 为空/小于等于 min，修正为 min+1
        if (next) {
          if (cur.max == null || Number(cur.max) <= Number(cur.min)) {
            cur.max = Number(cur.min) + 1
          }
          // 下一条的 min 必须 === 当前条的 max
          if (Number(next.min) !== Number(cur.max)) {
            next.min = Number(cur.max)
          }
        } else {
          // 末条：max 必须为 null
          cur.max = null
        }
        // price 类型保护
        cur.price = cur.price == null || isNaN(Number(cur.price)) ? 0 : Number(cur.price)
      }
    },

    emit() {
      // 先做一次连续性兜底（如组件外部直接修改 items 仍能保证正确）
      this.ensureContinuity(this.localItems)
      const cloned = cloneItems(this.localItems)
      this.$emit('input', cloned)
      this.$emit('change', cloned)
    },

    onItemInput(val, idx) {
      // 子组件只负责自己的 price / min / max 输入（文本框改变），
      // 连续性由 onMinChange / onMaxChange 负责。这里只做浅层同步。
      const cur = this.localItems[idx]
      if (!cur) return
      if (val.price !== undefined) cur.price = Number(val.price)
    },

    onMaxChange(val, idx) {
      const cur = this.localItems[idx]
      if (!cur) return
      cur.max = Number(val)
      // 联动：下一条的 min 必须 === 当前条的 max
      const next = this.localItems[idx + 1]
      if (next) {
        next.min = Number(val)
      }
      this.emit()
    },

    onMinChange(val, idx) {
      // 首条 min 必须恒为 0（用户无法通过输入框改，因为 minLocked），
      // 这里保留防御式处理。
      const cur = this.localItems[idx]
      if (!cur) return
      if (idx === 0) {
        cur.min = 0
      } else {
        cur.min = Number(val)
        // 联动：上一条的 max 必须 === 当前条的 min
        const prev = this.localItems[idx - 1]
        if (prev) prev.max = Number(val)
      }
      this.emit()
    },

    onAdd() {
      const list = this.localItems
      const last = list[list.length - 1]
      // 在最后一条前插入：新条的 min = last.min，max = last.min + 1；
      // 末条 min 变为新条的 max，末条 max 保持 null。
      // —— 直观理解：用户点新增，通常希望在最后一个区间前“插入”一个中间段。
      if (last == null) {
        list.push({ min: 0, max: null, price: 0 })
      } else {
        const newMin = Number(last.min)
        const newMax = newMin + 1
        const newPrice = Number(last.price) || 0
        // 新条插入到末条之前
        list.splice(list.length - 1, 0, {
          min: newMin,
          max: newMax,
          price: newPrice
        })
        // 原末条的 min 改为新条的 max（保持末条 max = null）
        list[list.length - 1].min = newMax
      }
      this.emit()
    },

    onDelete(idx) {
      const list = this.localItems
      if (list.length <= 1) return // 至少保留一条
      const cur = list[idx]
      const prev = list[idx - 1]
      const next = list[idx + 1]
      // 连续性约定：items[i].max === items[i+1].min
      // 删除 [a, b) 之后：prev.max = b，next.min 保持为 b（无需改）
      if (prev && next) {
        // 中间被删：prev 吞并当前段的上限
        prev.max = cur.max == null ? null : Number(cur.max)
        // 若 prev 变为新末条（cur 是末条），上面 cur.max=null 已处理
        // 若非末条，next.min 本就等于 cur.max，无需修改
      } else if (prev && !next) {
        // 删的是末条：prev 成为新末条
        prev.max = null
      } else if (!prev && next) {
        // 删的是首条：next 成为新首条
        next.min = 0
      }
      list.splice(idx, 1)
      this.emit()
    }
  }
}
</script>
