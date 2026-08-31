<template>
  <div class="xt-scroll-arrow" :class="[`xt-scroll-arrow--${direction}`]" :style="containerStyle">
    <div
      v-if="showLeftArrow"
      class="xt-scroll-arrow__btn xt-scroll-arrow__btn--left"
      @click="scrollLeft"
    >
      <i class="el-icon-arrow-left"></i>
    </div>

    <div
      v-if="showTopArrow && direction === 'vertical'"
      class="xt-scroll-arrow__btn xt-scroll-arrow__btn--top"
      @click="scrollTop"
    >
      <i class="el-icon-arrow-up"></i>
    </div>

    <!-- 使用 xt-scroll 作为滚动容器 -->
    <xt-scroll
      ref="scrollRef"
      :class="['xt-scroll-arrow__content', scrollClass]"
      :v-scroll="vScroll"
      :data="vScrollData"
      :item-size="itemSize"
      :key-field="keyField"
      :buffer-size="bufferSize"
      :scroll-direction="direction"
      :loading="vScrollLoading"
      :load-more="loadMore"
      :load-more-text="loadMoreText"
      :load-more-loading="loadMoreLoading"
      @scroll="onScroll"
      @load-more="$emit('load-more')"
    >
      <!-- 虚拟滚动模式：使用 item 插槽 -->
      <template v-if="vScroll" #item="{ item, index }">
        <slot name="vitem" :item="item" :index="index">
          <div class="xt-scroll-arrow__vitem">{{ item }}</div>
        </slot>
      </template>

      <!-- 非虚拟滚动模式：默认插槽 -->
      <slot v-else></slot>
    </xt-scroll>

    <div
      v-if="showRightArrow"
      class="xt-scroll-arrow__btn xt-scroll-arrow__btn--right"
      @click="scrollRight"
    >
      <i class="el-icon-arrow-right"></i>
    </div>

    <div
      v-if="showBottomArrow && direction === 'vertical'"
      class="xt-scroll-arrow__btn xt-scroll-arrow__btn--bottom"
      @click="scrollBottom"
    >
      <i class="el-icon-arrow-down"></i>
    </div>
  </div>
</template>

<script>
import XtScroll from '../xt-scroll'

export default {
  name: 'XtScrollArrow',

  components: {
    XtScroll
  },

  props: {
    // ========== 滚动方向 ==========
    direction: {
      type: String,
      default: 'horizontal',
      validator: (val) => ['horizontal', 'vertical'].includes(val)
    },

    // ========== 滚动步长 ==========
    scrollStep: {
      type: Number,
      default: 100
    },

    // ========== 箭头显示 ==========
    autoHide: {
      type: Boolean,
      default: true
    },

    // ========== 容器尺寸 ==========
    height: {
      type: [String, Number],
      default: ''
    },
    width: {
      type: [String, Number],
      default: ''
    },

    // ========== 模式 ==========
    appendMode: {
      type: Boolean,
      default: false
    },
    clickMode: {
      type: Boolean,
      default: false
    },

    // ========== 虚拟滚动配置 ==========
    /** 是否启用虚拟滚动 */
    vScroll: {
      type: Boolean,
      default: false
    },
    /** 虚拟滚动数据源 */
    vScrollData: {
      type: Array,
      default: () => []
    },
    /** 每个 item 的固定尺寸（px） */
    itemSize: {
      type: Number,
      default: 50
    },
    /** item 的唯一键字段名 */
    keyField: {
      type: String,
      default: 'id'
    },
    /** 预渲染缓冲区大小 */
    bufferSize: {
      type: Number,
      default: 5
    },
    /** 虚拟滚动加载状态 */
    vScrollLoading: {
      type: Boolean,
      default: false
    },

    // ========== 加载更多 ==========
    loadMore: {
      type: Boolean,
      default: false
    },
    loadMoreText: {
      type: String,
      default: '加载更多'
    },
    loadMoreLoading: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      showLeftArrow: false,
      showRightArrow: false,
      showTopArrow: false,
      showBottomArrow: false,
      mutationObserver: null
    }
  },

  computed: {
    containerStyle() {
      const style = {}
      if (this.height) {
        style.height = typeof this.height === 'number' ? `${this.height}px` : this.height
      }
      if (this.width) {
        style.width = typeof this.width === 'number' ? `${this.width}px` : this.width
      }
      return style
    },
    scrollClass() {
      return this.vScroll ? 'xt-scroll-arrow__content--virtual' : ''
    }
  },

  watch: {
    direction() {
      this.$nextTick(() => {
        this.checkScroll()
      })
    },
    vScrollData: {
      handler() {
        this.$nextTick(() => {
          this.checkScroll()
        })
      }
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.checkScroll()
    })
    this.addResizeObserver()
    if (!this.vScroll) {
      this.addMutationObserver()
    }
  },

  beforeDestroy() {
    this.removeResizeObserver()
    this.removeMutationObserver()
  },

  methods: {
    // ========== 尺寸监听 ==========
    addResizeObserver() {
      if (typeof ResizeObserver !== 'undefined') {
        this.resizeObserver = new ResizeObserver(() => {
          this.$nextTick(() => {
            this.checkScroll()
          })
        })
        const container = this.$el
        if (container) {
          this.resizeObserver.observe(container)
        }
      }
    },

    removeResizeObserver() {
      if (this.resizeObserver) {
        this.resizeObserver.disconnect()
      }
    },

    addMutationObserver() {
      if (typeof MutationObserver !== 'undefined') {
        this.mutationObserver = new MutationObserver(() => {
          this.$nextTick(() => {
            this.checkScroll()
            if (this.appendMode) {
              this.scrollToEnd()
            }
          })
        })
        const container = this.$refs.scrollRef
        if (container) {
          const wrap = container.getScrollContainer && container.getScrollContainer()
          if (wrap) {
            this.mutationObserver.observe(wrap, {
              childList: true,
              subtree: true
            })
          }
        }
      }
    },

    removeMutationObserver() {
      if (this.mutationObserver) {
        this.mutationObserver.disconnect()
      }
    },

    // ========== 滚动检测 ==========
    checkScroll() {
      const scrollRef = this.$refs.scrollRef
      if (!scrollRef) return

      const wrap = scrollRef.getScrollContainer && scrollRef.getScrollContainer()
      if (!wrap) return

      if (this.direction === 'horizontal') {
        const scrollLeft = wrap.scrollLeft
        const scrollWidth = wrap.scrollWidth
        const clientWidth = wrap.clientWidth
        const maxScroll = scrollWidth - clientWidth

        this.showTopArrow = false
        this.showBottomArrow = false

        if (this.autoHide) {
          this.showLeftArrow = scrollLeft > 0
          this.showRightArrow = maxScroll > 0 && scrollLeft < maxScroll - 1
        } else {
          this.showLeftArrow = maxScroll > 0
          this.showRightArrow = maxScroll > 0
        }
      } else {
        const scrollTop = wrap.scrollTop
        const scrollHeight = wrap.scrollHeight
        const clientHeight = wrap.clientHeight
        const maxScroll = scrollHeight - clientHeight

        this.showLeftArrow = false
        this.showRightArrow = false

        if (this.autoHide) {
          this.showTopArrow = scrollTop > 0
          this.showBottomArrow = maxScroll > 0 && scrollTop < maxScroll - 1
        } else {
          this.showTopArrow = maxScroll > 0
          this.showBottomArrow = maxScroll > 0
        }
      }
    },

    onScroll() {
      this.checkScroll()
      this.$emit('scroll', this.$refs.scrollRef)
    },

    // ========== 滚动操作 ==========
    scrollLeft() {
      this._scrollBy(-this.scrollStep)
    },

    scrollRight() {
      this._scrollBy(this.scrollStep)
    },

    scrollTop() {
      this._scrollBy(-this.scrollStep, 'vertical')
    },

    scrollBottom() {
      this._scrollBy(this.scrollStep, 'vertical')
    },

    _scrollBy(delta, dir) {
      const direction = dir || this.direction
      const scrollRef = this.$refs.scrollRef
      if (!scrollRef) return

      const wrap = scrollRef.getScrollContainer && scrollRef.getScrollContainer()
      if (!wrap) return

      if (direction === 'horizontal') {
        wrap.scrollBy({ left: delta, behavior: 'smooth' })
      } else {
        wrap.scrollBy({ top: delta, behavior: 'smooth' })
      }
    },

    scrollToEnd() {
      const scrollRef = this.$refs.scrollRef
      if (!scrollRef) return
      const wrap = scrollRef.getScrollContainer && scrollRef.getScrollContainer()
      if (!wrap) return

      if (this.direction === 'horizontal') {
        wrap.scrollTo({ left: wrap.scrollWidth, behavior: 'smooth' })
      } else {
        wrap.scrollTo({ top: wrap.scrollHeight, behavior: 'smooth' })
      }
    },

    // ========== 对外暴露方法 ==========
    /** 获取滚动位置 */
    getScrollPos() {
      const scrollRef = this.$refs.scrollRef
      if (!scrollRef) return 0
      const wrap = scrollRef.getScrollContainer && scrollRef.getScrollContainer()
      if (!wrap) return 0
      return this.direction === 'horizontal' ? wrap.scrollLeft : wrap.scrollTop
    },

    /** 获取 xt-scroll 组件实例 */
    getScrollInstance() {
      return this.$refs.scrollRef
    }
  }
}
</script>