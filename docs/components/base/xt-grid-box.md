## XtGridBox 网格布局组件

基于 CSS Grid 实现的网格布局组件，提供强大的二维布局能力，支持响应式设计和灵活的配置选项。

## 基本用法

::: demo 基本用法
```vue
<template>
  <XtGridBox :columns="3" gap="16px">
    <div style="padding: 16px; background: #f0f0f0; border-radius: 8px;">项目1</div>
    <div style="padding: 16px; background: #f0f0f0; border-radius: 8px;">项目2</div>
    <div style="padding: 16px; background: #f0f0f0; border-radius: 8px;">项目3</div>
    <div style="padding: 16px; background: #f0f0f0; border-radius: 8px;">项目4</div>
    <div style="padding: 16px; background: #f0f0f0; border-radius: 8px;">项目5</div>
    <div style="padding: 16px; background: #f0f0f0; border-radius: 8px;">项目6</div>
  </XtGridBox>
</template>
```
:::

## 属性说明

| 属性 | 类型 | 默认值 | 可选值 | 说明 |
|------|------|--------|--------|------|
| `columns` | String / Array / Number | `1fr` | - | 列配置，支持数字、字符串或数组 |
| `rows` | String / Array | `auto` | - | 行配置 |
| `gap` | String | - | - | 网格间距（同时控制行和列） |
| `rowGap` | String | - | - | 行间距 |
| `colGap` | String | - | - | 列间距 |
| `flow` | String | `row` | `row`、`column`、`row dense`、`column dense` | 自动排列方向 |
| `areas` | String / Array | - | - | 命名区域布局 |
| `align` | String | `stretch` | `start`、`end`、`center`、`stretch`、`baseline` | 子项对齐方式 |
| `justify` | String | `start` | `start`、`end`、`center`、`space-between`、`space-around`、`space-evenly`、`stretch` | 内容对齐方式 |
| `responsive` | Object | `{}` | - | 响应式断点配置 |

## XtGridItem 子项组件

配合 XtGridBox 使用的子项组件，支持跨行跨列等高级布局。

### 属性说明

| 属性 | 类型 | 默认值 | 可选值 | 说明 |
|------|------|--------|--------|------|
| `span` | Number | `1` | >1 | 跨列数 |
| `rowSpan` | Number | `1` | >1 | 跨行数 |
| `start` | Number | `0` | >0 | 起始列位置 |
| `rowStart` | Number | `0` | >0 | 起始行位置 |
| `area` | String | - | - | 命名区域名称 |
| `justifySelf` | String | `auto` | `auto`、`start`、`end`、`center`、`stretch` | 水平对齐 |
| `alignSelf` | String | `auto` | `auto`、`start`、`end`、`center`、`stretch`、`baseline` | 垂直对齐 |

## 示例

### 基础网格

::: demo 基础网格
```vue
<template>
  <XtGridBox :columns="4" gap="12px">
    <div v-for="i in 8" :key="i" style="padding: 12px; background: #e6f7ff; border-radius: 4px; text-align: center;">{{ i }}</div>
  </XtGridBox>
</template>
```
:::

### 列配置方式

::: demo 列配置方式
```vue
<template>
  <div>
    <!-- 数字方式：自动 repeat -->
    <XtGridBox :columns="3" gap="8px" style="margin-bottom: 16px;">
      <div v-for="i in 3" :key="i" style="padding: 12px; background: #f0f0f0;">{{ i }}</div>
    </XtGridBox>
    
    <!-- 字符串方式 -->
    <XtGridBox columns="200px 1fr 1fr" gap="8px" style="margin-bottom: 16px;">
      <div style="padding: 12px; background: #e6f7ff;">固定宽度</div>
      <div style="padding: 12px; background: #f6ffed;">弹性1</div>
      <div style="padding: 12px; background: #fff7e6;">弹性2</div>
    </XtGridBox>
    
    <!-- 数组方式 -->
    <XtGridBox :columns="['100px', '1fr', '2fr']" gap="8px">
      <div style="padding: 12px; background: #f9f0ff;">固定</div>
      <div style="padding: 12px; background: #e6fffb;">1份</div>
      <div style="padding: 12px; background: #fff7e6;">2份</div>
    </XtGridBox>
  </div>
</template>
```
:::

### 跨列跨行

::: demo 跨列跨行
```vue
<template>
  <XtGridBox :columns="4" gap="12px">
    <XtGridItem :span="2" style="padding: 24px; background: #1890ff; color: white; border-radius: 8px;">跨2列</XtGridItem>
    <XtGridItem style="padding: 24px; background: #52c41a; color: white; border-radius: 8px;">普通</XtGridItem>
    <XtGridItem style="padding: 24px; background: #52c41a; color: white; border-radius: 8px;">普通</XtGridItem>
    <XtGridItem :rowSpan="2" style="padding: 48px 16px; background: #faad14; color: white; border-radius: 8px;">跨2行</XtGridItem>
    <XtGridItem style="padding: 24px; background: #f5222d; color: white; border-radius: 8px;">普通</XtGridItem>
    <XtGridItem style="padding: 24px; background: #f5222d; color: white; border-radius: 8px;">普通</XtGridItem>
    <XtGridItem style="padding: 24px; background: #f5222d; color: white; border-radius: 8px;">普通</XtGridItem>
  </XtGridBox>
</template>
```
:::

### 命名区域布局

::: demo 命名区域布局
```vue
<template>
  <XtGridBox 
    :areas="[
      'header header header',
      'sidebar main main',
      'footer footer footer'
    ]"
    gap="12px"
  >
    <XtGridItem area="header" style="padding: 16px; background: #1890ff; color: white; border-radius: 8px;">Header</XtGridItem>
    <XtGridItem area="sidebar" style="padding: 16px; background: #52c41a; color: white; border-radius: 8px;">Sidebar</XtGridItem>
    <XtGridItem area="main" style="padding: 16px; background: #faad14; color: white; border-radius: 8px;">Main Content</XtGridItem>
    <XtGridItem area="footer" style="padding: 16px; background: #f5222d; color: white; border-radius: 8px;">Footer</XtGridItem>
  </XtGridBox>
</template>
```
:::

### 对齐方式

::: demo 对齐方式
```vue
<template>
  <div>
    <!-- 子项居中对齐 -->
    <XtGridBox :columns="3" gap="8px" align="center" style="height: 120px; background: #f0f0f0; margin-bottom: 16px;">
      <div style="padding: 8px 16px; background: white;">居中</div>
      <div style="padding: 8px 16px; background: white;">居中</div>
      <div style="padding: 8px 16px; background: white;">居中</div>
    </XtGridBox>
    
    <!-- 内容两端对齐 -->
    <XtGridBox :columns="3" gap="8px" justify="space-between" style="background: #f0f0f0;">
      <div style="padding: 8px 16px; background: white;">左</div>
      <div style="padding: 8px 16px; background: white;">中</div>
      <div style="padding: 8px 16px; background: white;">右</div>
    </XtGridBox>
  </div>
</template>
```
:::

### 独立间距控制

::: demo 独立间距控制
```vue
<template>
  <XtGridBox :columns="3" rowGap="24px" colGap="8px">
    <div v-for="i in 6" :key="i" style="padding: 12px; background: #e6f7ff; text-align: center;">{{ i }}</div>
  </XtGridBox>
</template>
```
:::

### 自动填充布局

::: demo 自动填充布局
```vue
<template>
  <XtGridBox columns="repeat(auto-fill, minmax(150px, 1fr))" gap="12px">
    <div v-for="i in 8" :key="i" style="padding: 16px; background: #f0f0f0; text-align: center;">项目{{ i }}</div>
  </XtGridBox>
</template>
```
:::

### 嵌套网格

::: demo 嵌套网格
```vue
<template>
  <XtGridBox :columns="2" gap="16px">
    <!-- 左侧 -->
    <div style="padding: 16px; background: #e6f7ff;">
      <h4>左侧面板</h4>
      <XtGridBox :columns="1" gap="8px">
        <div style="padding: 8px; background: white;">子项1</div>
        <div style="padding: 8px; background: white;">子项2</div>
      </XtGridBox>
    </div>
    
    <!-- 右侧 -->
    <div style="padding: 16px; background: #f6ffed;">
      <h4>右侧面板</h4>
      <XtGridBox :columns="2" gap="8px">
        <div style="padding: 8px; background: white;">A</div>
        <div style="padding: 8px; background: white;">B</div>
        <div style="padding: 8px; background: white;">C</div>
        <div style="padding: 8px; background: white;">D</div>
      </XtGridBox>
    </div>
  </XtGridBox>
</template>
```
:::

## 常见布局问题解决方案

### 1. 网格内容溢出

**问题**：当网格内容过多时，网格会超出容器边界

**解决方案**：
```vue
<template>
  <XtGridBox :columns="3" gap="12px" style="min-height: 0;">
    <div style="overflow-y: auto; max-height: 200px;">
      <!-- 大量内容 -->
    </div>
  </XtGridBox>
</template>
```

### 2. 动态内容高度不一致

**问题**：网格子项内容高度不同导致布局错乱

**解决方案**：
```vue
<template>
  <!-- 使用 align 属性强制对齐 -->
  <XtGridBox :columns="3" gap="12px" align="stretch">
    <div style="display: flex; flex-direction: column;">
      <div style="flex: 1;">内容区域</div>
      <div>固定底部</div>
    </div>
  </XtGridBox>
</template>
```

### 3. 响应式列数调整

**问题**：在不同屏幕尺寸下需要不同的列数

**解决方案**：
```vue
<template>
  <!-- 使用 CSS 类配合媒体查询 -->
  <XtGridBox class="responsive-grid" gap="12px">
    <div v-for="i in 6" :key="i" style="padding: 12px; background: #f0f0f0;">{{ i }}</div>
  </XtGridBox>
</template>

<style>
.responsive-grid {
  grid-template-columns: repeat(1, 1fr);
}

@media (min-width: 576px) {
  .responsive-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 768px) {
  .responsive-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
```

### 4. 网格项无法收缩

**问题**：当父容器高度受限，子项无法自动收缩

**解决方案**：
```vue
<template>
  <div style="height: 300px; background: #f0f0f0;">
    <XtGridBox :columns="2" style="height: 100%; min-height: 0;">
      <div style="overflow-y: auto;">
        <!-- 可滚动内容 -->
      </div>
      <div>固定内容</div>
    </XtGridBox>
  </div>
</template>
```

## 注意事项

1. **min-height: 0**：当网格作为子元素嵌套在其他布局中时，建议设置 `min-height: 0` 以确保正确的收缩行为
2. **响应式设计**：建议配合 CSS 媒体查询实现响应式布局
3. **性能优化**：对于大量网格项，考虑使用 `flow="dense"` 优化空间利用率
4. **嵌套使用**：网格可以嵌套使用，但注意控制嵌套层级以避免性能问题