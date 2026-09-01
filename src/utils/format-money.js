// ==================== 金额格式化 ====================

import { addThousandSeparator } from './format-number'

export const formatMoney = function(value, options) {
  if (value === null || value === undefined || value === '') {
    return ''
  }

  const num = typeof value === 'string' ? parseFloat(value) : value
  if (isNaN(num)) {
    return String(value)
  }

  const opts = Object.assign({
    currency: 'CNY',
    decimals: 2,
    prefix: '',
    suffix: '',
    showSign: false
  }, options || {})

  const currencySymbols = {
    CNY: '¥',
    USD: '$',
    EUR: '€',
    JPY: '¥',
    GBP: '£',
    AUD: 'A$',
    CAD: 'C$'
  }

  let symbol = currencySymbols[opts.currency] || ''
  let formatted = addThousandSeparator(num.toFixed(opts.decimals))

  if (opts.showSign && num > 0) {
    formatted = '+' + formatted
  }

  if (opts.prefix) {
    formatted = opts.prefix + formatted
  }

  if (opts.suffix) {
    formatted = formatted + opts.suffix
  }

  return symbol + formatted
}

export const formatCNY = function(value, decimals) {
  return formatMoney(value, {
    currency: 'CNY',
    decimals: decimals != null ? decimals : 2
  })
}

export const formatUSD = function(value, decimals) {
  return formatMoney(value, {
    currency: 'USD',
    decimals: decimals != null ? decimals : 2
  })
}