<template>
  <el-button 
    class="ex-button" 
    :class="buttonClasses"
    v-bind="$attrs" 
    @click="handleClick"
  >
    <slot></slot>
  </el-button>
</template>
<script>
export default {
  name: 'XtButton',
  inheritAttrs: false,
  inject: {
    xtConfig: {
      default: () => ({
        theme: 'light',
        size: 'medium',
        primaryColor: '#1890ff'
      })
    }
  },
  props: {
    type: {
      type: String,
      default: 'default',
      validator: (val) => ['default', 'primary', 'success', 'warning', 'danger'].includes(val)
    },
    throttle: {
      type: Number,
      default: 0
    },
    size: {
      type: String,
      default: null,
      validator: (val) => !val || ['mini', 'small', 'medium', 'large'].includes(val)
    }
  },
  data() {
    return {
      lastClickTime: 0
    }
  },
  computed: {
    finalSize() {
      // 优先使用组件自身的 size，其次继承 XtConfigProvider 的 size，最后使用默认值
      return this.size || this.xtConfig.size || 'medium'
    },
    buttonClasses() {
      return [
        `ex-button-${this.finalSize}`,
        `ex-button-${this.type}`
      ]
    }
  },
  methods: {
    handleClick() {
      if (this.throttle > 0 && Date.now() - this.lastClickTime < this.throttle) {
        return
      }
      this.lastClickTime = Date.now()
      this.$emit('click')
    }
  }
}
</script>