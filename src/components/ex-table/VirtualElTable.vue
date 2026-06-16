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
      scrollWrap: null,
      phantomDom: null,
      scrollTop: 0,
      // 根据数据量与容器高度预先估算一个合理的 endIndex，避免首屏只渲染 0 行
      startIndex: 0,
      endIndex: 20,
      rafId: null,
      unwatchPhantom: null,
      layoutTimer: null,
      retryTimers: []
    }
  },

  computed: {
    originData() {
      return this.$attrs.data || []
    },
    renderList() {
      if (!this.virtualScroll) return this.originData
      const start = Math.max(0, this.startIndex - this.bufferSize)
      const end = Math.min(this.originData.length, this.endIndex + this.bufferSize)
      return this.originData.slice(start, end)
    },
    totalListHeight() {
      return this.originData.length * this.rowHeight
    },
    contentOffsetY() {
      return Math.max(0, this.startIndex - this.bufferSize) * this.rowHeight
    }
  },

  watch: {
    renderList() {
      this.scheduleLayout()
    },
    originData: {
      handler(val) {
        if (!this.virtualScroll) return
        if (val && val.length) {
          this.$nextTick(() => {
            this.calcVisibleRange()
          })
        }
      }
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
        this.virtualScroll = false
        return
      }

      this.scrollWrap.style.overflowY = 'auto'
      this.scrollWrap.style.overflowX = 'auto'

      this.wrapTableBody()
      this.scrollWrap.addEventListener('scroll', this.onScroll, { passive: true })

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

    wrapTableBody() {
      const bodyDom = this.scrollWrap.querySelector('.el-table__body')
      if (!bodyDom || bodyDom.querySelector('.vs-phantom')) return

      // phantom 采用标准 block 布局：
      // - height = 总数据高度，确保撑开 body-wrapper 的滚动条
      // - padding-top = 可见区域偏移量，将 table 推到正确位置
      // - min-width: 100%（不设 width），允许 table 自然撑开，保证列宽生效
      const phantom = document.createElement('div')
      phantom.className = 'vs-phantom'
      phantom.style.position = 'relative'
      phantom.style.minWidth = '100%'
      phantom.style.boxSizing = 'border-box'
      phantom.style.zIndex = '1'
      this.phantomDom = phantom

      const table = bodyDom.querySelector('table')
      phantom.appendChild(table)
      bodyDom.appendChild(phantom)

      this.unwatchPhantom = this.$watch(
        ['totalListHeight', 'contentOffsetY'],
        () => {
          if (this.phantomDom) {
            this.phantomDom.style.height = `${this.totalListHeight}px`
            this.phantomDom.style.paddingTop = `${this.contentOffsetY}px`
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

      const visibleRowCount = Math.ceil(viewHeight / this.rowHeight)
      const newStart = Math.floor(this.scrollTop / this.rowHeight)
      const newEnd = Math.min(this.originData.length, newStart + visibleRowCount)

      if (newStart !== this.startIndex || newEnd !== this.endIndex) {
        this.startIndex = newStart
        this.endIndex = newEnd
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

<style scoped>
.vs-phantom {
  position: relative;
  box-sizing: border-box;
}
</style>