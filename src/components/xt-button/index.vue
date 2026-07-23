<template>
  <el-button 
    class="xt-button" 
    :class="buttonClasses"
    v-bind="$attrs"
    :type="type"
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
        theme: undefined,
        size: undefined,
        primaryColor: undefined
      })
    }
  },
  props: {
    type: {
      type: String,
      default: '',
      validator: (val) => ['', 'primary', 'success', 'warning', 'danger'].includes(val)
    },
    throttle: {
      type: Number,
      default: 0
    },
    size: {
      type: String,
      default: null,
      validator: (val) => !val || ['mini', 'small', 'medium', 'large'].includes(val)
    },
    square: {
      type: Boolean,
      default: false
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
        `xt-button-${this.finalSize}`,
        `xt-button-${this.type}`,
        this.square ? 'is-square' : ''
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