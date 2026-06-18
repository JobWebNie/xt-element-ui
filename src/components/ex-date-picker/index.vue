<template>
  <div style="display:inline-block">
    <FlexBox v-if="dateType=='quarter'" type="inline-flex" class="xt-date-picker" :class="{focus: isfocus}" :style="width?{width: `${width}px`}:{}">
      <Quarter v-model="timeStart" :format="format" placeholder="开始时间" quarter-type="quarter-start" clearable></Quarter>
      <span class="separator">{{ separator }}</span>
      <Quarter v-model="timeEnd" :format="format" placeholder="结束时间" quarter-type="quarter-end" clearable></Quarter>
    </FlexBox>
    <FlexBox v-else type="inline-flex" class="xt-date" :class="{focus: isfocus}" :style="width?{width: `${width}px`}:{}">
      <el-date-picker ref="timeStart" key="startSelect" v-model="timeStart" size="small" :disabled="disabled" append-to-body :picker-options="startTimeRange" :format="format" :type="dateType" placeholder="开始时间" clearable @blur="$emit('blur')" @focus="$emit('focus')"></el-date-picker>
      <span class="separator">{{ separator }}</span>
      <el-date-picker ref="timeEnd" key="endSelect" v-model="timeEnd" size="small" :disabled="disabled" append-to-body :picker-options="endTimeRange" :format="format" :type="dateType" placeholder="结束时间" clearable @blur="$emit('blur')" @focus="$emit('focus')"></el-date-picker>
    </FlexBox>
  </div>
</template>
<script>
const typeFormatEnum = {
  datetime: "yyyy-MM-dd HH:mm", month: "yyyy-MM", year: "yyyy", date: "yyyy-MM-dd", quarter: "yyyy-Qq", week: "yyyy-WW"
};

import FlexBox from '../xt-flex-box/index.vue'
import Quarter from "./quarter.vue";
export default {
  name: "ExDatePicker",
  components: {
    FlexBox,
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
    immediate: { // 是否直接初始化 参数
      type: Boolean,
      default: true
    },
    placeholder: {},
    width: {
      type: Number,
      default: 280
    }
  },
  data() {
    return {
      isfocus: false
    };
  },
  computed: {
    format() {
      return typeFormatEnum[this.dateType] || "yyyy-MM-dd";
    },
    timeStart: {
      get() {
        return this.value && this.value[0];
      },
      set(v) {
        this.$emit("update:value", [v, this.timeEnd]);
        this.$emit("change", [v, this.timeEnd]);
      }
    },
    timeEnd: {
      get() {
        return this.value && this.value[1];
      },
      set(v) {
        this.$emit("update:value", [this.timeStart, v]);
        this.$emit("change", [this.timeStart, v]);
      }
    },
    startTimeRange() {
      if (!this.timeEnd) return {};
      const endTime = this.timeEnd.getTime();
      return {
        disabledDate: (time) => {
          return time.getTime() > (endTime);
        }
      };
    },
    endTimeRange() {
      if (!this.timeStart) return {};
      const startTime = this.timeStart.getTime();
      return {
        disabledDate: (time) => {
          return time.getTime() < (startTime);
        }
      };
    }
  },
  methods: {
  }
};
</script>
<style lang="scss" scoped>
.xt-date-picker{
  width: 100%;
  border-radius: 4px;
  border: 1px solid #DCDFE6;
  
  &.focus{
    border-color: #1890FF;
  }
  
  ::v-deep .el-picker-panel{
    position: absolute;
    z-index: 401;
  }
  
  ::v-deep .el-input__inner{
    border: none;
    padding: 0;
    text-align: center;
  }
  
  ::v-deep .el-input__prefix{
    display: none;
  }
}
</style>
