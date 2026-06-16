<template>
  <button 
    class="theme-switch-btn"
    @click="handleThemeSwitch"
    :title="themeTitle"
  >
    <svg 
      v-if="isLightTheme" 
      class="icon sun" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round"
    >
      <circle cx="12" cy="12" r="5"></circle>
      <line x1="12" y1="1" x2="12" y2="3"></line>
      <line x1="12" y1="21" x2="12" y2="23"></line>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
      <line x1="1" y1="12" x2="3" y2="12"></line>
      <line x1="21" y1="12" x2="23" y2="12"></line>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
    </svg>
    <svg 
      v-else 
      class="icon moon" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
    </svg>
  </button>
</template>

<script>
export default {
  name: 'ThemeSwitch',
  computed: {
    isLightTheme() {
      return this.$root.currentTheme === 'light'
    },
    themeTitle() {
      return this.isLightTheme ? '切换到暗色模式' : '切换到亮色模式'
    }
  },
  methods: {
    handleThemeSwitch() {
      this.$root.switchTheme()
    }
  }
}
</script>

<style scoped>
.theme-switch-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: var(--xt-text-color-regular, #666666);
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
}

.theme-switch-btn:hover {
  background: var(--xt-bg-color-light, #f5f5f5);
  color: var(--xt-color-primary, #1890ff);
}

.theme-switch-btn:active {
  transform: scale(0.96);
}

.icon {
  width: 20px;
  height: 20px;
  transition: all 0.3s ease;
}

.icon.sun {
  animation: pulse 2s ease-in-out infinite;
}

.icon.moon {
  animation: float 3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
}
</style>
