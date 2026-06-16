<template>
  <div class="xt-grid-box" :style="styleAttrs">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "XtGridBox",
  props: {
    // 列配置
    columns: {
      type: [String, Array, Number],
      default: "1fr"
    },
    // 行配置
    rows: {
      type: [String, Array],
      default: "auto"
    },
    // 间距（同时控制行列间距）
    gap: { type: String, default: "" },
    // 行间距
    rowGap: { type: String, default: "" },
    // 列间距
    colGap: { type: String, default: "" },
    // 排列方向
    flow: { 
      type: String, 
      default: "row",
      validator: (val) => ['row', 'column', 'row dense', 'column dense'].includes(val)
    },
    // 命名区域
    areas: { type: [String, Array], default: "" },
    // 子项对齐（place-items）
    align: { 
      type: String, 
      default: "stretch",
      validator: (val) => ['start', 'end', 'center', 'stretch', 'baseline'].includes(val)
    },
    // 内容对齐（place-content）
    justify: { 
      type: String, 
      default: "start",
      validator: (val) => ['start', 'end', 'center', 'space-between', 'space-around', 'space-evenly', 'stretch'].includes(val)
    },
    // 响应式配置 { sm: 2, md: 3, lg: 4 }
    responsive: { type: Object, default: () => ({}) },
    // 是否自动填充
    autoFlow: { type: String, default: "" }
  },
  computed: {
    styleAttrs() {
      const styles = {
        display: "grid"
      };

      // 处理列配置
      if (typeof this.columns === 'number') {
        styles.gridTemplateColumns = `repeat(${this.columns}, 1fr)`;
      } else if (Array.isArray(this.columns)) {
        styles.gridTemplateColumns = this.columns.join(" ");
      } else {
        styles.gridTemplateColumns = this.columns;
      }

      // 处理行配置
      if (Array.isArray(this.rows)) {
        styles.gridTemplateRows = this.rows.join(" ");
      } else {
        styles.gridTemplateRows = this.rows;
      }

      // 处理间距
      if (this.gap) {
        styles.gap = this.gap;
      } else {
        if (this.rowGap) styles.rowGap = this.rowGap;
        if (this.colGap) styles.columnGap = this.colGap;
      }

      // 处理排列方向
      if (this.flow) {
        styles.gridAutoFlow = this.flow;
      }

      // 处理命名区域
      if (this.areas) {
        if (Array.isArray(this.areas)) {
          styles.gridTemplateAreas = this.areas.map(row => `"${row}"`).join(" ");
        } else {
          styles.gridTemplateAreas = this.areas;
        }
      }

      // 处理子项对齐
      if (this.align) {
        styles.placeItems = this.align;
      }

      // 处理内容对齐
      if (this.justify) {
        styles.placeContent = this.justify;
      }

      // 处理响应式断点
      if (Object.keys(this.responsive).length > 0) {
        this.addResponsiveStyles(styles);
      }

      return styles;
    }
  },
  methods: {
    addResponsiveStyles(styles) {
      // 响应式断点映射
      const breakpoints = {
        xs: '(max-width: 575px)',
        sm: '(min-width: 576px)',
        md: '(min-width: 768px)',
        lg: '(min-width: 992px)',
        xl: '(min-width: 1200px)'
      };

      Object.entries(this.responsive).forEach(([key, value]) => {
        if (breakpoints[key]) {
          const mediaQuery = `@media ${breakpoints[key]}`;
          // 注意：内联样式不支持媒体查询，这里预留接口
          // 实际响应式需要通过 CSS 类或其他方式实现
        }
      });
    }
  }
};
</script>
