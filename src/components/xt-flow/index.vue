<template>
  <div class="xt-flow" :class="rootClasses">
    <div
      v-for="(node, index) in displayNodes"
      :key="node.id || index"
      class="xt-flow__node"
      :class="nodeClasses(node, index)"
    >
      <!-- 时间线左侧 -->
      <div class="xt-flow__timeline">
        <!-- 节点图标 -->
        <div class="xt-flow__icon" :class="`xt-flow__icon--${node.status}`">
          <slot name="node-avatar" :node="node" :index="index">
            <span class="xt-flow__icon-dot"></span>
          </slot>
        </div>
        <!-- 连接线 -->
        <div
          v-if="index < displayNodes.length - 1"
          class="xt-flow__line"
          :class="[
            `xt-flow__line--${node.status}`,
            { 'xt-flow__line--dashed': node.status === 'rejected' }
          ]"
        ></div>
      </div>

      <!-- 节点内容 -->
      <div class="xt-flow__body">
        <div class="xt-flow__header">
          <span class="xt-flow__title">
            <slot name="node" :node="node" :index="index">
              {{ node.name || node.title }}
            </slot>
          </span>
          <span class="xt-flow__status" :class="`xt-flow__status--${node.status}`">
            {{ statusText(node.status) }}
          </span>
        </div>

        <div class="xt-flow__meta">
          <template v-if="node.assignee">
            <span class="xt-flow__assignee">
              <slot name="assignee" :node="node" :index="index">
                <span class="xt-flow__assignee-icon">👤</span>
                {{ node.assignee }}
              </slot>
            </span>
          </template>
          <template v-if="node.createTime || node.endTime">
            <span class="xt-flow__time">
              {{ formatTime(node) }}
            </span>
          </template>
          <template v-if="node.duration">
            <span class="xt-flow__duration">
              {{ node.duration }}
            </span>
          </template>
        </div>

        <div v-if="node.comment || node.description" class="xt-flow__desc">
          <slot name="node-desc" :node="node" :index="index">
            <template v-if="node.status === 'rejected' && node.comment">
              <span class="xt-flow__desc-label">驳回原因：</span>
            </template>
            <template v-else-if="node.comment">
              <span class="xt-flow__desc-label">审批意见：</span>
            </template>
            {{ node.comment || node.description }}
          </slot>
        </div>

        <div v-if="$scopedSlots['node-action']" class="xt-flow__actions">
          <slot name="node-action" :node="node" :index="index"></slot>
        </div>
      </div>
    </div>

    <!-- 折叠/展开触发器 -->
    <div
      v-if="isCollapsible && collapsed"
      class="xt-flow__collapse"
      @click="toggleCollapse"
    >
      <slot name="expand-trigger">
        <span class="xt-flow__collapse-text">
          展开全部 {{ totalCount }} 条审批记录
          <span class="xt-flow__collapse-arrow">▼</span>
        </span>
      </slot>
    </div>
    <div
      v-if="isCollapsible && !collapsed"
      class="xt-flow__collapse"
      @click="toggleCollapse"
    >
      <slot name="collapse-trigger">
        <span class="xt-flow__collapse-text">
          收起
          <span class="xt-flow__collapse-arrow xt-flow__collapse-arrow--up">▲</span>
        </span>
      </slot>
    </div>
  </div>
</template>

<script>
import { parseFlowData, formatFlowTime } from './flowable-parser'

export default {
  name: 'XtFlow',

  props: {
    // 数据源：数组格式，支持 Flowable 原始格式或自定义格式
    data: {
      type: Array,
      default: () => []
    },
    // 是否自动折叠长审批链
    collapse: {
      type: Boolean,
      default: true
    },
    // 折叠前可见节点数
    collapseCount: {
      type: Number,
      default: 5
    },
    // 圆角风格：square 方形 / round 圆形
    rounded: {
      type: String,
      default: 'square',
      validator: (val) => ['square', 'round'].includes(val)
    },
    // 数据格式：flowable 原生 / custom 自定义
    format: {
      type: String,
      default: 'flowable',
      validator: (val) => ['flowable', 'custom'].includes(val)
    },
    // 时间格式（仅在 format='flowable' 时生效）
    timeFormat: {
      type: String,
      default: 'YYYY-MM-DD HH:mm:ss'
    },
    // 自定义状态文本映射
    statusMap: {
      type: Object,
      default: () => ({
        approved: '已通过',
        rejected: '已驳回',
        pending: '待审批',
        transferred: '已转办',
        delegated: '已委托',
        recalled: '已撤回',
        started: '已发起',
        cancelled: '已取消'
      })
    }
  },

  data() {
    return {
      collapsed: true
    }
  },

  computed: {
    rootClasses() {
      return [
        `xt-flow--${this.rounded}`
      ]
    },

    parsedData() {
      if (this.format === 'flowable') {
        return parseFlowData(this.data)
      }
      return this.data
    },

    totalCount() {
      return this.parsedData.length
    },

    isCollapsible() {
      return this.collapse && this.totalCount > this.collapseCount
    },

    displayNodes() {
      if (!this.isCollapsible || !this.collapsed) {
        return this.parsedData
      }
      return this.parsedData.slice(0, this.collapseCount)
    }
  },

  methods: {
    nodeClasses(node, index) {
      return [
        `xt-flow__node--${node.status}`,
        {
          'xt-flow__node--last': index === this.displayNodes.length - 1,
          'xt-flow__node--first': index === 0
        }
      ]
    },

    statusText(status) {
      return this.statusMap[status] || status
    },

    formatTime(node) {
      if (this.format === 'flowable') {
        return formatFlowTime(node.createTime || node.endTime, this.timeFormat)
      }
      return node.createTime || node.endTime || ''
    },

    toggleCollapse() {
      this.collapsed = !this.collapsed
    }
  }
}
</script>