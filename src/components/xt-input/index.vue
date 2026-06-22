<template>
  <div
    class="xt-input"
    :class="[
      size ? 'xt-input--' + size : '',
      { 'is-disabled': disabled }
    ]"
  >
    <el-input
      :value="value"
      :placeholder="placeholder"
      :type="type"
      :size="size"
      :disabled="disabled"
      :readonly="readonly"
      :style="inputStyle"
      @input="$emit('input', $event)"
      @change="$emit('change', $event)"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
    />
  </div>
</template>

<script>
export default {
  name: 'XtInput',
  props: {
    value: [String, Number],
    placeholder: {
      type: String,
      default: '请输入内容'
    },
    type: {
      type: String,
      default: 'text'
    },
    size: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: ''
    }
  },
  computed: {
    inputStyle() {
      if (this.color) {
        return {
          '--xt-input-focus-color': this.color
        }
      }
      return {}
    }
  }
}
</script>
