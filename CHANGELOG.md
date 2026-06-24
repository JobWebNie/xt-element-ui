# 更新日志

本项目遵循 [Semantic Versioning](https://semver.org/lang/zh-CN/) 语义化版本。

格式说明：
- `✨` 新功能（Features）
- `🐛` Bug 修复
- `🎨` 代码风格/重构
- `⚡️` 性能优化
- `📝` 文档
- `🏗` 构建/CI
- `♻️` 重构

---

## [1.3.0]

### ♻️ 架构调整

- **组件命名统一**：移除双架构支持，所有组件统一使用 `Xt` 前缀命名
- **移除 Ex 系列组件**：删除 `ExButton`、`ExCard`、`ExChart`、`ExTable` 等所有 `Ex` 开头的组件
- **文档同步更新**：所有 Markdown 文档中的组件名称从 `Ex` 统一改为 `Xt`
- **配置文件更新**：`docs/.vuepress/config.js` 移除 `extend` 目录引用，统一使用 `base` 目录

### 📝 文档

- 更新 README.md，移除双架构说明，展示统一的 Xt 组件列表
- 更新 docs/README.md，统一组件命名规范
- 更新 CONTRIBUTING.md，移除双架构相关说明
- 新增 xt-date-picker.md、xt-icon.md、xt-table.md、xt-select-tree.md、xt-upload.md、xt-page.md 组件文档

---

## [1.2.5]

### ✨ 新功能

- **xt-chart**: 四个图表组件（XtBar / XtLine / XtPie / XtMulti）新增 `fieldKeys` prop，支持自定义 `chartData` 字段映射
- **xt-chart**: 四个图表组件新增 `simpleMode` prop，开启极简模式（隐藏图例、坐标轴等装饰元素）
- **xt-multi**: `chartData.unit` 支持去重，相同 unit 的 series 共用同一条 Y 轴
- **xt-table**: 新增虚拟滚动支持，大数据量表格渲染性能优化
- **xt-table**: 新增合并单元格（span-method）缓存机制，提升滚动性能
- **xt-icon**: 新增 XtIcon 组件，支持 `el-icon` 字体图标、SVG Sprite、内联 SVG 和自定义字体图标

### 🐛 Bug 修复

- **xt-chart**: 修复暗色模式下 canvas 背景色为透明的问题，改为黑色
- **xt-table**: 修复模板中非嵌套列分支引用未定义变量导致页面空白的问题
- **xt-table**: 修复横向滚动时固定列背景色被文字覆盖的问题
- **xt-table**: 修复虚拟滚动时 Y 轴滚动条不显示的问题
- **xt-table**: 修复虚拟滚动初始渲染只显示少量数据的问题，优化 `calcVisibleRange` 计算逻辑

### 📝 文档

- 新增 xt-table.md 详细文档，包含虚拟滚动、自定义 formatter、列配置等章节
- 新增 xt-icon.md 图标组件文档
- 更新 xt-chart.md 文档，按子组件拆分章节并补充 `fieldKeys`、`simpleMode` 等属性说明

---

## [1.2.0]

### ✨ 新功能

- **xt-button**: 新增按钮组件，支持多种类型和尺寸
- **xt-card / xt-card-item**: 新增卡片容器组件
- **xt-flex-box / xt-grid-box**: 新增弹性/网格布局组件
- **xt-text / xt-input**: 新增文本和输入框组件
- **xt-date-picker**: 新增日期选择组件（支持季度选择）
- **xt-config-provider**: 新增全局配置提供者，支持主题、尺寸、主色调配置
- **xt-chart (XtBar / XtLine / XtPie / XtMulti)**: 新增基于 ECharts 的图表组件族
- **xt-table**: 新增基于 ElementUI Table 的扩展表格组件
- **xt-select-tree**: 新增下拉选择树组件
- **xt-upload**: 新增上传组件（支持图片预览）
- **xt-page**: 新增页面组件

### 🏗 构建

- 完善 `vue-cli-service build --target lib` 构建流程，产出 `common.js` / `esm.js` / `umd.min.js` / `css`

---

## [1.0.0]

### ✨ 新功能

- 项目初始化，基于 Vue 2.7 + ElementUI 搭建组件库基础架构
- 主题系统：支持亮色/暗色主题切换，支持自定义主色调
- VuePress 文档系统：基于 vuepress-theme-reco 搭建组件文档站
