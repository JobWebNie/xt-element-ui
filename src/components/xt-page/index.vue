<template>
  <el-container class="page-container">
    <el-container class="page-main">
      <el-header v-if="$slots.header && showHeader" ref="header" height="" :class="{'page-header':$slots.aside}">
        <slot name="header" />
      </el-header>
      <el-main ref="main" style="padding: 0;">
        <slot :tableHeight="calcHeight - tableBorderHeight" />
      </el-main>
      <el-footer v-if="$slots.footer && showFooter" ref="footer" height="">
        <slot name="footer" />
      </el-footer>
    </el-container>
    <el-aside class="page-aside" v-if="$slots.aside && showAside" :width="asideWidth" ref="aside">
      <slot name="aside" />
    </el-aside>
    <slot name="dialog" />
  </el-container>
</template>
<script>
export default {
  name: "XtPage",
  props: {
    showHeader: { type: Boolean, default: true },
    showFooter: { type: Boolean, default: true },
    showAside: { type: Boolean, default: true },
    diffHeight: {
      type: Number,
      default: 0
    },
    minHeight: {
      type: Number,
      default: 200
    },
    tableBorderHeight: {
      type: Number,
      default: 1
    },
    asideWidth: {
      type: String
    }
  },
  data() {
    return {
      tableHeight: 360
    };
  },
  computed: {
    calcHeight() {
      return Math.max(this.tableHeight, this.minHeight);
    }
  },
  mounted() {
    this.$nextTick(() => {
      // 表格高度自适应浏览器大小
      this.doLayout();
      window.onresize = () => {
        this.doLayout();
      };
    });
  },
  methods: {
    doLayout() {
      // 多减去1 解决高度相等时 出现滚动条问题
      if (this.$refs.main) {
        this.tableHeight = this.$refs.main.$el.getBoundingClientRect().height - (this.diffHeight) - this.tableBorderHeight;
      } else {
      }
    }
  }
};
</script>
<style scoped lang="scss">
.el-main {
  padding: 0;
  background: #fff;
  .formBox {
    background: #f0f0f2;
  }
}
.el-footer{
  border-top: 1px solid #f0f0f2;
  padding: 5px 0;
}
.el-header{
  padding: 0;
}
.el-aside {
  background-color: #fff;
  margin-left: 10px;
  height: 100%;
  padding: 0;
  border: 1px solid #eee;
  margin-bottom: 0;
  overflow-x: hidden;
}
.page-container{
  padding: 20px;
  height: 100%;
  background: #f0f0f2;
}
.page-header{
  padding: 10px 10px 0;
  background: #fff;
}
.page-main{
  padding: 0;
}
</style>
