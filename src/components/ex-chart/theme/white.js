export default {
  color: ["#1890ff", "#37c3a4", "#29c0ce", "#6480D7", "#8cce6f", "#3a5dca", "#ffb74d"],
  backgroundColor: "#ffffff",
  textStyle: {
    fontFamily: "Microsoft YaHei, sans-serif"
  },
  title: {
    textStyle: {
      color: "#333",
      fontSize: 16
    },
    subtextStyle: {
      color: "#666666",
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
    }
  },
  pie: {
    roseType: "radius",
    label: {
      color: "#333"
    }
  },
  radar: {
    indicator: {
      color: "#666666"
    }
  },
  map: {
    label: {
      color: "#333"
    },
    itemStyle: {
      borderColor: "#fff"
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
      borderColor: "#666666"
    }
  },
  xAxis: {
    axisLine: {
      lineStyle: {
        color: "#DFE9EE"
      }
    },
    axisTick: {
      lineStyle: {
        color: "#DFE9EE"
      },
      show: false
    }
  },
  yAxis: {
    axisLine: {
      lineStyle: {
        color: "#DFE9EE"
      }
    },
    axisTick: {
      lineStyle: {
        color: "#DFE9EE"
      }
    },
    splitLine: {
      show: true,
      lineStyle: {
        type: "dashed",
        color: "#DFE9EE"
      }
    }
  },
  splitArea: {
    areaStyle: {
      color: ["#f7f8fa", "#ffffff"]
    }
  },
  legend: {
    textStyle: {
      color: "#333333"
    }
  },
  tooltip: {
    borderWidth: 1,
    backgroundColor: "#ffffff",
    borderColor: variables.xtColorBorder,
    textStyle: {
      color: "#333333"
    },
    trigger: "axis"
  }
};
