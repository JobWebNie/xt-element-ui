<template>
  <div ref="barchart" class="bar-box"></div>
</template>
<script>
import EchartsUtil from "./utils";
export default {
  name: "XtBar",
  props: {
    chartData: {
      type: Array,
      default: () => {
        return [
          { value: 65, label: "吴十" },
          { value: 70, label: "唐九" },
          { value: 73, label: "钱一" },
          { value: 78, label: "孙二" },
          { value: 88, label: "刘八" },
          { value: 93, label: "王七" },
          { value: 99, label: "赵六" },
          { value: 103, label: "宋五" },
          { value: 113, label: "李四" },
          { value: 125, label: "张三" }
        ];
      }
    },
    theme: {},
    size: {
      type: String,
      default: "medium"
    },
    fieldKeys: {
      type: Object,
      default: () => ({ label: "label", value: "value", data: "data" })
    },
    markPoint: {
      type: Boolean,
      default: false
    },
    unit: {
      type: String,
      default: ""
    },
    showZoom: {
      type: Boolean,
      default: false
    },
    reverse: {
      type: Boolean,
      default: false
    },
    longLable: {
      type: Boolean,
      default: false
    },
    longLableSplitNum: {
      type: Number,
      default: 1
    },
    longLablePx: {
      type: Number,
      default: 150
    },
    splitNumber: {
      type: Number,
      default: 5
    },
    simpleMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      myChart: null,
      name: "数量"
    };
  },
  watch: {
    chartData: {
      deep: true,
      handler(newVal, oldVal) {
        const _self = this;
        _self.initChart();
      }
    },
    unit: {
      deep: true,
      handler(newVal, oldVal) {
        const _self = this;
        _self.initChart();
      }
    },
    theme(newVal) {
      this.initChart();
    }
  },
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      const _self = this;
      const keys = Object.assign(
        { label: "label", value: "value", data: "data" },
        _self.fieldKeys || {}
      );
      const _xAxis = {
        type: "category",
        inverse: this.reverse,
        axisLabel: {
          interval: 0,
          formatter: function(value) {
            return !_self.reverse && _self.longLable ? value.replace(new RegExp(`(.{${_self.longLableSplitNum}})`, 'g'), `$1\n`) : value;
          }
        },
        data: _self.chartData.map((item) => {
          return item[keys.label];
        })
      };
      const _yAxis = {
        type: "value",
        splitLine: {
          lineStyle: {
            type: "dashed"
          }
        },
        name: _self.energyType,
        axisTick: {
          inside: true
        },
        min: 0,
        splitNumber: _self.splitNumber,
        max: function(value) {
          return Math.ceil(value.max / _self.splitNumber) * _self.splitNumber;
        },
        scale: true,
        axisLabel: {
          margin: 2,
          formatter: function(value, index) {
            if (value >= 10000 && value < 10000000) {
              value = value / 10000 + "万";
            } else if (value >= 10000000) {
              value = value / 10000000 + "千万";
            }
            return value;
          }
        }
      };

      const option = {
        legend: {
          right: 20,
          top: 0,
          textStyle: {
            fontSize: 12
          }
        },
        tooltip: {
          borderWidth: 1,
          trigger: "item"
        },
        grid: {
          top: "10",
          left: 40 + (this.reverse && this.longLable ? _self.longLablePx : 0),
          right: "10",
          bottom: (_self.showZoom ? 50 : 20) + (!_self.reverse && _self.longLable ? _self.longLablePx : 0),
          containLabel: true
        },
        xAxis: this.reverse ? _yAxis : _xAxis,
        yAxis: this.reverse ? _xAxis : _yAxis,
        series: {
          name: _self.unit,
          type: "bar",
          markPoint: {
            data: [
              { type: "min", name: "Min" },
              { type: "max", name: "Max" }
            ]
          },
          avoidLabelOverlap: true,
          data: _self.chartData.map((item, ind) => {
            const label = item[keys.label];
            const value = item[keys.value];
            return {
              value,
              name: label,
              tooltip: {
                borderWidth: 1
              }
            };
          })
        },
        dataZoom: _self.showZoom ? [{ height: 20, bottom: 0 }] : [],
      };
      if (!this.markPoint) {
        this.$delete(option.series[0], "markPoint");
      }
      if (this.simpleMode) {
        EchartsUtil.applySimpleMode(option, "bar");
      }
      this.myChart = EchartsUtil.init(_self.$refs.barchart, this.theme, option, this.size);
    }
  }
};
</script>
<style lang="scss" scoped>
.bar-box{
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
