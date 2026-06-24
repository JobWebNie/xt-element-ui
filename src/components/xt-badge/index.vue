<template>
  <span class="xt-badge" :class="[
    `xt-badge--${type}`,
    { 'xt-badge--dot': isDot },
    { 'xt-badge--hidden': hidden },
    { 'xt-badge--fixed': fixed }
  ]">
    <span class="xt-badge__content">
      <slot></slot>
    </span>
    <span 
      v-if="!hidden && (value || isDot)" 
      class="xt-badge__badge"
      :style="badgeStyle"
    >
      <template v-if="isDot"></template>
      <template v-else-if="showOverflow && value > max">{{ max }}+</template>
      <template v-else>{{ value }}</template>
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
    badgeStyle() {
      const style = {}
      if (this.color) {
        style.backgroundColor = this.color
      }
      return style
    }
  }
}
</script>
