## 主题配置

## 概述

通过工具函数可以全局设置主题模式，支持两种主题：`white`（亮色主题）和 `dark`（暗色主题）。

## 方法说明

### setTheme(theme)

设置全局主题。

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

## 注意事项

1. 主题切换会影响所有使用组件库样式的元素
2. 设置后会在 `html` 标签上添加/移除 `data-theme="dark"` 属性
3. 需要配合对应的暗色主题 CSS 样式才能生效
4. 建议在应用初始化时设置主题，可以结合用户偏好存储（如 localStorage）