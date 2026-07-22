<template>
  <div ref="tabsWrap" class="xt-tabs" :class="[
    `xt-tabs--${actualPosition}`,
    { 'xt-tabs--card': type === 'card' },
    { 'xt-tabs--border-card': type === 'border-card' },
    { 'xt-tabs--editable': editable }
  ]">
    <div class="xt-tabs__header" ref="tabsHeader">
      <div class="xt-tabs__nav" ref="tabsNav">
        <div
          v-for="(pane, index) in panes"
          :key="pane.name"
          class="xt-tabs__nav-item"
          :class="{ 
            'xt-tabs__nav-item--active': activeName === pane.name,
            'xt-tabs__nav-item--disabled': pane.disabled
          }"
          @click="handleTabClick(pane)"
        >
          <span class="xt-tabs__nav-link">{{ pane.label }}</span>
          <span 
            v-if="(closable || pane.closable) && !editable" 
            class="xt-tabs__close" 
            @click.stop="handleTabRemove(pane.name)"
          >×</span>
        </div>
        <div 
          v-if="addable || editable" 
          class="xt-tabs__nav-item xt-tabs__nav-item--add" 
          @click="handleTabAdd"
        >
          <span>+</span>
        </div>
      </div>
      <div class="xt-tabs__nav-indicator" :style="indicatorStyle"></div>
    </div>
    
    <div class="xt-tabs__content">
      <slot></slot>
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
      default: '',
      validator: (val) => ['', 'card', 'border-card'].includes(val)
    },
    position: {
      type: String,
      default: 'top',
      validator: (val) => ['top', 'bottom', 'left', 'right'].includes(val)
    },
    tabPosition: {
      type: String,
      default: ''
    },
    closable: {
      type: Boolean,
      default: false
    },
    addable: {
      type: Boolean,
      default: false
    },
    editable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      panes: [],
      activeName: this.value
    }
  },
  computed: {
    actualPosition() {
      return this.tabPosition || this.position
    },
    indicatorStyle() {
      const activeIndex = this.panes.findIndex(p => p.name === this.activeName)
      if (activeIndex === -1 || !this.$refs.tabsNav) return { display: 'none' }
      
      const navItems = this.$refs.tabsNav.querySelectorAll('.xt-tabs__nav-item:not(.xt-tabs__nav-item--add)')
      if (!navItems || navItems.length === 0) return { display: 'none' }
      
      const activeItem = navItems[activeIndex]
      if (!activeItem) return { display: 'none' }

      const pos = this.actualPosition
      const base = { transition: 'all 0.3s ease' }
      if (pos === 'top' || pos === 'bottom') {
        return {
          ...base,
          left: `${activeItem.offsetLeft}px`,
          width: `${activeItem.offsetWidth}px`,
          height: '2px',
          bottom: pos === 'top' ? 0 : 'auto',
          top: pos === 'bottom' ? 0 : 'auto',
          display: 'block'
        }
      } else {
        return {
          ...base,
          top: `${activeItem.offsetTop}px`,
          height: `${activeItem.offsetHeight}px`,
          width: '2px',
          left: pos === 'left' ? 'auto' : 0,
          right: pos === 'right' ? 0 : 'auto',
          display: 'block'
        }
      }
    }
  },
  watch: {
    value(val) {
      this.activeName = val
    },
    activeName(val) {
      this.$emit('input', val)
      this.$emit('change', val)
      this.$nextTick(() => this.$forceUpdate())
    },
    panes: {
      handler() {
        this.$nextTick(() => this.$forceUpdate())
      },
      deep: true
    }
  },
  methods: {
    handleTabClick(pane) {
      if (pane.disabled) return
      this.activeName = pane.name
      this.$emit('tab-click', pane)
    },
    handleTabRemove(name) {
      this.$emit('tab-remove', name)
      this.$emit('edit', name, 'remove')
      const index = this.panes.findIndex(p => p.name === name)
      if (index > -1) {
        this.panes.splice(index, 1)
        if (this.activeName === name && this.panes.length > 0) {
          this.activeName = this.panes[0].name
        }
      }
    },
    handleTabAdd() {
      this.$emit('tab-add')
      this.$emit('edit', null, 'add')
    },
    addPane(pane) {
      const exist = this.panes.some(p => p.name === pane.name)
      if (!exist) {
        this.panes.push(pane)
        if (!this.activeName && this.panes.length === 1) {
          this.activeName = pane.name
        }
        this.$nextTick(() => this.$forceUpdate())
      }
    },
    removePane(name) {
      const idx = this.panes.findIndex(p => p.name === name)
      if (idx > -1) {
        this.panes.splice(idx, 1)
        this.$nextTick(() => this.$forceUpdate())
      }
    },
    collectPanes() {
      this.panes = []
      this.$children.forEach(child => {
        if (child.$options.name === 'XtTabPane') {
          this.addPane({
            name: child.name,
            label: child.label,
            disabled: child.disabled,
            closable: child.closable
          })
        }
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.collectPanes()
      this.$watch(() => this.$children, () => {
        this.collectPanes()
      }, { flush: 'post' })
    })
  }
}
</script>