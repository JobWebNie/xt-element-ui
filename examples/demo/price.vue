<template>
  <el-form :model="form" :rules="rules" ref="formRef">
  <el-form-item label="阶梯价格" prop="stepPrice">
    {{ form.stepPrice }}
    <xt-step-price ref="stepPrice" :step="100" :limit="3" title=" " v-model="form.stepPrice" />
  </el-form-item>
</el-form>
</template>

<script>
export default {
  data() {
    return {
      form: { stepPrice: [] },
      rules: {
        stepPrice: [{
          required: true,
          validator: (rule, value, callback) => {
            const comp = this.$refs.stepPrice
            if (comp && comp.validate) {
              comp.validate((valid, errors) => {
                callback(valid ? undefined : new Error(errors[0].message))
              })
            } else {
              callback()
            }
          },
          trigger: ['blur', 'change']
        }]
      }
    }
  }
}
</script>