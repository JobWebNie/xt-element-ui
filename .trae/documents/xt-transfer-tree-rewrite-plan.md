# XtTransferTree 组件重写计划

## 上下文

当前 xt-transfer-tree 组件存在以下问题：
1. 不支持复制模式（左侧穿梭后原数据消失）
2. 不支持粘性模式（半选父节点时智能处理）
3. 单节点模式不支持"移动到指定位置"功能
4. 项目中存在冗余文件（xt-layout、pieList.vue、swiperItem.vue）

## 目标

为 xt-transfer-tree 新增三种模式，清理冗余文件，保持向后兼容。

---

## 一、文件清理

删除以下未注册/未引用的冗余文件：

| 文件 | 原因 |
|------|------|
| `src/components/xt-layout/BaseCollapse.vue` | 未在 index.js 注册，无引用，非 xt-* 命名 |
| `src/components/xt-layout/ExFieldset.vue` | 同上，且使用 Ex 前缀 |
| `src/components/xt-layout/` 目录 | 删除后为空 |
| `src/components/xt-chart/pieList.vue` | 无引用 |
| `src/components/xt-list/swiperItem.vue` | 空模板组件，无引用 |

---

## 二、新增 Props

```js
// 复制模式：穿梭到右侧时左侧保留原数据
copyMode: { type: Boolean, default: false },
// 粘性模式：级联勾选 + 半选父节点智能复制 + 全选父节点全移动
stickyMode: { type: Boolean, default: false },
// 单节点模式下的"移动到指定位置"功能
moveToEnabled: { type: Boolean, default: false }
```

约束：`copyMode` 和 `stickyMode` 互斥（created 中 warn）；`moveToEnabled` 仅在 `showCheckbox` 为 false 时生效。

---

## 三、修改核心逻辑

### 1. sourceData（复制模式核心修改）

```
copyMode=true  → 返回完整 this.data，不过滤
stickyMode=true → 排除 value 中但不在 copiedParentKeys 中的节点
默认模式       → 现有逻辑不变
```

### 2. targetData（粘性模式核心修改）

```
stickyMode=true → 包含 value 中的节点 + copiedParentKeys 中的幽灵父节点
默认模式       → 现有逻辑不变
```

### 3. 粘性模式右移逻辑（新增方法 transferKeysStickyToRight）

对于每个勾选的 key：
- 叶子节点 → 直接添加到 value
- 父节点 + 所有子节点都勾选 → 父节点 + 所有子节点都添加到 value
- 父节点 + 部分子节点勾选 → 父节点加入 copiedParentKeys（保持左侧可见），子节点添加到 value

### 4. 粘性模式左移逻辑（新增方法 transferKeysStickyToLeft）

- 从 value 和 copiedParentKeys 中移除对应 key
- 如果移除的是幽灵父节点，同时移除其所有子节点

### 5. 移动到指定位置（新增方法 moveToTarget）

- 左侧选中节点 → selectedLeftKey
- 右侧选中节点 → selectedRightKey
- 按钮触发 → 将 selectedLeftKey 插入到 selectedRightKey 的 top/bottom/before/after 位置

---

## 四、模板修改

1. 按钮区新增"移动到"按钮组（el-select 选位置 + el-button 执行）
2. 右侧树节点 slot 增加幽灵节点标记（`_isCopiedParent` 时显示复制图标）
3. 左侧树 moveTo 模式下高亮当前选中节点

---

## 五、验证

1. `npm run lib` 构建通过
2. 默认模式行为不变（回归）
3. copyMode：穿梭后左侧保留数据，右侧追加
4. stickyMode：半选父节点复制 + 子节点移动，全选父节点全移动
5. moveTo：单节点模式支持移动到指定位置