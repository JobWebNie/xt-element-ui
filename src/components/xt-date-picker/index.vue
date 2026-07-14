<template>
  <div class="xt-date-picker-container">
    <div v-if="showDimension" class="xt-date-dimension">
      <el-radio-group v-model="dimension" size="small">
        <el-radio-button label="date">日</el-radio-button>
        <el-radio-button label="month">月</el-radio-button>
        <el-radio-button label="year">年</el-radio-button>
        <el-radio-button label="daterange">自定义</el-radio-button>
      </el-radio-group>
    </div>
    <div class="xt-date-picker-wrapper">
      <XtFlexBox v-show="dateType=='quarter'" type="inline-flex" class='xt-date' :class="{focus: isfocus}" :style="width?{width: `${width}`}:{}">
        <Quarter v-model="timeStart" :format="format"  placeholder="开始时间" style="float: left;width: 220px;"  quarter-type="quarter-start" clearable></Quarter>
        <span class="separator" style="float: left;">{{ separator }}</span>
        <Quarter v-model="timeEnd" :format="format" placeholder="结束时间" style="float: left;width: 220px;" quarter-type="quarter-end" clearable></Quarter>
      </XtFlexBox>

      <XtFlexBox v-show="dateType!=='quarter' && useRangeMode" type="inline-flex" class="xt-date" :class="{focus: isfocus}" :style="width?{width: `${width}px`}:{}">
        <el-date-picker ref="timeStart" key="startSelect" v-model="timeStart" size="small" :disabled="disabled" append-to-body :picker-options="startTimeRange" :format="format" :type="rangeDateType" placeholder="开始时间" clearable @blur="$emit('blur')" @focus="$emit('focus')"></el-date-picker>
        <span class="separator">{{ separator }}</span>
        <el-date-picker ref="timeEnd" key="endSelect" v-model="timeEnd" size="small" :disabled="disabled" append-to-body :picker-options="endTimeRange" :format="format" :type="rangeDateType" placeholder="结束时间" clearable @blur="$emit('blur')" @focus="$emit('focus')"></el-date-picker>
      </XtFlexBox>

      <el-date-picker v-show="dateType!=='quarter' && !useRangeMode" ref="singlePicker" v-model="singleValue" size="small" :disabled="disabled" append-to-body :format="format" :type="dateType" :placeholder="placeholder" clearable @blur="$emit('blur')" @focus="$emit('focus')"></el-date-picker>
    </div>
  </div>
</template>
<script>
const typeFormatEnum = {
  datetime: "yyyy-MM-dd HH:mm", month: "yyyy-MM", year: "yyyy", date: "yyyy-MM-dd", quarter: "yyyy-Qq", week: "yyyy-WW"
};

const rangeTypeMap = {
  date: 'date',
  month: 'month',
  year: 'year',
  daterange: 'date'
};

import XtFlexBox from '../xt-flex-box/index.vue'
import Quarter from "./quarter.vue";
export default {
  name: "XtDatePicker",
  components: {
    XtFlexBox,
    Quarter
  },
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    value: {},
    dateType: {
      type: String,
      default: "date"
    },
    separator: {
      type: String,
      default: "至"
    },
    disabled: {
      type: Boolean,
      default: false
    },
    immediate: {
      type: Boolean,
      default: true
    },
    placeholder: {},
    width: {
      type: [String],
      default: '100%'
    },
    rangeMode: {
      type: Boolean,
      default: true
    },
    showDimension: {
      type: Boolean,
      default: false
    },
    dimension: {
      type: String,
      default: "date"
    }
  },
  data() {
    return {
      isfocus: false
    };
  },
  computed: {
    format() {
      if (this.showDimension) {
        const formatMap = {
          date: 'yyyy-MM-dd',
          month: 'yyyy-MM',
          year: 'yyyy',
          daterange: 'yyyy-MM-dd'
        };
        return formatMap[this.dimension] || typeFormatEnum[this.dateType];
      }
      return typeFormatEnum[this.dateType] || "yyyy-MM-dd";
    },
    rangeDateType() {
      if (this.showDimension) {
        return rangeTypeMap[this.dimension] || 'date';
      }
      const rangeMap = {
        date: 'date',
        month: 'month',
        year: 'year',
        quarter: 'quarter',
        week: 'week'
      };
      if (this.useRangeMode) {
        return rangeMap[this.dateType] || 'date';
      }
      return this.dateType;
    },
    useRangeMode() {
      if (this.dimension === 'daterange') {
        return true;
      }
      return false;
    },
    timeStart: {
      get() {
        return this.value && this.value[0];
      },
      set(v) {
        this.$emit("update:value", [v, this.timeEnd]);
        this.$emit("change", [v, this.timeEnd]);
        this.$emit("dimension-change", { dimension: this.dimension, value: [v, this.timeEnd] });
      }
    },
    timeEnd: {
      get() {
        return this.value && this.value[1];
      },
      set(v) {
        this.$emit("update:value", [this.timeStart, v]);
        this.$emit("change", [this.timeStart, v]);
        this.$emit("dimension-change", { dimension: this.dimension, value: [this.timeStart, v] });
      }
    },
    singleValue: {
      get() {
        return this.value;
      },
      set(v) {
        this.$emit("update:value", v);
        this.$emit("change", v);
        this.$emit("dimension-change", { dimension: this.dimension, value: v });
      }
    },
    startTimeRange() {
      const result = {};

      if (this.timeEnd) {
        const endTime = this.timeEnd.getTime();
        result.disabledDate = (time) => {
          return time.getTime() > endTime;
        };
      }

      return result;
    },
    endTimeRange() {
      const result = {};

      if (this.timeStart) {
        const startTime = this.timeStart.getTime();
        result.disabledDate = (time) => {
          return time.getTime() < startTime;
        };
      }

      return result;
    }
  },
  watch: {
    dimension(val) {
      this.closePickerPanels();
      this.$emit("dimension-change", { dimension: val, value: this.value });
    }
  },
  methods: {
    closePickerPanels() {
      if (this.$refs.timeStart) {
        this.$refs.timeStart.pickerVisible = false;
      }
      if (this.$refs.timeEnd) {
        this.$refs.timeEnd.pickerVisible = false;
      }
      if (this.$refs.singlePicker) {
        this.$refs.singlePicker.pickerVisible = false;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.xt-date-picker-container {
  display: inline-block;
  width: 100%;
}

.xt-date-dimension {
  margin-bottom: 8px;
}

.xt-date-picker-wrapper {
  display: inline-block;
  width: 100%;
}


.xt-date {
  width: 100%;
}

.separator {
  padding: 0 8px;
  color: #909399;
  line-height: 32px;
}
</style>