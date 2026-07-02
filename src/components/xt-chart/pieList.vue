<template>
  <div class="pieLBox">
    <div class="left">
      <XtPie class="chart-box" :chart-data="chartData" :showLegend="false" :showLabel="false" :colors="colors"></XtPie>
    </div>
    <div class="right">
      <div v-for="(item, index) in chartData" :key="index" class="box">
        <div class="itH">
          <span class="sign" :style="{background: colors[index]}"></span>
          <span>{{ item.name }}</span>
          <span class="fr">占比</span>
        </div>
        <div class="itB">
          <span class="sign"></span>
          <span>{{ item.value }}</span>
          <span class="fr">{{ parseFloat( item.value * 100 / totalNum ).toFixed(2)+"%" }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "XtPieLine",
  props: {
    chartData: {
      type: Array,
      default: () => {
        return [
          { value: 538, name: "管道" },
          { value: 250, name: "阀门" },
          { value: 60, name: "燃气表" },
          { value: 6, name: "其他" }
        ];
      }
    },
    colors: {
      type: Array,
      default: () => { return ["#F38787", "#B3BFCB", "#2CDEB3", "#A17EE6", "#E57E40", "#409EFF"]; }
    }
  },
  data() {
    return {
      myChart: null
    };
  },
  computed: {
    totalNum() {
      return this.chartData.map(it => parseFloat(it.value)).reduce((pre, aft) => { return pre + aft; }, 0);
    }
  },
  watch: {
  },
  mounted() {
  },
  methods: {
  }
};
</script>
<style lang="scss" scoped>
.pieLBox{
  display: flex;
  height: 100%;
  width: 100%;
  position: relative;
}
.left{
  flex: 1;
  width: 50%;
  .chart-box{
    height: calc(100% - 20px);
    width: 100%;
    position: relative;
  }
}
.right{
  width: 50%;
  height: calc(100% - 20px);
  overflow-y: auto;
  padding: 0px 10px 0 0;
  .box{
    padding-top: 28px;
    padding-bottom: 3px;
    border-bottom: 1px solid rgba(0, 0, 0, .1);
    &:first-child{
      padding-top: 3px;
    }
    &:last-child{
      border-bottom-color: transparent;
    }
    .itH{
      margin-bottom: 20px;
      font-size: 14px;
      .sign{
        display: inline-block;
        width: 12px;
        height: 8px;
        margin-right: 10px;
      }
    }
    .itB{
      font-size: 15px;
    }
    .fr{
      float: right;
    }
  }
}
</style>
