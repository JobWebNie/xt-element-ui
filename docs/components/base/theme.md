## iframe 主题注入

## 概述

为微前端架构提供统一的主题管理方案。主系统切换主题后，子系统 iframe 中的 Element UI 组件会自动同步换色，子系统无需任何改造。

### 设计思路

| 角色 | 职责 |
|------|------|
| 主系统 | 统一管理主题状态，注入 CSS 变量到 iframe |
| 子系统 | 标准 Element UI 项目，无需改造 |
| 注入时机 | iframe 加载完成后自动注入 |

### 工作流程

```
1. 主系统调用 setTheme('dark')
      ↓
2. utils 同步更新 --el-* + --xt-* 变量到主文档
      ↓
3. utils 通过 onConfigChange 广播主题变更
      ↓
4. 所有 IframeThemeInjector 实例收到通知
      ↓
5. 实例通过 applyThemeVars 将新主题应用到管理的 iframe
      ↓
6. 所有 iframe 内的 Element UI 组件实时换色
```

## 快速开始

### JS 模块（CSS 已内联为字符串）

```javascript
import { createThemeInjector } from 'xt-element-ui'

// 创建注入器（CSS 已内联，无需手动提供）
const injector = createThemeInjector({ theme: 'white' })

// 注入所有 iframe
injector.injectAll('iframe')
```

### 直接引用 CSS 文件

如果使用独立 CSS 文件注入：

```html
<link rel="stylesheet" href="xt-element-ui/lib/theme/element-vars.css">
<link rel="stylesheet" href="xt-element-ui/lib/theme/element-overrides.css">
```

### 手动注入 iframe（使用独立 CSS 文件）

```javascript
// 动态加载并注入
fetch('/lib/theme/element-vars.css')
  .then(res => res.text())
  .then(css => {
    const style = document.createElement('style')
    style.textContent = css
    iframe.contentDocument.head.appendChild(style)
  })
```

## API 说明

### createThemeInjector(options)

创建一个预配置的主题注入器实例。

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `options.theme` | String | 否 | 初始主题：`white`、`dark`（默认 `white`） |
| `options.primaryColor` | String | 否 | 初始主色调（默认 `#1890ff`） |
| `options.brand` | String | 否 | 品牌标识：`''`、`water`、`electricity`、`gas` |
| `options.persist` | Boolean | 否 | 是否持久化到 localStorage（默认 `false`） |
| `options.onThemeChange` | Function | 否 | 主题变化回调 |

**返回值**：`IframeThemeInjector` 实例

### inject(iframe)

向指定 iframe 注入主题 CSS。

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `iframe` | HTMLIFrameElement | 是 | iframe 元素 |

**返回值**：`boolean` 是否注入成功

### injectAll(selector)

批量注入所有匹配选择器的 iframe。

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `selector` | String | 否 | CSS 选择器（默认 `'iframe'`） |

**返回值**：`number` 成功注入的数量

### setTheme(theme, options)

切换主题，自动同步到主文档和所有 iframe。

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `theme` | String | 是 | `white`、`dark` |
| `options.primaryColor` | String | 否 | 同时设置主色调 |
| `options.brand` | String | 否 | 同时设置品牌色 |

```javascript
const injector = createThemeInjector({ theme: 'white' })
injector.injectAll('iframe')

// 切换主题（自动同步主文档 + 所有 iframe）
injector.setTheme('dark')
```

### setPrimaryColor(color)

设置主色调，自动同步到主文档和所有 iframe。

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `color` | String | 是 | 十六进制颜色值 |

### setBrand(brand)

设置品牌色，切换对应品牌的主色调。

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `brand` | String | 是 | `''`、`water`、`electricity`、`gas` |

**品牌色映射**：

| 品牌 | 亮色 | 暗色 |
|------|------|------|
| `water` | `#0077be` | `#0099cc` |
| `electricity` | `#2ecc71` | `#27ae60` |
| `gas` | `#f39c12` | `#e67e22` |

### startObserving(target)

开始自动监听 DOM 变化，自动注入新添加的 iframe。

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `target` | HTMLElement | 否 | 监听容器（默认 `document.body`） |

### stopObserving()

停止自动监听。

### remove(iframe)

移除指定 iframe 的注入。

### removeAll()

移除所有 iframe 的注入。

### destroy()

销毁实例，清理所有资源。

## 使用示例

### 基本用法

```javascript
import { createThemeInjector } from 'xt-element-ui'

// 创建注入器
const injector = createThemeInjector({ theme: 'white' })

// 注入现有 iframe
injector.injectAll('iframe')

// 切换主题
injector.setTheme('dark')

// 设置品牌色
injector.setBrand('water')

// 销毁
injector.destroy()
```

### 与全局主题配置联动

```javascript
import { setTheme, onConfigChange } from 'xt-element-ui'
import { createThemeInjector } from 'xt-element-ui'

// 1. 创建注入器
const injector = createThemeInjector({ theme: 'white' })

// 2. 注入 iframe
injector.injectAll('iframe')

// 3. 监听全局主题变化（保持同步）
const unsubscribe = onConfigChange((key, value) => {
  if (key === 'theme') {
    console.log('主题变更：', value)
  }
})

// 4. 通过全局 API 切换主题（自动同步到 iframe）
setTheme('dark')
```

### 自动监听新增 iframe

```javascript
const injector = createThemeInjector({ theme: 'white' })
injector.startObserving()  // 自动监听 DOM

// 动态添加的 iframe 会自动被注入主题
const newIframe = document.createElement('iframe')
document.body.appendChild(newIframe)  // 自动注入

// 清理
injector.stopObserving()
```

### 持久化配置

```javascript
// 创建时启用持久化
const injector = createThemeInjector({
  theme: 'white',
  persist: true  // 保存到 localStorage
})

// 下次加载时自动恢复
// localStorage 中的配置会自动应用
```

## 注意事项

1. **跨域限制**：跨域 iframe 无法访问，将输出警告日志
2. **加载时机**：iframe 必须加载完成后才能注入（注入器会自动等待 `load` 事件）
3. **CSS 内联**：推荐使用 `createThemeInjector()`，CSS 已内联无需额外配置
4. **主题同步**：通过 `onConfigChange` 实现主文档和 iframe 的主题自动同步
5. **性能**：大量 iframe 场景建议使用 `startObserving` 自动管理，避免手动注入遗漏