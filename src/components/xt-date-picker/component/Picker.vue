<template>
  <div class="base-date-root">
    <el-date-picker
      v-if="type !== 'quarter'"
      v-model="innerValue"
      v-bind="$attrs"
      v-on="$listeners"
      :type="pickerType"
      :value-format="valueFormat"
      :disabled="disabled"
      :placeholder="placeholder"
      popper-append-to-body
      popper-class="base-date-popper"
    />

    <el-popover
      v-else
      v-model="quarterPopVisible"
      trigger="manual"
      placement="bottom-start"
      width="240"
    >
      <div class="quarter-panel">
        <div class="quarter-header">
          <el-button icon="el-icon-d-arrow-left" @click="year--"></el-button>
          <span>{{ year }} 年</span>
          <el-button icon="el-icon-d-arrow-right" @click="year++"></el-button>
        </div>
        <div class="quarter-list">
          <div
            v-for="q in 4"
            :key="q"
            class="quarter-item"
            :class="{ active: quarterNum === q }"
            @click="selectQuarter(q)"
          >
            Q{{ q }}
          </div>
        </div>
      </div>

      <el-input
        slot="reference"
        ref="quarterInput"
        v-model="quarterShowText"
        size="small"
        readonly
        :placeholder="placeholder"
        :disabled="disabled"
        clearable
        @clear="handleClearQuarter"
      >
        <i slot="affix" class="el-icon-date"></i>
      </el-input>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: 'BaseDatePicker',
  inheritAttrs: false,
  props: {
    value: {
      type: [String, null],
      default: null
    },
    type: {
      type: String,
      default: 'date',
      validator: val => ['date', 'month', 'year', 'quarter', 'week'].includes(val)
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: String,
    valueFormat: String
  },
  data() {
    return {
      quarterPopVisible: false,
      year: new Date().getFullYear(),
      quarterNum: null
    }
  },
  computed: {
    pickerType() {
      return this.type === 'quarter' ? null : this.type
    },
    placeholder() {
      if (this.$props.placeholder) return this.$props.placeholder
      const map = {
        date: '请选择日期',
        month: '请选择月份',
        year: '请选择年份',
        quarter: '请选择季度',
        week: '请选择周'
      }
      return map[this.type] || '请选择日期'
    },
    valueFormat() {
      if (this.$props.valueFormat) return this.$props.valueFormat
      const map = {
        date: 'yyyy-MM-dd',
        month: 'yyyy-MM',
        year: 'yyyy',
        quarter: 'yyyy-Qq',
        week: 'yyyy-WW'
      }
      return map[this.type] || 'yyyy-MM-dd'
    },
    innerValue: {
      get() { return this.value },
      set(val) { this.$emit('input', val) }
    },
    quarterShowText() {
      if (!this.value) return ''
      return `${this.year}-Q${this.quarterNum}`
    }
  },
  watch: {
    value: {
      handler(val) {
        if (this.type !== 'quarter' || !val) {
          this.quarterNum = null
          return
        }
        const [y, q] = val.split('-Q')
        this.year = Number(y)
        this.quarterNum = Number(q)
      },
      immediate: true
    }
  },
  methods: {
    selectQuarter(q) {
      this.quarterNum = q
      const val = `${this.year}-Q${q}`
      this.$emit('input', val)
      this.quarterPopVisible = false
    },
    handleClearQuarter() {
      this.quarterNum = null
      this.$emit('input', null)
    }
  },
  mounted() {
    if (this.type === 'quarter' && this.$refs.quarterInput) {
      this.$refs.quarterInput.$el.addEventListener('click', () => {
        if (!this.disabled) this.quarterPopVisible = true
      })
    }
  }
}
</script>

<style scoped>
.base-date-root {
}

.quarter-panel {
  padding: 10px;
}

.quarter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.quarter-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

.quarter-item {
  text-align: center;
  padding: 8px 0;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  cursor: pointer;
}

.quarter-item.active {
  background: #409eff;
  color: #fff;
  border-color: #409eff;
}

::v-deep .base-date-popper {
  border-radius: 4px;
}
</style>