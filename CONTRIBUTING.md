# 贡献指南

感谢您对 XT-Element-UI 的关注！以下是关于如何参与贡献的一些指南。

## 📋 目录

- [问题反馈](#问题反馈)
- [代码贡献](#代码贡献)
- [开发指南](#开发指南)
- [组件规范](#组件规范)
- [提交规范](#提交规范)
- [Pull Request 流程](#pull-request-流程)
- [文档贡献](#文档贡献)

---

## 💬 问题反馈

如果您发现了 Bug 或有新功能建议，欢迎在 [创建 Issue](https://github.com/JobWebNie/xt-element-ui/issues)。

提交 Issue 时请尽量提供：

1. **Bug 报告
   - 复现步骤
   - 期望行为 vs 实际行为
   - 环境信息：浏览器、Node.js 版本、包版本
   - 最小可复现示例或代码片段

2. **功能建议**
   - 使用场景
   - 期望功能描述
   - 可能的实现思路

---

## 💻 代码贡献

### 环境要求

- Node.js >= 12.x
- npm >= 6.x 或 yarn >= 1.x

### 安装依赖

```bash
# 克隆项目
git clone https://github.com/JobWebNie/xt-element-ui.git
cd xt-element-ui

# 安装依赖
npm install
```

### 常用命令

```bash
# 本地开发（启动组件开发示例）
npm run dev

# 文档开发（本地预览文档）
npm run docs:dev

# 构建组件库
npm run lib

# 构建文档（产出到 docs/.vuepress/dist/）
npm run docs:build
```

---

## 📦 组件规范

### 命名规范

| 前缀 | 含义 | 说明 |
|------|------|------|
| `Xt` | 自定义组件 | 全新开发、不依赖 ElementUI 原有组件 |
| `Ex` | 扩展组件 | 基于 ElementUI / ECharts 二次封装的增强组件 |

### 文件结构

新增一个组件的标准结构：

```
src/components/{component-name}/
├── index.js          # 组件入口，负责注册
├── index.vue       # 组件主体
└── style/
    └── index.scss # 组件样式（如有需要）
```

### 组件注册

在 `src/index.js` 中注册新组件：

```javascript
import XtNewComponent from './components/xt-new-component'

const components = {
  // ... 其他组件
  XtNewComponent
}

const install = function(Vue, opts = {}) {
  Object.keys(components).forEach(key => {
    Vue.component(components[key].name || key, components[key])
  })
}

export {
  // ...
  XtNewComponent
}
```

### props 规范

- props 必须声明 `type` 和默认值
- 复杂类型使用函数返回默认值
- 命名使用驼峰式（camelCase），模板中使用短横线（kebab-case）

```javascript
props: {
  title: {
    type: String,
    default: ''
  },
  options: {
    type: Array,
    default: () => []
  }
}
```

### 样式规范

- 使用 SCSS，遵循项目已有的变量体系
- 组件样式尽量使用 scoped 或命名空间避免污染
- 颜色、间距、字体大小等优先使用 `src/styles` 下的变量

### 文档规范

每个组件都应在 `docs/components/` 下对应一份 `.md` 文档，包含：

- 组件简介
- 基础用法示例
- 属性（props）说明
- 事件（events）说明
- 高级用法（如有）

---

## ✏️ 提交规范

本项目遵循 [Conventional Commits](https://www.conventionalcommits.org/) 规范。

### 格式

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

### Type 类型

| 类型 | 说明 |
|------|------|
| `feat` | 新功能 |
| `fix` | Bug 修复 |
| `docs` | 文档变更 |
| `style` | 代码格式（不影响功能，例如空格、分号等格式修正） |
| `refactor` | 代码重构（不是新增功能，也不是修改 bug） |
| `perf` | 性能优化 |
| `test` | 增加或修改测试 |
| `build` | 构建流程、外部依赖变更（如升级 npm 包、修改 webpack 配置等） |
| `ci` | 修改 CI 配置、脚本 |
| `chore` | 其他不修改 src 或测试代码的其他变更 |
| `revert` | 回滚某次提交 |

### 示例

```
feat(ex-table): 新增虚拟滚动支持

- 实现基于 requestAnimationFrame 的滚动节流
- 优化可见范围计算逻辑
- 修复滚动条显示异常问题

Closes #123
```

---

## 🔀 Pull Request 流程

1. **Fork 本仓库**到你的 GitHub 账号
2. **克隆**到本地：
   ```bash
   git clone https://github.com/JobWebNie/xt-element-ui.git
   cd xt-element-ui
   ```
3. **创建新分支**：
   ```bash
   git checkout -b feat/your-feature-name
   # 或
   git checkout -b fix/your-bug-fix
   ```
4. **编写代码**，请遵循项目代码风格
5. **本地验证**：
   ```bash
   npm run dev        # 验证组件功能
   npm run docs:dev   # 验证文档正常
   ```
6. **提交代码**，按照 [提交规范](#提交规范) 写提交信息
7. **推送**到你的 Fork：
   ```bash
   git push origin feat/your-feature-name
   ```
8. **创建 Pull Request**，在描述中说明：
   - 变更内容
   - 相关 Issue
   - 截图（如果涉及 UI 变更）
   - 测试步骤

### PR 注意事项

- 请保持 PR **聚焦单一变更**，避免一次性提交大量无关联的修改
- 提交前请确保代码通过 `npm run lib` 和 `npm run docs:build`
- 新增组件请同时补齐文档
- Bug 修复请说明问题产生的原因和解决方案

---

## 📖 文档贡献

文档同样欢迎贡献！文档位于 `docs/` 目录下：

```
docs/
├── README.md                 # 文档首页
├── .vuepress/
│   ├── config.js            # VuePress 配置（导航、侧边栏等）
│   └── enhanceApp.js        # 文档应用增强
└── components/
    ├── base/               # Xt 组件文档
    ├── extend/               # Ex 组件文档
    └── utils/               # 工具类文档
```

### 修改文档

1. 在 `docs/components/` 下找到对应组件的 `.md` 文件
2. 使用 Markdown 语法编写，代码示例使用 `::: demo` 容器包裹
3. 运行 `npm run docs:dev` 本地预览

### 新增组件文档

1. 在 `docs/components/{base|extend}/xxx.md` 创建新文档
2. 在 `docs/.vuepress/config.js` 的 `sidebar` 和 `nav` 中注册导航和侧边栏

---

## 🙏 致谢

每一位为 XT-Element-UI 贡献代码、文档、Issue 的朋友，你们让这个项目变得更好！
