<template>
  <div
    class="xt-page-container"
    :class="containerClass"
  >
    <!-- 主体左右容器 -->
    <el-container class="xt-page-main-wrap">
      <!-- 顶部Header -->
      <el-header
        v-if="$slots.header && showHeader"
        ref="header"
        class="xt-page-header"
        :class="headerClass"
      >
        <slot name="header" />
      </el-header>

      <!-- 主内容区域 -->
      <el-main ref="main" class="xt-page-main" :class="mainClass">
        <slot :table-height="tableContentHeight" />
      </el-main>

      <!-- 底部Footer -->
      <el-footer
        v-if="$slots.footer && showFooter"
        ref="footer"
        class="xt-page-footer"
        :class="footerClass"
      >
        <slot name="footer" />
      </el-footer>
    </el-container>

    <!-- 侧边栏Aside -->
    <el-aside
      v-if="$slots.aside && showAside"
      ref="aside"
      class="xt-page-aside"
      :class="asideClass"
      :width="asideWidth"
    >
      <slot name="aside" />
    </el-aside>

    <!-- 弹窗插槽 -->
    <slot name="dialog" />
  </div>
</template>

<script>
export default {
  name: 'XtPage',
  props: {
    // 结构显隐控制（布局逻辑类Props，仅保留这类）
    showHeader: { type: Boolean, default: true },
    showFooter: { type: Boolean, default: true },
    showAside: { type: Boolean, default: true },
    asideWidth: { type: String, default: '240px' },

    // 表格自适应高度计算专用业务参数
    diffHeight: { type: Number, default: 0 },
    minTableHeight: { type: Number, default: 200 },
    tableBorderHeight: { type: Number, default: 1 },

    // 自定义扩展Class（重度差异化页面使用）
    containerClass: { type: String, default: '' },
    headerClass: { type: String, default: '' },
    mainClass: { type: String, default: '' },
    asideClass: { type: String, default: '' },
    footerClass: { type: String, default: '' }
  },
  data() {
    return {
      rawMainHeight: 0,
      resizeTimer: null,
      resizeObserver: null
    };
  },
  computed: {
    // 传给插槽表格的可用高度
    tableContentHeight() {
      const usable = this.rawMainHeight - this.diffHeight - this.tableBorderHeight;
      return Math.max(usable, this.minTableHeight);
    }
  },
  mounted() {
    this.$nextTick(() => this.calcMainHeight());
    this.setupResizeObserver();
  },
  beforeDestroy() {
    // 销毁解绑，防止内存泄漏
    clearTimeout(this.resizeTimer);
    this.teardownResizeObserver();
  },
  methods: {
    // 防抖封装
    handleResize() {
      clearTimeout(this.resizeTimer);
      this.resizeTimer = setTimeout(() => {
        this.calcMainHeight();
      }, 120);
    },
    // 容器级响应式：优先 ResizeObserver，旧浏览器降级为 window resize
    setupResizeObserver() {
      if (typeof ResizeObserver !== 'undefined') {
        this.resizeObserver = new ResizeObserver(() => this.handleResize());
        this.resizeObserver.observe(this.$el);
      } else {
        window.addEventListener('resize', this.handleResize);
      }
    },
    teardownResizeObserver() {
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
        this.resizeObserver = null;
      } else {
        window.removeEventListener('resize', this.handleResize);
      }
    },
    // 计算main可视高度
    calcMainHeight() {
      if (!this.$refs.main || !this.$refs.main.$el) return;
      const rect = this.$refs.main.$el.getBoundingClientRect();
      this.rawMainHeight = rect.height;
    }
  }
};
</script>

<style lang="scss" scoped>
.xt-page-container {
  // 全局默认样式变量（统一维护，全局:root可覆盖）
  --xt-page-container-padding: 20px;
  --xt-page-container-bg: #f0f0f2;

  --xt-header-padding: 0;
  --xt-header-bg: #ffffff;
  --xt-header-border: none;

  --xt-main-padding: 0;
  --xt-main-bg: #ffffff;

  --xt-footer-padding: 5px 0;
  --xt-footer-border-top: 1px solid #f0f0f2;

  --xt-aside-margin-left: 10px;
  --xt-aside-bg: #ffffff;
  --xt-aside-border: 1px solid #eeeeee;
  --xt-aside-padding: 0;
  --xt-aside-overflow-x: hidden;

  display: flex;
  height: 100%;
  padding: var(--xt-page-container-padding);
  background: var(--xt-page-container-bg);
  gap: var(--xt-page-aside-gap, 0);

  .xt-page-main-wrap {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .xt-page-header {
    padding: var(--xt-header-padding);
    background: var(--xt-header-bg);
    border: var(--xt-header-border);
  }

  .xt-page-main {
    flex: 1;
    padding: var(--xt-main-padding);
    background: var(--xt-main-bg);
    overflow: auto;
  }

  .xt-page-footer {
    padding: var(--xt-footer-padding);
    border-top: var(--xt-footer-border-top);
  }

  .xt-page-aside {
    margin-left: var(--xt-aside-margin-left);
    background: var(--xt-aside-bg);
    border: var(--xt-aside-border);
    padding: var(--xt-aside-padding);
    height: 100%;
    overflow-x: var(--xt-aside-overflow-x);
  }
}
</style>