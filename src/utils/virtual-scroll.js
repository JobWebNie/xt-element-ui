// ==================== 虚拟滚动工具 ====================

/**
 * 固定尺寸虚拟滚动的可见范围计算（纯函数）
 * 供 XtScroll / XtTable(VirtualElTable) 复用，统一「根据滚动偏移计算切片范围」的核心算法
 *
 * @param {Object} opts
 * @param {number} opts.scrollOffset 当前滚动偏移（scrollTop / scrollLeft）
 * @param {number} opts.itemSize 单项尺寸（px）
 * @param {number} opts.containerSize 容器可视尺寸（px）
 * @param {number} opts.total 数据总条数
 * @param {number} [opts.bufferSize] 缓冲区数量（前后各多渲染 N 项）
 * @returns {{ startIndex: number, endIndex: number, offsetStart: number }}
 *  startIndex / endIndex 为含缓冲区的切片范围；offsetStart 为切片起点对应的像素偏移
 */
export function computeFixedVirtualRange({ scrollOffset, itemSize, containerSize, total, bufferSize }) {
  const safeItemSize = itemSize && itemSize > 0 ? itemSize : 1
  const safeBuffer = bufferSize && bufferSize > 0 ? bufferSize : 0
  const safeTotal = total > 0 ? total : 0
  const safeOffset = scrollOffset > 0 ? scrollOffset : 0

  const rawStart = Math.floor(safeOffset / safeItemSize)
  const visibleCount = Math.ceil(containerSize / safeItemSize)

  const startIndex = Math.max(0, rawStart - safeBuffer)
  const endIndex = Math.min(safeTotal, rawStart + visibleCount + safeBuffer)
  const offsetStart = startIndex * safeItemSize

  return { startIndex, endIndex, offsetStart }
}