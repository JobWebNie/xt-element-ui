import themeWhite from "./theme/white";
import themeDark from "./theme/dark";

const themeKeys = {
  "default": themeWhite,
  "white": themeWhite,
  "dark": themeDark
};

// echarts 仅在客户端加载，避免 SSR 编译/渲染报错
let echarts = null;

function getEcharts() {
  if (!echarts && typeof window !== 'undefined') {
    try {
      echarts = require('echarts');
      // 注册所有主题
      for (const key in themeKeys) {
        echarts.registerTheme(key, themeKeys[key]);
      }
    } catch (e) {
      console.warn('[XtChart] echarts 加载失败:', e.message);
    }
  }
  return echarts;
}

// 字体大小配置
const fontSizeMap = {
  small: {
    title: 14,
    subtitle: 11,
    legend: 11,
    axisLabel: 10,
    tooltip: 11,
    label: 11
  },
  medium: {
    title: 16,
    subtitle: 12,
    legend: 12,
    axisLabel: 12,
    tooltip: 12,
    label: 12
  },
  large: {
    title: 18,
    subtitle: 14,
    legend: 14,
    axisLabel: 14,
    tooltip: 14,
    label: 14
  }
};

function EchartsUtil() {}

EchartsUtil.currentTheme = "default";
EchartsUtil.currentSize = "medium";
EchartsUtil.inverse = false;

EchartsUtil.EchartsUtil = {
  backgroundColor: "transparent",
  tooltip: {
    trigger: "axis",
    borderWidth: 1
  },
  legend: {
    right: 20,
    top: 0,
    show: true,
    textStyle: {
      fontSize: 12
    }
  },
  grid: {
    top: "25%",
    left: "40",
    right: "15",
    bottom: "40"
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    axisTick: {
      show: true,
      length: 4
    },
    axisLabel: {
      fontSize: 12,
      interval: 0,
      formatter: function(value) {
        return !this.reverse && this.longLable ? value.replace(new RegExp(`(.{${this.longLableSplitNum}})`, "g"), `$1\n`) : value;
      }
    }
  },
  yAxis: {
    type: "value",
    axisTick: {
      show: false
    },
    min: null,
    max: null,
    axisLabel: {
      show: false
    },
    splitLine: {
      lineStyle: {
        type: "dashed",
        width: 1
      }
    }
  }
};

EchartsUtil.chartInstanceList = [];
EchartsUtil.resizeObserverList = [];

// === 极简模式（simpleMode）预设配置 ===
// 极简模式：隐藏图例、隐藏坐标轴/网格线、缩小内边距、简化 tooltip、去除动画装饰

EchartsUtil.simpleModeOption = {
  legend: { show: false },
  tooltip: {
    borderWidth: 0,
    extraCssText: "box-shadow: 0 2px 8px rgba(0,0,0,0.12);"
  },
  grid: {
    top: "5%",
    left: "5%",
    right: "5%",
    bottom: "5%",
    containLabel: true
  },
  xAxis: {
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: { show: false }
  },
  yAxis: {
    axisLine: { show: false },
    axisTick: { show: false },
    splitLine: { show: false },
    axisLabel: { show: false }
  },
  animationDuration: 300,
  animationEasing: "linear"
};

// 各类图表的极简模式特殊配置
EchartsUtil.simpleModeByType = {
  bar: {
    series: {
      barWidth: "60%",
      label: { show: false },
      markPoint: null,
      emphasis: {
        itemStyle: {
          shadowBlur: 6,
          shadowOffsetX: 0,
          shadowColor: "rgba(0,0,0,0.15)"
        }
      }
    }
  },
  line: {
    series: {
      symbol: "none",
      smooth: true,
      symbolSize: 0,
      label: { show: false },
      areaStyle: null
    }
  },
  pie: {
    legend: { show: false },
    title: { show: false },
    series: {
      radius: ["40%", "72%"],
      label: { show: false },
      labelLine: { show: false }
    }
  },
  multi: {
    legend: { show: false },
    grid: {
      top: "8%",
      left: "5%",
      right: "5%",
      bottom: "5%",
      containLabel: true
    }
  }
};

// 深拷贝 + 深合并工具
function deepMerge(target, source) {
  if (source == null) return target;
  if (Array.isArray(source)) return source.slice();
  if (typeof source !== "object") return source;
  if (target == null || typeof target !== "object") {
    return JSON.parse(JSON.stringify(source));
  }
  const result = Array.isArray(target) ? target.slice() : Object.assign({}, target);
  Object.keys(source).forEach(key => {
    const src = source[key];
    if (src === null || src === undefined) {
      if (source.hasOwnProperty(key)) result[key] = src;
      return;
    }
    if (typeof src === "object") {
      result[key] = deepMerge(result[key], src);
    } else {
      result[key] = src;
    }
  });
  return result;
}

// 对 option 应用极简模式（会保留调用方显式设置的值）
EchartsUtil.applySimpleMode = function(option, type) {
  if (!option || typeof option !== "object") return option;

  const base = JSON.parse(JSON.stringify(EchartsUtil.simpleModeOption));
  const typeConfig = EchartsUtil.simpleModeByType[type] || {};
  const merged = deepMerge(base, typeConfig);

  // 合并 base 与 typeConfig 到当前 option
  Object.keys(merged).forEach(key => {
    if (key === "series") return; // series 单独处理
    if (option[key] == null) {
      option[key] = merged[key];
    } else if (typeof option[key] === "object" && typeof merged[key] === "object" && !Array.isArray(option[key])) {
      option[key] = deepMerge(merged[key], option[key]);
    }
    // 若调用方已有原始值则保留（不覆盖）
  });

  // series 处理：若存在则对每个 series 应用简化配置
  if (option.series && Array.isArray(option.series)) {
    const simpleSeries = (merged.series || {});
    option.series = option.series.map(s => {
      if (s == null || typeof s !== "object") return s;
      return deepMerge(simpleSeries, s); // 调用方的值优先级更高
    });
  }

  // 特殊：xAxis / yAxis 可能是数组
  ["xAxis", "yAxis"].forEach(axisKey => {
    if (option[axisKey] != null && typeof option[axisKey] === "object") {
      const simpleAxis = merged[axisKey] || {};
      if (Array.isArray(option[axisKey])) {
        option[axisKey] = option[axisKey].map(axis => {
          if (axis == null || typeof axis !== "object") return axis;
          return deepMerge(simpleAxis, axis);
        });
      } else {
        option[axisKey] = deepMerge(simpleAxis, option[axisKey]);
      }
    }
  });

  return option;
};

EchartsUtil.mergeOptions = function(themeOption, customOption) {
  return Object.assign({}, themeOption, customOption);
};

// 根据字体大小调整主题配置
EchartsUtil.applyFontSize = function(themeOption, size) {
  const fontSizeConfig = fontSizeMap[size] || fontSizeMap.medium;
  
  const result = JSON.parse(JSON.stringify(themeOption));
  
  // 调整标题字体大小
  if (result.title && result.title.textStyle) {
    result.title.textStyle.fontSize = fontSizeConfig.title;
  }
  if (result.title && result.title.subtextStyle) {
    result.title.subtextStyle.fontSize = fontSizeConfig.subtitle;
  }
  
  // 调整图例字体大小
  if (result.legend && result.legend.textStyle) {
    result.legend.textStyle.fontSize = fontSizeConfig.legend;
  }
  
  // 调整提示框字体大小
  if (result.tooltip && result.tooltip.textStyle) {
    result.tooltip.textStyle.fontSize = fontSizeConfig.tooltip;
  }
  
  // 调整饼图标签字体大小
  if (result.pie && result.pie.label) {
    if (typeof result.pie.label === 'object') {
      result.pie.label.fontSize = fontSizeConfig.label;
    }
  }
  
  // 调整雷达图指示器字体大小
  if (result.radar && result.radar.indicator) {
    if (typeof result.radar.indicator === 'object' && result.radar.indicator.textStyle) {
      result.radar.indicator.textStyle.fontSize = fontSizeConfig.label;
    }
  }
  
  // 调整地图标签字体大小
  if (result.map && result.map.label) {
    if (typeof result.map.label === 'object') {
      result.map.label.fontSize = fontSizeConfig.label;
    }
  }
  
  // 调整坐标轴标签字体大小和颜色
  const applyAxisLabel = function(axis) {
    if (!axis) return;
    if (!axis.axisLabel) {
      axis.axisLabel = {};
    }
    if (result.axisLabel && result.axisLabel.color) {
      axis.axisLabel.color = result.axisLabel.color;
    }
    axis.axisLabel.fontSize = fontSizeConfig.axisLabel;
  };
  
  if (result.xAxis) {
    if (Array.isArray(result.xAxis)) {
      result.xAxis.forEach(applyAxisLabel);
    } else {
      applyAxisLabel(result.xAxis);
    }
  }
  
  if (result.yAxis) {
    if (Array.isArray(result.yAxis)) {
      result.yAxis.forEach(applyAxisLabel);
    } else {
      applyAxisLabel(result.yAxis);
    }
  }
  
  return result;
};

EchartsUtil.init = function(dom, theme, customOption, size) {
  const ec = getEcharts();
  // SSR 环境下忽略初始化
  if (!ec || !dom) return null;
  
  theme = theme || "default";
  size = size || "medium";
  customOption = customOption || {};
  
  const useTheme = this.currentTheme || theme;
  const useSize = this.currentSize || size;
  
  this.currentTheme = useTheme;
  this.currentSize = useSize;
  
  let themeOption = themeKeys[useTheme];
  // 应用字体大小配置
  themeOption = this.applyFontSize(themeOption, useSize);
  
  const option = this.mergeOptions(themeOption, customOption);
  
  const chart = ec.init(dom, useTheme);
  chart.setOption(option, true);
  
  this.chartInstanceList.push({
    dom,
    chart,
    customOption,
    size: useSize
  });
  
  this.bindResize(chart);
  return chart;
};

EchartsUtil.changeSingleTheme = function(dom, chartIns, customOption, newTheme) {
  const ec = getEcharts();
  if (!ec || !dom || !chartIns) return;
  
  customOption = customOption || {};
  newTheme = newTheme || "default";
  
  this.currentTheme = newTheme;
  chartIns.dispose();
  
  const newChart = ec.init(dom, newTheme, customOption);
  
  const item = this.chartInstanceList.find(function(v) {
    return v.dom === dom;
  });
  
  if (item) {
    item.chart = newChart;
  }
  
  return newChart;
};

EchartsUtil.changeAllTheme = function(newTheme, newSize) {
  const ec = getEcharts();
  if (!ec || !newTheme) return;
  
  this.currentTheme = newTheme;
  // 如果传入了新的 size，则更新全局 size
  if (newSize) {
    this.currentSize = newSize;
  }
  
  this.chartInstanceList.forEach(function(item) {
    const dom = item.dom;
    const chart = item.chart;
    const customOption = item.customOption;
    // 使用图表自己的 size，如果没有则使用全局 size
    const useSize = item.size || EchartsUtil.currentSize;
    
    if (chart) {
      chart.dispose();
    }
    
    const newChart = ec.init(dom, newTheme);
    let themeOption = themeKeys[newTheme];
    // 应用字体大小配置
    themeOption = EchartsUtil.applyFontSize(themeOption, useSize);
    const option = EchartsUtil.mergeOptions(themeOption, customOption);
    
    newChart.setOption(option, true);
    item.chart = newChart;
    // 更新图表的 size 记录
    item.size = useSize;
    EchartsUtil.bindResize(newChart);
  });
};

EchartsUtil.bindResize = function(chartIns) {
  if (!chartIns || chartIns.resizeLocked) return;
  
  window.addEventListener("resize", function() {
    chartIns.resize();
  });
  
  chartIns._resizeLocked = true;
};

EchartsUtil.bindResizeObserver = function(dom, chartIns) {
  if (!dom || !chartIns || typeof ResizeObserver === 'undefined') return;
  
  const observer = new ResizeObserver(() => {
    chartIns.resize();
  });
  
  observer.observe(dom);
  
  EchartsUtil.resizeObserverList.push({
    dom,
    observer,
    chartIns
  });
};

EchartsUtil.unbindResizeObserver = function(dom) {
  const index = EchartsUtil.resizeObserverList.findIndex(item => item.dom === dom);
  if (index !== -1) {
    EchartsUtil.resizeObserverList[index].observer.disconnect();
    EchartsUtil.resizeObserverList.splice(index, 1);
  }
};

EchartsUtil.destroy = function(chartIns) {
  if (chartIns) {
    chartIns.dispose();
  }
  
  this.chartInstanceList = this.chartInstanceList.filter(function(item) {
    return item.chart !== chartIns;
  });
};

EchartsUtil.destroyAll = function() {
  this.chartInstanceList.forEach(function(item) {
    if (item.chart) {
      item.chart.dispose();
    }
  });
  
  this.chartInstanceList = [];
  
  this.resizeObserverList.forEach(function(item) {
    item.observer.disconnect();
  });
  
  this.resizeObserverList = [];
};

export default EchartsUtil;

export { getEcharts };
