# XT-Element-UI

> 基于 Vue 2.7 + ElementUI 的企业级组件库

<div align="center">

[![npm](https://img.shields.io/npm/v/xt-element-ui.svg?style=flat-square)](https://www.npmjs.com/package/xt-element-ui)
[![npm](https://img.shields.io/npm/dm/xt-element-ui.svg?style=flat-square)](https://www.npmjs.com/package/xt-element-ui)
[![license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](./LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D12.0.0-green.svg?style=flat-square)](package.json)
[![Vue](https://img.shields.io/badge/vue-2.7.x-brightgreen.svg?style=flat-square)](https://vuejs.org)

📖 [在线文档](https://JobWebNie.github.io/xt-element-ui/) ·
🐛 [问题反馈](https://github.com/JobWebNie/xt-element-ui/issues) ·
💡 [功能建议](https://github.com/JobWebNie/xt-element-ui/issues/new?labels=enhancement)

</div>

---

## ✨ 特性

- **🎯 丰富的组件**：提供 15+ 组件，覆盖布局、表单、数据展示、图表等常见场景
- **📦 开箱即用**：基于 ElementUI 构建，与现有 ElementUI 项目无缝集成
- **🪶 按需引入**：完整的 npm 包架构，支持按需引入，减小打包体积
- **🎨 双架构设计**：`Xt` 自定义组件 + `Ex` 扩展组件，职责清晰、便于维护
- **🌓 主题系统**：支持亮色/暗色主题切换，支持自定义主色调
- **📐 响应式设计**：组件支持多种尺寸配置，适配不同屏幕
- **📊 图表能力**：内置 ECharts 封装，提供柱状图、折线图、饼图、混合图
- **⚡️ 虚拟滚动**：表格组件支持虚拟滚动，轻松应对万级数据

---

## 🚀 快速开始

### 安装

```bash
# 使用 npm
npm install xt-element-ui --save

# 使用 yarn
yarn add xt-element-ui
```

> 前置依赖：Vue 2.6+ 或 Vue 2.7+，ElementUI 2.15+

### 全局引入

```javascript
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import XtElementUI from 'xt-element-ui'
import 'xt-element-ui/lib/index.css'

Vue.use(ElementUI)
Vue.use(XtElementUI)

// 配置选项（可选）
Vue.use(XtElementUI, {
  theme: 'dark',         // 主题：'white' 或 'dark'
  size: 'medium',        // 组件尺寸：'small' | 'medium' | 'large'
  primaryColor: '#1890ff' // 主色调
})
```

### 按需引入

```javascript
import { XtButton, XtFlexBox, ExTable, ExBar } from 'xt-element-ui'
import 'xt-element-ui/lib/index.css'

Vue.component('XtButton', XtButton)
Vue.component('XtFlexBox', XtFlexBox)
Vue.component('ExTable', ExTable)
Vue.component('ExBar', ExBar)
```

---

## 📦 组件列表

### Xt 组件（自定义组件）

| 组件 | 说明 |
|------|------|
| **XtButton** | 按钮组件 |
| **XtCard** | 卡片组件 |
| **XtCardItem** | 卡片项组件 |
| **XtFlexBox** | 弹性布局组件 |
| **XtGridBox** | 网格布局组件 |
| **XtGridItem** | 网格子项组件 |
| **XtText** | 文本组件 |
| **XtInput** | 输入框组件 |
| **XtDatePicker** | 日期选择组件 |
| **XtConfigProvider** | 全局配置提供器 |

### Ex 组件（扩展组件）

| 组件 | 说明 |
|------|------|
| **ExButton** | 基于 ElementUI Button 的扩展按钮 |
| **ExCard** | 基于 ElementUI Card 的扩展卡片 |
| **ExTable** | 基于 ElementUI Table 的扩展表格（支持虚拟滚动） |
| **ExBar** | 基于 ECharts 的柱状图 |
| **ExLine** | 基于 ECharts 的折线图 |
| **ExPie** | 基于 ECharts 的饼图 |
| **ExMulti** | 基于 ECharts 的混合图表（支持多 Y 轴） |
| **ExChart** | 图表容器组件 |
| **ExSelectTree** | 下拉选择树组件 |
| **ExUpload** | 上传组件（支持图片预览） |
| **ExPage** | 页面组件 |
| **ExIcon** | 图标组件（支持 SVG / 字体图标） |

---

## 🛠 工具函数

组件库通过 `this.$xt` 全局挂载以下工具方法：

```javascript
// 设置主题（white / dark）
this.$xt.setTheme('dark')

// 设置全局组件尺寸（small / medium / large）
this.$xt.setSize('large')

// 设置主色调
this.$xt.setPrimaryColor('#52c41a')

// 获取当前配置
console.log(this.$xt.getConfig())
```

---

## 📁 项目结构

```
xt-element-ui/
├── docs/                      # VuePress 文档
│   ├── README.md             # 文档首页
│   ├── .vuepress/            # VuePress 配置
│   │   ├── config.js         # 主题、导航、侧边栏配置
│   │   └── enhanceApp.js     # 应用增强
│   └── components/            # 各组件文档
│       ├── base/             # Xt 系列组件文档
│       ├── extend/           # Ex 系列组件文档
│       └── utils/            # 工具类文档
│
├── src/                       # 组件源码
│   ├── components/           # 组件目录
│   │   ├── xt-button/        # 按钮组件
│   │   ├── xt-card/          # 卡片组件
│   │   ├── xt-flex-box/      # 弹性布局组件
│   │   ├── xt-grid-box/      # 网格布局组件
│   │   ├── xt-text/          # 文本组件
│   │   ├── xt-input/         # 输入框组件
│   │   ├── xt-config-provider/ # 配置提供者
│   │   ├── xt-date-picker/   # 日期选择
│   │   │
│   │   ├── ex-button/        # 扩展按钮
│   │   ├── ex-card/          # 扩展卡片
│   │   ├── ex-table/         # 扩展表格（含虚拟滚动）
│   │   ├── ex-chart/         # 图表组件（ExBar/ExLine/ExPie/ExMulti）
│   │   ├── ex-icon/          # 图标组件
│   │   ├── ex-select-tree/   # 下拉选择树
│   │   ├── ex-upload/        # 上传组件
│   │   └── ex-page/          # 页面组件
│   │
│   ├── config/               # 配置模块
│   ├── styles/               # 全局样式与变量
│   ├── utils/                # 工具函数
│   └── index.js              # 组件库入口
│
├── examples/                  # 本地开发示例
├── lib/                       # 构建产物（git 忽略）
│
├── .github/                   # GitHub 配置
│   └── workflows/            # CI/CD 工作流
│       ├── deploy-docs.yml   # 自动部署文档到 GitHub Pages
│       └── publish-npm.yml   # 自动发布 npm 包
│
├── package.json               # 项目配置
├── .gitignore                 # Git 忽略文件
├── README.md                  # 项目说明
├── CHANGELOG.md               # 更新日志
├── CONTRIBUTING.md            # 贡献指南
└── LICENSE                    # 许可证（MIT）
```

---

## 🌐 浏览器支持

| Chrome | Firefox | Safari | Edge |
|--------|---------|--------|------|
| ✅ 最新 2 个版本 | ✅ 最新 2 个版本 | ✅ 10.1+ | ✅ 15+ |

---

## 📚 更多文档

- 📖 [完整在线文档](https://JobWebNie.github.io/xt-element-ui/)
- 📋 [更新日志](./CHANGELOG.md)
- 🤝 [贡献指南](./CONTRIBUTING.md)

---

## 💪 开发

```bash
# 1. 克隆项目
git clone https://github.com/JobWebNie/xt-element-ui.git
cd xt-element-ui

# 2. 安装依赖
npm install

# 3. 启动本地开发服务器
npm run dev

# 4. 启动文档开发服务器（本地预览文档）
npm run docs:dev

# 5. 构建组件库
npm run lib

# 6. 构建文档（用于部署）
npm run docs:build
# 产物位于 docs/.vuepress/dist/
```

---

## 📄 许可证

[MIT License](./LICENSE) © 2026 XT-Element-UI Contributors
