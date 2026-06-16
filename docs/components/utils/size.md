## 字体大小配置

## 概述

通过工具函数可以全局设置组件的字体大小，支持三种预设尺寸：`small`、`medium`、`large`。

## 方法说明

### setSize(size)

设置全局字体大小。

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `size` | String | 是 | 字体大小：`small`、`medium`、`large` |

```vue
<template>
  <div>
    <XtButton @click="setSmall">小号字体</XtButton>
    <XtButton @click="setMedium">中号字体</XtButton>
    <XtButton @click="setLarge">大号字体</XtButton>
  </div>
</template>

<script>
import { setSize } from 'xt-element-ui'

export default {
  methods: {
    setSmall() {
      setSize('small')
    },
    setMedium() {
      setSize('medium')
    },
    setLarge() {
      setSize('large')
    }
  }
}
</script>
```

### getSize()

获取当前字体大小配置。

```vue
<template>
  <div>
    <XtText>当前字体大小：{{ currentSize }}</XtText>
  </div>
</template>

<script>
import { getSize } from 'xt-element-ui'

export default {
  computed: {
    currentSize() {
      return getSize()
    }
  }
}
</script>
```

## 字体大小对照表

| 尺寸 | 说明 |
|------|------|
| `small` | 小号字体，默认值 |
| `medium` | 中号字体 |
| `large` | 大号字体，适合大屏展示 |

## 使用示例

### 在组件安装时配置

```javascript
import XtElementUI from 'xt-element-ui'

Vue.use(XtElementUI, {
  size: 'large'  // 全局设置大号字体
})
```

### 动态切换字体大小

```vue
<template>
  <div>
    <XtFlexBox content="center" style="gap: 16px; margin-bottom: 16px;">
      <XtButton 
        v-for="size in sizes" 
        :key="size"
        :type="currentSize === size ? 'primary' : ''"
        @click="changeSize(size)"
      >
        {{ sizeLabels[size] }}
      </XtButton>
    </XtFlexBox>
    
    <XtCard>
      <XtCardItem title="当前尺寸">
        <XtText type="primary" bold>{{ currentSize }}</XtText>
      </XtCardItem>
      <XtCardItem title="示例文本">
        <XtText>这是一段示例文本，用于展示字体大小效果。</XtText>
      </XtCardItem>
    </XtCard>
  </div>
</template>

<script>
import { setSize, getSize } from 'xt-element-ui'

export default {
  data() {
    return {
      sizes: ['small', 'medium', 'large'],
      sizeLabels: {
        small: '小号',
        medium: '中号',
        large: '大号'
      }
    }
  },
  computed: {
    currentSize() {
      return getSize()
    }
  },
  methods: {
    changeSize(size) {
      setSize(size)
    }
  }
}
</script>
```

## 注意事项

1. 字体大小设置会影响所有使用组件库样式的元素
2. 设置后会在 `html` 标签上添加 `data-size` 属性
3. 需要配合对应的 CSS 样式才能生效