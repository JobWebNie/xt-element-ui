<template>
  <div class="xt-scroll" :class="[`xt-scroll--${scrollDirection}`]" :style="containerStyle">
    <!-- 原生滚动容器 -->
    <div
      ref="scrollWrap"
      class="xt-scroll__wrap"
      :class="[`xt-scroll__wrap--${scrollDirection}`]"
      @scroll="onScroll"
    >
      <!-- 虚拟滚动模式 -->
      <div v-if="vScroll" class="xt-scroll__virtual" :style="virtualWrapperStyle">
        <!-- 虚拟滚动 phantom -->
        <div
          v-if="scrollDirection === 'vertical'"
          class="xt-scroll__phantom"
          :style="{ height: totalSize + 'px' }"
        >
          <div :style="{ transform: `translateY(${offsetStart}px)` }">
            <template v-for="(item, index) in visibleData">
              <div
                :key="getItemKey(item, index)"
                class="xt-scroll__item"
                :style="itemStyle"
                :class="itemClassName"
              >
                <slot name="item" :item="item" :index="getOriginalIndex(index)">
                  {{ item }}
                </slot>
              </div>
            </template>
          </div>
        </div>

        <!-- 横向虚拟滚动 phantom -->
        <div
          v-else-if="scrollDirection === 'horizontal'"
          class="xt-scroll__phantom"
          :style="{ width: totalSize + 'px' }"
        >
          <div :style="{ transform: `translateX(${offsetStart}px)` }">
            <template v-for="(item, index) in visibleData">
              <div
                :key="getItemKey(item, index)"
                class="xt-scroll__item"
                :style="itemStyle"
                :class="itemClassName"
              >
                <slot name="item" :item="item" :index="getOriginalIndex(index)">
                  {{ item }}
                </slot>
              </div>
            </template>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="vScroll && (!data || !data.length) && !loading" class="xt-scroll__empty">
        <slot name="empty">
          <span>{{ emptyText }}</span>
        </slot>
      </div>

      <!-- 加载状态 -->
      <div v-if="loading" class="xt-scroll__loading">
        <slot name="loading">
          <i class="el-icon-loading"></i>
          <span>加载中...</span>
        </slot>
      </div>

      <!-- 非虚拟滚动模式：默认插槽 -->
      <div v-if="!vScroll" class="xt-scroll__default">
        <slot></slot>
      </div>

      <!-- 触底/触顶加载更多 -->
      <div v-if="vScroll && showLoadMore && !loading" class="xt-scroll__loadmore" @click="onLoadMore">
        <el-button type="text" :loading="loadMoreLoading">
          {{ loadMoreText }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { computeFixedVirtualRange } from '../../utils/virtual-scroll'

export default {
  name: 'XtScroll',

  props: {
    // ========== 虚拟滚动配置 ==========
    /** 是否启用虚拟滚动 */
    vScroll: { type: Boolean, default: false },
    /** 数据源 */
    data: { type: Array, default: () => [] },
    /** 每个 item 的固定尺寸（px），纵向为高度，横向为宽度 */
    itemSize: { type: Number, default: 50 },
    /** item 的唯一键字段名 */
    keyField: { type: String, default: 'id' },
    /** 预渲染缓冲区大小（item 数量） */
    bufferSize: { type: Number, default: 5 },
    /** 虚拟滚动方向 */
    scrollDirection: {
      type: String,
      default: 'vertical',
      validator: (v) => ['vertical', 'horizontal'].includes(v)
    },
    /** item 的自定义 CSS 类名 */
    itemClassName: { type: String, default: '' },

    // ========== 容器尺寸 ==========
    height: { type: [Number, String], default: '' },
    maxHeight: { type: [Number, String], default: '' },
    width: { type: [Number, String], default: '' },
    maxWidth: { type: [Number, String], default: '' },

    // ========== 状态 ==========
    loading: { type: Boolean, default: false },
    emptyText: { type: String, default: '暂无数据' },

    // ========== 加载更多 ==========
    loadMore: { type: Boolean, default: false },
    loadMoreText: { type: String, default: '加载更多' },
    loadMoreLoading: { type: Boolean, default: false }
  },

  data() {
    return {
      scrollPos: 0,
      containerSize: 0,
      resizeObserver: null,
      rafId: null
    }
  },

  computed: {
    containerStyle() {
      const style = {}
      if (this.height) {
        style.height = typeof this.height === 'number' ? this.height + 'px' : this.height
      }
      if (this.maxHeight) {
        style.maxHeight = typeof this.maxHeight === 'number' ? this.maxHeight + 'px' : this.maxHeight
      }
      if (this.width) {
        style.width = typeof this.width === 'number' ? this.width + 'px' : this.width
      }
      if (this.maxWidth) {
        style.maxWidth = typeof this.maxWidth === 'number' ? this.maxWidth + 'px' : this.maxWidth
      }
      return style
    },

    virtualWrapperStyle() {
      const style = {}
      if (this.scrollDirection === 'horizontal') {
        style.height = '100%'
      }
      return style
    },

    itemStyle() {
      return this.scrollDirection === 'vertical'
        ? { height: this.itemSize + 'px' }
        : { width: this.itemSize + 'px', display: 'inline-block' }
    },

    /** 数据总条数 */
    dataCount() {
      return (this.data && this.data.length) || 0
    },

    /** 总滚动尺寸 */
    totalSize() {
      return this.dataCount * this.itemSize
    },

    /** 虚拟滚动：可见范围计算（含缓冲区） */
    virtualRange() {
      if (!this.vScroll) {
        return { startIndex: 0, endIndex: this.dataCount, offsetStart: 0 }
      }
      return computeFixedVirtualRange({
        scrollOffset: this.scrollPos,
        itemSize: this.itemSize,
        containerSize: this.containerSize,
        total: this.dataCount,
        bufferSize: this.bufferSize
      })
    },

    /** 虚拟滚动：可见范围起始索引 */
    visibleStartIndex() {
      return this.virtualRange.startIndex
    },

    /** 虚拟滚动：可见范围结束索引 */
    visibleEndIndex() {
      return this.virtualRange.endIndex
    },

    /** 可见数据 */
    visibleData() {
      if (!this.vScroll || !this.data) return this.data || []
      return this.data.slice(this.visibleStartIndex, this.visibleEndIndex)
    },

    /** 偏移量（px） */
    offsetStart() {
      return this.virtualRange.offsetStart
    },

    /** 是否显示加载更多 */
    showLoadMore() {
      if (!this.loadMore || !this.dataCount) return false
      if (this.scrollDirection === 'vertical') {
        return this.scrollPos + this.containerSize >= this.totalSize - this.itemSize * 2
      }
      return false
    }
  },

  watch: {
    data: {
      handler() {
        this.$nextTick(() => {
          this.updateContainerSize()
        })
      }
    },
    vScroll(val) {
      if (val) {
        this.$nextTick(() => {
          this.updateContainerSize()
          this.bindResizeObserver()
        })
      }
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.updateContainerSize()
      if (this.vScroll) {
        this.bindResizeObserver()
      }
    })
  },

  beforeDestroy() {
    this.unbindResizeObserver()
    if (this.rafId && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
  },

  methods: {
    // ========== 虚拟滚动 ==========
    onScroll() {
      const wrap = this.$refs.scrollWrap
      if (!wrap) return

      const pos = this.scrollDirection === 'vertical' ? wrap.scrollTop : wrap.scrollLeft
      this.scrollPos = pos

      // 对外 emit scroll 事件，传递 scrollTop/scrollLeft 方便父组件使用
      this.$emit('scroll', {
        scrollTop: wrap.scrollTop,
        scrollLeft: wrap.scrollLeft
      })

      if (this.rafId) return
      if (typeof requestAnimationFrame === 'undefined') return
      this.rafId = requestAnimationFrame(() => {
        this.$forceUpdate()
        this.rafId = null
      })
    },

    getItemKey(item, index) {
      if (item && typeof item === 'object' && this.keyField && item[this.keyField] != null) {
        return item[this.keyField]
      }
      return `vitem_${this.visibleStartIndex + index}`
    },

    getOriginalIndex(index) {
      return this.visibleStartIndex + index
    },

    // ========== 容器尺寸 ==========
    updateContainerSize() {
      const wrap = this.$refs.scrollWrap
      if (!wrap) return

      this.containerSize = this.scrollDirection === 'vertical'
        ? wrap.clientHeight
        : wrap.clientWidth
    },

    bindResizeObserver() {
      if (typeof ResizeObserver === 'undefined') return
      this.unbindResizeObserver()

      const wrap = this.$refs.scrollWrap
      if (!wrap) return

      this.resizeObserver = new ResizeObserver(() => {
        this.updateContainerSize()
      })
      this.resizeObserver.observe(wrap)
    },

    unbindResizeObserver() {
      if (this.resizeObserver) {
        this.resizeObserver.disconnect()
        this.resizeObserver = null
      }
    },

    // ========== 加载更多 ==========
    onLoadMore() {
      this.$emit('load-more')
    },

    // ========== 对外暴露方法 ==========
    /** 获取原生滚动容器 DOM 元素 */
    getScrollContainer() {
      return this.$refs.scrollWrap
    },

    /** 滚动到指定位置 */
    scrollTo(pos, behavior) {
      const wrap = this.$refs.scrollWrap
      if (!wrap) return

      const opts = behavior && typeof behavior === 'string'
        ? { behavior }
        : { behavior: 'smooth' }

      if (this.scrollDirection === 'vertical') {
        wrap.scrollTo({ top: pos, ...opts })
      } else {
        wrap.scrollTo({ left: pos, ...opts })
      }
    },

    /** 滚动到指定索引的 item */
    scrollToItem(index) {
      const pos = index * this.itemSize
      this.scrollTo(pos)
    },

    /** 滚动到顶部/左侧 */
    scrollToStart() {
      this.scrollTo(0)
    },

    /** 滚动到底部/右侧 */
    scrollToEnd() {
      this.scrollTo(this.totalSize)
    },

    /** 获取当前滚动位置 */
    getScrollPos() {
      return this.scrollPos
    }
  }
}
</script>