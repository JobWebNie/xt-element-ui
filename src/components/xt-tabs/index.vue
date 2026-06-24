<template>
  <div class="xt-tabs" :class="[
    `xt-tabs--${position}`,
    { 'xt-tabs--card': type === 'card' }
  ]">
    <div class="xt-tabs__header">
      <div class="xt-tabs__nav">
        <div
          v-for="(pane, index) in panes"
          :key="pane.name"
          class="xt-tabs__nav-item"
          :class="{ 'xt-tabs__nav-item--active': activeName === pane.name }"
          @click="handleTabClick(pane.name)"
        >
          <span class="xt-tabs__nav-link">{{ pane.label }}</span>
        </div>
      </div>
      <div class="xt-tabs__nav-indicator" :style="indicatorStyle"></div>
    </div>
    
    <div class="xt-tabs__content">
      <transition name="xt-tabs-fade" mode="out-in">
        <div
          v-for="(pane, index) in panes"
          :key="pane.name"
          class="xt-tabs__pane"
          v-show="activeName === pane.name"
        >
          <slot :name="pane.name"></slot>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'XtTabs',
  props: {
    value: {
      type: [String, Number],
      default: ''
    },
    type: {
      type: String,
      default: 'default',
      validator: (val) => ['default', 'card'].includes(val)
    },
    position: {
      type: String,
      default: 'top',
      validator: (val) => ['top', 'bottom', 'left', 'right'].includes(val)
    }
  },
  data() {
    return {
      panes: [],
      activeName: this.value
    }
  },
  watch: {
    value(val) {
      this.activeName = val
    },
    activeName(val) {
      this.$emit('input', val)
      this.$emit('change', val)
    }
  },
  computed: {
    indicatorStyle() {
      const activeIndex = this.panes.findIndex(p => p.name === this.activeName)
      if (activeIndex === -1) return { display: 'none' }
      
      const navItems = this.$el && this.$el.querySelectorAll('.xt-tabs__nav-item')
      if (!navItems || navItems.length === 0) return { display: 'none' }
      
      const activeItem = navItems[activeIndex]
      return {
        left: `${activeItem.offsetLeft}px`,
        width: `${activeItem.offsetWidth}px`,
        display: 'block'
      }
    }
  },
  methods: {
    handleTabClick(name) {
      this.activeName = name
    },
    addPane(pane) {
      if (!this.panes.find(p => p.name === pane.name)) {
        this.panes.push(pane)
        if (!this.activeName && this.panes.length === 1) {
          this.activeName = pane.name
        }
      }
    },
    removePane(name) {
      const index = this.panes.findIndex(p => p.name === name)
      if (index > -1) {
        this.panes.splice(index, 1)
      }
    }
  },
  mounted() {
    this.$children.forEach(child => {
      if (child.$options.name === 'XtTabPane') {
        this.addPane({ name: child.name, label: child.label })
      }
    })
  }
}
</script>
