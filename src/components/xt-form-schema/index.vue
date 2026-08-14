<template>
  <div class="xt-form-schema">
    <!-- 已选检索标签 -->
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

    <!-- Dialog弹窗模式 -->
    <el-dialog
      v-if="mode === 'dialog'"
      :title="title"
      :visible.sync="visible"
      :width="width"
      :before-close="handleCancel"
      class="xt-form-schema-dialog"
      append-to-body
    >
      <el-form :model="formData" :inline="false" label-width="120px">
        <el-form-item
          :label="field.label"
          :prop="field.prop"
          :key="field.prop"
          v-for="field in schema"
        >
          <!-- 渲染内置组件 -->
          <template v-if="!field.isSlot">
            <component
              :is="getFieldComponent(field)"
              v-bind="getFieldProps(field)"
            >
              <!-- select 下拉选项统一渲染 -->
              <template v-if="['select','checkbox-group','radio-group'].includes(field.type)">
                <el-option
                  v-for="opt in getFieldOptions(field)"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                />
              </template>
            </component>
          </template>
          <!-- 自定义插槽 -->
          <slot v-else :name="field.prop" :field="field" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </div>
    </el-dialog>

    <!-- Drawer抽屉模式 -->
    <el-drawer
      v-if="mode === 'drawer'"
      :title="title"
      :visible.sync="visible"
      :direction="direction"
      :size="width"
      :before-close="handleCancel"
      class="xt-form-schema-drawer"
      append-to-body
    >
      <el-form :model="formData" :inline="false" label-width="120px">
        <el-form-item
          :label="field.label"
          :prop="field.prop"
          v-for="field in schema"
          :key="field.prop"
        >
          <template v-if="!field.isSlot">
            <component
              :is="getFieldComponent(field)"
              v-bind="getFieldProps(field)"
            >
              <template v-if="['select','checkbox-group','radio-group'].includes(field.type)">
                <el-option
                  v-for="opt in getFieldOptions(field)"
                  :key="opt.value"
                  :label="opt.label"
                  :value="opt.value"
                />
              </template>
            </component>
          </template>
          <slot v-else :name="field.prop" :field="field" />
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
    // 全局下拉字典池（核心新增）
    optionMap: {
      type: Object,
      default: () => ({})
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
      formData: {},
      // 缓存schema内部loadOptions异步加载的下拉数据
      asyncOptionCache: {}
    }
  },
  computed: {
    activeSearchTags() {
      const tags = {}
      this.schema.forEach(field => {
        const value = this.formData[field.prop]
        if ([null, undefined, '', []].includes(value)) return

        let displayValue = value
        const options = this.getFieldOptions(field)

        // select 单选
        if (field.type === 'select' && !field.multiple) {
          const opt = options.find(o => o.value === value)
          displayValue = opt ? opt.label : value
        }
        // 多选框组
        else if (field.type === 'checkbox-group' && Array.isArray(value)) {
          const labels = value.map(v => {
            const opt = options.find(o => o.value === v)
            return opt ? opt.label : v
          })
          displayValue = labels.join(', ')
        }
        // 日期区间格式化
        else if (['date', 'daterange', 'datetime', 'datetime-range'].includes(field.type) && Array.isArray(value)) {
          displayValue = value.map(v => v ? this.formatDate(v) : '').join(' - ')
        }

        tags[field.prop] = {
          label: field.label,
          value: displayValue
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
          this.loadAllAsyncOptions()
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
    },
    schema: {
      deep: true,
      handler() {
        this.loadAllAsyncOptions()
      }
    },
    optionMap: {
      deep: true,
      handler() {
        this.$forceUpdate()
      }
    }
  },
  methods: {
    // 初始化表单默认值
    initFormData() {
      const data = {}
      this.schema.forEach(field => {
        data[field.prop] = this.value[field.prop] !== undefined
          ? this.value[field.prop]
          : (field.defaultValue !== undefined ? field.defaultValue : '')
      })
      this.formData = data
    },

    // 加载schema中loadOptions异步下拉
    async loadAllAsyncOptions() {
      for (const field of this.schema) {
        if (['select', 'checkbox-group', 'radio-group'].includes(field.type)
          && typeof field.loadOptions === 'function') {
          try {
            const list = await field.loadOptions()
            this.$set(this.asyncOptionCache, field.prop, list)
          } catch (err) {
            console.error(`字段${field.prop}异步下拉加载失败`, err)
            this.$set(this.asyncOptionCache, field.prop, [])
          }
        }
      }
    },

    // 核心：统一获取标准化下拉选项（兼容optionKey/loadOptions/labelKey映射）
    getFieldOptions(field) {
      let rawList = []
      // 1. 优先取schema内部异步加载数据
      if (this.asyncOptionCache[field.prop]) {
        rawList = this.asyncOptionCache[field.prop]
      }
      // 2. 读取全局optionMap字典
      else if (field.optionKey && this.optionMap[field.optionKey]) {
        rawList = this.optionMap[field.optionKey]
      }
      // 3. 兜底schema内硬编码options
      else {
        rawList = field.options || []
      }

      // 后端字段自动映射 labelKey / valueKey
      const labelKey = field.labelKey || 'label'
      const valueKey = field.valueKey || 'value'
      return rawList.map(item => ({
        label: item[labelKey] != null ? item[labelKey] : '',
        value: item[valueKey]
      }))
    },

    // 获取组件名称映射
    getFieldComponent(field) {
      const componentMap = {
        input: 'el-input',
        textarea: 'el-input',
        select: 'el-select',
        checkbox: 'el-checkbox',
        'checkbox-group': 'el-checkbox-group',
        radio: 'el-radio',
        'radio-group': 'el-radio-group',
        date: 'el-date-picker',
        daterange: 'el-date-picker',
        datetime: 'el-date-picker',
        'datetime-range': 'el-date-picker',
        number: 'el-input-number',
        switch: 'el-switch'
      }
      return componentMap[field.type] || 'el-input'
    },

    // 生成组件绑定属性
    getFieldProps(field) {
      const props = {
        value: this.formData[field.prop],
        placeholder: field.placeholder || `请输入${field.label}`
      }

      // 文本域
      if (field.type === 'textarea') {
        props.type = 'textarea'
        props.rows = field.rows || 3
      }

      // select下拉基础属性
      if (field.type === 'select') {
        props.filterable = field.filterable || false
        props.multiple = field.multiple || false
        props.clearable = field.clearable != null ? field.clearable : true
      }

      // 日期选择器
      if (['date', 'daterange', 'datetime', 'datetime-range'].includes(field.type)) {
        const typeMap = {
          date: 'date',
          daterange: 'daterange',
          datetime: 'datetime',
          'datetime-range': 'datetimerange'
        }
        props.type = typeMap[field.type]
        props.format = field.format || 'yyyy-MM-dd'
        props['value-format'] = field.valueFormat || 'yyyy-MM-dd'
      }

      // 数字输入框
      if (field.type === 'number') {
        props.min = field.min
        props.max = field.max
        props.step = field.step || 1
      }

      // 禁用、尺寸
      if (field.disabled !== undefined) props.disabled = field.disabled
      if (field.size !== undefined) props.size = field.size

      // 双向绑定事件
      props['on:input'] = (val) => this.handleFieldChange(field, val)
      props['on:change'] = (val) => this.handleFieldChange(field, val)

      return props
    },

    // 字段值变更（支持级联联动回调）
    handleFieldChange(field, val) {
      this.formData[field.prop] = val
      this.$emit('input', { ...this.formData })
      this.$emit('change', { prop: field.prop, value: val, form: this.formData })

      // 执行schema自定义change回调，实现级联下拉刷新
      if (typeof field.change === 'function') {
        field.change(val, this.formData)
      }
    },

    // 删除检索标签
    handleRemoveTag(prop) {
      this.formData[prop] = ''
      this.$emit('input', { ...this.formData })
      this.$emit('change', { prop, value: '' })
    },

    // 确认搜索
    handleConfirm() {
      this.$emit('confirm', { ...this.formData })
      this.$emit('input', { ...this.formData })
      this.$emit('update:visible', false)
    },

    // 关闭弹窗
    handleCancel() {
      this.$emit('cancel')
      this.$emit('update:visible', false)
    },

    // 日期格式化工具
    formatDate(date) {
      if (!date) return ''
      const d = new Date(date)
      const year = d.getFullYear()
      const month = String(d.getMonth() + 1).padStart(2, '0')
      const day = String(d.getDate()).padStart(2, '0')
      return `${year}-${month}-${day}`
    },

    // 重置所有筛选条件
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
