<template>
  <div class="xt-list" :class="{ 'xt-list--loading': loading }">
    <!-- 标题栏 -->
    <div class="xt-list__header" v-if="title || filterable || sortable || $slots.toolbar">
      <span class="xt-list__title" v-if="title">{{ title }}</span>
      <div class="xt-list__toolbar">
        <!-- 搜索 -->
        <div class="xt-list__search" v-if="filterable">
          <el-input
            v-model="searchText"
            :placeholder="filterPlaceholder"
            size="small"
            clearable
            prefix-icon="el-icon-search"
            @input="handleSearch"
          />
        </div>
        <!-- 排序 -->
        <el-button
          v-if="sortable && sortBy"
          size="small"
          icon="el-icon-sort"
          :type="currentSortOrder ? 'primary' : 'default'"
          plain
          @click="handleSortToggle"
        >
          {{ sortLabel }}
        </el-button>
        <!-- 分组排序 -->
        <el-button
          v-if="groupSortable && groupSortBy && groupBy"
          size="small"
          icon="el-icon-sort"
          :type="currentGroupSortOrder ? 'primary' : 'default'"
          plain
          @click="handleGroupSortToggle"
        >
          {{ groupSortLabel }}
        </el-button>
        <slot name="toolbar"></slot>
      </div>
    </div>

    <!-- 主体区域：使用 xt-scroll 作为滚动容器 -->
    <xt-scroll
      ref="scrollContainer"
      :class="['xt-list__body', { 'xt-list__body--virtual': virtualScroll }]"
      :style="bodyStyle"
      @scroll="onScroll"
    >
      <!-- 虚拟滚动 phantom -->
      <div
        v-if="virtualScroll"
        class="xt-list__phantom"
        :style="{ height: totalHeight + 'px' }"
      >
        <div :style="{ paddingTop: offsetY + 'px' }">
          <template v-if="groupedData.length">
            <template v-for="(group, gIdx) in visibleGroups">
              <div :key="group._key" class="xt-list__group">
                <!-- 分组标题 -->
                <div
                  class="xt-list__group-title"
                  @click="toggleGroup(group._key)"
                >
                  <span class="xt-list__group-arrow" :class="{ 'is-expanded': group._expanded }">
                    <i class="el-icon-arrow-right"></i>
                  </span>
                  <slot name="group-title" :group="group" :items="group._items" :expanded="group._expanded">
                    <span class="xt-list__group-label">{{ getGroupLabel(group) }}</span>
                    <span class="xt-list__group-count">({{ group._items.length }})</span>
                  </slot>
                </div>

                <!-- 分组卡片 -->
                <div v-if="group._expanded" :class="['xt-list__cards', 'xt-list__cols-' + columns]">
                  <div
                    v-for="(item, idx) in getVisibleItems(group)"
                    :key="item._id || idx"
                    class="xt-list__item"
                    @click="handleItemClick(item, group._key)"
                  >
                    <el-card :shadow="shadow" :body-style="cardBodyStyle">
                      <slot
                        :item="item"
                        :index="getItemIndex(item, group)"
                        :group="group"
                      >
                        <!-- 图片区域 -->
                        <div v-if="getImage(item)" class="xt-list__image">
                          <img :src="getImage(item)" :alt="getConfigValue(cardConfig.title, item)" />
                        </div>
                        <!-- 标签 -->
                        <div v-if="getTag(item)" class="xt-list__tag">
                          <el-tag size="small" :type="getTagType(item)">{{ getTag(item) }}</el-tag>
                        </div>
                        <!-- 标题 -->
                        <div class="xt-list__card-title" v-if="getConfigValue(cardConfig.title, item)">
                          {{ getConfigValue(cardConfig.title, item) }}
                        </div>
                        <!-- 副标题 -->
                        <div class="xt-list__card-subtitle" v-if="getConfigValue(cardConfig.subtitle, item)">
                          {{ getConfigValue(cardConfig.subtitle, item) }}
                        </div>
                        <!-- 内容 -->
                        <div class="xt-list__card-content" v-if="getConfigValue(cardConfig.content, item)">
                          {{ getConfigValue(cardConfig.content, item) }}
                        </div>
                        <!-- 底部 -->
                        <div class="xt-list__card-footer" v-if="getConfigValue(cardConfig.footer, item)">
                          <slot name="card-footer" :item="item" :index="getItemIndex(item, group)">
                            {{ getConfigValue(cardConfig.footer, item) }}
                          </slot>
                        </div>
                      </slot>
                    </el-card>
                  </div>
                </div>
              </div>
            </template>
          </template>
          <div
            v-else-if="!loading"
            class="xt-list__empty"
          >
            <slot name="empty">
              <span>{{ emptyText }}</span>
            </slot>
          </div>
        </div>
      </div>

      <!-- 非虚拟滚动模式 -->
      <template v-else-if="groupedData.length">
        <template v-for="group in groupedData">
          <div :key="group._key" class="xt-list__group">
            <div
              class="xt-list__group-title"
              @click="toggleGroup(group._key)"
            >
              <span class="xt-list__group-arrow" :class="{ 'is-expanded': group._expanded }">
                <i class="el-icon-arrow-right"></i>
              </span>
              <slot name="group-title" :group="group" :items="group._items" :expanded="group._expanded">
                <span class="xt-list__group-label">{{ getGroupLabel(group) }}</span>
                <span class="xt-list__group-count">({{ group._items.length }})</span>
              </slot>
            </div>
            <div v-if="group._expanded" :class="['xt-list__cards', 'xt-list__cols-' + columns]">
              <div
                v-for="(item, idx) in group._items"
                :key="item._id || idx"
                class="xt-list__item"
                @click="handleItemClick(item, group._key)"
              >
                <el-card :shadow="shadow" :body-style="cardBodyStyle">
                  <slot :item="item" :index="idx" :group="group">
                    <div v-if="getImage(item)" class="xt-list__image">
                      <img :src="getImage(item)" :alt="getConfigValue(cardConfig.title, item)" />
                    </div>
                    <div v-if="getTag(item)" class="xt-list__tag">
                      <el-tag size="small" :type="getTagType(item)">{{ getTag(item) }}</el-tag>
                    </div>
                    <div class="xt-list__card-title" v-if="getConfigValue(cardConfig.title, item)">
                      {{ getConfigValue(cardConfig.title, item) }}
                    </div>
                    <div class="xt-list__card-subtitle" v-if="getConfigValue(cardConfig.subtitle, item)">
                      {{ getConfigValue(cardConfig.subtitle, item) }}
                    </div>
                    <div class="xt-list__card-content" v-if="getConfigValue(cardConfig.content, item)">
                      {{ getConfigValue(cardConfig.content, item) }}
                    </div>
                    <div class="xt-list__card-footer" v-if="getConfigValue(cardConfig.footer, item)">
                      <slot name="card-footer" :item="item" :index="idx">
                        {{ getConfigValue(cardConfig.footer, item) }}
                      </slot>
                    </div>
                  </slot>
                </el-card>
              </div>
            </div>
          </div>
        </template>
      </template>

      <div v-else-if="!loading" class="xt-list__empty">
        <slot name="empty">
          <span>{{ emptyText }}</span>
        </slot>
      </div>

      <!-- 加载更多 -->
      <div v-if="loadMore && hasMore && !loading" class="xt-list__loadmore">
        <el-button type="text" :loading="loadMoreLoading" @click="handleLoadMore">
          {{ loadMoreText }}
        </el-button>
      </div>
    </xt-scroll>

    <!-- 加载状态 -->
    <div v-if="loading" class="xt-list__loading">
      <slot name="loading">
        <i class="el-icon-loading"></i>
        <span>加载中...</span>
      </slot>
    </div>

    <!-- 分页 -->
    <div class="xt-list__footer" v-if="showPagination">
      <el-pagination
        background
        small
        :current-page="pagination.pageNum"
        :page-size="pagination.pageSize"
        :total="total"
        :page-sizes="pagination.pageSizes || [10, 20, 50]"
        layout="total, prev, pager, next"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import XtScroll from '../xt-scroll'
import { compareValues } from '../../utils/sort'

const CARD_ITEM_HEIGHT = 160
const GROUP_HEADER_HEIGHT = 44

export default {
  name: 'XtList',

  components: {
    XtScroll
  },

  props: {
    data: { type: Array, default: () => [] },
    // 分组配置
    groupBy: { type: String, default: '' },
    groupLabel: { type: [String, Function], default: '' },
    // 卡片配置
    cardConfig: {
      type: Object,
      default: () => ({
        title: 'title',
        subtitle: '',
        content: '',
        image: '',
        tag: '',
        tagType: '',
        footer: ''
      })
    },
    // 显示配置
    title: { type: String, default: '' },
    columns: { type: Number, default: 1 },
    shadow: { type: String, default: 'hover' },
    cardBodyStyle: { type: Object, default: () => ({}) },
    // 虚拟滚动
    virtualScroll: { type: Boolean, default: false },
    itemHeight: { type: Number, default: CARD_ITEM_HEIGHT },
    bufferSize: { type: Number, default: 3 },
    height: { type: [Number, String], default: null },
    maxHeight: { type: [Number, String], default: null },
    // 分组折叠
    expandAll: { type: Boolean, default: true },
    accordion: { type: Boolean, default: false },
    // 分页
    pagination: { type: Object, default: null },
    total: { type: Number, default: 0 },
    // 加载更多
    loadMore: { type: Boolean, default: false },
    hasMore: { type: Boolean, default: false },
    loadMoreText: { type: String, default: '加载更多' },
    loadMoreLoading: { type: Boolean, default: false },
    // 状态
    loading: { type: Boolean, default: false },
    emptyText: { type: String, default: '暂无数据' },
    // 搜索筛选
    filterable: { type: Boolean, default: false },
    filterPlaceholder: { type: String, default: '请输入搜索内容' },
    filterMethod: { type: Function, default: null },
    // 排序（组内排序）
    sortable: { type: Boolean, default: false },
    sortBy: { type: String, default: '' },
    sortOrder: { type: String, default: '' },
    sortMethod: { type: Function, default: null },
    // 分组排序
    groupSortable: { type: Boolean, default: false },
    groupSortBy: { type: String, default: '' },
    groupSortOrder: { type: String, default: '' },
    groupSortMethod: { type: Function, default: null }
  },

  data() {
    return {
      groupExpandState: {},
      scrollTop: 0,
      containerHeight: 0,
      resizeObserver: null,
      rafId: null,
      searchText: '',
      currentSortOrder: this.sortOrder || '',
      currentGroupSortOrder: this.groupSortOrder || ''
    }
  },

  computed: {
    showPagination() {
      return this.pagination && this.total > 0
    },
    sortLabel() {
      if (!this.currentSortOrder) return '排序'
      return this.currentSortOrder === 'ascending' ? '升序' : '降序'
    },
    groupSortLabel() {
      if (!this.currentGroupSortOrder) return '分组排序'
      return this.currentGroupSortOrder === 'ascending' ? '分组↑' : '分组↓'
    },
    bodyStyle() {
      const style = {}
      if (this.height) {
        style.height = typeof this.height === 'number' ? this.height + 'px' : this.height
      }
      if (this.maxHeight) {
        style.maxHeight = typeof this.maxHeight === 'number' ? this.maxHeight + 'px' : this.maxHeight
      }
      if (this.virtualScroll) {
        style.overflowY = 'auto'
        style.overflowX = 'hidden'
      }
      return style
    },

    // 筛选后的数据
    filteredData() {
      if (!this.filterable || !this.searchText) return this.data
      return this.data.filter(item => {
        if (typeof this.filterMethod === 'function') {
          return this.filterMethod(item, this.searchText)
        }
        return Object.values(item).some(val => {
          if (val == null) return false
          return String(val).toLowerCase().includes(this.searchText.toLowerCase())
        })
      })
    },

    // 排序后的数据
    sortedData() {
      if (!this.sortable || !this.sortBy || !this.currentSortOrder) return this.filteredData
      const order = this.currentSortOrder === 'ascending' ? 1 : -1
      const sortFn = typeof this.sortMethod === 'function'
        ? this.sortMethod
        : (a, b) => compareValues(a[this.sortBy], b[this.sortBy])
      return [...this.filteredData].sort((a, b) => sortFn(a, b) * order)
    },

    // 分组后的数据
    groupedData() {
      const source = this.sortedData
      if (!source || !source.length) return []

      if (!this.groupBy) {
        return [{
          _key: '_default',
          _items: source.map((item, idx) => ({ ...item, _id: item._id || `item_${idx}` })),
          _expanded: true
        }]
      }

      const groups = {}
      source.forEach((item, idx) => {
        const value = item[this.groupBy]
        const key = value != null ? String(value) : '_undefined'
        if (!groups[key]) {
          groups[key] = {
            _key: key,
            _value: value,
            _items: []
          }
        }
        groups[key]._items.push({ ...item, _id: item._id || `item_${idx}` })
      })

      const result = Object.keys(groups).map(key => {
        const g = groups[key]
        g._expanded = this.groupExpandState[key] !== undefined ? this.groupExpandState[key] : this.expandAll
        return g
      })

      // 分组排序
      if (this.groupSortBy && this.currentGroupSortOrder) {
        result.sort(this._getGroupSortFn())
      }

      return result
    },

    // 虚拟滚动：总高度
    totalHeight() {
      if (!this.virtualScroll) return 0
      let height = 0
      this.groupedData.forEach(group => {
        height += GROUP_HEADER_HEIGHT
        if (group._expanded) {
          const rows = Math.ceil(group._items.length / this.columns)
          height += rows * this.itemHeight
        }
      })
      return height
    },

    // 虚拟滚动：可见分组
    visibleGroups() {
      if (!this.virtualScroll) return this.groupedData

      const start = Math.max(0, this.scrollTop - this.bufferSize * this.itemHeight)
      const end = start + this.containerHeight + this.bufferSize * this.itemHeight * 2
      const visible = []
      let currentTop = 0

      this.groupedData.forEach(group => {
        const groupHeight = GROUP_HEADER_HEIGHT +
          (group._expanded ? Math.ceil(group._items.length / this.columns) * this.itemHeight : 0)
        const groupEnd = currentTop + groupHeight

        if (groupEnd >= start && currentTop <= end) {
          visible.push(group)
        }
        currentTop = groupEnd
      })

      return visible
    },

    // 虚拟滚动：偏移量
    offsetY() {
      if (!this.virtualScroll) return 0
      let offset = 0
      const start = Math.max(0, this.scrollTop - this.bufferSize * this.itemHeight)

      for (let i = 0; i < this.groupedData.length; i++) {
        const group = this.groupedData[i]
        const h = GROUP_HEADER_HEIGHT +
          (group._expanded ? Math.ceil(group._items.length / this.columns) * this.itemHeight : 0)
        if (offset + h <= start) {
          offset += h
        } else {
          break
        }
      }
      return offset
    }
  },

  watch: {
    data: {
      handler() {
        this.$nextTick(() => {
          this.updateContainerHeight()
        })
      }
    },
    expandAll(val) {
      const state = {}
      this.groupedData.forEach(g => { state[g._key] = val })
      this.groupExpandState = state
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.updateContainerHeight()
      this.bindResizeObserver()
    })
  },

  beforeDestroy() {
    this.unbindResizeObserver()
    if (this.rafId && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(this.rafId)
      this.rafId = null
    }
  },

  methods: {
    // ========== 分组展开/折叠 ==========
    toggleGroup(key) {
      const newState = { ...this.groupExpandState }
      const current = newState[key] !== undefined ? newState[key] : this.expandAll

      if (this.accordion && !current) {
        Object.keys(newState).forEach(k => { newState[k] = false })
      }
      newState[key] = !current
      this.groupExpandState = newState

      this.$nextTick(() => {
        this.updateContainerHeight()
        this.$emit('group-toggle', { key, expanded: newState[key] })
      })
    },

    getGroupLabel(group) {
      if (this.groupLabel === '') return group._value
      if (typeof this.groupLabel === 'function') return this.groupLabel(group)
      if (typeof this.groupLabel === 'string' && group._items[0]) {
        return group._items[0][this.groupLabel] || group._value
      }
      return group._value
    },

    // ========== 卡片配置解析 ==========
    getConfigValue(config, item) {
      if (!config) return ''
      if (typeof config === 'function') return config(item)
      if (typeof config === 'string') return item[config] || ''
      return ''
    },

    getImage(item) {
      return this.getConfigValue(this.cardConfig.image, item)
    },

    getTag(item) {
      return this.getConfigValue(this.cardConfig.tag, item)
    },

    getTagType(item) {
      if (this.cardConfig.tagType) {
        if (typeof this.cardConfig.tagType === 'function') return this.cardConfig.tagType(item)
        return this.cardConfig.tagType
      }
      return ''
    },

    // ========== 虚拟滚动 ==========
    getVisibleItems(group) {
      if (!this.virtualScroll) return group._items

      const bufferPx = this.bufferSize * this.itemHeight
      const start = Math.max(0, this.scrollTop - bufferPx)
      const end = start + this.containerHeight + bufferPx * 2

      let currentTop = 0
      let groupStart = 0
      for (let i = 0; i < this.groupedData.length; i++) {
        const g = this.groupedData[i]
        if (g._key === group._key) {
          groupStart = currentTop + GROUP_HEADER_HEIGHT
          break
        }
        currentTop += GROUP_HEADER_HEIGHT +
          (g._expanded ? Math.ceil(g._items.length / this.columns) * this.itemHeight : 0)
      }

      const groupEnd = groupStart + Math.ceil(group._items.length / this.columns) * this.itemHeight

      if (groupEnd <= start || groupStart >= end) return []

      const visibleStart = Math.max(0, Math.floor((start - groupStart) / this.itemHeight) * this.columns)
      const visibleEnd = Math.min(group._items.length, Math.ceil((end - groupStart) / this.itemHeight) * this.columns + bufferPx)

      return group._items.slice(Math.max(0, visibleStart), visibleEnd)
    },

    getItemIndex(item, group) {
      return group._items.indexOf(item)
    },

    onScroll(e) {
      if (!this.virtualScroll) return
      // xt-scroll 传递的是 { scrollTop, scrollLeft } 对象
      this.scrollTop = e && e.scrollTop != null ? e.scrollTop : 0
      if (this.rafId) return
      if (typeof requestAnimationFrame === 'undefined') return
      this.rafId = requestAnimationFrame(() => {
        this.$forceUpdate()
        this.rafId = null
      })
    },

    updateContainerHeight() {
      if (this.$refs.scrollContainer) {
        const scrollCmp = this.$refs.scrollContainer
        const wrap = scrollCmp.getScrollContainer && scrollCmp.getScrollContainer()
        this.containerHeight = wrap ? wrap.clientHeight : 0
      }
    },

    bindResizeObserver() {
      if (typeof ResizeObserver === 'undefined') return
      const scrollCmp = this.$refs.scrollContainer
      if (!scrollCmp) return
      const wrap = scrollCmp.getScrollContainer && scrollCmp.getScrollContainer()
      if (!wrap) return
      this.resizeObserver = new ResizeObserver(() => {
        this.updateContainerHeight()
      })
      this.resizeObserver.observe(wrap)
    },

    unbindResizeObserver() {
      if (this.resizeObserver) {
        this.resizeObserver.disconnect()
        this.resizeObserver = null
      }
    },

    // ========== 事件处理 ==========
    handleSearch() {
      this.$emit('search', this.searchText)
    },

    handleSortToggle() {
      const orders = ['', 'ascending', 'descending']
      const idx = orders.indexOf(this.currentSortOrder)
      this.currentSortOrder = orders[(idx + 1) % 3]
      this.$emit('sort-change', { prop: this.sortBy, order: this.currentSortOrder })
    },

    handleGroupSortToggle() {
      const orders = ['', 'ascending', 'descending']
      const idx = orders.indexOf(this.currentGroupSortOrder)
      this.currentGroupSortOrder = orders[(idx + 1) % 3]
      this.$emit('group-sort-change', { prop: this.groupSortBy, order: this.currentGroupSortOrder })
    },

    _getGroupSortFn() {
      const order = this.currentGroupSortOrder === 'descending' ? -1 : 1
      let fn

      if (typeof this.groupSortMethod === 'function') {
        fn = this.groupSortMethod
      } else if (this.groupSortBy === '_key') {
        fn = (a, b) => compareValues(a._key, b._key)
      } else if (this.groupSortBy === '_count') {
        fn = (a, b) => a._items.length - b._items.length
      } else if (this.groupSortBy === '_value') {
        fn = (a, b) => compareValues(a._value, b._value)
      } else {
        fn = (a, b) => compareValues(
          a._items[0] && a._items[0][this.groupSortBy],
          b._items[0] && b._items[0][this.groupSortBy]
        )
      }

      return (a, b) => fn(a, b) * order
    },

    handleItemClick(item, groupKey) {
      this.$emit('click-item', { item, groupKey })
    },

    handleLoadMore() {
      this.$emit('load-more')
    },

    handleSizeChange(size) {
      this.$emit('size-change', size)
    },

    handleCurrentChange(page) {
      this.$emit('page-change', page)
    },

    // ========== 对外暴露方法 ==========
    scrollToTop() {
      if (this.$refs.scrollContainer && this.$refs.scrollContainer.scrollToStart) {
        this.$refs.scrollContainer.scrollToStart()
      }
    },

    expandGroup(key) {
      const newState = { ...this.groupExpandState }
      newState[key] = true
      this.groupExpandState = newState
    },

    collapseGroup(key) {
      const newState = { ...this.groupExpandState }
      newState[key] = false
      this.groupExpandState = newState
    },

    collapseAll() {
      const newState = {}
      this.groupedData.forEach(g => { newState[g._key] = false })
      this.groupExpandState = newState
    },

    expandAllGroups() {
      this.groupExpandState = {}
    }
  }
}
</script>

<style scoped>
.xt-list {
  width: 100%;
  position: relative;
}

/* 标题栏 */
.xt-list__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;
  margin-bottom: 8px;
}
.xt-list__title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  position: relative;
  padding-left: 12px;
}
.xt-list__title::before {
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
.xt-list__toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 搜索栏 */
.xt-list__search {
  width: 180px;
  flex-shrink: 0;
}

/* 主体区域 */
.xt-list__body {
  position: relative;
}

/* 虚拟滚动 phantom */
.xt-list__phantom {
  position: relative;
  box-sizing: border-box;
}

/* 分组 */
.xt-list__group {
  margin-bottom: 12px;
}

/* 分组标题 */
.xt-list__group-title {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  background: #f5f7fa;
  border-radius: 6px;
  cursor: pointer;
  user-select: none;
  transition: background 0.2s;
  margin-bottom: 8px;
}
.xt-list__group-title:hover {
  background: #ebeef5;
}
.xt-list__group-title:active {
  background: #e4e7ed;
}
.xt-list__group-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-right: 8px;
  transition: transform 0.3s;
  color: #909399;
}
.xt-list__group-arrow.is-expanded {
  transform: rotate(90deg);
}
.xt-list__group-label {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
}
.xt-list__group-count {
  font-size: 12px;
  color: #909399;
  margin-left: 6px;
}

/* 卡片网格 */
.xt-list__cards {
  display: grid;
  gap: 12px;
}
.xt-list__cols-1 {
  grid-template-columns: 1fr;
}
.xt-list__cols-2 {
  grid-template-columns: repeat(2, 1fr);
}
.xt-list__cols-3 {
  grid-template-columns: repeat(3, 1fr);
}

/* 卡片项 */
.xt-list__item {
  cursor: pointer;
  transition: transform 0.2s;
}
.xt-list__item:active {
  transform: scale(0.98);
}

/* 卡片内部 */
.xt-list__image {
  width: 100%;
  margin: -20px -20px 12px;
  border-radius: 4px 4px 0 0;
  overflow: hidden;
}
.xt-list__image img {
  width: 100%;
  display: block;
  object-fit: cover;
}
.xt-list__tag {
  margin-bottom: 8px;
}
.xt-list__card-title {
  font-size: 15px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 6px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.xt-list__card-subtitle {
  font-size: 13px;
  color: #909399;
  margin-bottom: 8px;
  line-height: 1.3;
}
.xt-list__card-content {
  font-size: 14px;
  color: #606266;
  line-height: 1.6;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
.xt-list__card-footer {
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px solid #ebeef5;
  font-size: 13px;
  color: #909399;
}

/* 空状态 */
.xt-list__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 0;
  color: #909399;
  font-size: 14px;
}

/* 加载状态 */
.xt-list__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 48px 0;
  color: #909399;
  font-size: 14px;
}
.xt-list__loading .el-icon-loading {
  font-size: 20px;
  animation: rotating 2s linear infinite;
}
@keyframes rotating {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 加载更多 */
.xt-list__loadmore {
  display: flex;
  justify-content: center;
  padding: 16px 0;
}

/* 分页 */
.xt-list__footer {
  display: flex;
  justify-content: center;
  padding: 16px 0;
}

/* 滚动条 */
.xt-list__body::-webkit-scrollbar {
  width: 6px;
}
.xt-list__body::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}
.xt-list__body::-webkit-scrollbar-track {
  background: transparent;
}

/* 移动端适配 */
@media (max-width: 768px) {
  .xt-list__cols-2,
  .xt-list__cols-3 {
    grid-template-columns: 1fr;
  }
  .xt-list__group-title {
    padding: 10px 8px;
  }
}
</style>