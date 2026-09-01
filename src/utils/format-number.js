// ==================== 数字格式化 ====================

/**
 * 安全数字转换：空值 / Infinity / 非法值一律转为 fallback
 * @param {*} v
 * @param {number} [fallback=0]
 * @returns {number}
 */
export const toSafeNumber = function(v, fallback = 0) {
  if (v === null || v === undefined || v === '' || v === Infinity || v === -Infinity) return fallback
  const n = Number(v)
  return isNaN(n) ? fallback : n
}

export const formatNumber = function(value, options) {
  if (value === null || value === undefined || value === '') {
    return ''
  }

  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) {
    return String(value)
  }

  const opts = Object.assign({
    decimals: 2,
    thousand: true,
    prefix: '',
    suffix: '',
    showSign: false
  }, options || {})

  let result = num.toFixed(opts.decimals)

  if (opts.thousand) {
    result = addThousandSeparator(result)
  }

  if (opts.showSign && num > 0) {
    result = '+' + result
  }

  return opts.prefix + result + opts.suffix
}

export const formatThousand = function(value, decimals) {
  return formatNumber(value, {
    decimals: decimals != null ? decimals : 2,
    thousand: true
  })
}

export const formatPercent = function(value, decimals) {
  if (value === null || value === undefined || value === '') {
    return ''
  }
  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) {
    return String(value)
  }
  return formatNumber(num * 100, {
    decimals: decimals != null ? decimals : 2,
    thousand: true,
    suffix: '%'
  })
}

// ==================== 文件大小格式化 ====================

export const formatFileSize = function(bytes) {
  if (bytes === null || bytes === undefined || bytes === '') {
    return ''
  }

  const num = typeof bytes === 'string' ? parseFloat(bytes) : bytes
  if (isNaN(num)) {
    return String(bytes)
  }

  if (num === 0) {
    return '0 B'
  }

  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(num) / Math.log(k))

  return parseFloat((num / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * 添加千分位分隔符（供数字/金额格式化共同使用）
 * @param {string|number} value - 待处理的小数字符串/数字
 * @returns {string}
 */
export function addThousandSeparator(value) {
  const parts = String(value).split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}