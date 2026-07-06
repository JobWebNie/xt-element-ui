<template>
  <el-card 
    class="xt-card" 
    :class="cardClasses"
    v-bind="$attrs"
  >
    <template #header v-if="$slots.header || title">
      <slot name="header">{{ title }}</slot>
    </template>
    <slot></slot>
  </el-card>
</template>

<script>
export default {
  name: 'XtCard',
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
    title: {
      type: String,
      default: ''
    },
    shadow: {
      type: String,
      default: 'always',
      validator: (val) => ['always', 'hover', 'never'].includes(val)
    },
    bordered: {
      type: Boolean,
      default: true
    },
    bodyClass: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: null,
      validator: (val) => !val || ['small', 'medium', 'large'].includes(val)
    }
  },
  computed: {
    finalSize() {
      // 优先使用组件自身的 size，其次继承 XtConfigProvider 的 size，最后使用默认值
      return this.size || this.xtConfig.size || 'medium'
    },
    cardClasses() {
      return [
        `xt-card-${this.shadow}`,
        `xt-card-${this.finalSize}`,
        {
          'xt-card-no-border': !this.bordered,
          [this.bodyClass]: this.bodyClass
        }
      ]
    }
  }
}
</script>
