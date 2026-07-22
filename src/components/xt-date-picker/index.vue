<template>
  <div class="xt-date-picker-container">
    <!-- 维度切换单选：日/月/年/自定义区间 -->
    <div v-if="showDimension" class="xt-date-dimension">
      <el-radio-group v-model="dimension" size="small">
        <el-radio-button label="date">日</el-radio-button>
        <el-radio-button label="month">月</el-radio-button>
        <el-radio-button label="year">年</el-radio-button>
        <el-radio-button label="daterange">自定义</el-radio-button>
      </el-radio-group>
    </div>

    <div class="xt-date-picker-wrapper">
      <!-- 区间模式 -->
      <RangeDate
        v-if="useRangeMode"
        v-model="rangeValue"
        :type="rangeDateType"
        :separator="separator"
        :disabled="disabled"
        class="xt-date"
        :class="{ focus: isfocus }"
        :style="width ? { width: `${width}px` } : {}"
        @focus="isfocus = true; $emit('focus')"
        @blur="isfocus = false; $emit('blur')"
      />

      <!-- 单选模式：日/月/年/周 -->
      <el-date-picker
        v-if="!useRangeMode && realDateType !== 'quarter'"
        ref="singlePicker"
        v-model="singleValue"
        size="small"
        class="xt-date"
        :disabled="disabled"
        append-to-body
        :format="format"
        :type="realDateType"
        :placeholder="innerPlaceholder"
        clearable
        @focus="isfocus = true; $emit('focus')"
        @blur="isfocus = false; $emit('blur')"
      />
      <!-- 单选模式：季度（使用自定义组件） -->
      <Picker
        v-else-if="!useRangeMode && realDateType === 'quarter'"
        v-model="singleValue"
        type="quarter"
        class="xt-date"
        size="small"
        :disabled="disabled"
        :placeholder="innerPlaceholder"
        @focus="isfocus = true; $emit('focus')"
        @blur="isfocus = false; $emit('blur')"
      />
    </div>
  </div>
</template>

<script>
// 全局常量统一维护
// 类型对应格式化规则
const DATE_FORMAT_MAP = {
  datetime: 'yyyy-MM-dd HH:mm',
  month: 'yyyy-MM',
  year: 'yyyy',
  date: 'yyyy-MM-dd',
  quarter: 'yyyy-Qq',
  week: 'yyyy-WW'
};
// 维度面板对应的格式化
const DIMENSION_FORMAT_MAP = {
  date: 'yyyy-MM-dd',
  month: 'yyyy-MM',
  year: 'yyyy',
  daterange: 'yyyy-MM-dd'
};
// 维度 -> RangeDate 使用的基础类型
const DIMENSION_TO_RANGE_TYPE = {
  date: 'date',
  month: 'month',
  year: 'year',
  daterange: 'date'
};
// 普通type映射区间组件type
const NORMAL_TO_RANGE_TYPE = {
  date: 'date',
  month: 'month',
  year: 'year',
  quarter: 'quarter',
  week: 'week'
};

export default {
  name: 'XtDatePicker',
  components: { RangeDate: () => import( './component/RangeDate.vue'), Picker: () => import( './component/Picker.vue') },
  // 标准v-model：父组件 v-model="xxx"
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    // 绑定主值
    value: {
      type: [String, Array, null],
      default: null
    },
    // 基础日期类型 date/month/year/quarter/week/datetime
    dateType: {
      type: String,
      default: 'date',
      validator: val => Object.keys(DATE_FORMAT_MAP).includes(val)
    },
    // 区间分隔符
    separator: {
      type: String,
      default: '至'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // 维度切换后是否立即触发事件
    immediate: {
      type: Boolean,
      default: true
    },
    // 外部自定义占位
    placeholder: String,
    // 整体宽度
    width: {
      type: String,
      default: '100%'
    },
    // 是否开启区间模式（无维度切换时生效）
    rangeMode: {
      type: Boolean,
      default: false
    },
    // 是否展示维度切换单选框
    showDimension: {
      type: Boolean,
      default: false
    },
    // 当前选中维度 date/month/year/daterange
    dimension: {
      type: String,
      default: 'date',
      validator: val => ['date', 'month', 'year', 'daterange'].includes(val)
    }
  },
  data() {
    return {
      isfocus: false
    };
  },
  computed: {
    // 真实底层日期类型（区分维度面板场景）
    realDateType() {
      if (this.showDimension) return this.dimension;
      return this.dateType;
    },

    // 当前是否启用区间组件
    useRangeMode() {
      // 维度为自定义区间 或 全局开启rangeMode且非维度面板
      return this.dimension === 'daterange' || (this.rangeMode);
    },

    // 区间组件使用的type
    rangeDateType() {
      if (this.showDimension) {
        return DIMENSION_TO_RANGE_TYPE[this.dimension] || 'date';
      }
      return NORMAL_TO_RANGE_TYPE[this.dateType] || 'date';
    },

    // 日期格式化字符串
    format() {
      if (this.showDimension) {
        return DIMENSION_FORMAT_MAP[this.dimension] || DATE_FORMAT_MAP[this.dateType];
      }
      return DATE_FORMAT_MAP[this.dateType] || 'yyyy-MM-dd';
    },

    // 内部自动生成占位（外部placeholder优先）
    innerPlaceholder() {
      if (this.placeholder) return this.placeholder;
      const map = {
        date: '请选择日期',
        month: '请选择月份',
        year: '请选择年份',
        quarter: '请选择季度',
        week: '请选择周',
        datetime: '请选择日期时间'
      };
      return map[this.realDateType] || '请选择';
    },

    // 单选模式双向绑定
    singleValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('update:value', val);
        this.$emit('change', val);
        this.$emit('dimension-change', {
          dimension: this.dimension,
          value: val
        });
      }
    },

    // 区间组件双向绑定中转
    rangeValue: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('update:value', val);
        this.$emit('change', val);
        this.$emit('dimension-change', {
          dimension: this.dimension,
          value: val
        });
      }
    }
  },
  watch: {
    // 切换维度，关闭下拉面板并抛出事件
    dimension(newVal) {
      this.closePickerPanels();
      if (this.immediate) {
        this.$emit('dimension-change', {
          dimension: newVal,
          value: this.value
        });
      }
    }
  },
  methods: {
    // 关闭原生单选日期下拉面板
    closePickerPanels() {
      if (this.$refs.singlePicker) {
        this.$refs.singlePicker.pickerVisible = false;
      }
    }
  }
};
</script>
