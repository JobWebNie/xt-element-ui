# 🚀 XT-Element-UI：基于 Vue 2.7 + ElementUI 的企业级组件库

> 30+ 高质量组件，开箱即用，让你的企业级开发效率翻倍！

---

## 🔥 为什么选择 XT-Element-UI？

在日常的企业级开发中，你是否遇到过以下痛点：

- 🎨 ElementUI 原生组件样式不够精致，二次开发成本高
- 📊 图表组件与业务系统耦合度高，复用困难
- 🌓 主题切换需要大量 CSS 覆盖，代码冗余
- 🔄 审批流程轨迹展示丑陋，难以定制

**XT-Element-UI** 正是为解决这些痛点而生！基于 Vue 2.7 + ElementUI 构建，提供 30+ 企业级组件，覆盖布局、表单、数据展示、图表、工作流等常见场景。

---

## ✨ 核心亮点

### 1️⃣ 丰富的组件体系

```
├── 🎨 基础组件 (13个)
│   ├── XtButton / XtCard / XtFlexBox
│   ├── XtInput / XtText / XtTime
│   ├── XtGridBox / XtGridItem
│   └── XtStepPrice / XtList ...
├── 🔧 扩展组件 (15个)
│   ├── XtTable (虚拟滚动)
│   ├── XtSelectTree / XtTransferTree
│   ├── XtUpload (图片预览)
│   └── XtFlow (审批流程轨迹) ...
└── 📊 图表组件 (5个)
    ├── XtBar / XtLine / XtPie
    └── XtMulti (组合图)
```

### 2️⃣ 开箱即用的主题系统

无需复杂配置，轻松切换明暗主题：

```vue
<template>
  <xt-config-provider 
    tag="template"
    :proxyElement="htmlElement"
    :theme="theme"
    :primaryColor="primaryColor"
    :injectBackground="true"
  >
    <your-app />
  </xt-config-provider>
</template>

<script>
export default {
  data() {
    return {
      theme: 'white',      // 'white' | 'dark'
      primaryColor: '#1890ff',
      htmlElement: null
    }
  },
  mounted() {
    this.htmlElement = document.querySelector('html')
  },
  methods: {
    changeTheme(newTheme) {
      this.theme = newTheme
    }
  }
}
</script>
```

### 3️⃣ 优雅的审批流程轨迹

`XtFlow` 组件专为企业级审批场景设计：

- 📐 纯纵向布局，规避行内拓扑图的丑陋
- 📦 自动折叠长审批链，控制页面高度
- ✅ 区分通过/驳回/待办/转办四种状态
- 🎯 原生对接 Flowable 工作流后端数据

```html
<xt-flow 
  :data="flowData" 
  :rounded="'square'"
  @node-click="handleNodeClick"
>
  <template #node-action="{ node }">
    <el-button size="mini">查看详情</el-button>
  </template>
</xt-flow>
```

### 4️⃣ 强大的图表能力

内置 ECharts 封装，支持柱状图、折线图、饼图、组合图：

```html
<xt-bar 
  :data="chartData" 
  :theme="theme"
  :size="'medium'"
/>

<xt-multi 
  :data="multiData" 
  :type="['line', 'bar']"
/>
```

### 5️⃣ 灵活的布局组件

```html
<!-- 弹性布局 -->
<xt-flex-box :gap="'16px'" :direction="'row'" :align="'center'">
  <xt-button>按钮1</xt-button>
  <xt-button>按钮2</xt-button>
</xt-flex-box>

<!-- 网格布局 -->
<xt-grid-box :cols="4" :gap="'16px'">
  <xt-grid-item v-for="item in list" :key="item.id">
    <xt-card-item :title="item.title" :value="item.value" />
  </xt-grid-item>
</xt-grid-box>
```

---

## 📦 快速开始

### 安装

```bash
npm install xt-element-ui --save
```

### 全局引入

```javascript
import Vue from 'vue'
import XtElementUI from 'xt-element-ui'
import 'xt-element-ui/lib/index.css'

Vue.use(XtElementUI)
```

### 按需引入

```javascript
import XtButton from 'xt-element-ui/lib/xt-button'
import XtCard from 'xt-element-ui/lib/xt-card'
import 'xt-element-ui/lib/xt-button/style.css'
import 'xt-element-ui/lib/xt-card/style.css'

Vue.component('XtButton', XtButton)
Vue.component('XtCard', XtCard)
```

---

## 🌐 资源链接

| 资源 | 链接 |
|------|------|
| 📖 在线文档 | https://JobWebNie.github.io/xt-element-ui/ |
| 🐛 GitHub 仓库 | https://github.com/JobWebNie/xt-element-ui |
| 📦 npm 主页 | https://www.npmjs.com/package/xt-element-ui |
| 📝 更新日志 | https://github.com/JobWebNie/xt-element-ui/blob/main/CHANGELOG.md |

---

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！如果你有好的组件想法或发现 Bug，欢迎参与贡献。

---

## 📄 License

MIT License

---

> 如果觉得这个组件库对你有帮助，欢迎 ⭐ Star 支持一下！你的支持是我们持续更新的动力！

#Vue #ElementUI #组件库 #前端 #企业级
