## 主题配置

## 概述

通过工具函数可以全局设置主题模式，支持两种主题：`white`（亮色主题）和 `dark`（暗色主题）。

主题系统采用统一的 CSS 变量架构，主题切换时会**同时设置两套变量**：

| 变量前缀 | 用途 |
|----------|------|
| `--el-*` | 覆盖 Element UI 组件样式 |
| `--xt-*` | xt-element-ui 自定义组件样式 |

两套变量保持同步，确保 Element UI 原生组件和 xt 组件在主题切换时表现一致。

## 架构说明

```
┌─────────────────────────────────────────────┐
│  utils/theme-vars.js                        │
│  ┌─────────────────────────────────────┐    │
│  │  applyThemeVars(element, config)   │    │  ← 唯一事实源
│  │  - LIGHT_THEME_VARS / DARK_THEME_VARS│    │
│  │  - BRAND_COLORS                     │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
          ▲                    ▲
          │ 调用               │ 调用
┌─────────┴──────┐    ┌───────┴────────────┐
│ utils/index.js  │    │ theme/iframe-      │
│ setTheme()      │    │ injector.js       │
│ setPrimaryColor()│   │ iframe 主题同步   │
└─────────────────┘    └────────────────────┘
```

## 方法说明

### setTheme(theme)

设置全局主题，同时更新 `--el-*` 和 `--xt-*` 两套 CSS 变量。

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `theme` | String | 是 | 主题类型：`white`、`dark` |

```vue
<template>
  <div>
    <XtButton @click="setWhiteTheme">亮色主题</XtButton>
    <XtButton @click="setDarkTheme">暗色主题</XtButton>
  </div>
</template>

<script>
import { setTheme } from 'xt-element-ui'

export default {
  methods: {
    setWhiteTheme() {
      setTheme('white')
    },
    setDarkTheme() {
      setTheme('dark')
    }
  }
}
</script>
```

**内部行为**：
1. 调用 `applyThemeVars()` 设置 `--el-*` 主题变量（主色、背景、文字、边框等）
2. 设置 `--xt-*` 组件主色变量
3. 在 `<html>` 上设置 `data-theme` 属性
4. 同步更新 ECharts 图表主题

### getTheme()

获取当前主题配置。

```vue
<template>
  <div>
    <XtText>当前主题：{{ currentTheme }}</XtText>
  </div>
</template>

<script>
import { getTheme } from 'xt-element-ui'

export default {
  computed: {
    currentTheme() {
      return getTheme()
    }
  }
}
</script>
```

### setPrimaryColor(color)

设置全局主色调，同时更新 `--el-color-primary*` 和 `--xt-color-primary*` 变量。

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `color` | String | 是 | 十六进制颜色值，如 `#1890ff` |

```vue
<template>
  <div>
    <XtButton @click="changePrimary('#ff5722')">橙色主题</XtButton>
    <XtButton @click="changePrimary('#4caf50')">绿色主题</XtButton>
  </div>
</template>

<script>
import { setPrimaryColor } from 'xt-element-ui'

export default {
  methods: {
    changePrimary(color) {
      setPrimaryColor(color)
    }
  }
}
</script>
```

**自动衍生变量**：设置主色后会自动生成以下变量：

| 变量 | 说明 |
|------|------|
| `--el-color-primary` | 主色 |
| `--el-color-primary-light-3` | 主色 +30% 亮度 |
| `--el-color-primary-light-5` | 主色 +50% 亮度 |
| `--el-color-primary-light-7` | 主色 +70% 亮度 |
| `--el-color-primary-light-8` | 主色 +80% 亮度 |
| `--el-color-primary-light-9` | 主色 +90% 亮度 |
| `--el-color-primary-dark-2` | 主色 -20% 亮度 |
| `--el-color-primary-rgb` | 主色 RGB 值 |

## 主题对照表

| 主题 | 说明 |
|------|------|
| `white` | 亮色主题，适合日间使用（默认值） |
| `dark` | 暗色主题，适合夜间使用 |

## 使用示例

### 在组件安装时配置

```javascript
import XtElementUI from 'xt-element-ui'

Vue.use(XtElementUI, {
  theme: 'dark'  // 全局设置暗色主题
})
```

### 动态切换主题

```vue
<template>
  <div>
    <XtFlexBox content="center" style="gap: 16px; margin-bottom: 16px;">
      <XtButton 
        v-for="theme in themes" 
        :key="theme"
        :type="currentTheme === theme ? 'primary' : ''"
        @click="changeTheme(theme)"
      >
        {{ themeLabels[theme] }}
      </XtButton>
    </XtFlexBox>
    
    <XtCard>
      <XtCardItem title="当前主题">
        <XtText type="primary" bold>{{ themeLabels[currentTheme] }}</XtText>
      </XtCardItem>
      <XtCardItem title="主题状态">
        <XtText :type="currentTheme === 'dark' ? 'warning' : 'success'">
          {{ currentTheme === 'dark' ? '暗色模式已开启' : '亮色模式已开启' }}
        </XtText>
      </XtCardItem>
    </XtCard>
  </div>
</template>

<script>
import { setTheme, getTheme } from 'xt-element-ui'

export default {
  data() {
    return {
      themes: ['white', 'dark'],
      themeLabels: {
        white: '亮色',
        dark: '暗色'
      }
    }
  },
  computed: {
    currentTheme() {
      return getTheme()
    }
  },
  methods: {
    changeTheme(theme) {
      setTheme(theme)
    }
  }
}
</script>
```

### 监听主题变化

```vue
<template>
  <div>
    <XtText>主题变化次数：{{ changeCount }}</XtText>
  </div>
</template>

<script>
import { onConfigChange } from 'xt-element-ui'

export default {
  data() {
    return {
      changeCount: 0,
      unsubscribe: null
    }
  },
  mounted() {
    // 监听主题变化
    this.unsubscribe = onConfigChange((key, value) => {
      if (key === 'theme') {
        this.changeCount++
        console.log('主题已切换为:', value)
      }
    })
  },
  beforeDestroy() {
    // 取消监听
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }
}
</script>
```

### 微前端架构（iframe 场景）

主系统切换主题后，子系统 iframe 中的 Element UI 组件会自动同步换色。详细用法参见 [iframe 主题注入](#/base/theme)。

```javascript
// 主系统
import { setTheme } from 'xt-element-ui'
import { createThemeInjector } from 'xt-element-ui'

// 1. 创建注入器
const injector = createThemeInjector({ theme: 'white' })

// 2. 注入现有 iframe
injector.injectAll('iframe')

// 3. 切换主题（自动同步到所有 iframe）
setTheme('dark')
```

## 注意事项

1. 主题切换会影响所有使用组件库样式的元素
2. 设置后会在 `html` 标签上添加/移除 `data-theme="dark"` 属性
3. `setTheme` 和 `setPrimaryColor` 会**同时设置** `--el-*` 和 `--xt-*` 两套变量
4. 建议在应用初始化时设置主题，可以结合用户偏好存储（如 localStorage）
5. 微前端架构下，主系统通过 `createThemeInjector` 可实现 iframe 自动同步