/**
 * Flowable 工作流数据格式化工具
 *
 * 原生 Flowable 数据格式示例：
 * {
 *   "id": "75001",
 *   "processInstanceId": "25001",
 *   "taskId": "50001",
 *   "taskName": "部门经理审批",
 *   "assignee": "张三",
 *   "startTime": "2024-01-01T10:00:00",
 *   "endTime": "2024-01-01T10:30:00",
 *   "deleteReason": null,
 *   "type": "startEvent" | "userTask" | "endEvent"
 * }
 *
 * 历史任务（HistoricTaskInstance）：
 * {
 *   "id": "50001",
 *   "name": "部门经理审批",
 *   "assignee": "张三",
 *   "startTime": "2024-01-01T10:00:00",
 *   "endTime": "2024-01-01T10:30:00",
 *   "deleteReason": "rejected",
 *   "durationInMillis": 1800000
 * }
 */

// 默认待办节点
const DEFAULT_PENDING_NODE = {
  status: 'pending',
  name: '待处理',
  assignee: '--',
  createTime: null,
  comment: '等待审批中...'
}

/**
 * 解析 Flowable 原始数据为 xt-flow 组件格式
 * @param {Array} rawData - Flowable 返回的原始数据
 * @param {Object} options
 * @param {Object} options.pendingNode - 自定义待办节点数据
 * @param {Boolean} options.autoPending - 是否自动追加待办节点（默认 true）
 * @returns {Array} 标准化后的节点数组
 */
export function parseFlowData(rawData, options = {}) {
  const { pendingNode = null, autoPending = true } = options

  if (!rawData || !rawData.length) {
    return []
  }

  const nodes = rawData
    .filter((item) => {
      // 过滤掉 startEvent 和无效数据
      if (item.type === 'startEvent') return false
      // 过滤掉没有任务名称的节点
      if (!item.name && !item.taskName && !item.activityName) return false
      return true
    })
    .map((item) => {
      const node = {
        id: item.id || item.taskId || '',
        name: item.name || item.taskName || item.activityName || '',
        assignee: item.assignee || '',
        createTime: item.startTime || item.createTime || '',
        endTime: item.endTime || '',
        status: inferStatus(item),
        comment: item.comment || item.deleteReason || '',
        duration: formatDuration(item.durationInMillis || item.duration),
        // 保留原始数据用于插槽扩展
        raw: item
      }
      return node
    })

  // 自动追加待办节点
  if (autoPending && nodes.length > 0) {
    const lastNode = nodes[nodes.length - 1]
    // 如果最后一个节点不是 pending 状态，追加待办节点
    if (lastNode.status !== 'pending') {
      const pending = pendingNode || DEFAULT_PENDING_NODE
      nodes.push({
        id: 'pending',
        name: pending.name || '待处理',
        assignee: pending.assignee || '--',
        createTime: pending.createTime || null,
        endTime: null,
        status: 'pending',
        comment: pending.comment || '',
        duration: '',
        raw: pending
      })
    }
  }

  return nodes
}

/**
 * 推断节点状态
 * @param {Object} item - Flowable 原始数据项
 * @returns {String} 状态值
 */
function inferStatus(item) {
  const deleteReason = (item.deleteReason || '').toLowerCase()

  // 根据 deleteReason 判断
  if (deleteReason.includes('reject') || deleteReason.includes('驳回')) {
    return 'rejected'
  }
  if (deleteReason.includes('delegate') || deleteReason.includes('委托')) {
    return 'delegated'
  }
  if (deleteReason.includes('transfer') || deleteReason.includes('转办')) {
    return 'transferred'
  }
  if (deleteReason.includes('revoke') || deleteReason.includes('撤回') || deleteReason.includes('recall')) {
    return 'recalled'
  }
  if (deleteReason.includes('cancel') || deleteReason.includes('取消')) {
    return 'cancelled'
  }

  // 有结束时间且无驳回原因 → 通过
  if (item.endTime && !item.deleteReason) {
    return 'approved'
  }

  // 无结束时间 → 待办中
  if (!item.endTime) {
    return 'pending'
  }

  return 'approved'
}

/**
 * 格式化时长
 * @param {Number} millis - 毫秒数
 * @returns {String} 格式化后的时长
 */
function formatDuration(millis) {
  if (!millis && millis !== 0) return ''

  const totalSeconds = Math.floor(millis / 1000)
  if (totalSeconds < 60) {
    return `${totalSeconds}秒`
  }

  const minutes = Math.floor(totalSeconds / 60)
  if (minutes < 60) {
    return `${minutes}分钟`
  }

  const hours = Math.floor(minutes / 60)
  const remainMinutes = minutes % 60
  if (hours < 24) {
    return remainMinutes > 0 ? `${hours}小时${remainMinutes}分钟` : `${hours}小时`
  }

  const days = Math.floor(hours / 24)
  const remainHours = hours % 24
  return remainHours > 0 ? `${days}天${remainHours}小时` : `${days}天`
}

/**
 * 格式化时间字符串
 * @param {String} timeStr - 时间字符串
 * @param {String} format - 格式
 * @returns {String} 格式化后的时间
 */
export function formatFlowTime(timeStr, format) {
  if (!timeStr) return ''

  try {
    const d = new Date(timeStr)
    if (isNaN(d.getTime())) return timeStr

    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hour = String(d.getHours()).padStart(2, '0')
    const minute = String(d.getMinutes()).padStart(2, '0')
    const second = String(d.getSeconds()).padStart(2, '0')

    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hour)
      .replace('mm', minute)
      .replace('ss', second)
  } catch (e) {
    return timeStr
  }
}

/**
 * 生成模拟审批链数据（用于开发和演示）
 * @param {Number} count - 节点数量
 * @returns {Array} 模拟数据
 */
export function createMockFlowData(count = 7) {
  const statuses = ['approved', 'approved', 'approved', 'rejected', 'pending', 'transferred', 'approved']
  const names = [
    '提交申请', '直属领导审批', '部门经理审批',
    '总监审批', 'HR 审批', '总经理审批', '流程结束'
  ]
  const assignees = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九']
  const comments = [
    '', '同意', '同意', '驳回：请补充材料后重新提交',
    '', '', '同意'
  ]

  const now = new Date()
  const result = []

  for (let i = 0; i < Math.min(count, names.length); i++) {
    const startTime = new Date(now.getTime() - (count - i) * 3600000)
    const endTime = statuses[i] === 'pending'
      ? null
      : new Date(startTime.getTime() + 1800000)

    result.push({
      id: `flow-${i + 1}`,
      name: names[i],
      assignee: assignees[i],
      status: statuses[i],
      createTime: startTime.toISOString(),
      endTime: endTime ? endTime.toISOString() : null,
      comment: comments[i],
      duration: endTime ? '30分钟' : ''
    })
  }

  return result
}

export default {
  parseFlowData,
  formatFlowTime,
  createMockFlowData
}