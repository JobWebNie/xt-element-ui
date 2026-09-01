<template>
  <div ref="gridBox" class="xt-grid-box" :style="styleAttrs">
    <slot></slot>
  </div>
</template>

<script>
// 断点约定（与 Bootstrap 一致，移动优先）
const BREAKPOINT_ORDER = ['xs', 'sm', 'md', 'lg', 'xl']
const BREAKPOINT_MIN_WIDTH = { sm: 576, md: 768, lg: 992, xl: 1200 }

export default {
  name: "XtGridBox",
  props: {
    // 列配置：数字（等分列数）| 数组 | 字符串（任意 grid-template-columns 值）
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
      default: "",
      validator: (val) => ['', 'row', 'column', 'row dense', 'column dense'].includes(val)
    },
    // 命名区域
    areas: { type: [String, Array], default: "" },
    // 子项对齐（place-items），空串表示遵循 CSS 默认（stretch）
    align: {
      type: String,
      default: "",
      validator: (val) => ['', 'start', 'end', 'center', 'stretch', 'baseline'].includes(val)
    },
    // 内容对齐（place-content），空串表示遵循 CSS 默认（normal）
    justify: {
      type: String,
      default: "",
      validator: (val) => ['', 'start', 'end', 'center', 'space-between', 'space-around', 'space-evenly', 'stretch'].includes(val)
    },
    // 容器级响应式列配置 { sm: 2, md: 3, lg: 4 }
    // 基于 ResizeObserver 监听容器宽度（非视口），未命中断点时回退到 columns
    responsive: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      // 当前容器命中的断点
      breakpoint: ""
    }
  },
  computed: {
    styleAttrs() {
      const styles = {
        display: "grid"
      };

      // 处理列配置（含响应式）
      const cols = this.resolveColumns();
      if (typeof cols === "number") {
        styles.gridTemplateColumns = `repeat(${cols}, 1fr)`;
      } else if (Array.isArray(cols)) {
        styles.gridTemplateColumns = cols.join(" ");
      } else if (cols) {
        styles.gridTemplateColumns = cols;
      }

      // 处理行配置
      if (Array.isArray(this.rows)) {
        styles.gridTemplateRows = this.rows.join(" ");
      } else if (this.rows) {
        styles.gridTemplateRows = this.rows;
      }

      // 处理间距
      if (this.gap) {
        styles.gap = this.gap;
      } else {
        if (this.rowGap) styles.rowGap = this.rowGap;
        if (this.colGap) styles.columnGap = this.colGap;
      }

      // 处理排列方向（仅在显式设置时输出，遵循 CSS 默认）
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

      // 处理对齐（仅在显式设置时输出，避免覆盖 CSS 默认行为）
      if (this.align) {
        styles.placeItems = this.align;
      }
      if (this.justify) {
        styles.placeContent = this.justify;
      }

      return styles;
    }
  },
  watch: {
    responsive: {
      deep: true,
      handler() {
        this.setupObserver()
      }
    }
  },
  mounted() {
    this.setupObserver()
  },
  beforeDestroy() {
    this.teardownObserver()
  },
  methods: {
    // 按当前断点向下（移动优先）查找已配置的列数，未命中回退到基础 columns
    resolveColumns() {
      const resp = this.responsive || {}
      const idx = BREAKPOINT_ORDER.indexOf(this.breakpoint)
      if (idx >= 0) {
        for (let i = idx; i >= 0; i--) {
          const val = resp[BREAKPOINT_ORDER[i]]
          if (val !== undefined && val !== null) return val
        }
      }
      return this.columns
    },
    getBreakpoint(width) {
      if (width >= BREAKPOINT_MIN_WIDTH.xl) return 'xl'
      if (width >= BREAKPOINT_MIN_WIDTH.lg) return 'lg'
      if (width >= BREAKPOINT_MIN_WIDTH.md) return 'md'
      if (width >= BREAKPOINT_MIN_WIDTH.sm) return 'sm'
      return 'xs'
    },
    measure() {
      if (!this.$refs.gridBox) return
      const bp = this.getBreakpoint(this.$refs.gridBox.clientWidth)
      if (bp !== this.breakpoint) {
        this.breakpoint = bp
      }
    },
    setupObserver() {
      this.teardownObserver()
      const hasResponsive = this.responsive && Object.keys(this.responsive).length > 0
      if (!hasResponsive) return

      // 立即测量一次
      this.measure()

      if (typeof ResizeObserver !== 'undefined') {
        this._resizeObserver = new ResizeObserver(() => this.measure())
        this._resizeObserver.observe(this.$refs.gridBox)
      } else {
        // 旧浏览器降级：监听窗口尺寸变化
        this._onWindowResize = () => this.measure()
        window.addEventListener('resize', this._onWindowResize)
      }
    },
    teardownObserver() {
      if (this._resizeObserver) {
        this._resizeObserver.disconnect()
        this._resizeObserver = null
      }
      if (this._onWindowResize) {
        window.removeEventListener('resize', this._onWindowResize)
        this._onWindowResize = null
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.xt-grid-box {
  box-sizing: border-box;
}
</style>
