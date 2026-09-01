// ==================== 排序比较器 ====================

/**
 * 通用值比较：null/undefined 安全 + 数字数值比较 + 字符串自然排序（识别数字段）
 * 供 XtList / XtTable 等组件的默认排序复用，避免各自重复实现 localeCompare 逻辑
 * @param {*} a
 * @param {*} b
 * @returns {number} 负数 / 0 / 正数
 */
export function compareValues(a, b) {
  if (a == null && b == null) return 0
  if (a == null) return -1
  if (b == null) return 1
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return String(a).localeCompare(String(b), undefined, { numeric: true })
}

/**
 * 按对象字段生成比较器
 * @param {string} prop 字段名
 * @returns {(a: Object, b: Object) => number}
 */
export function createSortComparator(prop) {
  return (a, b) => compareValues(a && a[prop], b && b[prop])
}