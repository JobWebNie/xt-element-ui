## 全局配置

## 概述

提供全局配置管理工具函数，包括配置的获取、设置、重置以及主色调配置等功能。

## 方法说明

### getConfig()

获取当前全局配置。

```vue
<template>
  <div>
    <XtText>当前配置：{{ JSON.stringify(config) }}</XtText>
  </div>
</template>

<script>
import { getConfig } from 'xt-element-ui'

export default {
  computed: {
    config() {
      return getConfig()
    }
  }
}
</script>
```

**返回值**：

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `theme` | String | 'white' | 主题类型 |
| `size` | String | 'medium' | 字体大小 |
| `primaryColor` | String | '#1890ff' | 主色调 |

### setConfig(config)

批量设置全局配置。

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `config` | Object | 是 | 配置对象 |

**config 参数**：

| 属性 | 类型 | 说明 |
|------|------|------|
| `theme` | String | 主题类型：`white`、`dark` |
| `size` | String | 字体大小：`small`、`medium`、`large` |
| `primaryColor` | String | 主色调，十六进制颜色格式 |

```vue
<template>
  <div>
    <XtButton @click="initConfig">初始化配置</XtButton>
  </div>
</template>

<script>
import { setConfig } from 'xt-element-ui'

export default {
  methods: {
    initConfig() {
      setConfig({
        theme: 'dark',
        size: 'large',
        primaryColor: '#1890ff'
      })
    }
  }
}
</script>
```

### setPrimaryColor(color)

设置全局主色调，同时更新 `--el-color-primary*`（Element UI）和 `--xt-color-primary*`（xt 组件）两套 CSS 变量。

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `color` | String | 是 | 十六进制颜色值 |

**自动衍生变量**：设置主色后会自动生成以下 Element UI 变量：

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

```vue
<template>
  <div>
    <XtButton @click="changePrimaryColor('#ff5722')">橙色主题</XtButton>
    <XtButton @click="changePrimaryColor('#4caf50')">绿色主题</XtButton>
  </div>
</template>

<script>
import { setPrimaryColor } from 'xt-element-ui'

export default {
  methods: {
    changePrimaryColor(color) {
      setPrimaryColor(color)
    }
  }
}
</script>
```

### getPrimaryColor()

获取当前主色调配置。

```vue
<template>
  <div>
    <XtText>当前主色调：{{ currentColor }}</XtText>
  </div>
</template>

<script>
import { getPrimaryColor } from 'xt-element-ui'

export default {
  computed: {
    currentColor() {
      return getPrimaryColor()
    }
  }
}
</script>
```

### resetConfig()

重置为默认配置。

```vue
<template>
  <div>
    <XtButton @click="reset">重置配置</XtButton>
  </div>
</template>

<script>
import { resetConfig } from 'xt-element-ui'

export default {
  methods: {
    reset() {
      resetConfig()
    }
  }
}
</script>
```

### onConfigChange(listener)

监听配置变化，返回取消订阅函数。

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `listener` | Function | 是 | 变化监听回调函数 |

**回调参数**：

| 参数 | 类型 | 说明 |
|------|------|------|
| `key` | String | 变化的配置项：`theme`、`size`、`primaryColor` |
| `value` | Any | 配置项的新值 |

```vue
<template>
  <div>
    <XtText>配置变化次数：{{ changeCount }}</XtText>
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
    this.unsubscribe = onConfigChange((key, value) => {
      this.changeCount++
      console.log(`配置 ${key} 已变更为:`, value)
    })
  },
  beforeDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  }
}
</script>
```

## 使用示例

### 完整配置示例

```vue
<template>
  <XtCard>
    <XtCardItem title="当前配置">
      <XtText>{{ JSON.stringify(config) }}</XtText>
    </XtCardItem>
    
    <XtCardItem title="配置操作">
      <XtFlexBox direction="vertical" style="gap: 12px;">
        <XtButton @click="updateConfig">更新配置</XtButton>
        <XtButton @click="changePrimary('#67c23a')">修改主色调</XtButton>
        <XtButton type="danger" @click="reset">重置</XtButton>
      </XtFlexBox>
    </XtCardItem>
    
    <XtCardItem title="配置变化">
      <XtText>变化次数：{{ changeCount }}</XtText>
    </XtCardItem>
  </XtCard>
</template>

<script>
import { 
  getConfig, 
  setConfig, 
  setPrimaryColor, 
  resetConfig,
  onConfigChange 
} from 'xt-element-ui'

export default {
  data() {
    return {
      changeCount: 0,
      unsubscribe: null
    }
  },
  computed: {
    config() {
      return getConfig()
    }
  },
  mounted() {
    this.unsubscribe = onConfigChange(() => {
      this.changeCount++
    })
  },
  beforeDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe()
    }
  },
  methods: {
    updateConfig() {
      setConfig({
        theme: 'dark',
        size: 'medium',
        primaryColor: '#1890ff'
      })
    },
    changePrimary(color) {
      setPrimaryColor(color)
    },
    reset() {
      resetConfig()
    }
  }
}
</script>
```

## 注意事项

1. `setPrimaryColor` 只支持十六进制颜色格式（如 `#1890ff`、`#fff`）
2. 设置主色调时，会自动生成对应的浅色系列（light-3 到 light-9）和暗色系列（dark-2）
3. `setPrimaryColor` 会**同时设置** `--el-*`（Element UI）和 `--xt-*`（xt 组件）两套变量
4. `onConfigChange` 返回的取消订阅函数应在组件销毁时调用，避免内存泄漏
5. 所有配置修改都会触发 `onConfigChange` 监听器