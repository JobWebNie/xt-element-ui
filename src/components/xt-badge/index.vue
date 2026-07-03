<template>
  <span :class="rootClasses">
    <span class="xt-badge__content">
      <slot></slot>
    </span>
    <span 
      v-if="!hidden && (value || isDot)" 
      class="xt-badge__badge"
      :style="badgeStyle"
    >
      <span v-if="isDot"></span>
      <span v-else-if="isOverflow">{{ overflowText }}</span>
      <span v-else>{{ value }}</span>
    </span>
  </span>
</template>

<script>
export default {
  name: 'XtBadge',
  props: {
    value: {
      type: [Number, String],
      default: ''
    },
    type: {
      type: String,
      default: 'primary',
      validator: (val) => ['primary', 'success', 'warning', 'danger', 'info'].includes(val)
    },
    max: {
      type: Number,
      default: 99
    },
    isDot: {
      type: Boolean,
      default: false
    },
    hidden: {
      type: Boolean,
      default: false
    },
    showOverflow: {
      type: Boolean,
      default: true
    },
    fixed: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: ''
    }
  },
  computed: {
    rootClasses() {
      return [
        'xt-badge',
        `xt-badge--${this.type}`,
        { 'xt-badge--dot': this.isDot },
        { 'xt-badge--hidden': this.hidden },
        { 'xt-badge--fixed': this.fixed }
      ]
    },
    badgeStyle() {
      const style = {}
      if (this.color) {
        style.backgroundColor = this.color
      }
      return style
    },
    overflowText() {
      return this.max + '+'
    },
    isOverflow() {
      return this.showOverflow && this.value > this.max
    }
  }
}
</script>
