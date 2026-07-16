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
      default: 'card',
      validator: (val) => ['default', 'card', 'border-card'].includes(val)
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

<style lang="scss" scoped>
.xt-tabs {
  display: flex;
  flex-direction: column;
  
  &--top, &--bottom {
    flex-direction: column;
    .xt-tabs__header {
      width: 100%;
    }
  }
  
  &--left, &--right {
    flex-direction: row;
    .xt-tabs__header {
      flex-direction: column;
      width: auto;
    }
    .xt-tabs__nav {
      flex-direction: column;
    }
    .xt-tabs__nav-indicator {
      width: 2px;
      height: auto;
    }
    .xt-tabs__content {
      border-left: 1px solid #dcdfe6;
      border-top: none;
    }
    &--right .xt-tabs__content {
      border-left: none;
      border-right: 1px solid #dcdfe6;
    }
  }
  
  &--top .xt-tabs__nav-indicator {
    bottom: 0;
  }
  &--bottom .xt-tabs__nav-indicator {
    top: 0;
  }
  &--left .xt-tabs__nav-indicator {
    right: 0;
  }
  &--right .xt-tabs__nav-indicator {
    left: 0;
  }
  
  &--card {
    .xt-tabs__header {
      margin-bottom: -1px;
    }
    
    .xt-tabs__nav-item {
      border: 1px solid transparent;
      border-bottom: none;
      background: #f5f7fa;
      
      &--active {
        background: #fff;
        border-color: #dcdfe6;
        border-bottom-color: #fff;
      }
    }
    &--left, &--right {
      .xt-tabs__nav-item {
        border-bottom: 1px solid transparent;
        border-right: none;
      }
      .xt-tabs__nav-item--active {
        border-right-color: #fff;
        border-bottom-color: #dcdfe6;
      }
    }
  }
  
  &--border-card {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    overflow: hidden;
    
    .xt-tabs__nav-item--active {
      background: #ecf5ff;
      color: #409eff;
    }
  }
  
  &--editable {
    .xt-tabs__close {
      display: inline-block;
    }
  }
}

.xt-tabs__header {
  position: relative;
  display: flex;
}

.xt-tabs__nav {
  display: flex;
  flex-wrap: nowrap;
}

.xt-tabs__nav-item {
  position: relative;
  padding: 12px 20px;
  cursor: pointer;
  font-size: 14px;
  color: #606266;
  transition: all 0.3s;
  white-space: nowrap;
  
  &--active {
    color: #409eff;
  }
  
  &--disabled {
    cursor: not-allowed;
    color: #c0c4cc;
  }
  
  &--add {
    color: #909399;
    font-size: 20px;
  }
  
  &:hover:not(.xt-tabs__nav-item--disabled) {
    color: #409eff;
    background-color: #ecf5ff;
  }
}

.xt-tabs__nav-link {
  display: inline-block;
}

.xt-tabs__close {
  display: none;
  margin-left: 8px;
  font-size: 16px;
  line-height: 1;
  color: #909399;
  vertical-align: middle;
  
  &:hover {
    color: #f56c6c;
  }
}

.xt-tabs__nav-indicator {
  position: absolute;
  height: 2px;
  background-color: #409eff;
}

.xt-tabs__content {
  flex: 1;
  padding: 16px;
  border-top: 1px solid #dcdfe6;
}

.xt-tabs--border-card .xt-tabs__content {
  border-top: none;
}

.xt-tabs__pane {
  min-height: 40px;
}
</style>