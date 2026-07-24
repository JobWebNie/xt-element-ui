<template>
    <xt-card class="xt-card-item" :bordered="false" :class="{ [`is-${type}`]: type ? true : false}">
        <xt-flex-box content="between">
          <div >
            <div><xt-text bold size="extra-large">{{ title }}</xt-text></div>
            <xt-text bold size="large" v-model="value" format="thousand" :type="type" :decimals="0"></xt-text>
            <div style="margin: 5px 0;">
              <xt-text size="small">较昨日</xt-text>
              <xt-text v-model="reference" format="normal" :type="diff > 0 ? 'success' : 'danger'" :suffix="diff > 0 ? '↑' : '↓'"></xt-text> 
            </div>
          </div>
          <div style="height: 100%;">
            <slot name="icon">
              <xt-text size="extra-large" :type="type"><xt-icon name="el-icon-user" :size="48" ></xt-icon></xt-text>
            </slot>
          </div>
        </xt-flex-box>
      </xt-card>
</template>
<script>
export default {
    name: "XtCardItem",
    props: {
        type: { type: String, default: "primary" },
        title: { type: String, default: '' },
        diff: { type: Number, default: 0 },
        value: { type: Number, default: 0 },
        reference: { type: Number, default: 0 },
    },
    data() {
        return {
        }
    }
}
</script>