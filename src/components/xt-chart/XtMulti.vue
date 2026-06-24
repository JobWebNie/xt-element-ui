<template>
  <div ref="multilinechart" class="multiline-box"></div>
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
    fieldKeys: {
      type: Object,
      default: () => ({ label: "label", value: "value", data: "data" })
    },
    simpleMode: {
      type: Boolean,
      default: false
    },
    highlightKey: String,
    config: {
      type: Object,
      default() {
        return {
          interval: 0,
          rotate: 0,
          gridbottom: 40,
          isShowthreshold: false
        };
      }
    },
    chartData: {
      type: Array,
      default: () => {
        return [
          {
            label: "入户数",
            unit: "户",
            data: [
              { label: "01月", value: 980 },
              { label: "02月", value: 806 },
              { label: "03月", value: 930 },
              { label: "04月", value: 804 },
              { label: "05月", value: 750 },
              { label: "06月", value: 660 },
              { label: "07月", value: 780 },
              { label: "08月", value: 630 },
              { label: "09月", value: 806 },
              { label: "10月", value: 950 },
              { label: "11月", value: 810 },
              { label: "12月", value: 703 }
            ]
          },
          {
            label: "隐患数",
            unit: "个",
            data: [
              { label: "01月", value: 200 },
              { label: "02月", value: 120 },
              { label: "03月", value: 110 },
              { label: "04月", value: 109 },
              { label: "05月", value: 108 },
              { label: "06月", value: 150 },
              { label: "07月", value: 126 },
              { label: "08月", value: 130 },
              { label: "09月", value: 108 },
              { label: "10月", value: 109 },
              { label: "11月", value: 140 },
              { label: "12月", value: 106 }
            ]
          },
          {
            label: "整改数",
            unit: "个",
            data: [
              { label: "01月", value: 25 },
              { label: "02月", value: 19 },
              { label: "03月", value: 34 },
              { label: "04月", value: 12 },
              { label: "05月", value: 16 },
              { label: "06月", value: 20 },
              { label: "07月", value: 19 },
              { label: "08月", value: 18 },
              { label: "09月", value: 14 },
              { label: "10月", value: 12 },
              { label: "11月", value: 11 },
              { label: "12月", value: 16 }
            ]
          }
        ];
      }
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
  watch: {
    chartData: {
      deep: true,
      handler(newVal, oldVal) {
        const _self = this;
        this.myChart && this.myChart.dispose();
        this.myChart = null;
        _self.initChart();
      }
    },
    theme(newVal) {
      this.myChart && this.myChart.dispose();
      this.myChart = null;
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

      // 从 chartData 中收集所有 unit，并保持首次出现顺序去重
      const uniqueUnits = [];
      (_self.chartData || []).forEach(item => {
        const u = item.unit || "";
        if (uniqueUnits.indexOf(u) === -1) {
          uniqueUnits.push(u);
        }
      });

      const groupYAxis = (unit, index) => {
        const yAxis = {
          type: "value",
          name: unit,
          axisLine: { show: false, lineStyle: {} },
          axisTick: { show: false },
          splitLine: { lineStyle: { type: "dashed" } },
          axisLabel: {
            formatter: function(value, index) {
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

      const yAxisList = uniqueUnits.length
        ? uniqueUnits.map((unit, idx) => groupYAxis(unit, idx))
        : [groupYAxis("", 0)];

      const unitToYAxisIndex = {};
      uniqueUnits.forEach((unit, idx) => {
        unitToYAxisIndex[unit] = idx;
      });

      const firstSeriesData = _self.chartData && _self.chartData.length
        ? _self.chartData[0][keys.data] || []
        : [];

      const option = {
        legend: {
          right: 20,
          top: 0,
          show: true,
          data: _self.chartData.map((item) => {
            return item[keys.label];
          }),
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
          top: "25%",
          left: "40",
          right: "15",
          bottom: this.config.gridbottom == null ? 20 : this.config.gridbottom
        },
        xAxis: {
          type: "category",
          axisLabel: {
            rotate: this.config.rotate
          },
          data: firstSeriesData.map((item) => {
            return item[keys.label];
          })
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
        series: this.getSeriesData(unitToYAxisIndex, keys)
      };
      if (this.simpleMode) {
        EchartsUtil.applySimpleMode(option, "multi");
      }
      this.myChart = EchartsUtil.init(_self.$refs.multilinechart, this.theme, option, this.size);
    },
    getSeriesData(unitToYAxisIndex, keys) {
      const _self = this;
      const _seriesData = [];
      _self.chartData.forEach((item, ind) => {
        const seriesItems = item[keys.data] || [];
        const _item = {
          animation: true,
          name: item[keys.label],
          type: item.type || "bar",
          avoidLabelOverlap: true,
          data: seriesItems.map(it => it[keys.value]),
          yAxisIndex: unitToYAxisIndex[item.unit || ""] != null ? unitToYAxisIndex[item.unit || ""] : 0
        };
        _seriesData.push(_item);
      });
      return _seriesData;
    }
  }
};
</script>
<style lang="scss" scoped>
.multiline-box{
  height: 100%;
  width: 100%;
}
</style>
