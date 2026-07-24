<template>
  <div ref="piechart" class="pie-box" :style="chartStyle"></div>
</template>
<script>
import EchartsUtil from "./utils";
export default {
  name: "XtPie",
  props: {
    theme: {},
    size: {
      type: String,
      default: "medium"
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "100%"
    },
    ratio: {
      type: Number,
      default: null
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
    colors: {
      type: Array,
      default: () => { return []; }
    },
    unit: {
      type: String,
      default: ""
    },
    showLegend: {
      type: Boolean,
      default: true
    },
    simpleMode: {
      type: Boolean,
      default: false
    },
    highlightKey: String,
    roseType: {
      type: String,
      default: ""
    },
    showLabel: {
      type: Boolean,
      default: true
    },
    totalLabel: {
      type: String,
      default: "总数"
    }
  },
  data() {
    return {
      myChart: null
    };
  },
  computed: {
    chartStyle() {
      const style = {};
      if (this.width) style.width = this.width;
      if (this.ratio) {
        style.aspectRatio = this.ratio;
      } else if (this.height) {
        style.height = this.height;
      }
      return style;
    },
    totalNum() {
      const keys = Object.assign(
        { label: "label", value: "value", data: "data" },
        this.fieldKeys || {}
      );
      return this.chartData.map(it => parseFloat(it[keys.value])).reduce((pre, aft) => { return pre + aft; }, 0);
    }
  },
  watch: {
    chartData: {
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
    this.$nextTick(() => {
      this.initChart();
      EchartsUtil.bindResizeObserver(this.$refs.piechart, this.myChart);
    });
  },
  beforeUnmount() {
    EchartsUtil.unbindResizeObserver(this.$refs.piechart);
    if (this.myChart) {
      this.myChart.dispose();
    }
  },
  methods: {
    initChart() {
      const _self = this;
      const keys = Object.assign(
        { label: "label", value: "value", data: "data" },
        _self.fieldKeys || {}
      );
      const option = {
        title: {
          text: `${_self.totalLabel}:${_self.totalNum}`,
          textStyle: {
          },
          top: "middle",
          left: "center"
        },
        tooltip: {
          trigger: "item"
        },
        legend: this.showLegend ? {
          top: "top",
          right: "20",
          type: "scroll"
        } : null,
        grid: {
          left: 30,
          right: 0,
          top: 20,
          bottom: 0,
          containLabel: true
        },
        series: [{
          name: _self.unit,
          type: "pie",
          center: ["50%", "50%"],
          roseType: this.roseType,
          radius: ["50%", "65%"],
          minAngle: 5,
          avoidLabelOverlap: true,
          data: _self.chartData.map((item, ind) => {
            const label = item[keys.label];
            const value = item[keys.value];
            return {
              value,
              name: label,
              labelLine: {
                show: this.showLabel
              },
              emphasis: {
                labelLine: {
                  show: this.showLabel
                }
              },
              label: {
                show: this.showLabel
              },
              tooltip: {
                formatter: "{b}:{c} ({d}%)",
                position: "inside",
                borderWidth: 1
              }
            };
          })
        }]
      };
      if (this.simpleMode) {
        EchartsUtil.applySimpleMode(option, "pie");
      }
      console.log('option', option);
      this.myChart = EchartsUtil.init(_self.$refs.piechart, this.theme, option, this.size);
    }
  }
};
</script>
<style lang="scss" scoped>
.pie-box{
  position: relative;
  height: 100%;
  width: 100%;
  min-height: 100px;
}
</style>
