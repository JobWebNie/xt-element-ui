<template>
  <div class="xt-scroll-arrow" :class="[`xt-scroll-arrow--${direction}`]" :style="containerStyle">
    <div 
      v-if="showLeftArrow" 
      class="xt-scroll-arrow__btn xt-scroll-arrow__btn--left"
      @click="scrollLeft"
    >
      <i class="el-icon-arrow-left"></i>
    </div>

    <div ref="scrollContainer" class="xt-scroll-arrow__content" @scroll="handleScroll" @click="handleClick">
      <slot></slot>
    </div>

    <div 
      v-if="showRightArrow" 
      class="xt-scroll-arrow__btn xt-scroll-arrow__btn--right"
      @click="scrollRight"
    >
      <i class="el-icon-arrow-right"></i>
    </div>

    <div 
      v-if="showTopArrow && direction === 'vertical'" 
      class="xt-scroll-arrow__btn xt-scroll-arrow__btn--top"
      @click="scrollTop"
    >
      <i class="el-icon-arrow-up"></i>
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
export default {
  name: 'XtScrollArrow',
  props: {
    direction: {
      type: String,
      default: 'horizontal',
      validator: (val) => ['horizontal', 'vertical'].includes(val)
    },
    scrollStep: {
      type: Number,
      default: 100
    },
    autoHide: {
      type: Boolean,
      default: true
    },
    height: {
      type: [String, Number],
      default: ''
    },
    width: {
      type: [String, Number],
      default: ''
    },
    appendMode: {
      type: Boolean,
      default: false
    },
    clickMode: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showLeftArrow: false,
      showRightArrow: false,
      showTopArrow: false,
      showBottomArrow: false
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
    }
  },
  watch: {
    direction() {
      this.$nextTick(() => {
        this.checkScroll()
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.checkScroll()
    })
    this.addResizeObserver()
    this.addMutationObserver()
  },
  beforeDestroy() {
    this.removeResizeObserver()
    this.removeMutationObserver()
  },
  methods: {
    addResizeObserver() {
      if (typeof ResizeObserver !== 'undefined') {
        this.resizeObserver = new ResizeObserver(() => {
          this.$nextTick(() => {
            this.checkScroll()
          })
        })
        const container = this.$refs.scrollContainer
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
        const container = this.$refs.scrollContainer
        if (container) {
          this.mutationObserver.observe(container, {
            childList: true,
            subtree: true
          })
        }
      }
    },
    removeMutationObserver() {
      if (this.mutationObserver) {
        this.mutationObserver.disconnect()
      }
    },
    checkScroll() {
      const container = this.$refs.scrollContainer
      if (!container) return

      if (this.direction === 'horizontal') {
        const scrollLeft = container.scrollLeft
        const scrollWidth = container.scrollWidth
        const clientWidth = container.clientWidth
        const maxScroll = scrollWidth - clientWidth

        this.showTopArrow = false
        this.showBottomArrow = false

        if (this.autoHide) {
          this.showLeftArrow = scrollLeft > 0
          this.showRightArrow = maxScroll > 0 && scrollLeft < maxScroll
        } else {
          this.showLeftArrow = maxScroll > 0
          this.showRightArrow = maxScroll > 0
        }
      } else {
        const scrollTop = container.scrollTop
        const scrollHeight = container.scrollHeight
        const clientHeight = container.clientHeight
        const maxScroll = scrollHeight - clientHeight

        this.showLeftArrow = false
        this.showRightArrow = false

        if (this.autoHide) {
          this.showTopArrow = scrollTop > 0
          this.showBottomArrow = maxScroll > 0 && scrollTop < maxScroll
        } else {
          this.showTopArrow = maxScroll > 0
          this.showBottomArrow = maxScroll > 0
        }
      }
    },
    handleScroll() {
      this.checkScroll()
      this.$emit('scroll', this.$refs.scrollContainer)
    },
    handleClick(e) {
      if (!this.clickMode) return
      const container = this.$refs.scrollContainer
      if (!container) return
      
      const target = e.target
      if (!target || target === container) return
      
      const containerRect = container.getBoundingClientRect()
      const targetRect = target.getBoundingClientRect()
      
      const isVisible = (
        targetRect.left >= containerRect.left &&
        targetRect.right <= containerRect.right &&
        targetRect.top >= containerRect.top &&
        targetRect.bottom <= containerRect.bottom
      )
      
      if (!isVisible) {
        if (this.direction === 'horizontal') {
          const scrollLeft = target.offsetLeft - (container.clientWidth - targetRect.width) / 2
          container.scrollTo({ left: scrollLeft, behavior: 'smooth' })
        } else {
          const scrollTop = target.offsetTop - (container.clientHeight - targetRect.height) / 2
          container.scrollTo({ top: scrollTop, behavior: 'smooth' })
        }
      }
    },
    scrollLeft() {
      const container = this.$refs.scrollContainer
      if (container) {
        container.scrollBy({ left: -this.scrollStep, behavior: 'smooth' })
      }
    },
    scrollRight() {
      const container = this.$refs.scrollContainer
      if (container) {
        container.scrollBy({ left: this.scrollStep, behavior: 'smooth' })
      }
    },
    scrollTop() {
      const container = this.$refs.scrollContainer
      if (container) {
        container.scrollBy({ top: -this.scrollStep, behavior: 'smooth' })
      }
    },
    scrollBottom() {
      const container = this.$refs.scrollContainer
      if (container) {
        container.scrollBy({ top: this.scrollStep, behavior: 'smooth' })
      }
    },
    scrollToEnd() {
      const container = this.$refs.scrollContainer
      if (!container) return
      if (this.direction === 'horizontal') {
        container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' })
      } else {
        container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' })
      }
    }
  }
}
</script>