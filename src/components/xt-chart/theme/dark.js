
import variables from '../../../styles/variables-export.scss'
export default {
  color: ["#1060ff", "#6648fe", "#26ddff", "#1bae94", "#ff8041", "#3a5dca", "#c7dd4b"],
  backgroundColor: "#000",
  textStyle: {
    fontFamily: "Microsoft YaHei, sans-serif"
  },
  title: {
    textStyle: {
      color: "#ffffff",
      fontSize: 16
    },
    subtextStyle: {
      color: "#ffffff",
      fontSize: 12
    }
  },
  line: {
    itemStyle: {
    },
    lineStyle: {
      width: 2
    }
  },
  bar: {
    itemStyle: {
      borderRadius: 4
    },
  },
  pie: {
    roseType: "radius",
    label: {
      color: "#ffffff"
    }
  },
  radar: {
    indicator: {
      color: "#ffffff"
    }
  },
  map: {
    label: {
      color: "#ffffff"
    },
    itemStyle: {
      borderColor: "#dcdfe6"
    }
  },
  valueAxis: {
    axisLabel: {
      color: "#ffffff"
    }
  },
  categoryAxis: {
    axisLabel: {
      color: "#ffffff"
    }
  },
  gauge: {
    axisLine: {
      lineStyle: {
        color: [[1, "#5470c6"]]
      }
    }
  },
  toolbox: {
    iconStyle: {
      borderColor: "#ffffff"
    }
  },
  xAxis: {
    axisLine: {
      lineStyle: {
        color: "#DCDFE6"
      }
    },
    axisTick: {
      lineStyle: {
        color: "#DCDFE6"
      }
    }
  },
  yAxis: {
    axisLine: {
      lineStyle: {
        color: "#DCDFE6"
      }
    },
    axisTick: {
      lineStyle: {
        color: "#DCDFE6"
      }
    }
  },
  splitLine: {
    lineStyle: {
      color: "#ebeef5"
    }
  },
  splitArea: {
    areaStyle: {
      color: ["#666666", "#666666"]
    }
  },
  legend: {
    textStyle: {
      color: "#ffffff"
    }
  },
  tooltip: {
    backgroundColor: "#333333",
    borderWidth: 1,
    borderColor: "#dcdfe6",
    textStyle: {
      color: "#fff"
    }
  },
  trigger: "axis"
};
