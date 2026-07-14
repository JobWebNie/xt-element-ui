<template>
  <div class="xt-flex-box" :class="classAttrs" :style="flexStyle">
    <slot></slot>
  </div>
</template>

<script>
export default {
    name: "XtFlexBox",
    props: {
        type: { type: String, default: "flex" },
        align: { type: String, default: "center" },
        content: { type: String, default: "start" },
        direction: { type: String, default: "row" },
        wrap: { type: String, default: "unset" },
        gap: { type: String, default: "" }
    },
    computed: {
        classAttrs(){
            const { type, align, wrap, direction, content } = this;
            return [`${type}`, `align-${align}`, `content-${content}`, `direction-${direction}`, `wrap-${wrap}`]
        },
        flexStyle() {
            const result = {}
            if (this.gap) {
                result.gap = this.gap
            } else {
                result.gap = ''
            }
            return result
        }
    }
}
</script>