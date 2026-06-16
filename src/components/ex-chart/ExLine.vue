<template>
  <div ref="linechart" class="line-box"></div>
</template>
<script>
import EchartsUtil from "./utils";
export default {
  name: "XtLine",
  props: {
    theme: {},
    size: {
      type: String,
      default: "medium"
    },
    chartData: {
      type: Array,
      default: () => {
        return [
          { value: 53, label: "张三" },
          { value: 10, label: "李四" },
          { value: 60, label: "宋五" }
        ];
      }
    },
    fieldKeys: {
      type: Object,
      default: () => ({ label: "label", value: "value", data: "data" })
    },
    isArea: {
      type: Boolean,
      default: false
    },
    unit: {
      type: String,
      default: ""
    },
    intervalvalue: {
      type: Number,
      default: 0
    },
    simpleMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      myChart: null
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
      const option = {
        animationDuration: 500,
        grid: {
          top: "18%",
          left: "30",
          right: "30",
          bottom: "20"
        },
        xAxis: [{
          type: "category",
          splitLine: {
            show: true,
            lineStyle: {
              type: "dashed"
            }
          },
          axisLabel: {
            interval: this.intervalvalue
          },
          boundaryGap: false,
          data: _self.chartData.map((item) => {
            return item[keys.label];
          })
        }],
        yAxis: {
          type: "value",
          axisLine: {
            show: false,
            lineStyle: {
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              type: "dashed"
            }
          },
          name: _self.unit,
          scale: true,
          axisLabel: {
            margin: 2,
            formatter: function(value, index) {
              if (value >= 10000 && value < 10000000) {
                value = Math.floor(value / 10000) + "万";
              } else if (value >= 10000000) {
                value = Math.floor(value / 10000000) + "千万";
              }
              return value;
            }
          }
        },
        series: [{
          type: "line",
          symbol: "circle",
          areaStyle: _self.isArea ? {} : null,
          smooth: true,
          avoidLabelOverlap: true,
          data: _self.chartData.map((item, ind) => {
            return item[keys.value];
          })
        }]
      };

      if (this.simpleMode) {
        EchartsUtil.applySimpleMode(option, "line");
      }
      this.myChart = EchartsUtil.init(_self.$refs.linechart, this.theme, option, this.size);
    }
  }
};
</script>
<style lang="scss" scoped>
.line-box{
  position: relative;
  height: 100%;
  width: 100%;
}
</style>
