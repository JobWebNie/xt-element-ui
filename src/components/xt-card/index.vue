<template>
  <div class="xt-card" :class="{'no-padding': noPadding }">
    <div class="card__header" v-if="title">
      <slot name="icon">{{ icon }}</slot>
      <slot name="title">{{ title }}</slot>
    </div>
    <div class="card__body">
      <slot>
        <span class="value"><slot name="value">{{ value }}</slot></span>
        <span class="unit">{{ unit }}</span>
      </slot>
    </div>
  </div>
</template>
<script>
export default {
  name: "XtCard",
  props: {
    type: {},
    title: {},
    value: {},
    unit: {},
    icon: {},
    iconIn: { default: "right" },
    noPadding: { type: Boolean, default: false }
  }
}
</script>