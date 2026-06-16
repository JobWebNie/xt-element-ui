<template>
  <span>
    <slot>
    </slot>
    <slot v-if="open" name="open">
    </slot>
    <slot name="suffix">
    </slot>
    <component :is="elTag" v-if="$slots.open" :type="buttonType" plain @click="handleToggle()" style="margin: 0px 0px 18px 10px">
      <i :class="open?'el-icon-arrow-up':'el-icon-arrow-down'"></i>
      {{ open?"收 起": moreText }}
    </component>
  </span>
</template>
<script>
export default {
  name: "BaseCollapse",
  props: {
    defaultOpen: {
      type: Boolean,
      default: false
    },
    moreText: {
      type: String,
      default: "展 开"
    },
    buttonType: {
      type: String,
      default: "primary"
    },
    elTag: {
      type: String,
      default: "elButton" // 支持el标签 及html标签
    }
  },
  data() {
    return {
      open: this.defaultOpen || false
    };
  },
  methods: {
    handleToggle() {
      this.open = !this.open;
      this.$emit("change", this.open);
    }
  }
};
</script>
