<template>
  <div ref="multilinechart" class="multiline-box" :style="chartStyle"></div>
</template>
<script>
import EchartsUtil from "./utils";
export default {
  name: "XtMulti",
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
    fieldKeys: {
      type: Object,
      default: () => ({ label: "label", series: "series", value: "value" })
    },
    simpleMode: {
      type: Boolean,
      default: false
    },
    highlightKey: String,
    chartData: {
      type: Array,
      default: () => {
        const months = ["01月", "02月", "03月", "04月", "05月", "06月", "07月", "08月", "09月", "10月", "11月", "12月"];
        const series = [
          { name: "入户数", values: [980, 806, 930, 804, 750, 660, 780, 630, 806, 950, 810, 703] },
          { name: "隐患数", values: [200, 120, 110, 109, 108, 150, 126, 130, 108, 109, 140, 106] },
          { name: "整改数", values: [25, 19, 34, 12, 16, 20, 19, 18, 14, 12, 11, 16] }
        ];
        const result = [];
        series.forEach(s => {
          months.forEach((m, i) => {
            result.push({ label: m, series: s.name, value: s.values[i] });
          });
        });
        return result;
      }
    },
    seriesMap: {
      type: Object,
      default: () => ({})
    },
    colors: {
      type: Array,
      default: () => { return []; }
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
    }
  },
  watch: {
    chartData: {
      deep: true,
      handler(newVal, oldVal) {
        const _self = this;
        this.myChart && this.myChart.dispose();
        this.myChart = null;
        _self.initChart();
        EchartsUtil.bindResizeObserver(this.$refs.multilinechart, this.myChart);
      }
    },
    seriesMap: {
      deep: true,
      handler() {
        const _self = this;
        this.myChart && this.myChart.dispose();
        this.myChart = null;
        _self.initChart();
        EchartsUtil.bindResizeObserver(this.$refs.multilinechart, this.myChart);
      }
    },
    theme(newVal) {
      this.myChart && this.myChart.dispose();
      this.myChart = null;
      this.initChart();
      EchartsUtil.bindResizeObserver(this.$refs.multilinechart, this.myChart);
    }
  },
  mounted() {
    this.initChart();
    EchartsUtil.bindResizeObserver(this.$refs.multilinechart, this.myChart);
  },
  beforeUnmount() {
    EchartsUtil.unbindResizeObserver(this.$refs.multilinechart);
    if (this.myChart) {
      this.myChart.dispose();
    }
  },
  methods: {
    initChart() {
      const _self = this;
      const keys = Object.assign(
        { label: "label", series: "series", value: "value" },
        _self.fieldKeys || {}
      );

      // 抽取所有类目（X 轴），保持首次出现顺序
      const categorySet = [];
      const categorySeen = {};
      (_self.chartData || []).forEach(item => {
        const cat = item[keys.label];
        if (cat != null && !categorySeen[cat]) {
          categorySeen[cat] = true;
          categorySet.push(cat);
        }
      });

      // 按 series 分组，保持首次出现顺序
      const seriesDataMap = {};
      const seriesOrder = [];
      (_self.chartData || []).forEach(item => {
        const s = item[keys.series];
        if (s == null) return;
        if (!seriesDataMap[s]) {
          seriesDataMap[s] = [];
          seriesOrder.push(s);
        }
        seriesDataMap[s].push({
          label: item[keys.label],
          value: item[keys.value]
        });
      });

      // 将每个 series 的数据对齐到类目维度（缺失补 null）
      const alignedSeriesData = seriesOrder.map(s => {
        const dataPoints = seriesDataMap[s] || [];
        const dataMap = {};
        dataPoints.forEach(dp => {
          dataMap[dp.label] = dp.value;
        });
        return {
          name: s,
          alignedData: categorySet.map(cat =>
            dataMap[cat] != null ? dataMap[cat] : null
          )
        };
      });

      // 根据 seriesMap 收集 unit 并建立 unit -> series 映射
      const unitToSeries = {};
      const unitOrder = [];
      seriesOrder.forEach(s => {
        const config = (_self.seriesMap && _self.seriesMap[s]) || {};
        const unit = config.unit || "";
        if (!unitToSeries[unit]) {
          unitToSeries[unit] = [];
          unitOrder.push(unit);
        }
        unitToSeries[unit].push(s);
      });

      const unitToYAxisIndex = {};
      unitOrder.forEach((unit, idx) => {
        unitToYAxisIndex[unit] = idx;
      });

      const groupYAxis = (unit, index) => {
        const yAxis = {
          type: "value",
          name: unit,
          axisLine: { show: false, lineStyle: {} },
          axisTick: { show: false },
          splitLine: { lineStyle: { type: "dashed" } },
          axisLabel: {
            formatter: function(value) {
              if (value >= 10000 && value < 10000000) {
                value = Math.floor(value / 10000) + "万";
              } else if (value >= 10000000) {
                value = Math.floor(value / 10000000) + "千万";
              }
              return value;
            }
          }
        };
        if (index > 0) {
          yAxis.position = "right";
          yAxis.splitLine = { show: false };
        }
        return yAxis;
      };

      const yAxisList = unitOrder.length
        ? unitOrder.map((unit, idx) => groupYAxis(unit, idx))
        : [groupYAxis("", 0)];

      const series = alignedSeriesData.map(({ name, alignedData }) => {
        const config = (_self.seriesMap && _self.seriesMap[name]) || {};
        const unit = config.unit || "";
        return {
          animation: true,
          name,
          type: config.type || "bar",
          avoidLabelOverlap: true,
          areaStyle: config.areaStyle ? {} : null,
          smooth: config.smooth ? {} : false,
          data: alignedData,
          yAxisIndex: unitToYAxisIndex[unit] != null ? unitToYAxisIndex[unit] : 0
        };
      });

      const option = {
        legend: {
          right: 20,
          top: 0,
          show: true,
          data: seriesOrder,
          textStyle: {}
        },
        tooltip: {
          borderWidth: 1,
          trigger: "axis",
          axisPointer: {
            type: "shadow"
          }
        },
        grid: {
          left: 16,
          right: 16,
          top: 40,
          bottom: 48,
          containLabel: true
        },
        xAxis: {
          type: "category",
          axisLabel: {},
          data: categorySet
        },
        yAxis: yAxisList,
        dataZoom: [
          {
            type: "inside",
            xAxisIndex: [0],
            start: 1,
            end: 100
          }
        ],
        series
      };

      if (this.simpleMode) {
        EchartsUtil.applySimpleMode(option, "multi");
      }
      this.myChart = EchartsUtil.init(_self.$refs.multilinechart, this.theme, option, this.size);
    }
  }
};
</script>
<style lang="scss" scoped>
.multiline-box{
  height: 100%;
  width: 100%;
  min-height: 100px;
}
</style>
