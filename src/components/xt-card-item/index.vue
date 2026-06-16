<template>
    <ex-card class="xt-card-item" :bordered="false" :class="{ [`is-${type}`]: type ? true : false}">
        <xt-text bold size="medium">{{ title }}</xt-text>
        <xt-flex-box>
          <div style="width: 50%;margin-bottom: 5px;">
            <xt-text bold size="large" v-model="value" format="thousand" :type="type" :decimals="0"></xt-text>
            <div style="margin: 5px 0;">
              <xt-text size="small">较昨日</xt-text>
              <xt-text v-model="change" format="normal" :type="diff > 0 ? 'success' : 'danger'" :suffix="diff > 0 ? '↑' : '↓'"></xt-text> 
            </div>
          </div>
          <div style="flex: 1; height: 100%;">
            <xt-text size="extra-large" :type="type"><i class="el-icon-user"></i></xt-text>
          </div>
        </xt-flex-box>
      </ex-card>
</template>
<script>
export default {
    name: "XtCardItem",
    props: {
        type: { type: String, default: "primary" },
        title: { type: String, default: '' },
        diff: { type: Number, default: 0 },
        value: { type: Number, default: 0 },
        change: { type: Number, default: 0 },
    },
    data() {
        return {
        }
    }
}
</script>