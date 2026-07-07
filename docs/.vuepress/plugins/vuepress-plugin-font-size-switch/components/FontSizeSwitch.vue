<template>
  <div class="xt-font-size-switch">
    <button 
      class="font-size-trigger"
      @click="toggleDropdown"
      :title="`当前字体: ${currentSizeLabel}`"
    >
      <svg class="font-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M5 4h14l1 12H4L5 4z"/>
        <polyline points="12 6 12 12 15 15"/>
      </svg>
      <span class="font-size-current">{{ currentSizeLabel }}</span>
      <svg class="arrow-icon" :class="{ open: isOpen }" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </button>
    
    <div v-show="isOpen" class="font-size-dropdown">
      <button 
        v-for="size in sizes" 
        :key="size.value"
        :class="['dropdown-item', { active: currentSize === size.value }]"
        @click="selectSize(size.value)"
      >
        <span class="size-label">{{ size.label }}</span>
        <svg v-if="currentSize === size.value" class="check-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </button>
    </div>
  </div>
</template>

<script>
const opts = FONT_SIZE_OPTIONS || {
  defaultSize: 'small',
  sizes: ['small', 'medium', 'large'],
  sizeLabels: {
    small: '小号',
    medium: '中号',
    large: '大号'
  }
}

export default {
  name: 'FontSizeSwitch',
  data() {
    return {
      isOpen: false,
      currentSize: opts.defaultSize,
      sizes: opts.sizes.map(s => ({
        value: s,
        label: opts.sizeLabels[s] || s
      }))
    }
  },
  computed: {
    currentSizeLabel() {
      const size = this.sizes.find(s => s.value === this.currentSize)
      return size ? size.label : '中号'
    }
  },
  mounted() {
    this.loadSize()
    document.addEventListener('click', this.handleOutsideClick)
    window.addEventListener('xt-font-size-change', this.handleSizeChange)
    
    this.$nextTick(() => {
      this.injectIntoNavbar()
    })
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleOutsideClick)
    window.removeEventListener('xt-font-size-change', this.handleSizeChange)
  },
  methods: {
    loadSize() {
      const saved = localStorage.getItem('xt-font-size')
      const validSizes = opts.sizes
      if (saved && validSizes.includes(saved)) {
        this.currentSize = saved
      }
    },
    saveSize(size) {
      localStorage.setItem('xt-font-size', size)
      document.documentElement.setAttribute('data-size', size)
      
      const sizeMap = {
        small: '12px',
        medium: '14px',
        large: '16px'
      }
      document.documentElement.style.setProperty('--xt-font-size-base', sizeMap[size] || sizeMap.small)
      
      window.dispatchEvent(new CustomEvent('xt-font-size-change', { detail: size }))
    },
    toggleDropdown(e) {
      e.stopPropagation()
      this.isOpen = !this.isOpen
    },
    selectSize(size) {
      this.currentSize = size
      this.saveSize(size)
      this.isOpen = false
    },
    handleOutsideClick(e) {
      const container = document.querySelector('.xt-font-size-switch')
      if (container && !container.contains(e.target)) {
        this.isOpen = false
      }
    },
    handleSizeChange(e) {
      this.currentSize = e.detail
    },
    injectIntoNavbar() {
      const navbar = document.querySelector('.reco-navbar') || 
                    document.querySelector('nav.navbar') ||
                    document.querySelector('.navbar')

      if (!navbar) return

      let navbarRight = navbar.querySelector('.links')

      if (!navbarRight) {
        navbarRight = document.createElement('div')
        navbarRight.className = 'navbar-right'
        navbarRight.style.cssText = 'display: flex; align-items: center; margin-left: auto;'
        navbar.appendChild(navbarRight)
      }

      const existingSwitch = document.querySelector('.xt-font-size-switch')
      if (existingSwitch) {
        existingSwitch.parentNode.removeChild(existingSwitch)
      }

      const mountPoint = document.createElement('div')
      navbarRight.appendChild(mountPoint)

      const Vue = require('vue').default
      const FontSizeSwitchComponent = require('./FontSizeSwitch.vue').default
      new Vue({
        render: h => h(FontSizeSwitchComponent)
      }).$mount(mountPoint)
    }
  }
}
</script>

<style scoped>
.xt-font-size-switch {
  position: relative;
  display: inline-flex;
  align-items: center;
  padding: 0 8px;
}

.font-size-trigger {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.font-size-trigger:hover {
  color: #1890ff;
}

.font-icon {
  width: 16px;
  height: 16px;
}

.font-size-current {
  min-width: 40px;
  text-align: center;
}

.arrow-icon {
  width: 14px;
  height: 14px;
  transition: transform 0.2s ease;
}

.arrow-icon.open {
  transform: rotate(180deg);
}

.font-size-dropdown {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  padding: 4px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  min-width: 120px;
  z-index: 9999;
}

.dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px 14px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: #333;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.dropdown-item:hover {
  background: #e6f7ff;
  color: #1890ff;
}

.dropdown-item.active {
  background: #1890ff;
  color: #fff;
}

.size-label {
  flex: 1;
}

.check-icon {
  width: 14px;
  height: 14px;
}

.theme-dark .font-size-trigger {
  color: #aaa;
}

.theme-dark .font-size-trigger:hover {
  color: #40a9ff;
}

.theme-dark .font-size-dropdown {
  background: #2a2a2a;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.theme-dark .dropdown-item {
  color: #aaa;
}

.theme-dark .dropdown-item:hover {
  background: rgba(64, 169, 255, 0.2);
  color: #40a9ff;
}

.theme-dark .dropdown-item.active {
  background: #1890ff;
  color: #fff;
}
</style>
