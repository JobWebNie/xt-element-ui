// ==================== 日期格式化 ====================

export function padZero(num, len) {
  len = len || 2
  return String(num).padStart(len, '0')
}

/**
 * 将各种类型的日期输入统一转换为 Date 对象
 * 支持：Date | 数字（10 位秒 / 13 位毫秒） | 字符串（时间戳或日期字符串）
 * @param {*} date
 * @returns {Date|null} 无法解析时返回 null
 */
export function toDate(date) {
  if (date instanceof Date) {
    return date
  }
  if (typeof date === 'number') {
    return new Date(date.toString().length === 10 ? date * 1000 : date)
  }
  if (typeof date === 'string') {
    const str = date.trim()
    if (/^\d+$/.test(str)) {
      return new Date(str.length === 10 ? parseInt(str) * 1000 : parseInt(str))
    }
    return new Date(str.replace(/-/g, '/'))
  }
  return null
}

export const formatDate = function(date, format) {
  if (!date) {
    return ''
  }

  const d = toDate(date)
  if (!d || isNaN(d.getTime())) {
    return ''
  }

  const fmt = format || 'yyyy-MM-dd'
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  const hour = d.getHours()
  const minute = d.getMinutes()
  const second = d.getSeconds()
  const week = d.getDay()

  const weekMap = ['日', '一', '二', '三', '四', '五', '六']

  return fmt
    .replace('yyyy', year)
    .replace('MM', padZero(month))
    .replace('M', month)
    .replace('dd', padZero(day))
    .replace('d', day)
    .replace('HH', padZero(hour))
    .replace('H', hour)
    .replace('hh', padZero(hour % 12 || 12))
    .replace('h', hour % 12 || 12)
    .replace('mm', padZero(minute))
    .replace('m', minute)
    .replace('ss', padZero(second))
    .replace('s', second)
    .replace('w', weekMap[week])
    .replace('W', '星期' + weekMap[week])
}

export const formatDateTime = function(date, format) {
  return formatDate(date, format || 'yyyy-MM-dd HH:mm:ss')
}

export const formatTime = function(date, format) {
  return formatDate(date, format || 'HH:mm:ss')
}

export const formatRelativeTime = function(date) {
  if (!date) {
    return ''
  }

  const d = toDate(date)
  if (!d || isNaN(d.getTime())) {
    return ''
  }

  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour
  const week = 7 * day
  const month = 30 * day
  const year = 365 * day

  if (diff < minute) {
    return '刚刚'
  } else if (diff < hour) {
    return Math.floor(diff / minute) + '分钟前'
  } else if (diff < day) {
    return Math.floor(diff / hour) + '小时前'
  } else if (diff < week) {
    return Math.floor(diff / day) + '天前'
  } else if (diff < month) {
    return Math.floor(diff / week) + '周前'
  } else if (diff < year) {
    return Math.floor(diff / month) + '个月前'
  } else {
    return Math.floor(diff / year) + '年前'
  }
}