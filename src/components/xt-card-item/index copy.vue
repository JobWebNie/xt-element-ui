<template>
  <FlexBox 
    v-if="iconType=='border'" 
    class="xt-card-item is-border" 
    :class="[iconType=='border'?`is-${type}`:'']" 
    :style="cardItemStyle" 
    content="between"
  >
    <span class="item__label" v-if="title">
      <slot name="label">{{ label }}</slot>
    </span>
    <span class="item__value">
      <slot name="value">{{ value }}</slot>
    </span>
    <span class="item__unit">
      <slot name="unit">{{ unit }}</slot>
    </span>
  </FlexBox>
  <FlexBox 
    v-else 
    class="xt-card-item" 
    :direction="direction" 
    :content="contentAlign"
  >
    <slot name="icon">
      <el-button :type="type" :circle="circle" :round="round" plain :icon="icon"></el-button>
    </slot>
    <div class="item__value">
      <span class="value" :style="valueStyle">
        <slot name="value">{{ label }}</slot>
      </span>
      <div class="unit">{{ value }}</div>
    </div>
  </FlexBox>
</template>
<script>
import FlexBox from '../xt-flex-box/index.vue'
export default {
  name: "XtCardItem",
  components: {
    FlexBox
  },
  props: {
    iconType: { default: "border" },
    type: { default: "primary" },
    label: {},
    value: {},
    unit: {},
    icon: {},
    iconAt: { default: "right" },
    color: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      circle: false,
      round: false
    }
  },
  computed: {
    contentAlign() {
      return this.iconAt == 'center' ? 'center' : 'start'
    },
    direction() {
      const iconAtMap = {
        left: 'row',
        right: 'row-reverse',
        top: 'column',
        bottom: 'column-reverse'
      }
      return iconAtMap[this.iconAt]
    },
    cardItemStyle() {
      if (this.iconType === 'border' && this.type === 'primary' && this.color) {
        return {
          '--xt-card-item-color': this.color
        }
      }
      return {}
    },
    valueStyle() {
      if (this.iconType !== 'border' && this.type === 'primary' && this.color) {
        return {
          color: this.color
        }
      }
      return {}
    }
  }
}
</script>