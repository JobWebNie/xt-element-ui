<template>
  <button
    class="xt-button"
    :class="[
      type ? 'xt-button--' + type : '',
      size ? 'xt-button--' + size : '',
      {
        'is-plain': plain,
        'is-disabled': disabled,
        'is-round': round,
        'is-circle': circle,
        'is-dashed': dashed,
        'is-text': text,
        'is-link': link,
        'is-loading': loading
      }
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <i v-if="loading" class="el-icon-loading"></i>
    <i v-else-if="icon" :class="iconClass"></i>
    <span v-if="$slots.default" class="xt-button__inner">
      <slot></slot>
    </span>
  </button>
</template>

<script>
export default {
  name: 'XtButton',
  props: {
    type: {
      type: String,
      default: '',
      validator: (val) => ['', 'primary', 'success', 'warning', 'danger', 'info'].includes(val)
    },
    size: {
      type: String,
      default: '',
      validator: (val) => ['', 'large', 'medium', 'small'].includes(val)
    },
    plain: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    round: {
      type: Boolean,
      default: false
    },
    circle: {
      type: Boolean,
      default: false
    },
    dashed: {
      type: Boolean,
      default: false
    },
    text: {
      type: Boolean,
      default: false
    },
    link: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String,
      default: ''
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    iconClass() {
      if (!this.icon) return ''
      if (this.icon.indexOf('el-icon') === 0) {
        return this.icon
      }
      return 'el-icon-' + this.icon
    }
  },
  methods: {
    handleClick() {
      if (!this.disabled && !this.loading) {
        this.$emit('click')
      }
    }
  }
}
</script>
