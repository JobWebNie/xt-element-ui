<template>
  <div class="xt-transfer-tree">
    <div class="xt-transfer-tree__panel xt-transfer-tree__source">
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
        />
      </div>
      <div class="xt-transfer-tree__body">
        <el-tree
          ref="leftTree"
          :data="sourceData"
          :props="treeProps"
          :default-expand-all="defaultExpandAll"
          :filter-node-method="filterLeftNode"
          :show-checkbox="showCheckbox"
          :check-strictly="!cascade"
          :default-checked-keys="leftCheckedKeys"
          @check-change="handleLeftCheckChange"
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
    </div>

    <div class="xt-transfer-tree__panel xt-transfer-tree__target">
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
        />
      </div>
      <div class="xt-transfer-tree__body">
        <el-tree
          ref="rightTree"
          :data="targetData"
          :props="treeProps"
          :default-expand-all="defaultExpandAll"
          :filter-node-method="filterRightNode"
          :show-checkbox="showCheckbox"
          :check-strictly="!cascade"
          :default-checked-keys="rightCheckedKeys"
          @check-change="handleRightCheckChange"
          @node-click="handleRightNodeClick"
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
  </div>
</template>

<script>
export default {
  name: 'XtTransferTree',

  props: {
    data: {
      type: Array,
      default: () => []
    },
    value: {
      type: Array,
      default: () => []
    },
    leftTitle: {
      type: String,
      default: '待选择'
    },
    rightTitle: {
      type: String,
      default: '已选择'
    },
    treeProps: {
      type: Object,
      default: () => ({
        label: 'label',
        children: 'children',
        value: 'id'
      })
    },
    defaultExpandAll: {
      type: Boolean,
      default: true
    },
    filterable: {
      type: Boolean,
      default: false
    },
    showCheckbox: {
      type: Boolean,
      default: true
    },
    cascade: {
      type: Boolean,
      default: true
    },
    transferMode: {
      type: String,
      default: 'single',
      validator: (val) => ['single', 'multiple', 'parent-child'].includes(val)
    },
    buttonSize: {
      type: String,
      default: 'small'
    }
  },

  data() {
    return {
      leftFilterText: '',
      rightFilterText: '',
      leftCheckedKeys: [],
      rightCheckedKeys: []
    }
  },

  computed: {
    sourceData() {
      const valueSet = new Set(this.value)
      return this.filterTreeData(this.data, valueSet, true)
    },

    targetData() {
      const valueSet = new Set(this.value)
      return this.filterTreeData(this.data, valueSet, false)
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

  methods: {
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

    filterLeftNode(value, data) {
      if (!value) return true
      return String(data[this.treeProps.label]).toLowerCase().indexOf(value.toLowerCase()) !== -1
    },

    filterRightNode(value, data) {
      if (!value) return true
      return String(data[this.treeProps.label]).toLowerCase().indexOf(value.toLowerCase()) !== -1
    },

    handleLeftCheckChange(data, checked) {
      const key = data[this.treeProps.value]
      if (checked) {
        if (!this.leftCheckedKeys.includes(key)) {
          this.leftCheckedKeys.push(key)
        }
        if (this.cascade && data.children) {
          data.children.forEach(child => {
            const childKey = child[this.treeProps.value]
            if (!this.leftCheckedKeys.includes(childKey)) {
              this.leftCheckedKeys.push(childKey)
            }
          })
        }
      } else {
        this.leftCheckedKeys = this.leftCheckedKeys.filter(k => k !== key)
        if (this.cascade && data.children) {
          data.children.forEach(child => {
            this.leftCheckedKeys = this.leftCheckedKeys.filter(k => k !== child[this.treeProps.value])
          })
        }
      }
    },

    handleRightCheckChange(data, checked) {
      const key = data[this.treeProps.value]
      if (checked) {
        if (!this.rightCheckedKeys.includes(key)) {
          this.rightCheckedKeys.push(key)
        }
        if (this.cascade && data.children) {
          data.children.forEach(child => {
            const childKey = child[this.treeProps.value]
            if (!this.rightCheckedKeys.includes(childKey)) {
              this.rightCheckedKeys.push(childKey)
            }
          })
        }
      } else {
        this.rightCheckedKeys = this.rightCheckedKeys.filter(k => k !== key)
        if (this.cascade && data.children) {
          data.children.forEach(child => {
            this.rightCheckedKeys = this.rightCheckedKeys.filter(k => k !== child[this.treeProps.value])
          })
        }
      }
    },

    handleLeftNodeClick(data) {
      if (!this.showCheckbox) {
        const key = data[this.treeProps.value]
        const keysToTransfer = this.getTransferKeys(data)
        this.transferKeys(keysToTransfer, true)
      }
    },

    handleRightNodeClick(data) {
      if (!this.showCheckbox) {
        const key = data[this.treeProps.value]
        const keysToTransfer = this.getTransferKeys(data)
        this.transferKeys(keysToTransfer, false)
      }
    },

    getTransferKeys(data) {
      const key = data[this.treeProps.value]
      switch (this.transferMode) {
        case 'parent-child':
          return this.getAllKeys(data)
        case 'multiple':
          return [key]
        default:
          return [key]
      }
    },

    transferToRight() {
      const keys = [...this.leftCheckedKeys]
      this.transferKeys(keys, true)
      this.leftCheckedKeys = []
    },

    transferToLeft() {
      const keys = [...this.rightCheckedKeys]
      this.transferKeys(keys, false)
      this.rightCheckedKeys = []
    },

    transferKeys(keys, toRight) {
      const currentValue = [...this.value]
      const newKeys = new Set(currentValue)

      if (toRight) {
        keys.forEach(k => newKeys.add(k))
        if (this.cascade) {
          keys.forEach(k => {
            const parentKeys = this.getParentKeys(this.data, k)
            parentKeys.forEach(pk => newKeys.add(pk))
          })
        }
      } else {
        keys.forEach(k => newKeys.delete(k))
        if (this.cascade) {
          keys.forEach(k => {
            const allChildKeys = []
            this.findAllChildKeys(this.data, k, allChildKeys)
            allChildKeys.forEach(ck => newKeys.delete(ck))
          })
        }
      }

      const newValue = Array.from(newKeys)
      this.$emit('update:value', newValue)
      this.$emit('change', {
        value: newValue,
        addedKeys: toRight ? keys : [],
        removedKeys: toRight ? [] : keys
      })
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