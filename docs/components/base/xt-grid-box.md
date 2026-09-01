基于 CSS Grid 实现的网格布局组件，提供强大的二维布局能力，支持响应式设计和灵活的配置选项。

## 基本用法

::: demo 基本用法
```vue
<template>
  <XtGridBox :columns="3" gap="16px">
    <div style="padding: 16px; background: #1890ff; color: white; border-radius: 8px;">元素1</div>
    <div style="padding: 16px; background: #52c41a; color: white; border-radius: 8px;">元素2</div>
    <div style="padding: 16px; background: #faad14; color: white; border-radius: 8px;">元素3</div>
    <div style="padding: 16px; background: #f56c6c; color: white; border-radius: 8px;">元素4</div>
    <div style="padding: 16px; background: #9adbbe; color: white; border-radius: 8px;">元素5</div>
    <div style="padding: 16px; background: #40ffef; color: white; border-radius: 8px;">元素6</div>
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
| `flow` | String | - | `row`、`column`、`row dense`、`column dense` | 自动排列方向，不设置遵循 CSS 默认 |
| `areas` | String / Array | - | - | 命名区域布局 |
| `align` | String | - | `start`、`end`、`center`、`stretch`、`baseline` | 子项对齐方式，不设置遵循 CSS 默认（stretch） |
| `justify` | String | - | `start`、`end`、`center`、`space-between`、`space-around`、`space-evenly`、`stretch` | 内容对齐方式，不设置遵循 CSS 默认 |
| `responsive` | Object | `{}` | - | 容器级响应式列配置，如 `{ sm: 2, md: 3, lg: 4 }` |

## 响应式列数

基于 `ResizeObserver` 监听**容器宽度**（而非视口宽度）自动切换列数，移动优先匹配：当前断点未配置时向下查找最近的已配置断点，全部未命中则回退到 `columns`。

::: demo 响应式列数（拖动浏览器窗口宽度观察列数变化：lg 4列 / md 3列 / sm 2列 / xs 1列）
```vue
<template>
  <XtGridBox :columns="1" :responsive="{ sm: 2, md: 3, lg: 4 }" gap="12px">
    <div v-for="i in 8" :key="i" style="padding: 12px; background: #1890ff; color: white; text-align: center;">{{ i }}</div>
  </XtGridBox>
</template>
```
:::

**断点约定**（与 Bootstrap 一致，基于容器宽度）：

| 断点 | 容器宽度 |
|------|---------|
| `xs` | < 576px |
| `sm` | >= 576px |
| `md` | >= 768px |
| `lg` | >= 992px |
| `xl` | >= 1200px |

::: demo 断点级联回退（未配置的断点向下查找：xl 命中 lg 的 3 列配置）
```vue
<template>
  <!-- 只配置了 sm 和 lg：xs/sm 用 2 列，md 向下命中 sm 用 2 列，lg/xl 用 3 列 -->
  <XtGridBox :columns="1" :responsive="{ sm: 2, lg: 3 }" gap="12px">
    <div v-for="i in 6" :key="i" style="padding: 12px; background: #52c41a; color: white; text-align: center;">{{ i }}</div>
  </XtGridBox>
</template>
```
:::

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
    <div v-for="i in 8" :key="i" style="padding: 12px; background: #1890ff; border-radius: 4px; text-align: center;">{{ i }}</div>
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
      <div v-for="i in 3" :key="i" style="padding: 12px; background: #1890ff;">{{ i }}</div>
    </XtGridBox>
    
    <!-- 字符串方式 -->
    <XtGridBox columns="200px 1fr 1fr" gap="8px" style="margin-bottom: 16px;">
      <div style="padding: 12px; background: #52c41a;">固定宽度</div>
      <div style="padding: 12px; background: #faad14;">弹性1</div>
      <div style="padding: 12px; background: #f5222d;">弹性2</div>
    </XtGridBox>
    
    <!-- 数组方式 -->
    <XtGridBox :columns="['100px', '1fr', '2fr']" gap="8px">
      <div style="padding: 12px; background: #52c41a;">固定</div>
      <div style="padding: 12px; background: #faad14;">1份</div>
      <div style="padding: 12px; background: #f5222d;">2份</div>
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
    <XtGridItem :span="2" style="padding: 24px; background: #52c41a; color: white; border-radius: 8px;">跨2列</XtGridItem>
    <XtGridItem style="padding: 24px; background: #52c41a; color: white; border-radius: 8px;">普通</XtGridItem>
    <XtGridItem style="padding: 24px; background: #52c41a; color: white; border-radius: 8px;">普通</XtGridItem>
    <XtGridItem :rowSpan="2" style="padding: 48px 16px; background: #faad14; color: white; border-radius: 8px;">跨2行</XtGridItem>
    <XtGridItem style="padding: 24px; background: #52c41a; color: white; border-radius: 8px;">普通</XtGridItem>
    <XtGridItem style="padding: 24px; background: #52c41a; color: white; border-radius: 8px;">普通</XtGridItem>
    <XtGridItem style="padding: 24px; background: #52c41a; color: white; border-radius: 8px;">普通</XtGridItem>
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
      <div style="padding: 8px 16px; background: #1890ff; color: white;">居中</div>
      <div style="padding: 8px 16px; background: #1890ff; color: white;">居中</div>
      <div style="padding: 8px 16px; background: #1890ff; color: white;">居中</div>
    </XtGridBox>
    
    <!-- 内容两端对齐 -->
    <XtGridBox :columns="3" gap="8px" justify="space-between" style="background: #f0f0f0;">
      <div style="padding: 8px 16px;background: #1890ff; color: white;">左</div>
      <div style="padding: 8px 16px;background: #1890ff; color: white;">中</div>
      <div style="padding: 8px 16px;background: #1890ff; color: white;">右</div>
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
    <div v-for="i in 6" :key="i" style="padding: 12px; background: #1890ff; text-align: center;">{{ i }}</div>
  </XtGridBox>
</template>
```
:::

### 自动填充布局

::: demo 自动填充布局
```vue
<template>
  <XtGridBox columns="repeat(auto-fill, minmax(150px, 1fr))" gap="12px">
    <div v-for="i in 8" :key="i" style="padding: 16px; background: #1890ff; text-align: center;">项目{{ i }}</div>
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
    <div style="padding: 16px; background: #f5222d;">
      <h4>左侧面板</h4>
      <XtGridBox :columns="1" gap="8px">
        <div style="padding: 8px; background: #1890ff;">子项1</div>
        <div style="padding: 8px; background: #1890ff;">子项2</div>
      </XtGridBox>
    </div>
    
    <!-- 右侧 -->
    <div style="padding: 16px; background: #faad14;">
      <h4>右侧面板</h4>
      <XtGridBox :columns="2" gap="8px">
        <div style="padding: 8px; background: #1890ff;">A</div>
        <div style="padding: 8px; background: #1890ff;">B</div>
        <div style="padding: 8px; background: #1890ff;">C</div>
        <div style="padding: 8px; background: #1890ff;">D</div>
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

**解决方案**：直接使用 `responsive` 属性（见上方「响应式列数」章节），无需手写媒体查询：

::: demo 响应式列数调整
```vue
<template>
  <XtGridBox :columns="1" :responsive="{ sm: 2, md: 3 }" gap="12px">
    <div v-for="i in 6" :key="i" style="padding: 12px; background: #f0f0f0;">{{ i }}</div>
  </XtGridBox>
</template>
```
:::

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
2. **响应式设计**：使用 `responsive` 属性即可，基于容器宽度而非视口宽度，适合侧边栏收起等局部布局变化场景
3. **性能优化**：对于大量网格项，考虑使用 `flow="row dense"` 优化空间利用率
4. **嵌套使用**：网格可以嵌套使用，但注意控制嵌套层级以避免性能问题