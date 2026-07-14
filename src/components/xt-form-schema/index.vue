<template>
  <div class="xt-form-schema">
    <div v-if="showSearchTags" class="search-tags">
      <span class="tags-title">已检索：</span>
      <el-tag
        v-for="(tag, key) in activeSearchTags"
        :key="key"
        closable
        size="small"
        @close="handleRemoveTag(key)"
      >
        {{ tag.label }}: {{ tag.value }}
      </el-tag>
      <span v-if="activeSearchTagsCount === 0" class="no-tags">暂无检索条件</span>
    </div>

    <el-dialog
      v-if="mode === 'dialog'"
      :title="title"
      :visible.sync="visible"
      :width="width"
      :before-close="handleCancel"
      class="xt-form-schema-dialog"
      append-to-body
      modal-append-to-body
    >
      <el-form :model="formData" :inline="false" label-width="120px">
        <el-form-item :label="field.label" :prop="field.prop" :key="field.prop" v-for="field in schema">
          <component v-if="!field.isSlot" :is="getFieldComponent(field)" v-bind="getFieldProps(field)" />
          <slot v-else :name="field.prop" :field="field">
          </slot>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </div>
    </el-dialog>

    <el-drawer
      v-if="mode === 'drawer'"
      :title="title"
      :visible.sync="visible"
      :direction="direction"
      :size="width"
      :before-close="handleCancel"
      class="xt-form-schema-drawer"
      append-to-body
      modal-append-to-body
    >
      <el-form :model="formData" :inline="false" label-width="120px">
        <el-form-item :label="field.label" :prop="field.prop" v-for="field in schema" :key="field.prop">
          <component v-if="!field.isSlot" :is="getFieldComponent(field)" v-bind="getFieldProps(field)" />
          <slot v-else :name="field.prop" :field="field">
          </slot>
        </el-form-item>
      </el-form>
      <div class="drawer-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: 'XtFormSchema',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
      default: () => ({})
    },
    schema: {
      type: Array,
      default: () => []
    },
    mode: {
      type: String,
      default: 'dialog',
      validator: (val) => ['dialog', 'drawer'].includes(val)
    },
    title: {
      type: String,
      default: '高级搜索'
    },
    width: {
      type: [String, Number],
      default: '500px'
    },
    direction: {
      type: String,
      default: 'rtl',
      validator: (val) => ['ltr', 'rtl', 'ttb', 'btt'].includes(val)
    },
    showSearchTags: {
      type: Boolean,
      default: false
    },
    simpleFields: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      formData: {}
    }
  },
  computed: {
    activeSearchTags() {
      const tags = {}
      this.schema.forEach(field => {
        const value = this.formData[field.prop]
        if (value !== null && value !== undefined && value !== '' && value !== []) {
          let displayValue = value
          if (field.type === 'select' && field.options) {
            const option = field.options.find(opt => opt.value === value)
            displayValue = option ? option.label : value
          } else if (field.type === 'date' && Array.isArray(value)) {
            displayValue = value.map(v => v ? this.formatDate(v) : '').join(' - ')
          } else if (field.type === 'daterange' && Array.isArray(value)) {
            displayValue = value.map(v => v ? this.formatDate(v) : '').join(' - ')
          } else if (field.type === 'checkbox-group' && Array.isArray(value)) {
            const labels = value.map(v => {
              const option = (field.options || []).find(opt => opt.value === v)
              return option ? option.label : v
            })
            displayValue = labels.join(', ')
          }
          tags[field.prop] = {
            label: field.label,
            value: displayValue
          }
        }
      })
      return tags
    },
    activeSearchTagsCount() {
      return Object.keys(this.activeSearchTags).length
    }
  },
  watch: {
    visible: {
      immediate: true,
      handler(val) {
        if (val) {
          this.initFormData()
        }
      }
    },
    value: {
      deep: true,
      handler(val) {
        if (val && this.visible) {
          this.formData = { ...val }
        }
      }
    }
  },
  methods: {
    initFormData() {
      const data = {}
      this.schema.forEach(field => {
        data[field.prop] = this.value[field.prop] !== undefined ? this.value[field.prop] : (field.defaultValue !== undefined ? field.defaultValue : '')
      })
      this.formData = data
    },
    getFieldComponent(field) {
      const componentMap = {
        input: 'el-input',
        textarea: 'el-input',
        select: 'el-select',
        checkbox: 'el-checkbox',
        'checkbox-group': 'el-checkbox-group',
        radio: 'el-radio',
        'radio-group': 'el-radio-group',
        'date': 'el-date-picker',
        daterange: 'el-date-picker',
        datetime: 'el-date-picker',
        'datetime-range': 'el-date-picker',
        number: 'el-input-number',
        switch: 'el-switch'
      }
      return componentMap[field.type] || 'el-input'
    },
    getFieldProps(field) {
      const props = {
        value: this.formData[field.prop],
        placeholder: field.placeholder || `请输入${field.label}`
      }

      if (field.type === 'textarea') {
        props.type = 'textarea'
        props.rows = field.rows || 3
      }

      if (field.type === 'select') {
        props.filterable = field.filterable || false
        props.multiple = field.multiple || false
      }

      if (field.type === 'date') {
        props.type = field.dateType || 'date'
        props.format = field.format || 'yyyy-MM-dd'
        props['value-format'] = field.valueFormat || 'yyyy-MM-dd'
      }

      if (field.type === 'daterange') {
        props.type = 'daterange'
        props.format = field.format || 'yyyy-MM-dd'
        props['value-format'] = field.valueFormat || 'yyyy-MM-dd'
      }

      if (field.type === 'datetime') {
        props.type = 'datetime'
        props.format = field.format || 'yyyy-MM-dd HH:mm:ss'
        props['value-format'] = field.valueFormat || 'yyyy-MM-dd HH:mm:ss'
      }

      if (field.type === 'datetime-range') {
        props.type = 'datetimerange'
        props.format = field.format || 'yyyy-MM-dd HH:mm:ss'
        props['value-format'] = field.valueFormat || 'yyyy-MM-dd HH:mm:ss'
      }

      if (field.type === 'number') {
        props.min = field.min
        props.max = field.max
        props.step = field.step || 1
      }

      if (field.type === 'checkbox-group' || field.type === 'radio-group') {
        props.options = field.options || []
      }

      if (field.disabled !== undefined) {
        props.disabled = field.disabled
      }

      if (field.size !== undefined) {
        props.size = field.size
      }

      props['on:input'] = (val) => this.handleFieldChange(field.prop, val)
      props['on:change'] = (val) => this.handleFieldChange(field.prop, val)

      return props
    },
    handleFieldChange(prop, val) {
      this.formData[prop] = val
      this.$emit('input', { ...this.formData })
      this.$emit('change', { prop, value: val })
    },
    handleRemoveTag(prop) {
      this.formData[prop] = ''
      this.$emit('input', { ...this.formData })
      this.$emit('change', { prop, value: '' })
    },
    handleConfirm() {
      this.$emit('confirm', { ...this.formData })
      this.$emit('input', { ...this.formData })
      this.$emit('update:visible', false)
    },
    handleCancel() {
      this.$emit('cancel')
      this.$emit('update:visible', false)
    },
    formatDate(date) {
      if (!date) return ''
      const d = new Date(date)
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },
    resetFields() {
      this.initFormData()
      this.schema.forEach(field => {
        this.formData[field.prop] = field.defaultValue !== undefined ? field.defaultValue : ''
      })
      this.$emit('input', { ...this.formData })
    }
  }
}
</script>

<style lang="scss" scoped>
.xt-form-schema {
  .search-tags {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    padding: 8px 12px;
    background: #f5f7fa;
    border-radius: 4px;
    margin-bottom: 12px;

    .tags-title {
      font-size: 14px;
      color: #606266;
      margin-right: 8px;
      flex-shrink: 0;
    }

    .el-tag {
      margin: 4px;
      cursor: pointer;
    }

    .no-tags {
      font-size: 14px;
      color: #c0c4cc;
    }
  }

  .dialog-footer,
  .drawer-footer {
    text-align: right;
    padding-top: 16px;
    border-top: 1px solid #ebeef5;
  }
}
</style>