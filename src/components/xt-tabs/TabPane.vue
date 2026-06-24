<template>
  <div v-show="isActive" class="xt-tab-pane">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'XtTabPane',
  props: {
    name: {
      type: [String, Number],
      required: true
    },
    label: {
      type: String,
      default: ''
    }
  },
  computed: {
    isActive() {
      return this.$parent && this.$parent.activeName === this.name
    }
  },
  mounted() {
    if (this.$parent && typeof this.$parent.addPane === 'function') {
      this.$parent.addPane({ name: this.name, label: this.label })
    }
  },
  beforeDestroy() {
    if (this.$parent && typeof this.$parent.removePane === 'function') {
      this.$parent.removePane(this.name)
    }
  }
}
</script>
