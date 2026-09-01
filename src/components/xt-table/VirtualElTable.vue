<template>
  <el-table
    ref="innerTable"
    v-bind="$attrs"
    v-on="$listeners"
    :data="renderList"
  >
    <slot />
  </el-table>
</template>

<script>
import { computeFixedVirtualRange } from '../../utils/virtual-scroll'

export default {
  name: 'VirtualElTable',
  inheritAttrs: false,

  props: {
    virtualScroll: {
      type: Boolean,
      default: false
    },
    rowHeight: {
      type: Number,
      default: 48
    },
    bufferSize: {
      type: Number,
      default: 5
    }
  },

  data() {
    return {
      // 虚拟滚动是否真正启用（DOM 就绪后置为 true，避免容器未找到时错误切片）
      virtualEnabled: false,
      scrollWrap: null,
      phantomDom: null,
      tableDom: null,
      scrollTop: 0,
      // computeFixedVirtualRange 返回值：startIndex / endIndex 已包含 bufferSize，offsetStart 为切片起点的像素偏移
      startIndex: 0,
      endIndex: 20,
      offsetStart: 0,
      rafId: null,
      unwatchPhantom: null,
      layoutTimer: null,
      retryTimers: [],
      wrapRetries: 0
    }
  },

  computed: {
    originData() {
      return this.$attrs.data || []
    },
    renderList() {
      if (!this.virtualScroll || !this.virtualEnabled) return this.originData
      // computeFixedVirtualRange 返回的 startIndex / endIndex 已含 bufferSize，直接切片
      return this.originData.slice(this.startIndex, this.endIndex)
    },
    totalListHeight() {
      return this.originData.length * this.rowHeight
    }
  },

  watch: {
    renderList() {
      this.scheduleLayout()
    },
    originData() {
      if (!this.virtualEnabled) return
      this.$nextTick(() => {
        this.calcVisibleRange()
      })
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.initVirtualScroll()
    })
  },

  beforeDestroy() {
    this.unbindScrollEvent()
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
    if (this.unwatchPhantom) {
      this.unwatchPhantom()
      this.unwatchPhantom = null
    }
    if (this.layoutTimer) {
      clearTimeout(this.layoutTimer)
      this.layoutTimer = null
    }
    this.retryTimers.forEach(t => clearTimeout(t))
    this.retryTimers = []
  },

  methods: {
    initVirtualScroll() {
      if (!this.virtualScroll) return
      this.scrollWrap = this.$refs.innerTable.$el.querySelector('.el-table__body-wrapper')
      if (!this.scrollWrap) {
        console.warn('[VirtualElTable] 无法找到滚动容器，虚拟滚动功能已禁用')
        return
      }

      // body-wrapper 作为绝对定位 table 的包含块
      this.scrollWrap.style.position = 'relative'
      this.scrollWrap.style.overflowY = 'auto'
      this.scrollWrap.style.overflowX = 'auto'

      // 根元素打标 + 注入行高 CSS 变量（固定列克隆表同样在根元素内，可继承该变量）
      const root = this.$refs.innerTable.$el
      root.classList.add('vs-virtual')
      root.style.setProperty('--vs-row-height', `${this.rowHeight}px`)

      this.setupPhantom()
      this.scrollWrap.addEventListener('scroll', this.onScroll, { passive: true })
      this.virtualEnabled = true

      // 首次可见范围计算 + 多次重试：
      // ElementUI 的 el-table 在 mounted 后仍会异步完成列宽/高度布局，
      // 单次 $nextTick 可能拿到 clientHeight=0，导致计算失败且无法恢复。
      // 以递增延迟多次调用，直到 scrollWrap.clientHeight 获得稳定值。
      this.calcVisibleRange()
      const delays = [100, 300, 600, 1000]
      delays.forEach(ms => {
        const timer = setTimeout(() => {
          this.calcVisibleRange()
        }, ms)
        this.retryTimers.push(timer)
      })
    },

    setupPhantom() {
      if (this.scrollWrap.querySelector('.vs-phantom')) return

      // Element UI 的真实 DOM 结构为：
      //   .el-table__body-wrapper > table.el-table__body
      // 即 .el-table__body 本身就是 <table> 元素（并非包裹 table 的容器）。
      // table 由 el-table 内部 Vue 实例渲染并持有引用，因此不能移动它的 DOM 层级
      // （移动后 el-table 重渲染插入空态节点会因锚点父节点不匹配而报错），
      // 方案：table 保持原位置改为绝对定位（top = offsetStart），
      //       另插入一个文档流内的 phantom div 撑开总高度，形成滚动条。
      const table = this.scrollWrap.querySelector('table.el-table__body')
      if (!table) {
        // el-table 的 table 为异步渲染，未就绪时延迟重试（最多约 1.5s）
        this.wrapRetries += 1
        if (this.wrapRetries <= 30) {
          const timer = setTimeout(() => this.setupPhantom(), 50)
          this.retryTimers.push(timer)
        }
        return
      }

      const phantom = document.createElement('div')
      phantom.className = 'vs-phantom'
      phantom.style.minWidth = '100%'
      phantom.style.boxSizing = 'border-box'
      this.phantomDom = phantom
      this.tableDom = table

      // phantom 放在 table 之前（文档流中撑开 body-wrapper 的滚动高度）
      this.scrollWrap.insertBefore(phantom, table)

      // table 脱离文档流，通过 top 偏移到可见区域
      table.style.position = 'absolute'
      table.style.left = '0'
      table.style.top = '0'
      table.style.zIndex = '1'

      // 注意：Vue 2 的 $watch 不支持数组路径语法（Vue 3 才支持），
      // 必须使用函数返回依赖，否则 watcher 创建失败且只执行一次 immediate
      this.unwatchPhantom = this.$watch(
        () => [this.totalListHeight, this.offsetStart],
        ([height, offset]) => {
          if (this.phantomDom) {
            this.phantomDom.style.height = `${height}px`
          }
          if (this.tableDom) {
            this.tableDom.style.top = `${offset}px`
          }
        },
        { immediate: true }
      )
    },

    onScroll() {
      this.scrollTop = this.scrollWrap.scrollTop
      if (this.rafId) return
      this.rafId = requestAnimationFrame(() => {
        this.calcVisibleRange()
        this.rafId = null
      })
    },

    calcVisibleRange() {
      if (!this.scrollWrap) return
      let viewHeight = this.scrollWrap.clientHeight

      // 关键兜底：ElementUI 异步布局尚未完成时，clientHeight 可能为 0，
      // 此时用组件接收到的 height / max-height 作为估算值，确保至少能渲染正确数量的行。
      if (!viewHeight) {
        const h = this.$attrs.height || this.$attrs.maxHeight
        if (h) {
          viewHeight = typeof h === 'number' ? h : parseInt(String(h), 10)
        }
      }
      if (!viewHeight || viewHeight <= 0) return

      const { startIndex, endIndex, offsetStart } = computeFixedVirtualRange({
        scrollOffset: this.scrollTop,
        itemSize: this.rowHeight,
        containerSize: viewHeight,
        total: this.originData.length,
        bufferSize: this.bufferSize
      })

      if (startIndex !== this.startIndex || endIndex !== this.endIndex || offsetStart !== this.offsetStart) {
        this.startIndex = startIndex
        this.endIndex = endIndex
        this.offsetStart = offsetStart
      }
    },

    unbindScrollEvent() {
      if (this.scrollWrap) {
        this.scrollWrap.removeEventListener('scroll', this.onScroll)
      }
    },

    scheduleLayout() {
      if (this.layoutTimer) return
      this.layoutTimer = setTimeout(() => {
        if (this.$refs.innerTable) {
          this.$refs.innerTable.doLayout()
        }
        this.layoutTimer = null
      }, 0)
    },

    clearSelection() {
      return this.$refs.innerTable.clearSelection()
    },
    toggleRowSelection() {
      return this.$refs.innerTable.toggleRowSelection()
    },
    doLayout() {
      return this.$refs.innerTable.doLayout()
    }
  }
}
</script>

<style>
/* 虚拟滚动依赖「等行高」这一前提：
   el-table 默认 td 上下 padding 12px + 单元格内容可换行，实际行高并非固定值，
   滚动后会产生像素级累积偏差。这里在虚拟滚动模式下（根元素 .vs-virtual）：
   1. 固定每个单元格高度为 --vs-row-height；
   2. 单元格内容强制单行省略，避免换行撑高行高。
   主表与固定列克隆表均在 .vs-virtual 根内，行高保持一致。
   注意：phantom 为 JS 动态创建节点，不带 scoped 属性，故使用全局样式 + 专属类名隔离。 */
.vs-virtual .el-table__body td.el-table__cell {
  height: var(--vs-row-height, 48px);
  padding-top: 0 !important;
  padding-bottom: 0 !important;
}
.vs-virtual .el-table__body td.el-table__cell .cell {
  height: var(--vs-row-height, 48px);
  line-height: var(--vs-row-height, 48px);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
