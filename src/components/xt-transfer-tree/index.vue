<template>
  <div class="xt-transfer-tree" :style="containerStyle">
    <div class="xt-transfer-tree__panel xt-transfer-tree__source" :style="panelStyle">
      <div class="xt-transfer-tree__header">
        <span class="xt-transfer-tree__title">{{ leftTitle }}</span>
        <span class="xt-transfer-tree__count">{{ leftCheckedCount }}/{{ leftTotalCount }}</span>
      </div>
      <div class="xt-transfer-tree__search" v-if="filterable">
        <el-input
          v-model="leftFilterText"
          placeholder="搜索"
          prefix-icon="el-icon-search"
          size="small"
          clearable
        />
      </div>
      <div class="xt-transfer-tree__body">
        <el-tree
          ref="leftTree"
          :data="sourceData"
          :props="treeProps"
          :node-key="treeProps.value"
          :default-expand-all="defaultExpandAll"
          :filter-node-method="filterLeftNode"
          :show-checkbox="showCheckbox"
          :check-strictly="checkStrictlyLeft"
          :default-checked-keys="leftCheckedKeys"
          :highlight-current="highlightCurrent && !showCheckbox"
          @check-change="handleCheckChange('left', $event, arguments[1])"
          @node-click="handleLeftNodeClick"
        >
          <span class="xt-transfer-tree__node" slot-scope="{ node, data }">
            <span>{{ node.label }}</span>
            <span v-if="data.children && data.children.length" class="xt-transfer-tree__node-count">
              ({{ data.children.length }})
            </span>
          </span>
        </el-tree>
      </div>
    </div>

    <div class="xt-transfer-tree__buttons">
      <el-button
        type="primary"
        :disabled="!leftCheckedCount"
        @click="transferToRight"
        :size="buttonSize"
      >
        <i class="el-icon-arrow-right"></i>
      </el-button>
      <el-button
        type="primary"
        :disabled="!rightCheckedCount"
        @click="transferToLeft"
        :size="buttonSize"
      >
        <i class="el-icon-arrow-left"></i>
      </el-button>

      <!-- 移动到指定位置 -->
      <template v-if="moveToEnabled">
        <div class="xt-transfer-tree__move-to">
          <el-select
            v-model="insertPosition"
            size="mini"
            class="xt-transfer-tree__position-select"
          >
            <el-option label="置顶" value="top" />
            <el-option label="置底" value="bottom" />
            <el-option label="之前" value="before" />
            <el-option label="之后" value="after" />
          </el-select>
          <el-button
            type="primary"
            :size="buttonSize"
            :disabled="!selectedLeftKey || !selectedRightKey"
            @click="moveToTarget"
          >
            移动到
          </el-button>
        </div>
      </template>
    </div>

    <div class="xt-transfer-tree__panel xt-transfer-tree__target" :style="panelStyle">
      <div class="xt-transfer-tree__header">
        <span class="xt-transfer-tree__title">{{ rightTitle }}</span>
        <span class="xt-transfer-tree__count">{{ rightCheckedCount }}/{{ rightTotalCount }}</span>
      </div>
      <div class="xt-transfer-tree__search" v-if="filterable">
        <el-input
          v-model="rightFilterText"
          placeholder="搜索"
          prefix-icon="el-icon-search"
          size="small"
          clearable
        />
      </div>
      <div class="xt-transfer-tree__body" :class="{ 'is-draggable': draggable }">
        <!-- 拖拽放置区 -->
        <div
          v-if="draggable"
          class="xt-transfer-tree__drop-zone"
          @dragover.prevent="onDragOver($event)"
          @drop.prevent="onDrop($event)"
        >
          <el-tree
            ref="rightTree"
            :data="targetData"
            :props="treeProps"
            :node-key="treeProps.value"
            :default-expand-all="defaultExpandAll"
            :filter-node-method="filterRightNode"
            :show-checkbox="showCheckbox"
            :check-strictly="!cascade"
            :default-checked-keys="rightCheckedKeys"
            :draggable="true"
            :allow-drop="allowDrop"
            @check-change="handleCheckChange('right', $event, arguments[1])"
            @node-click="handleRightNodeClick"
            @node-drop="handleNodeDrop"
          >
            <span class="xt-transfer-tree__node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span v-if="data._isCopiedParent" class="xt-transfer-tree__copied-badge" title="共享节点，两侧同时存在">
                <i class="el-icon-copy-document"></i>
              </span>
              <span v-if="data.children && data.children.length" class="xt-transfer-tree__node-count">
                ({{ data.children.length }})
              </span>
            </span>
          </el-tree>
        </div>
        <!-- 非拖拽模式 -->
        <template v-else>
          <el-tree
            ref="rightTree"
            :data="targetData"
            :props="treeProps"
            :node-key="treeProps.value"
            :default-expand-all="defaultExpandAll"
            :filter-node-method="filterRightNode"
            :show-checkbox="showCheckbox"
            :check-strictly="!cascade"
            :default-checked-keys="rightCheckedKeys"
            @check-change="handleCheckChange('right', $event, arguments[1])"
            @node-click="handleRightNodeClick"
          >
            <span class="xt-transfer-tree__node" slot-scope="{ node, data }">
              <span>{{ node.label }}</span>
              <span v-if="data._isCopiedParent" class="xt-transfer-tree__copied-badge" title="共享节点，两侧同时存在">
                <i class="el-icon-copy-document"></i>
              </span>
              <span v-if="data.children && data.children.length" class="xt-transfer-tree__node-count">
                ({{ data.children.length }})
              </span>
            </span>
          </el-tree>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'XtTransferTree',

  props: {
    // 数据源（支持嵌套 children 结构或扁平 id/pid 结构）
    data: {
      type: Array,
      default: () => []
    },
    // 已选择的节点 ID 数组（v-model）
    value: {
      type: Array,
      default: () => []
    },
    // 左侧标题
    leftTitle: {
      type: String,
      default: '待选择'
    },
    // 右侧标题
    rightTitle: {
      type: String,
      default: '已选择'
    },
    // 字段映射配置
    treeProps: {
      type: Object,
      default: () => ({
        label: 'label',
        children: 'children',
        value: 'id'
      })
    },
    // 扁平数据的父级字段名
    pidKey: {
      type: String,
      default: 'pid'
    },
    // 扁平数据的根节点 pid 值
    rootPidValue: {
      type: [String, Number, Array],
      default: 0
    },
    // 是否默认展开所有节点
    defaultExpandAll: {
      type: Boolean,
      default: true
    },
    // 是否支持搜索过滤
    filterable: {
      type: Boolean,
      default: false
    },
    // 是否显示复选框
    showCheckbox: {
      type: Boolean,
      default: true
    },
    // 是否级联选择
    cascade: {
      type: Boolean,
      default: true
    },
    // 穿梭模式
    transferMode: {
      type: String,
      default: 'single',
      validator: (val) => ['single', 'multiple', 'parent-child'].includes(val)
    },
    // 按钮尺寸
    buttonSize: {
      type: String,
      default: 'small'
    },
    // 复制模式：右侧穿梭时左侧保留原数据
    copyMode: {
      type: Boolean,
      default: false
    },
    // 粘性模式：级联勾选 + 半选父节点复制 + 全选移动
    stickyMode: {
      type: Boolean,
      default: false
    },
    // 单节点模式下的"移动到指定位置"功能
    moveToEnabled: {
      type: Boolean,
      default: false
    },
    // 固定高度
    height: {
      type: [String, Number],
      default: ''
    },
    // 是否启用拖拽排序（右侧面板）
    draggable: {
      type: Boolean,
      default: false
    },
    // 是否高亮当前选中节点
    highlightCurrent: {
      type: Boolean,
      default: true
    }
  },

  data() {
    return {
      leftFilterText: '',
      rightFilterText: '',
      leftCheckedKeys: [],
      rightCheckedKeys: [],
      // 粘性模式：记录被"复制"到右侧的幽灵父节点 key
      copiedParentKeys: [],
      // 移动到指定位置
      selectedLeftKey: null,
      selectedRightKey: null,
      insertPosition: 'after'
    }
  },

  computed: {
    // 统一的树数据（将扁平数据转换为嵌套结构）
    treeData() {
      if (!this.data || this.data.length === 0) return []
      // 检测是否为扁平数据（包含 pid 字段且无 children）
      const isFlat = this.data.some(item => item[this.pidKey] !== undefined && !item[this.treeProps.children])
      if (isFlat) {
        return this.flatToNested(this.data)
      }
      return this.data
    },

    checkStrictlyLeft() {
      if (this.stickyMode) return false
      return !this.cascade
    },

    containerStyle() {
      return this.height ? { height: this.normalizeHeight(this.height) } : {}
    },

    panelStyle() {
      return this.height ? { height: '100%' } : {}
    },

    sourceData() {
      if (this.copyMode) {
        return this.treeData
      }
      if (this.stickyMode) {
        return this.filterTreeDataSticky(this.treeData, new Set(this.value), new Set(this.copiedParentKeys))
      }
      return this.filterTreeData(this.treeData, new Set(this.value), true)
    },

    targetData() {
      const valueSet = new Set(this.value)
      if (this.stickyMode) {
        return this.filterTreeDataTarget(this.treeData, valueSet, new Set(this.copiedParentKeys))
      }
      return this.filterTreeData(this.treeData, valueSet, false)
    },

    leftTotalCount() {
      return this.countTreeNodes(this.sourceData)
    },

    rightTotalCount() {
      return this.countTreeNodes(this.targetData)
    },

    leftCheckedCount() {
      return this.leftCheckedKeys.length
    },

    rightCheckedCount() {
      return this.rightCheckedKeys.length
    }
  },

  watch: {
    leftFilterText(val) {
      this.$refs.leftTree && this.$refs.leftTree.filter(val)
    },
    rightFilterText(val) {
      this.$refs.rightTree && this.$refs.rightTree.filter(val)
    }
  },

  created() {
    if (this.copyMode && this.stickyMode) {
      console.warn('[XtTransferTree] copyMode 和 stickyMode 互斥，将优先使用 copyMode')
    }
  },

  methods: {
    // ========== 数据转换 ==========

    normalizeHeight(h) {
      return typeof h === 'number' ? h + 'px' : h
    },

    // 将扁平数据（id/pid/label）转换为嵌套 children 结构
    flatToNested(flatData) {
      const { value: valKey, label: labelKey, children: childKey } = this.treeProps
      const pidKey = this.pidKey
      const roots = []
      const nodeMap = {}

      flatData.forEach(item => {
        nodeMap[item[valKey]] = { ...item }
      })

      const rootPids = Array.isArray(this.rootPidValue) ? this.rootPidValue : [this.rootPidValue]

      flatData.forEach(item => {
        const node = nodeMap[item[valKey]]
        const pid = item[pidKey]

        if (rootPids.includes(pid) || pid == null) {
          roots.push(node)
        } else if (nodeMap[pid]) {
          if (!nodeMap[pid][childKey]) {
            nodeMap[pid][childKey] = []
          }
          nodeMap[pid][childKey].push(node)
        } else {
          // 父节点不在数据中，作为根节点
          roots.push(node)
        }
      })

      return roots
    },

    // ========== 树数据过滤 ==========

    filterTreeData(data, valueSet, exclude) {
      return data
        .map(node => {
          const isTarget = valueSet.has(node[this.treeProps.value])
          if (exclude && isTarget) return null
          if (!exclude && !isTarget) return null

          const result = { ...node }
          if (node.children && node.children.length) {
            const filteredChildren = this.filterTreeData(node.children, valueSet, exclude)
            if (filteredChildren.length) {
              result.children = filteredChildren
            } else {
              delete result.children
            }
          }
          return result
        })
        .filter(Boolean)
    },

    filterTreeDataSticky(data, valueSet, copiedSet) {
      return data
        .map(node => {
          const key = node[this.treeProps.value]
          const isCopied = copiedSet.has(key)
          if (valueSet.has(key) && !isCopied) return null

          const result = { ...node }
          if (node.children && node.children.length) {
            const filteredChildren = this.filterTreeDataSticky(node.children, valueSet, copiedSet)
            if (filteredChildren.length) {
              result.children = filteredChildren
            } else {
              delete result.children
            }
          }
          return result
        })
        .filter(Boolean)
    },

    filterTreeDataTarget(data, valueSet, copiedSet) {
      return data
        .map(node => {
          const key = node[this.treeProps.value]
          const inValue = valueSet.has(key)
          const isCopied = copiedSet.has(key)
          if (!inValue && !isCopied) return null

          const result = { ...node }
          if (isCopied && !inValue) {
            result._isCopiedParent = true
          }
          if (node.children && node.children.length) {
            const filteredChildren = this.filterTreeDataTarget(node.children, valueSet, copiedSet)
            if (filteredChildren.length) {
              result.children = filteredChildren
            } else {
              delete result.children
            }
          }
          return result
        })
        .filter(Boolean)
    },

    // ========== 工具方法 ==========

    countTreeNodes(data) {
      let count = 0
      data.forEach(node => {
        count++
        if (node.children) {
          count += this.countTreeNodes(node.children)
        }
      })
      return count
    },

    getAllKeys(node, keys = []) {
      keys.push(node[this.treeProps.value])
      if (node.children) {
        node.children.forEach(child => this.getAllKeys(child, keys))
      }
      return keys
    },

    getParentKeys(data, key, parentKeys = []) {
      for (const node of data) {
        if (node[this.treeProps.value] === key) {
          return parentKeys
        }
        if (node.children) {
          const result = this.getParentKeys(node.children, key, [...parentKeys, node[this.treeProps.value]])
          if (result.length > 0) return result
        }
      }
      return []
    },

    findNodeByKey(data, key) {
      for (const node of data) {
        if (node[this.treeProps.value] === key) return node
        if (node.children) {
          const found = this.findNodeByKey(node.children, key)
          if (found) return found
        }
      }
      return null
    },

    isParentFullyChecked(node, checkedKeys) {
      if (!node.children || node.children.length === 0) return false
      const checkedSet = new Set(checkedKeys)
      return node.children.every(child => checkedSet.has(child[this.treeProps.value]))
    },

    collectAllDescendantKeys(node, targetSet) {
      if (node.children) {
        node.children.forEach(child => {
          targetSet.add(child[this.treeProps.value])
          this.collectAllDescendantKeys(child, targetSet)
        })
      }
    },

    findAllChildKeys(data, parentKey, childKeys) {
      for (const node of data) {
        if (node[this.treeProps.value] === parentKey && node.children) {
          node.children.forEach(child => {
            childKeys.push(child[this.treeProps.value])
            if (child.children) {
              this.findAllChildKeys([child], child[this.treeProps.value], childKeys)
            }
          })
        }
        if (node.children) {
          this.findAllChildKeys(node.children, parentKey, childKeys)
        }
      }
    },

    // ========== 过滤 ==========

    filterLeftNode(value, data) {
      return this.filterNode(value, data)
    },

    filterRightNode(value, data) {
      return this.filterNode(value, data)
    },

    filterNode(value, data) {
      if (!value) return true
      return String(data[this.treeProps.label]).toLowerCase().indexOf(value.toLowerCase()) !== -1
    },

    // ========== 勾选变化 ==========

    handleCheckChange(side, data, checked) {
      const key = data[this.treeProps.value]
      const keysRef = side === 'left' ? 'leftCheckedKeys' : 'rightCheckedKeys'
      if (checked) {
        if (!this[keysRef].includes(key)) {
          this[keysRef].push(key)
        }
      } else {
        this[keysRef] = this[keysRef].filter(k => k !== key)
      }
    },

    // ========== 节点点击 ==========

    handleLeftNodeClick(data) {
      if (this.moveToEnabled && !this.showCheckbox) {
        this.selectedLeftKey = data[this.treeProps.value]
        return
      }
      if (!this.showCheckbox) {
        const keysToTransfer = this.getTransferKeys(data)
        this.transferKeys(keysToTransfer, true)
        if (!this.copyMode) {
          this.leftCheckedKeys = []
        }
      }
    },

    handleRightNodeClick(data) {
      if (this.moveToEnabled && !this.showCheckbox) {
        this.selectedRightKey = data[this.treeProps.value]
        return
      }
      if (!this.showCheckbox) {
        const keysToTransfer = this.getTransferKeys(data)
        this.transferKeys(keysToTransfer, false)
        this.rightCheckedKeys = []
      }
    },

    getTransferKeys(data) {
      switch (this.transferMode) {
        case 'parent-child':
          return this.getAllKeys(data)
        default:
          return [data[this.treeProps.value]]
      }
    },

    // ========== 拖拽排序 ==========

    allowDrop(draggingNode, dropNode, type) {
      return type !== 'inner' || !dropNode.children || dropNode.children.length === 0
    },

    onDragOver(e) {
      e.dataTransfer.dropEffect = 'move'
    },

    onDrop(e) {
      // el-tree 内部处理了 node-drop 事件
    },

    handleNodeDrop(draggingNode, dropNode, dropType, ev) {
      const dragKey = draggingNode.data[this.treeProps.value]
      const dropKey = dropNode.data[this.treeProps.value]

      // 拖拽仅在右侧有效（拖拽排序本身就是右侧的功能）
      if (!this.value.includes(dragKey)) return

      const currentValue = [...this.value]
      const dragIndex = currentValue.indexOf(dragKey)
      if (dragIndex === -1) return

      currentValue.splice(dragIndex, 1)

      const dropIndex = currentValue.indexOf(dropKey)
      if (dropIndex === -1) {
        currentValue.push(dragKey)
      } else {
        if (dropType === 'before') {
          currentValue.splice(dropIndex, 0, dragKey)
        } else if (dropType === 'after') {
          currentValue.splice(dropIndex + 1, 0, dragKey)
        } else {
          currentValue.splice(dropIndex, 0, dragKey)
        }
      }

      this.$emit('input', currentValue)
      this.$emit('change', {
        value: currentValue,
        addedKeys: [],
        removedKeys: []
      })
    },

    // ========== 穿梭 ==========

    transferToRight() {
      const keys = [...this.leftCheckedKeys]
      if (this.stickyMode) {
        this.transferKeysStickyToRight(keys)
      } else {
        this.transferKeys(keys, true)
      }
      if (!this.copyMode) {
        this.leftCheckedKeys = []
      }
    },

    transferToLeft() {
      const keys = [...this.rightCheckedKeys]
      if (this.stickyMode) {
        this.transferKeysStickyToLeft(keys)
      } else {
        this.transferKeys(keys, false)
      }
      this.rightCheckedKeys = []
    },

    transferKeys(keys, toRight) {
      const currentValue = [...this.value]
      const newKeys = new Set(currentValue)

      if (toRight) {
        keys.forEach(k => newKeys.add(k))
        if (this.cascade && !this.copyMode) {
          keys.forEach(k => {
            const parentKeys = this.getParentKeys(this.treeData, k)
            parentKeys.forEach(pk => newKeys.add(pk))
          })
        }
      } else {
        keys.forEach(k => newKeys.delete(k))
        if (this.cascade) {
          keys.forEach(k => {
            const allChildKeys = []
            this.findAllChildKeys(this.treeData, k, allChildKeys)
            allChildKeys.forEach(ck => newKeys.delete(ck))
          })
        }
      }

      const newValue = Array.from(newKeys)
      this.$emit('input', newValue)
      this.$emit('change', {
        value: newValue,
        addedKeys: toRight ? keys : [],
        removedKeys: toRight ? [] : keys
      })
    },

    // ========== 粘性模式穿梭 ==========

    transferKeysStickyToRight(checkedKeys) {
      const currentValue = [...this.value]
      const newKeys = new Set(currentValue)
      const newCopied = new Set(this.copiedParentKeys)

      checkedKeys.forEach(key => {
        const node = this.findNodeByKey(this.treeData, key)
        if (!node) {
          newKeys.add(key)
          return
        }

        if (node.children && node.children.length > 0 && this.isParentFullyChecked(node, checkedKeys)) {
          newKeys.add(key)
          this.collectAllDescendantKeys(node, newKeys)
          newCopied.delete(key)
        } else if (node.children && node.children.length > 0) {
          newCopied.add(key)
          const checkedSet = new Set(checkedKeys)
          node.children.forEach(child => {
            const childKey = child[this.treeProps.value]
            if (checkedSet.has(childKey)) {
              newKeys.add(childKey)
            }
          })
        } else {
          newKeys.add(key)
        }
      })

      this.copiedParentKeys = Array.from(newCopied)
      const newValue = Array.from(newKeys)
      this.$emit('input', newValue)
      this.$emit('change', {
        value: newValue,
        addedKeys: checkedKeys,
        removedKeys: []
      })
    },

    transferKeysStickyToLeft(checkedKeys) {
      const currentValue = [...this.value]
      const newKeys = new Set(currentValue)
      const newCopied = new Set(this.copiedParentKeys)

      checkedKeys.forEach(key => {
        if (newCopied.has(key)) {
          newCopied.delete(key)
          const node = this.findNodeByKey(this.treeData, key)
          if (node) {
            const descendantKeys = new Set()
            this.collectAllDescendantKeys(node, descendantKeys)
            descendantKeys.forEach(dk => newKeys.delete(dk))
          }
        }
        newKeys.delete(key)
      })

      this.copiedParentKeys = Array.from(newCopied)
      const newValue = Array.from(newKeys)
      this.$emit('input', newValue)
      this.$emit('change', {
        value: newValue,
        addedKeys: [],
        removedKeys: checkedKeys
      })
    },

    // ========== 移动到指定位置 ==========

    moveToTarget() {
      if (!this.selectedLeftKey || !this.selectedRightKey) return

      const currentValue = [...this.value]
      const targetIndex = currentValue.indexOf(this.selectedRightKey)

      const leftIndex = currentValue.indexOf(this.selectedLeftKey)
      if (leftIndex !== -1) {
        currentValue.splice(leftIndex, 1)
      }

      let insertIndex = targetIndex
      if (targetIndex === -1) {
        insertIndex = currentValue.length
      } else {
        switch (this.insertPosition) {
          case 'top':
            insertIndex = 0
            break
          case 'bottom':
            insertIndex = currentValue.length
            break
          case 'before':
            break
          case 'after':
            insertIndex = targetIndex + 1
            break
        }
      }

      currentValue.splice(insertIndex, 0, this.selectedLeftKey)

      this.$emit('input', currentValue)
      this.$emit('change', {
        value: currentValue,
        addedKeys: [this.selectedLeftKey],
        removedKeys: []
      })

      this.selectedLeftKey = null
      this.selectedRightKey = null
    },

    // ========== 公共方法 ==========

    clearSelection() {
      this.leftCheckedKeys = []
      this.rightCheckedKeys = []
    }
  }
}
</script>

<style lang="scss" scoped>
.xt-transfer-tree {
  display: flex;
  align-items: stretch;
  width: 100%;
  height: 100%;
}

.xt-transfer-tree__panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  overflow: hidden;
}

.xt-transfer-tree__source {
  margin-right: 8px;
}

.xt-transfer-tree__target {
  margin-left: 8px;
}

.xt-transfer-tree__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  background: #f5f7fa;
  border-bottom: 1px solid #ebeef5;
}

.xt-transfer-tree__title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}

.xt-transfer-tree__count {
  font-size: 12px;
  color: #909399;
}

.xt-transfer-tree__search {
  padding: 8px 12px;
  border-bottom: 1px solid #ebeef5;
}

.xt-transfer-tree__body {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.xt-transfer-tree__body.is-draggable {
  padding: 8px;
}

.xt-transfer-tree__drop-zone {
  width: 100%;
  min-height: 100%;
}

.xt-transfer-tree__buttons {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 8px;
  gap: 8px;
}

.xt-transfer-tree__node {
  display: flex;
  align-items: center;
  gap: 4px;
}

.xt-transfer-tree__node-count {
  font-size: 12px;
  color: #909399;
}

.xt-transfer-tree__copied-badge {
  font-size: 12px;
  color: #e6a23c;
  margin-left: 4px;
  cursor: help;
}

.xt-transfer-tree__move-to {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #ebeef5;
}

.xt-transfer-tree__position-select {
  width: 80px;
}

.xt-transfer-tree__body::-webkit-scrollbar {
  width: 6px;
}

.xt-transfer-tree__body::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.xt-transfer-tree__body::-webkit-scrollbar-track {
  background: transparent;
}
</style>