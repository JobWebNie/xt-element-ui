---
home: true
heroImage: /favicon.ico
heroText: XT-Element-UI
tagline: 基于 Vue 2.7 + ElementUI 的企业级组件库
actionText: 🚀 快速上手
actionLink: /components/base/xt-button
features:
  - title: 🎯 丰富的组件
    details: 提供 15+ 组件，覆盖布局、表单、数据展示、图表等常见场景
  - title: 📦 开箱即用
    details: 基于 ElementUI 构建，与现有 ElementUI 项目无缝集成
  - title: 🪶 按需引入
    details: 完整的 npm 包架构，支持按需引入，减小打包体积
  - title: 🎨 双架构设计
    details: Xt 自定义组件 + Ex 扩展组件，职责清晰、便于维护
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

### 🎨 Xt 组件（自定义组件）

全新开发、不依赖 ElementUI 原有组件：

| 组件 | 说明 |
|------|------|
| **XtButton** | 按钮组件 |
| **XtCard** | 卡片组件 |
| **XtCardItem** | 卡片项组件 |
| **XtFlexBox** | 弹性布局组件 |
| **XtGridBox** | 网格布局组件 |
| **XtText** | 文本组件 |
| **XtInput** | 输入框组件 |
| **XtDatePicker** | 日期选择组件 |
| **XtConfigProvider** | 全局配置提供器 |

### ✨ Ex 组件（扩展组件）

基于 ElementUI / ECharts 二次封装的增强组件：

| 组件 | 说明 |
|------|------|
| **ExButton** | 基于 ElementUI Button 的扩展按钮 |
| **ExCard** | 基于 ElementUI Card 的扩展卡片 |
| **ExTable** | 基于 ElementUI Table 的扩展表格（支持虚拟滚动） |
| **ExBar / ExLine / ExPie / ExMulti** | 基于 ECharts 的图表组件 |
| **ExSelectTree** | 下拉选择树组件 |
| **ExUpload** | 上传组件（支持图片预览） |
| **ExPage** | 页面组件 |
| **ExIcon** | 图标组件（支持 SVG / 字体图标） |

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
