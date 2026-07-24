---
home: true
# heroImage: /favicon.ico
heroText: XT-Element-UI
tagline: 基于 Vue 2.7 + ElementUI 的企业级组件库
actionText: 🚀 快速上手
actionLink: /components/base/xt-button
features:
  - title: 🎯 丰富的组件
    details: 提供 30+ 组件，覆盖布局、表单、数据展示、图表、工作流等常见场景
  - title: 📦 开箱即用
    details: 基于 ElementUI 构建，与现有 ElementUI 项目无缝集成
  - title: 🪶 按需引入
    details: 完整的 npm 包架构，支持按需引入，减小打包体积
  - title: 🌓 主题系统
    details: 支持亮色/暗色主题切换，支持自定义主色调
  - title: 📊 图表能力
    details: 内置 ECharts 封装，提供柱状图、折线图、饼图、混合图
footer: MIT Licensed | Copyright © 2026 XT-Element-UI
---

::: tip 💡 快速开始

```bash
# 安装
npm install xt-element-ui --save

# 全局引入
import Vue from 'vue'
import XtElementUI from 'xt-element-ui'
import 'xt-element-ui/lib/index.css'

Vue.use(XtElementUI)
```

:::

---

## 📦 组件概览

所有组件统一以 `Xt` 开头命名，不再区分双架构：

### 🎨 基础组件

| 组件 | 说明 |
|------|------|
| **XtButton** | 按钮组件 |
| **XtCard** | 卡片组件 |
| **XtCardItem** | 卡片项组件 |
| **XtFlexBox** | 弹性布局组件 |
| **XtGridBox** | 网格布局组件 |
| **XtGridItem** | 网格项组件 |
| **XtText** | 文本组件 |
| **XtTime** | 时间组件（当前时间/倒计时/日期格式化） |
| **XtInput** | 输入框组件 |
| **XtConfigProvider** | 全局配置提供器 |
| **XtMap** | 统一地图组件（支持高德/天地图/百度） |
| **XtMapProvider** | 地图提供器 |
| **XtStepPrice** | 阶梯价格组件 |
| **XtStepPriceItem** | 阶梯价格项组件 |
| **XtList** | 卡片列表组件 |

### 🔧 扩展组件

| 组件 | 说明 |
|------|------|
| **XtDatePicker** | 日期选择器（支持季度选择） |
| **XtIcon** | 图标组件（支持 el-icon/SVG/自定义字体） |
| **XtTable** | 扩展表格（含虚拟滚动） |
| **XtSelectTree** | 下拉选择树组件 |
| **XtUpload** | 上传组件（支持图片预览） |
| **XtPage** | 页面组件 |
| **XtProgress** | 进度条组件 |
| **XtTabs** | 标签页组件 |
| **XtTabPane** | 标签页面板组件 |
| **XtBadge** | 徽标组件 |
| **XtScrollArrow** | 滚动箭头组件 |
| **XtTransferTree** | 树形穿梭框组件 |
| **XtFormSchema** | 表单配置化搜索组件 |
| **XtFlow** | 审批流程轨迹组件（支持 Flowable 工作流对接） |

### 📊 图表组件

| 组件 | 说明 |
|------|------|
| **XtChart** | 图表容器 |
| **XtBar** | 柱状图 |
| **XtLine** | 折线图 |
| **XtPie** | 饼图 |
| **XtMulti** | 组合图 |


---

## 🌐 GitHub Pages 自动部署

本项目通过 **GitHub Actions** 自动构建并部署文档到 **GitHub Pages**：

- 📖 **在线文档**：https://JobWebNie.github.io/xt-element-ui/
- 🐛 **问题反馈**：https://github.com/JobWebNie/xt-element-ui/issues
- 📦 **npm 主页**：https://www.npmjs.com/package/xt-element-ui

推送代码到 `main` / `master` 分支后，GitHub Actions 将自动执行：
1. 安装依赖
2. 构建 VuePress 文档
3. 部署到 GitHub Pages

---

## 📚 更多资源

- **[查看完整文档](https://JobWebNie.github.io/xt-element-ui/)**
- **[更新日志](https://github.com/JobWebNie/xt-element-ui/blob/main/CHANGELOG.md)**
- **[贡献指南](https://github.com/JobWebNie/xt-element-ui/blob/main/CONTRIBUTING.md)**
- **[GitHub 仓库](https://github.com/JobWebNie/xt-element-ui)**


