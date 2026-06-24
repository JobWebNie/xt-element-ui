<template>
  <component
    :is="tag"
    :class="iconClasses"
    :style="iconStyle"
    v-on="$listeners"
    @click="handleClick"
  >
    <svg v-if="isSvgSprite" :style="svgStyle" aria-hidden="true">
      <use :href="svgHref" />
    </svg>
    <slot v-else-if="hasDefaultSlot" />
  </component>
</template>

<script>
const customPrefixes = {}

const XtIcon = {
  name: 'XtIcon',
  inheritAttrs: false,

  props: {
    name: {
      type: String,
      default: ''
    },
    size: {
      type: [String, Number],
      default: ''
    },
    color: {
      type: String,
      default: ''
    },
    spin: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    hasDefaultSlot() {
      return !!this.$slots.default
    },
    iconName() {
      return (this.name || '').trim()
    },
    isElIcon() {
      return /^el-icon-/.test(this.iconName)
    },
    isSvgInline() {
      return this.iconName.indexOf('<svg') > -1
    },
    isSvgSprite() {
      return /^(#|svg:)/.test(this.iconName)
    },
    isCustomFont() {
      if (!this.iconName) return false
      return !this.isElIcon && !this.isSvgInline && !this.isSvgSprite
    },
    svgHref() {
      if (!this.isSvgSprite) return ''
      const name = this.iconName.replace(/^svg:/, '').replace(/^#/, '')
      return `#${name}`
    },
    needsExIconPrefix() {
      if (!this.isCustomFont) return false
      for (const prefix of Object.keys(customPrefixes)) {
        if (this.iconName.indexOf(prefix) === 0) {
          return false
        }
      }
      return true
    },
    tag() {
      if (this.isSvgInline) return 'span'
      return 'i'
    },
    iconClasses() {
      const classes = []
      if (this.isElIcon) {
        classes.push(this.iconName)
      } else if (this.isSvgSprite) {
        classes.push('ex-icon-svg')
      } else if (this.isCustomFont) {
        if (this.needsExIconPrefix) classes.push('ex-icon')
        classes.push(this.iconName)
      } else if (this.isSvgInline) {
        classes.push('ex-icon-inline-svg')
      }
      if (this.spin) classes.push('ex-icon-spin')
      return classes
    },
    iconStyle() {
      const style = {}
      if (this.size) {
        const s = typeof this.size === 'number' ? `${this.size}px` : this.size
        style.fontSize = s
        style.width = s
        style.height = s
      }
      if (this.color) {
        style.color = this.color
      }
      if (this.isSvgInline) {
        style.display = 'inline-block'
        style.verticalAlign = 'middle'
      }
      return style
    },
    svgStyle() {
      return {
        width: '1em',
        height: '1em',
        verticalAlign: '-0.15em',
        fill: 'currentColor',
        overflow: 'hidden'
      }
    }
  },

  mounted() {
    if (this.isSvgInline && this.$el) {
      this.$el.innerHTML = this.iconName
    }
  },

  beforeUpdate() {
    if (this.isSvgInline && this.$el) {
      this.$el.innerHTML = this.iconName
    }
  },

  methods: {
    handleClick(e) {
      this.$emit('click', e)
    }
  }
}

XtIcon.registerPrefix = function (prefix) {
  if (prefix && typeof prefix === 'string') {
    customPrefixes[prefix] = true
  }
}

export default XtIcon
</script>

<style lang="scss" scoped>
.ex-icon-svg {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  font-size: inherit;
}

.ex-icon-spin {
  animation: ex-icon-spin-rotate 1s linear infinite;
}

@keyframes ex-icon-spin-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
