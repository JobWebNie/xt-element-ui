<template>
  <div class="xt-input">
    <el-input
      :value="value"
      :placeholder="placeholder"
      :style="inputStyle"
      @input="$emit('input', $event)"
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