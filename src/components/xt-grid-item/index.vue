<template>
  <div class="xt-grid-item" :style="styleAttrs">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "XtGridItem",
  props: {
    // 跨列数
    span: {
      type: Number,
      default: 1,
      validator: (val) => val > 0
    },
    // 跨行数
    rowSpan: {
      type: Number,
      default: 1,
      validator: (val) => val > 0
    },
    // 起始列
    start: {
      type: Number,
      default: 0,
      validator: (val) => val >= 0
    },
    // 起始行
    rowStart: {
      type: Number,
      default: 0,
      validator: (val) => val >= 0
    },
    // 命名区域
    area: {
      type: String,
      default: ""
    },
    // 对齐方式（justify-self）
    justifySelf: {
      type: String,
      default: "auto",
      validator: (val) => ['auto', 'start', 'end', 'center', 'stretch'].includes(val)
    },
    // 对齐方式（align-self）
    alignSelf: {
      type: String,
      default: "auto",
      validator: (val) => ['auto', 'start', 'end', 'center', 'stretch', 'baseline'].includes(val)
    },
    // 自定义样式类
    customClass: {
      type: String,
      default: ""
    }
  },
  computed: {
    styleAttrs() {
      const styles = {};

      // 处理跨列
      if (this.span > 1) {
        styles.gridColumnEnd = `span ${this.span}`;
      }

      // 处理跨行
      if (this.rowSpan > 1) {
        styles.gridRowEnd = `span ${this.rowSpan}`;
      }

      // 处理起始列
      if (this.start > 0) {
        styles.gridColumnStart = this.start;
      }

      // 处理起始行
      if (this.rowStart > 0) {
        styles.gridRowStart = this.rowStart;
      }

      // 处理命名区域
      if (this.area) {
        styles.gridArea = this.area;
      }

      // 处理 justify-self
      if (this.justifySelf && this.justifySelf !== 'auto') {
        styles.justifySelf = this.justifySelf;
      }

      // 处理 align-self
      if (this.alignSelf && this.alignSelf !== 'auto') {
        styles.alignSelf = this.alignSelf;
      }

      return styles;
    }
  }
};
</script>

<style lang="scss" scoped>
.xt-grid-item {
  box-sizing: border-box;
}
</style>