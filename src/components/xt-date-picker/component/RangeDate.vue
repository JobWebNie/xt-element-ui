<!-- RangeDate.vue 区间业务组件 -->
<template>
    <div class="range-picker">
      <Picker
        v-model="startVal"
        :type="type"
        size="small"
        :placeholder="startPlaceholder"
        :disabled="disabled"
        :disabled-date="disabledStart"
        @change="handleChange"
      />
      <span class="split">{{ separator }}</span>
      <Picker
        v-model="endVal"
        :type="type"
        size="small"
        :placeholder="endPlaceholder"
        :disabled="disabled"
        :disabled-date="disabledEnd"
        @change="handleChange"
      />
    </div>
  </template>
  <script>
  import Picker from './Picker.vue'
  export default {
    name: 'RangeDate',
    components: { Picker },
    props: {
      // 父组件v-model绑定数组 [startStr, endStr]
      value: {
        type: Array,
        default: () => [null, null]
      },
      type: {
        type: String,
        default: 'date'
      },
      separator: {
        type: String,
        default: '至'
      },
      disabled: { type: Boolean, default: false }
    },
    data() {
      return {
        startVal: '',
        endVal: ''
      }
    },
    watch: {
      // 外部回填回显
      value: {
        handler(val) {
          const [s, e] = val || []
          this.startVal = s || ''
          this.endVal = e || ''
        },
        immediate: true
      }
    },
    computed: {
      startDate() {
        return this.startVal ? new Date(this.startVal) : null
      },
      endDate() {
        return this.endVal ? new Date(this.endVal) : null
      },
      startPlaceholder() {
        const map = {
          date: '开始日期',
          month: '开始月份',
          year: '开始年份',
          quarter: '开始季度',
          week: '开始周'
        }
        return map[this.type] || '开始日期'
      },
      endPlaceholder() {
        const map = {
          date: '结束日期',
          month: '结束月份',
          year: '结束年份',
          quarter: '结束季度',
          week: '结束周'
        }
        return map[this.type] || '结束日期'
      }
    },
    methods: {
      // 禁用开始：不能晚于已选结束
      disabledStart(time) {
        if (!this.endDate) return false
        return time.getTime() > this.endDate.getTime()
      },
      // 禁用结束：不能早于已选开始
      disabledEnd(time) {
        if (!this.startDate) return false
        return time.getTime() < this.startDate.getTime()
      },
      // 任意日期变更同步抛出数组给父组件
      handleChange() {
        this.$emit('input', [this.startVal, this.endVal])
      }
    }
  }
  </script>
  <style scoped>
  .range-picker {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
    width: 100%;
  }
  .range-picker .el-date-editor {
    flex: 1;
    min-width: 130px;
  }
  .split {
    flex-shrink: 0;
    padding: 0 4px;
  }
  /* 手机/窄侧边栏自动竖向排列 */
  @media (max-width: 360px) {
    .range-picker {
      flex-direction: column;
      align-items: stretch;
    }
    .split {
      text-align: center;
      margin: 4px 0;
    }
  }
  </style>