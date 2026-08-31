<template>
  <span
    class="xt-time"
    :class="[
      typeColor ? 'xt-time--' + typeColor : '',
      'xt-time--' + size,
      { 'xt-time--bold': bold }
    ]"
    :style="customStyle"
    @click="handleClick"
  >
    <slot name="prefix">{{ prefix }}</slot>

    <slot>
      <template v-if="mode === 'text'">
        <template v-if="displayText !== undefined">{{ displayText }}</template>
        <template v-else-if="!hideEmpty">{{ emptyText }}</template>
      </template>

      <template v-else-if="mode === 'now'">
        {{ nowText }}
      </template>

      <template v-else-if="mode === 'countdown'">
        <template v-if="isCountdownFinished">
          <slot name="finished">{{ finishedText }}</slot>
        </template>
        <template v-else>
          {{ countdownText }}
        </template>
      </template>
    </slot>

    <slot name="suffix">{{ suffix }}</slot>
  </span>
</template>

<script>
const DEFAULT_FORMAT = 'YYYY-MM-DD HH:mm:ss'

function pad(n) {
  const s = String(n)
  return s.length < 2 ? '0' + s : s
}

/**
 * 根据字符串/数字/Date 解析为 Date 对象
 * 兼容：时间戳(ms/s)、Date、"2024-01-01"、"2024/01/01 12:00:00"、ISO 字符串
 */
function parseDate(value) {
  if (value === null || value === undefined || value === '') return null
  if (value instanceof Date) return isNaN(value.getTime()) ? null : value

  // 数字时间戳
  if (typeof value === 'number') {
    // 10 位秒级时间戳补 000
    const t = value < 1e12 ? value * 1000 : value
    const d = new Date(t)
    return isNaN(d.getTime()) ? null : d
  }

  if (typeof value === 'string') {
    // 纯数字字符串
    if (/^\d+$/.test(value)) {
      const n = Number(value)
      const t = n < 1e12 ? n * 1000 : n
      const d = new Date(t)
      return isNaN(d.getTime()) ? null : d
    }
    // 将 "-" 统一为 "/"，避免 Safari 下 "YYYY-MM-DD" 解析失败
    const normalized = value.replace(/-/g, '/')
    const d = new Date(normalized)
    return isNaN(d.getTime()) ? null : d
  }

  return null
}

/**
 * 简易 formatDateTime 实现（不依赖外部库）
 * 支持占位符：YYYY MM DD HH mm ss SSS
 */
function formatDateTime(date, fmt) {
  if (!date) return ''
  const f = fmt || DEFAULT_FORMAT
  const map = {
    YYYY: date.getFullYear(),
    MM: pad(date.getMonth() + 1),
    DD: pad(date.getDate()),
    HH: pad(date.getHours()),
    mm: pad(date.getMinutes()),
    ss: pad(date.getSeconds()),
    SSS: String(date.getMilliseconds()).padStart(3, '0')
  }
  return f.replace(/YYYY|MM|DD|HH|mm|ss|SSS/g, (k) => map[k])
}

export default {
  name: 'XtTime',

  props: {
    // 显示模式：now（当前时间实时刷新）/ countdown（倒计时）/ text（格式化日期文本）
    type: {
      type: String,
      default: 'now',
      validator: (val) => ['now', 'countdown', 'text'].includes(val)
    },

    // ===== 通用 =====
    size: {
      type: String,
      default: 'base',
      validator: (val) =>
        ['extra-large', 'large', 'medium', 'base', 'small', 'extra-small'].includes(val)
    },
    typeColor: {
      type: String,
      default: '',
      validator: (val) => ['', 'primary', 'success', 'warning', 'danger'].includes(val)
    },
    bold: {
      type: Boolean,
      default: false
    },
    format: {
      type: String,
      default: DEFAULT_FORMAT
    },
    prefix: {
      type: String,
      default: ''
    },
    suffix: {
      type: String,
      default: ''
    },
    emptyText: {
      type: String,
      default: '-'
    },
    hideEmpty: {
      type: Boolean,
      default: false
    },
    interval: {
      type: Number,
      default: 1000,
      validator: (val) => val >= 100
    },

    // ===== text 模式 =====
    // 兼容 v-model 用法，也可直接传 value / :value
    value: {
      type: [String, Number, Date],
      default: ''
    },

    // ===== countdown 模式 =====
    targetTime: {
      type: [String, Number, Date],
      default: ''
    },
    // 倒计时显示格式：
    // DHMS -> 3天 12时 08分 30秒
    // HMS  -> 12时 08分 30秒（天数自动折算到小时）
    // MS   -> 08分 30秒（全部折算到分钟）
    // SEC  -> 3200秒
    countdownFormat: {
      type: String,
      default: 'DHMS',
      validator: (val) => ['DHMS', 'HMS', 'MS', 'SEC'].includes(val)
    },
    finishedText: {
      type: String,
      default: '已结束'
    }
  },

  data() {
    return {
      tick: 0
    }
  },

  computed: {
    mode() {
      return this.type
    },

    parsedValue() {
      return parseDate(this.value)
    },

    parsedTarget() {
      return parseDate(this.targetTime) || this.parsedValue || new Date()
    },

    displayText() {
      if (!this.parsedValue) return undefined
      return formatDateTime(this.parsedValue, this.format)
    },

    nowText() {
      // 通过 tick 触发刷新
      // eslint-disable-next-line no-unused-vars
      const _ = this.tick
      return formatDateTime(new Date(), this.format)
    },

    // 剩余毫秒数（countdown 模式）
    remainingMs() {
      if (this.mode !== 'countdown') return 0
      // eslint-disable-next-line no-unused-vars
      const _ = this.tick
      if (!this.parsedTarget) return 0
      const now = Date.now()
      // value 有值时：到达 value 时间前保持静态差值，到达后开始实时倒计时
      const baseTime = this.parsedValue
        ? Math.max(this.parsedValue.getTime(), now)
        : now
      const diff = this.parsedTarget.getTime() - baseTime
      return diff > 0 ? diff : 0
    },

    isCountdownFinished() {
      return this.mode === 'countdown' && this.parsedTarget && this.remainingMs <= 0
    },

    countdownText() {
      if (!this.parsedTarget) return this.emptyText
      const total = Math.floor(this.remainingMs / 1000)
      if (total <= 0) return this.finishedText

      switch (this.countdownFormat) {
        case 'SEC':
          return `${total}秒`
        case 'MS': {
          const m = Math.floor(total / 60)
          const s = total % 60
          return `${pad(m)}分${pad(s)}秒`
        }
        case 'HMS': {
          const h = Math.floor(total / 3600)
          const m = Math.floor((total % 3600) / 60)
          const s = total % 60
          return `${pad(h)}时${pad(m)}分${pad(s)}秒`
        }
        case 'DHMS':
        default: {
          const d = Math.floor(total / 86400)
          const h = Math.floor((total % 86400) / 3600)
          const m = Math.floor((total % 3600) / 60)
          const s = total % 60
          return `${d}天${pad(h)}时${pad(m)}分${pad(s)}秒`
        }
      }
    },

    customStyle() {
      return {}
    }
  },

  watch: {
    type() {
      this.restartTimer()
    },
    interval() {
      this.restartTimer()
    }
  },

  mounted() {
    this.restartTimer()
  },

  beforeDestroy() {
    this.clearTimer()
  },

  activated() {
    this.restartTimer()
  },

  deactivated() {
    this.clearTimer()
  },

  methods: {
    restartTimer() {
      this.clearTimer()
      if (this.mode === 'now' || this.mode === 'countdown') {
        // 立即刷新一次，避免首次渲染时 tick=0 导致的差异
        this.tick++
        this._timer = setInterval(() => {
          this.tick++
          // 倒计时结束触发 finish 事件
          if (this.mode === 'countdown' && this.parsedTarget && this.remainingMs <= 0) {
            this.clearTimer()
            this.$emit('finish')
          }
        }, this.interval)
      }
    },

    clearTimer() {
      if (this._timer) {
        clearInterval(this._timer)
        this._timer = null
      }
    },

    handleClick(e) {
      this.$emit('click', e)
    }
  }
}
</script>
