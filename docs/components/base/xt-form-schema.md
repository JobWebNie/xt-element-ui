## XtFormSchema 表单配置化搜索组件

用于解决大量检索条件场景下的表单使用，支持使用抽屉或对话框显示高级搜索表单，自动展示已检索标签。

## 基本用法

::: demo 基本用法（抽屉模式）
```vue
<template>
  <div>
    <XtButton type="primary" @click="showForm = true">高级搜索</XtButton>
    <XtFormSchema
      v-model="searchForm"
      :visible.sync="showForm"
      :schema="schema"
      mode="drawer"
      title="高级搜索"
      @confirm="handleConfirm"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      showForm: false,
      searchForm: {},
      schema: [
        {
          prop: 'name',
          label: '姓名',
          type: 'input',
          placeholder: '请输入姓名'
        },
        {
          prop: 'gender',
          label: '性别',
          type: 'select',
          options: [
            { value: 'male', label: '男' },
            { value: 'female', label: '女' }
          ]
        },
        {
          prop: 'dateRange',
          label: '时间范围',
          type: 'daterange'
        }
      ]
    }
  },
  methods: {
    handleConfirm(formData) {
      console.log('搜索条件:', formData)
    }
  }
}
</script>
```
:::

## 属性说明

| 属性 | 类型 | 默认值 | 可选值 | 说明 |
|------|------|--------|--------|------|
| `value / v-model` | Object | {} | - | 表单数据对象 |
| `visible` | Boolean | false | - | 是否显示弹窗/抽屉 |
| `schema` | Array | [] | - | 表单字段配置数组 |
| `mode` | String | drawer | `dialog`、`drawer` | 展示模式：对话框或抽屉 |
| `title` | String | 高级搜索 | - | 弹窗/抽屉标题 |
| `width` | String / Number | 500px | - | 弹窗/抽屉宽度 |
| `direction` | String | rtl | `ltr`、`rtl`、`ttb`、`btt` | 抽屉弹出方向 |
| `showSearchTags` | Boolean | true | - | 是否显示已检索标签 |
| `simpleFields` | Array | [] | - | 页面上简单展示的字段 |

## schema 字段配置说明

| 属性 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `prop` | String | 是 | 字段名，对应表单数据的 key |
| `label` | String | 是 | 字段标签 |
| `type` | String | 是 | 字段类型，见下表 |
| `placeholder` | String | 否 | 占位提示 |
| `defaultValue` | Any | 否 | 默认值 |
| `options` | Array | 否 | 下拉选项，用于 select/radio-group/checkbox-group |
| `disabled` | Boolean | 否 | 是否禁用 |
| `size` | String | 否 | 字段尺寸 |
| `filterable` | Boolean | 否 | 是否可搜索（select） |
| `multiple` | Boolean | 否 | 是否多选（select） |
| `format` | String | 否 | 日期格式化（date-picker） |
| `valueFormat` | String | 否 | 日期值格式（date-picker） |
| `dateType` | String | 否 | 日期类型（date-picker） |
| `min` | Number | 否 | 最小值（number） |
| `max` | Number | 否 | 最大值（number） |
| `step` | Number | 否 | 步长（number） |
| `rows` | Number | 否 | 行数（textarea） |

## 支持的字段类型

| 类型 | 说明 | 对应 Element 组件 |
|------|------|-------------------|
| `input` | 文本输入 | el-input |
| `textarea` | 多行文本 | el-input(type="textarea") |
| `select` | 下拉选择 | el-select |
| `checkbox` | 单选框 | el-checkbox |
| `checkbox-group` | 多选框组 | el-checkbox-group |
| `radio` | 单选按钮 | el-radio |
| `radio-group` | 单选按钮组 | el-radio-group |
| `date` | 日期选择 | el-date-picker |
| `daterange` | 日期范围 | el-date-picker(type="daterange") |
| `datetime` | 日期时间 | el-date-picker(type="datetime") |
| `datetime-range` | 日期时间范围 | el-date-picker(type="datetimerange") |
| `number` | 数字输入 | el-input-number |
| `switch` | 开关 | el-switch |

## 事件说明

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `input` | `formData` | 表单数据变化时触发 |
| `change` | `{ prop, value }` | 单个字段值变化时触发 |
| `confirm` | `formData` | 点击确认按钮时触发 |
| `cancel` | - | 点击取消按钮或关闭时触发 |

## 方法说明

| 方法名 | 参数 | 说明 |
|--------|------|------|
| `resetFields` | - | 重置表单到默认值 |

## 示例

### 对话框模式

::: demo 对话框模式
```vue
<template>
  <div>
    <XtButton type="primary" @click="showForm = true">高级搜索（对话框）</XtButton>
    <XtFormSchema
      v-model="searchForm"
      :visible.sync="showForm"
      :schema="schema"
      mode="dialog"
      width="600px"
      title="高级搜索"
      @confirm="handleConfirm"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      showForm: false,
      searchForm: {},
      schema: [
        {
          prop: 'name',
          label: '姓名',
          type: 'input',
          placeholder: '请输入姓名'
        },
        {
          prop: 'status',
          label: '状态',
          type: 'select',
          options: [
            { value: 'active', label: '活跃' },
            { value: 'inactive', label: '不活跃' },
            { value: 'pending', label: '待审核' }
          ],
          filterable: true
        }
      ]
    }
  },
  methods: {
    handleConfirm(formData) {
      console.log('搜索条件:', formData)
    }
  }
}
</script>
```
:::

### 包含日期范围和多选框

::: demo 包含日期范围和多选框
```vue
<template>
  <div>
    <XtButton type="primary" @click="showForm = true">高级搜索</XtButton>
    <XtFormSchema
      v-model="searchForm"
      :visible.sync="showForm"
      :schema="schema"
      @confirm="handleConfirm"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      showForm: false,
      searchForm: {},
      schema: [
        {
          prop: 'keywords',
          label: '关键词',
          type: 'input',
          placeholder: '请输入关键词'
        },
        {
          prop: 'type',
          label: '类型',
          type: 'checkbox-group',
          options: [
            { value: 'article', label: '文章' },
            { value: 'video', label: '视频' },
            { value: 'image', label: '图片' }
          ]
        },
        {
          prop: 'dateRange',
          label: '发布时间',
          type: 'daterange',
          format: 'yyyy-MM-dd'
        }
      ]
    }
  },
  methods: {
    handleConfirm(formData) {
      console.log('搜索条件:', formData)
    }
  }
}
</script>
```
:::

### 完整搜索示例

::: demo 完整搜索示例
```vue
<template>
  <div>
    <XtFlexBox class="search-bar" style="gap: 12px; margin-bottom: 16px;">
      <XtInput v-model="searchForm.name" placeholder="姓名" style="width: 200px;" />
      <XtInput v-model="searchForm.phone" placeholder="手机号" style="width: 200px;" />
      <XtButton type="primary" @click="showForm = true">高级搜索</XtButton>
      <XtButton @click="handleReset">重置</XtButton>
    </XtFlexBox>

    <XtFormSchema
      ref="formSchema"
      v-model="searchForm"
      :visible.sync="showForm"
      :schema="schema"
      mode="drawer"
      title="高级搜索"
      @confirm="handleSearch"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      showForm: false,
      searchForm: {
        name: '',
        phone: '',
        gender: '',
        department: '',
        dateRange: [],
        status: []
      },
      schema: [
        {
          prop: 'gender',
          label: '性别',
          type: 'select',
          options: [
            { value: 'male', label: '男' },
            { value: 'female', label: '女' }
          ]
        },
        {
          prop: 'department',
          label: '部门',
          type: 'select',
          options: [
            { value: 'tech', label: '技术部' },
            { value: 'sales', label: '销售部' },
            { value: 'hr', label: '人事部' }
          ],
          filterable: true
        },
        {
          prop: 'dateRange',
          label: '入职时间',
          type: 'daterange'
        },
        {
          prop: 'status',
          label: '状态',
          type: 'checkbox-group',
          options: [
            { value: 'active', label: '在职' },
            { value: 'leave', label: '休假' },
            { value: 'resigned', label: '离职' }
          ]
        },
        {
          prop: 'score',
          label: '绩效评分',
          type: 'number',
          min: 0,
          max: 100
        }
      ]
    }
  },
  methods: {
    handleSearch(formData) {
      console.log('搜索条件:', formData)
    },
    handleReset() {
      this.searchForm = {
        name: '',
        phone: '',
        gender: '',
        department: '',
        dateRange: [],
        status: []
      }
      this.$refs.formSchema.resetFields()
    }
  }
}
</script>
```
:::

## 注意事项

1. 表单数据通过 `v-model` 双向绑定，页面上的简单搜索字段和组件内的字段会自动同步
2. `showSearchTags` 开启后，已选择的条件会自动展示为标签，点击标签右侧的关闭按钮可清除对应条件
3. `schema` 中的 `prop` 需要与 `v-model` 对象的 key 对应
4. 组件支持通过 `ref` 调用 `resetFields` 方法重置表单