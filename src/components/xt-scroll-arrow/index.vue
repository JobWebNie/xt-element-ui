<template>
  <div class="xt-scroll-arrow" :class="[`xt-scroll-arrow--${direction}`]" :style="containerStyle">
    <div 
      v-if="showLeftArrow" 
      class="xt-scroll-arrow__btn xt-scroll-arrow__btn--left"
      @click="scrollLeft"
    >
      <i class="el-icon-arrow-left"></i>
    </div>

    <div ref="scrollContainer" class="xt-scroll-arrow__content" @scroll="handleScroll">
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
  },
  beforeDestroy() {
    this.removeResizeObserver()
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
    }
  }
}
</script>