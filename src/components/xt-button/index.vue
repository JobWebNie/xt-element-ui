<template>
  <button 
    class="xt-button"
    :class="[
      type ?'xt-button--' + type: '', 
      size ? 'xt-button--' + size : '',
      {
        'is-plain': plain, 
        'is-disabled': disabled,
        'is-round': round
      }
    ]"  
    :disabled="disabled"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>
<script>
export default {
  name: 'XtButton',
  props: {
    type: {
      type: String,
      default: '',
      validator: (val) => ['', 'primary', 'success', 'warning', 'danger'].includes(val)
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
    }
  },
  methods: {
    handleClick() {
      if (!this.disabled) {
        this.$emit('click')
      }
    }
  }
}
</script>