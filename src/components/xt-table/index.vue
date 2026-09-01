<template>
  <div class="xt-table-wrapper">
    <!-- 标题栏 / 工具栏 -->
    <div class="xt-table-header" v-if="title || $slots.toolbar">
      <span class="xt-table-title" v-if="title">{{ title }}</span>
      <div class="xt-table-toolbar">
        <slot name="toolbar"></slot>
      </div>
    </div>

    <!-- 主体表格：单 Table + 内置虚拟滚动（核心改造） -->
    <div class="xt-table-body">
      <VirtualElTable
        ref="table"
        :data="processedTableData"
        :height="computedHeight"
        :max-height="computedMaxHeight"
        :virtual-scroll="virtualScroll"
        :row-height="rowInitHeight"
        :buffer-size="bufferSize"
        :span-method="groupColumns.length ? handleSpanMethod : undefined"
        :row-class-name="getRowClassName"
        v-bind="$attrs"
        v-on="$listeners"
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
        class="xt-table"
      >
        <!-- 选择列 -->
        <el-table-column
          v-if="selection"
          type="selection"
          width="55"
          :fixed="selectionFixed"
        />
        <!-- 序号列 -->
        <el-table-column
          v-if="showIndex"
          type="index"
          width="60"
          label="#"
          :fixed="indexFixed"
          :index="indexMethod"
        />
        <!-- 多级列配置 -->
        <template v-for="col in flattenedColumns">
          <el-table-column
            v-if="col.children && col.children.length"
            :key="col._key"
            v-bind="getColumnProps(col)"
          >
            <template v-for="child in col.children">
              <el-table-column :key="child._key" v-bind="getColumnProps(child)">
                <template v-if="child.render" v-slot="scope">
                  <XtTableCell
                    :row="scope.row"
                    :index="scope.$index"
                    :render="child.render"
                    :column="child"
                  />
                </template>
                <template v-else-if="child.slot" v-slot="scope">
                  <slot
                    :name="child.slot"
                    :row="scope.row"
                    :index="scope.$index"
                    :column="child"
                  />
                </template>
              </el-table-column>
            </template>
          </el-table-column>
          <el-table-column v-else :key="col._key" v-bind="getColumnProps(col)">
            <template v-if="col.render" v-slot="scope">
              <XtTableCell
                :row="scope.row"
                :index="scope.$index"
                :render="col.render"
                :column="col"
              />
            </template>
            <template v-else-if="col.slot" v-slot="scope">
              <slot
                :name="col.slot"
                :row="scope.row"
                :index="scope.$index"
                :column="col"
              />
            </template>
          </el-table-column>
        </template>
      </VirtualElTable>
    </div>

    <!-- 分页 -->
    <div class="xt-table-footer" v-if="showPagination">
      <el-pagination
        :current-page="pagination.pageNum"
        :page-size="pagination.pageSize"
        :total="total"
        :page-sizes="pagination.pageSizes || [10, 20, 50, 100]"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import XtTableCell from './XtTableCell.vue'
import VirtualElTable from './VirtualElTable.vue'
import { createSortComparator } from '../../utils/sort'

export default {
  name: 'XtTable',
  inheritAttrs: false,
  components: { XtTableCell, VirtualElTable },

  props: {
    tableData: { type: Array, default: () => [] },
    columns: { type: Array, default: () => [] },
    groupColumns: { type: Array, default: () => [] },
    // 排序配置
    sortGroup: { type: Boolean, default: false },
    defaultSort: { type: Object, default: null },
    // 过滤配置
    filterMethod: { type: Function, default: null },
    title: { type: String, default: '' },
    height: { type: [Number, String], default: null },
    maxHeight: { type: [Number, String], default: null },
    virtualScroll: { type: Boolean, default: false },
    rowInitHeight: { type: Number, default: 48 },
    bufferSize: { type: Number, default: 5 },
    pagination: { type: Object, default: null },
    total: { type: Number, default: 0 },
    showIndex: { type: Boolean, default: false },
    selection: { type: Boolean, default: false },
    selectionFixed: { type: [String, Boolean], default: false },
    indexFixed: { type: [String, Boolean], default: false },
    loading: { type: Boolean, default: false },
    emptyText: { type: String, default: '暂无数据' },
    subtotalConfig: { type: Object, default: () => ({ enabled: false }) },
    totalConfig: { type: Object, default: () => ({ enabled: false }) }
  },

  data() {
    return {
      spanCache: {},
      flattenedColumnsCache: [],
      selectedRows: [],
      // 排序状态
      sortProp: null,
      sortOrder: null
    }
  },

  computed: {
    showPagination() {
      return this.pagination && this.total > 0
    },
    computedHeight() {
      return this.height || undefined
    },
    computedMaxHeight() {
      return this.height ? undefined : this.maxHeight || undefined
    },

    // 排序后的数据
    sortedTableData() {
      if (!this.tableData.length) return []

      let data = [...this.tableData]

      if (typeof this.filterMethod === 'function') {
        data = data.filter(this.filterMethod)
      }

      if (!this.sortProp || !this.sortOrder) return data

      const order = this.sortOrder === 'ascending' ? 1 : -1
      const sortFn = this.resolveSortMethod(this.sortProp)

      if (this.sortGroup && this.groupColumns.length) {
        return this.groupSort(data, sortFn, order)
      }
      return data.sort((a, b) => sortFn(a, b) * order)
    },

    // 处理小计、总计后的最终数据
    processedTableData() {
      if (!this.sortedTableData.length) return []
      let data = [...this.sortedTableData]
      const hasSubtotal = this.subtotalConfig && this.subtotalConfig.enabled
      const hasTotal = this.totalConfig && this.totalConfig.enabled

      if (!hasSubtotal && !hasTotal) return data

      const labelColumn = this.findLabelColumn()
      let result = []

      if (hasSubtotal && this.subtotalConfig.groupBy && this.subtotalConfig.groupBy.length) {
        const groups = this.groupData(data, this.subtotalConfig.groupBy)
        groups.forEach((groupRows) => {
          result.push(...groupRows)
          const subtotalRow = this.createSubtotalRow(groupRows)
          result.push(subtotalRow)
        })
      } else {
        result = data
      }

      if (hasTotal) {
        const totalRow = this.createTotalRow(data)
        result.push(totalRow)
      }
      return result
    },

    // 扁平化列配置，添加唯一 key
    flattenedColumns() {
      if (this.flattenedColumnsCache.length) return this.flattenedColumnsCache
      const assignKeys = (cols, parentPath = '') => {
        return cols.map((col, index) => {
          const path = parentPath ? `${parentPath}_${index}` : String(index)
          const key = col.prop || col.slot || col.label || path
          const item = { ...col, _key: key }
          if (col.children && col.children.length) {
            item.children = assignKeys(col.children, path)
          }
          return item
        })
      }
      this.flattenedColumnsCache = assignKeys(this.columns)
      return this.flattenedColumnsCache
    }
  },

  watch: {
    tableData() {
      this.spanCache = {}
      this.flattenedColumnsCache = []
    },
    columns: {
      handler() {
        this.flattenedColumnsCache = []
        this.spanCache = {}
      },
      deep: true
    },
    groupColumns: {
      handler() {
        this.spanCache = {}
      },
      deep: true
    },
    defaultSort: {
      handler(val) {
        if (val && val.prop) {
          this.sortProp = val.prop
          this.sortOrder = val.order || 'ascending'
        }
      },
      immediate: false
    },
    sortProp() {
      this.spanCache = {}
    }
  },

  created() {
    if (this.defaultSort && this.defaultSort.prop) {
      this.sortProp = this.defaultSort.prop
      this.sortOrder = this.defaultSort.order || 'ascending'
    }
  },

  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.handleResize)
    })
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
  },

  methods: {
    // ========== 排序逻辑 ==========
    resolveSortMethod(prop) {
      const col = this.findColumnByProp(prop)
      if (col && typeof col.sortMethod === 'function') {
        return col.sortMethod
      }
      return createSortComparator(prop)
    },

    findColumnByProp(prop) {
      for (const col of this.columns) {
        if (col.children && col.children.length) {
          for (const child of col.children) {
            if (child.prop === prop) return child
          }
        } else if (col.prop === prop) {
          return col
        }
      }
      return null
    },

    groupSort(data, sortFn, order) {
      const groups = {}
      data.forEach(row => {
        const key = this.groupColumns.map(f => row[f] == null ? '' : String(row[f])).join('|||')
        if (!groups[key]) groups[key] = []
        groups[key].push(row)
      })
      const result = []
      Object.keys(groups).sort().forEach(key => {
        const groupRows = groups[key]
        groupRows.sort((a, b) => sortFn(a, b) * order)
        result.push(...groupRows)
      })
      return result
    },

    handleResize() {
      this.$nextTick(() => {
        this.$refs.table && this.$refs.table.doLayout()
      })
    },

    // ========== 小计 / 总计 相关 ==========
    findLabelColumn() {
      for (const col of this.columns) {
        if (col.children && col.children.length) {
          for (const child of col.children) {
            if (child.prop) return { prop: child.prop, label: child.label }
          }
        } else if (col.prop) {
          return { prop: col.prop, label: col.label }
        }
      }
      return { prop: '', label: '' }
    },

    groupData(data, groupBy) {
      const map = new Map()
      data.forEach(row => {
        const key = groupBy.map(f => row[f]).join('|||')
        if (!map.has(key)) map.set(key, [])
        map.get(key).push(row)
      })
      return map
    },

    _calcValue(rows, calc) {
      if (typeof calc === 'function') return calc(rows)
      const prop = calc.prop
      const type = calc.type || 'sum'
      const vals = prop ? rows.map(r => parseFloat(r[prop]) || 0) : []
      switch (type) {
        case 'sum': return vals.reduce((s, v) => s + v, 0)
        case 'avg':
        case 'average': return vals.length ? vals.reduce((s, v) => s + v, 0) / vals.length : 0
        case 'count': return rows.length
        case 'min': return vals.length ? Math.min(...vals) : 0
        case 'max': return vals.length ? Math.max(...vals) : 0
        default: return ''
      }
    },

    createSubtotalRow(groupRows) {
      const config = this.subtotalConfig
      const rawLabelProp = this.findLabelColumn()
      const labelField = config.groupBy ? config.groupBy[0] : ''
      const groupValue = groupRows[0] ? groupRows[0][labelField] : ''
      const labelText = config.labelText || `${groupValue} 小计`

      const row = { _rowType: 'subtotal' }
      row[rawLabelProp.prop] = labelText

      if (config.columns) {
        Object.keys(config.columns).forEach(prop => {
          const calc = config.columns[prop]
          row[prop] = typeof calc === 'string'
            ? this._calcValue(groupRows, { prop, type: calc })
            : this._calcValue(groupRows, calc)
        })
      }
      return row
    },

    createTotalRow(allRows) {
      const config = this.totalConfig
      const rawLabelProp = this.findLabelColumn()
      const labelText = config.labelText || '总计'

      const row = { _rowType: 'total' }
      row[rawLabelProp.prop] = labelText

      if (config.columns) {
        Object.keys(config.columns).forEach(prop => {
          const calc = config.columns[prop]
          row[prop] = typeof calc === 'string'
            ? this._calcValue(allRows, { prop, type: calc })
            : this._calcValue(allRows, calc)
        })
      }
      return row
    },

    getRowClassName({ row }) {
      if (row._rowType === 'subtotal') return 'xt-table-row-subtotal'
      if (row._rowType === 'total') return 'xt-table-row-total'
      return ''
    },

    // ========== 列处理 ==========
    getColumnProps(col) {
      const { _key, children, render, slot, sortMethod, ...props } = col
      return props
    },

    indexMethod(index) {
      return index + 1
    },

    // ========== 合并单元格 ==========
    handleSpanMethod({ row, column, rowIndex }) {
      if (row._rowType === 'subtotal' || row._rowType === 'total') {
        return { rowspan: 1, colspan: 1 }
      }
      if (!this.groupColumns.length) return { rowspan: 1, colspan: 1 }

      const data = this.processedTableData
      const prop = column.property
      const groupIndex = this.groupColumns.indexOf(prop)
      if (groupIndex === -1) return { rowspan: 1, colspan: 1 }

      const cacheKey = `${rowIndex}_${prop}`
      if (this.spanCache[cacheKey]) return this.spanCache[cacheKey]

      if (rowIndex > 0) {
        const prevRow = data[rowIndex - 1]
        let isSame = true
        for (let i = 0; i <= groupIndex; i++) {
          const gp = this.groupColumns[i]
          if (prevRow[gp] !== row[gp]) {
            isSame = false
            break
          }
        }
        if (isSame) {
          const res = { rowspan: 0, colspan: 1 }
          this.spanCache[cacheKey] = res
          return res
        }
      }

      let count = 1
      for (let i = rowIndex + 1; i < data.length; i++) {
        const nextRow = data[i]
        let same = true
        for (let j = 0; j <= groupIndex; j++) {
          const gp = this.groupColumns[j]
          if (nextRow[gp] !== row[gp]) {
            same = false
            break
          }
        }
        if (same) count++
        else break
      }

      const res = { rowspan: count > 1 ? count : 1, colspan: 1 }
      this.spanCache[cacheKey] = res
      return res
    },

    // ========== 选择、排序、分页 ==========
    handleSelectionChange(rows) {
      this.selectedRows = rows.filter(r => !r._rowType)
      this.$emit('selection-change', this.selectedRows)
    },
    handleSortChange(info) {
      this.sortProp = info.prop
      this.sortOrder = info.order
      this.$emit('sort-change', info)
    },
    handleSizeChange(size) {
      this.$emit('size-change', size)
    },
    handleCurrentChange(page) {
      this.$emit('page-change', page)
    },

    // ========== 对外暴露方法 ==========
    getSelection() {
      return this.selectedRows
    },
    clearSelection() {
      this.$refs.table && this.$refs.table.clearSelection()
      this.selectedRows = []
    },
    clearSort() {
      this.sortProp = null
      this.sortOrder = null
      this.$nextTick(() => {
        if (this.$refs.table && this.$refs.table.$refs.innerTable) {
          this.$refs.table.$refs.innerTable.clearSort()
        }
      })
    },
    toggleRowSelection(row, selected) {
      this.$refs.table && this.$refs.table.toggleRowSelection(row, selected)
    },
    toggleRowsSelection(rows, selected) {
      if (!rows || !rows.length) return
      rows.forEach(row => {
        this.$refs.table && this.$refs.table.toggleRowSelection(row, selected)
      })
    },
    doLayout() {
      this.$refs.table && this.$refs.table.doLayout()
    }
  }
}
</script>
<style scoped>
.xt-table-wrapper {
  width: 100%;
}

/* 表头栏 */
.xt-table-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  margin-bottom: 8px;
}
.xt-table-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  position: relative;
  padding-left: 12px;
}
.xt-table-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 16px;
  background: #409eff;
  border-radius: 2px;
}
.xt-table-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
}

.xt-table-body {
  position: relative;
  z-index: 1;
}

/* 分页区域 */
.xt-table-footer {
  display: flex;
  justify-content: flex-end;
  padding: 16px 0;
}

/* ========== 小计/合计行样式 ========== */
::v-deep .xt-table-row-subtotal {
  background-color: #f5f7fa;
  font-weight: 600;
  color: #303133;
}
::v-deep .xt-table-row-total {
  background-color: #e8eaed;
  font-weight: 700;
  color: #303133;
  border-top: 2px solid #c0c4cc;
}
::v-deep .xt-table-row-subtotal:hover > td {
  background-color: #ebeef5 !important;
}
::v-deep .xt-table-row-total:hover > td {
  background-color: #dcdfe6 !important;
}

/* ========== 滚动条：Y轴 + X轴 统一处理 ========== */
/* 合并为一个选择器块，避免重复导致的优先级问题 */
::v-deep .el-table__body-wrapper {
  overflow-y: auto !important;
  overflow-x: auto !important;
  user-select: none;
  -webkit-user-select: none;
}
::v-deep .el-table__body-wrapper::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::v-deep .el-table__body-wrapper::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}
::v-deep .el-table__body-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
}
/* 滚动条角落（Y+X 交汇处） */
::v-deep .el-table__body-wrapper::-webkit-scrollbar-corner {
  background: #f1f1f1;
}

/* 允许单元格内文字选中，但容器本身不可选中 */
::v-deep .el-table__body-wrapper .el-table__cell {
  user-select: text;
  -webkit-user-select: text;
}

/* ========== 固定列层级 + 背景 防文字穿透 ========== */
::v-deep .el-table__fixed {
  z-index: 10 !important;
  box-shadow: 4px 0 8px rgba(0, 0, 0, 0.08);
}
::v-deep .el-table__fixed-right {
  z-index: 10 !important;
  box-shadow: -4px 0 8px rgba(0, 0, 0, 0.08);
}

/* 固定列单元格底色（纯白兜底，盖住滚动穿透文字） */
::v-deep .el-table__fixed .el-table__cell,
::v-deep .el-table__fixed-right .el-table__cell {
  background-color: #ffffff !important;
}
::v-deep .el-table__fixed .el-table__row:nth-child(even) .el-table__cell,
::v-deep .el-table__fixed-right .el-table__row:nth-child(even) .el-table__cell {
  background-color: #fafafa !important;
}
::v-deep .el-table__fixed .el-table__row:hover .el-table__cell,
::v-deep .el-table__fixed-right .el-table__row:hover .el-table__cell {
  background-color: #f5f7fa !important;
}

::v-deep .el-table__fixed-header-wrapper,
::v-deep .el-table__fixed-right-header-wrapper {
  z-index: 11 !important;
}

/* ========== 虚拟滚动容器：正常布局流撑开滚动条 ========== */
::v-deep .vs-phantom {
  position: relative;
  box-sizing: border-box;
  z-index: 1 !important;
}
</style>