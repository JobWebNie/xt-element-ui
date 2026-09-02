<template>
  <div class="xt-mobile-date-picker">
    <!-- 顶部工具栏 -->
    <div class="xt-mobile-date-picker__toolbar">
      <button class="xt-mobile-date-picker__btn xt-mobile-date-picker__btn--cancel" @click="onCancel">取消</button>
      <span class="xt-mobile-date-picker__title">
        {{ displayDate }}
        <span v-if="hasTime" class="xt-mobile-date-picker__title-divider" />
        <span v-if="hasTime">{{ displayTime }}</span>
      </span>
      <button class="xt-mobile-date-picker__btn xt-mobile-date-picker__btn--confirm" @click="onConfirm">确定</button>
    </div>

    <!-- 滚轮选择区 -->
    <div class="xt-mobile-date-picker__body" @touchmove.prevent>
      <div class="xt-mobile-date-picker__highlight" />
      <div class="xt-mobile-date-picker__columns">
        <!-- 年 -->
        <div v-if="columns.includes('year')" class="xt-mobile-date-picker__column" ref="colYear">
          <div class="xt-mobile-date-picker__scroll" :style="scrollStyles.year" @touchstart="onTouchStart('year', $event)" @touchmove="onTouchMove('year', $event)" @touchend="onTouchEnd('year')" @mousedown="onMouseDown('year', $event)">
            <div v-for="item in yearList" :key="item" class="xt-mobile-date-picker__item" :class="{ 'is-selected': item === selected.year }">{{ item }}年</div>
          </div>
        </div>
        <!-- 月 -->
        <div v-if="columns.includes('month')" class="xt-mobile-date-picker__column" ref="colMonth">
          <div class="xt-mobile-date-picker__scroll" :style="scrollStyles.month" @touchstart="onTouchStart('month', $event)" @touchmove="onTouchMove('month', $event)" @touchend="onTouchEnd('month')" @mousedown="onMouseDown('month', $event)">
            <div v-for="item in monthList" :key="item" class="xt-mobile-date-picker__item" :class="{ 'is-selected': item === selected.month }">{{ pad(item) }}月</div>
          </div>
        </div>
        <!-- 日 -->
        <div v-if="columns.includes('day')" class="xt-mobile-date-picker__column" ref="colDay">
          <div class="xt-mobile-date-picker__scroll" :style="scrollStyles.day" @touchstart="onTouchStart('day', $event)" @touchmove="onTouchMove('day', $event)" @touchend="onTouchEnd('day')" @mousedown="onMouseDown('day', $event)">
            <div v-for="item in dayList" :key="item" class="xt-mobile-date-picker__item" :class="{ 'is-selected': item === selected.day }">{{ pad(item) }}日</div>
          </div>
        </div>
        <!-- 时 -->
        <div v-if="columns.includes('hour')" class="xt-mobile-date-picker__column" ref="colHour">
          <div class="xt-mobile-date-picker__scroll" :style="scrollStyles.hour" @touchstart="onTouchStart('hour', $event)" @touchmove="onTouchMove('hour', $event)" @touchend="onTouchEnd('hour')" @mousedown="onMouseDown('hour', $event)">
            <div v-for="item in hourList" :key="item" class="xt-mobile-date-picker__item" :class="{ 'is-selected': item === selected.hour }">{{ pad(item) }}时</div>
          </div>
        </div>
        <!-- 分 -->
        <div v-if="columns.includes('minute')" class="xt-mobile-date-picker__column" ref="colMinute">
          <div class="xt-mobile-date-picker__scroll" :style="scrollStyles.minute" @touchstart="onTouchStart('minute', $event)" @touchmove="onTouchMove('minute', $event)" @touchend="onTouchEnd('minute')" @mousedown="onMouseDown('minute', $event)">
            <div v-for="item in minuteList" :key="item" class="xt-mobile-date-picker__item" :class="{ 'is-selected': item === selected.minute }">{{ pad(item) }}分</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
var ITEM_HEIGHT = 44
var OFFSET_ROWS = 2

function pad(n) {
  return String(n).length < 2 ? '0' + n : String(n)
}

function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate()
}

function rangeList(min, max) {
  var list = []
  for (var i = min; i <= max; i++) list.push(i)
  return list
}

export default {
  name: 'XtMobileDatePicker',

  props: {
    value: {
      type: [String, Date],
      default: ''
    },
    minDate: {
      type: Date,
      default: function () {
        var d = new Date()
        d.setFullYear(d.getFullYear() - 10)
        return d
      }
    },
    maxDate: {
      type: Date,
      default: function () {
        var d = new Date()
        d.setFullYear(d.getFullYear() + 10)
        return d
      }
    },
    columns: {
      type: Array,
      default: function () { return ['year', 'month', 'day', 'hour', 'minute'] }
    },
    minHour: {
      type: Number,
      default: 0
    },
    maxHour: {
      type: Number,
      default: 23
    },
    minuteStep: {
      type: Number,
      default: 1
    }
  },

  data: function () {
    var now = new Date()
    return {
      selected: {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
        hour: now.getHours(),
        minute: now.getMinutes()
      },
      scrollStyles: {
        year: { transform: '', transition: 'none' },
        month: { transform: '', transition: 'none' },
        day: { transform: '', transition: 'none' },
        hour: { transform: '', transition: 'none' },
        minute: { transform: '', transition: 'none' }
      },
      currentTranslate: {
        year: 0, month: 0, day: 0, hour: 0, minute: 0
      },
      touchState: {
        year: { startY: 0, startTranslate: 0, lastY: 0, lastTime: 0, speed: 0 },
        month: { startY: 0, startTranslate: 0, lastY: 0, lastTime: 0, speed: 0 },
        day: { startY: 0, startTranslate: 0, lastY: 0, lastTime: 0, speed: 0 },
        hour: { startY: 0, startTranslate: 0, lastY: 0, lastTime: 0, speed: 0 },
        minute: { startY: 0, startTranslate: 0, lastY: 0, lastTime: 0, speed: 0 }
      },
      mouseCol: null,
      lastTouchEndTime: 0,
      isInitializing: false
    }
  },

  computed: {
    yearList: function () {
      return rangeList(this.minDate.getFullYear(), this.maxDate.getFullYear())
    },
    monthList: function () {
      var minM = 1
      var maxM = 12
      if (this.selected.year === this.minDate.getFullYear()) {
        minM = this.minDate.getMonth() + 1
      }
      if (this.selected.year === this.maxDate.getFullYear()) {
        maxM = this.maxDate.getMonth() + 1
      }
      if (minM > maxM) minM = maxM
      return rangeList(minM, maxM)
    },
    dayList: function () {
      var minD = 1
      var maxD = daysInMonth(this.selected.year, this.selected.month)
      if (this.selected.year === this.minDate.getFullYear() && this.selected.month === this.minDate.getMonth() + 1) {
        minD = this.minDate.getDate()
      }
      if (this.selected.year === this.maxDate.getFullYear() && this.selected.month === this.maxDate.getMonth() + 1) {
        maxD = this.maxDate.getDate()
      }
      if (minD > maxD) minD = maxD
      return rangeList(minD, maxD)
    },
    hourList: function () {
      // 取 minHour/maxHour 与 minDate/maxDate 日期边界的交集
      var minH = this.minHour
      var maxH = this.maxHour
      if (this.isDateBoundary(this.minDate)) {
        minH = Math.max(minH, this.minDate.getHours())
      }
      if (this.isDateBoundary(this.maxDate)) {
        maxH = Math.min(maxH, this.maxDate.getHours())
      }
      if (minH > maxH) minH = maxH
      return rangeList(minH, maxH)
    },
    minuteList: function () {
      var step = this.minuteStep > 1 ? this.minuteStep : 1
      var minMin = 0
      var maxMin = 59
      // 对齐到 step 的整数倍
      minMin = Math.ceil(minMin / step) * step
      if (this.isHourBoundary(this.minDate)) {
        minMin = Math.max(minMin, Math.ceil(this.minDate.getMinutes() / step) * step)
      }
      if (this.isHourBoundary(this.maxDate)) {
        maxMin = Math.min(maxMin, this.maxDate.getMinutes())
      }
      if (minMin > maxMin) minMin = maxMin
      var list = []
      for (var m = minMin; m <= maxMin; m += step) list.push(m)
      return list.length ? list : [0]
    },
    displayDate: function () {
      var parts = []
      if (this.columns.includes('year')) parts.push(this.selected.year + '年')
      if (this.columns.includes('month')) parts.push(pad(this.selected.month) + '月')
      if (this.columns.includes('day')) parts.push(pad(this.selected.day) + '日')
      return parts.join('')
    },
    displayTime: function () {
      var parts = []
      if (this.columns.includes('hour')) parts.push(pad(this.selected.hour))
      if (this.columns.includes('minute')) parts.push(pad(this.selected.minute))
      return parts.join(':')
    },
    hasTime: function () {
      return this.columns.includes('hour') || this.columns.includes('minute')
    }
  },

  watch: {
    'selected.year': function () {
      if (this.isInitializing) return
      this.clampValue('month', this.monthList)
    },
    'selected.month': function () {
      if (this.isInitializing) return
      this.clampValue('day', this.dayList)
    },
    'selected.day': function () {
      if (this.isInitializing) return
      this.clampValue('hour', this.hourList)
    },
    'selected.hour': function () {
      if (this.isInitializing) return
      this.clampValue('minute', this.minuteList)
    }
  },

  mounted: function () {
    this.initFromValue()
    var self = this
    this.$nextTick(function () {
      self.columns.forEach(function (col) {
        self.resetScroll(col)
      })
    })
  },

  beforeDestroy: function () {
    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mouseup', this.onMouseUp)
  },

  methods: {
    pad: pad,

    /* ===== 边界判断 ===== */
    isDateBoundary: function (boundary) {
      return this.selected.year === boundary.getFullYear() &&
        this.selected.month === boundary.getMonth() + 1 &&
        this.selected.day === boundary.getDate()
    },
    isHourBoundary: function (boundary) {
      return this.isDateBoundary(boundary) &&
        this.selected.hour === boundary.getHours()
    },

    /* ===== 级联钳制 ===== */
    clampValue: function (col, list) {
      var current = this.selected[col]
      if (list.indexOf(current) === -1) {
        this.selected[col] = current < list[0] ? list[0] : list[list.length - 1]
        var self = this
        this.$nextTick(function () { self.resetScroll(col) })
      }
    },

    initFromValue: function () {
      this.isInitializing = true
      var d
      var v = this.value
      if (v) {
        if (typeof v === 'string') {
          d = new Date(v.replace(/-/g, '/'))
        } else {
          d = new Date(v)
        }
      }
      if (!d || isNaN(d.getTime())) {
        d = new Date()
      }
      // 钳制到 [minDate, maxDate]
      if (d < this.minDate) d = new Date(this.minDate)
      if (d > this.maxDate) d = new Date(this.maxDate)

      this.selected.year = d.getFullYear()
      this.selected.month = d.getMonth() + 1
      this.selected.day = d.getDate()
      // hour 钳制到 [minHour, maxHour]
      var h = d.getHours()
      if (h < this.minHour) h = this.minHour
      if (h > this.maxHour) h = this.maxHour
      this.selected.hour = h
      // minute 对齐到 minuteStep
      var step = this.minuteStep > 1 ? this.minuteStep : 1
      this.selected.minute = Math.round(d.getMinutes() / step) * step
      if (this.selected.minute > 59) this.selected.minute = 59 - (59 % step)
      this.isInitializing = false
    },

    getListLength: function (col) {
      switch (col) {
        case 'year': return this.yearList.length
        case 'month': return this.monthList.length
        case 'day': return this.dayList.length
        case 'hour': return this.hourList.length
        case 'minute': return this.minuteList.length
      }
    },

    getSelectedIndex: function (col) {
      switch (col) {
        case 'year': return this.yearList.indexOf(this.selected.year)
        case 'month': return this.monthList.indexOf(this.selected.month)
        case 'day': return this.dayList.indexOf(this.selected.day)
        case 'hour': return this.hourList.indexOf(this.selected.hour)
        case 'minute': return this.minuteList.indexOf(this.selected.minute)
      }
    },

    getTargetTranslate: function (col) {
      return -(this.getSelectedIndex(col) * ITEM_HEIGHT) + OFFSET_ROWS * ITEM_HEIGHT
    },

    getMaxTranslate: function (col) {
      return (this.getListLength(col) - 1) * ITEM_HEIGHT
    },
    getMinTranslate: function (col) {
      return -this.getMaxTranslate(col) + OFFSET_ROWS * ITEM_HEIGHT
    },
    getMaxTranslatePx: function () {
      return OFFSET_ROWS * ITEM_HEIGHT
    },

    resetScroll: function (col) {
      this.currentTranslate[col] = this.getTargetTranslate(col)
      this.scrollStyles[col] = {
        transform: 'translateY(' + this.currentTranslate[col] + 'px)',
        transition: 'none'
      }
    },

    onTouchStart: function (col, e) {
      var t = e.touches[0]
      this.touchState[col] = {
        startY: t.clientY,
        startTranslate: this.currentTranslate[col],
        lastY: t.clientY,
        lastTime: Date.now(),
        speed: 0
      }
      this.scrollStyles[col] = {
        transform: 'translateY(' + this.currentTranslate[col] + 'px)',
        transition: 'none'
      }
    },

    onTouchMove: function (col, e) {
      var t = e.touches[0]
      var now = Date.now()
      var dy = t.clientY - this.touchState[col].startY
      var translate = this.touchState[col].startTranslate + dy

      var maxTranslate = this.getMaxTranslatePx()
      var minTranslate = this.getMinTranslate(col)
      var edgeStiffness = 0.3

      if (translate > maxTranslate) {
        translate = maxTranslate + (translate - maxTranslate) * edgeStiffness
      } else if (translate < minTranslate) {
        translate = minTranslate + (translate - minTranslate) * edgeStiffness
      }

      this.currentTranslate[col] = translate
      this.scrollStyles[col] = {
        transform: 'translateY(' + translate + 'px)',
        transition: 'none'
      }

      var dt = now - this.touchState[col].lastTime
      if (dt > 0) {
        this.touchState[col].speed = (t.clientY - this.touchState[col].lastY) / dt
        this.touchState[col].lastY = t.clientY
        this.touchState[col].lastTime = now
      }
    },

    onTouchEnd: function (col) {
      this.lastTouchEndTime = Date.now()
      this.finishDrag(col)
    },

    finishDrag: function (col) {
      var speed = this.touchState[col].speed
      var inertia = speed * 120
      var target = this.currentTranslate[col] + inertia

      var maxTranslate = this.getMaxTranslatePx()
      var minTranslate = this.getMinTranslate(col)
      target = Math.max(minTranslate, Math.min(maxTranslate, target))

      var adjusted = target - OFFSET_ROWS * ITEM_HEIGHT
      var index = Math.round(-adjusted / ITEM_HEIGHT)
      var clamped = Math.max(0, Math.min(this.getListLength(col) - 1, index))
      target = -(clamped * ITEM_HEIGHT) + OFFSET_ROWS * ITEM_HEIGHT

      this.currentTranslate[col] = target
      this.scrollStyles[col] = {
        transform: 'translateY(' + target + 'px)',
        transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)'
      }

      this.updateSelected(col, clamped)
    },

    /* ===== 鼠标拖拽（PC 端） ===== */
    onMouseDown: function (col, e) {
      // 屏蔽触摸结束后浏览器派发的合成 mousedown（500ms 内）
      if (Date.now() - this.lastTouchEndTime < 500) return
      e.preventDefault()
      this.mouseCol = col
      this.touchState[col] = {
        startY: e.clientY,
        startTranslate: this.currentTranslate[col],
        lastY: e.clientY,
        lastTime: Date.now(),
        speed: 0
      }
      this.scrollStyles[col] = {
        transform: 'translateY(' + this.currentTranslate[col] + 'px)',
        transition: 'none'
      }
      document.addEventListener('mousemove', this.onMouseMove)
      document.addEventListener('mouseup', this.onMouseUp)
    },
    onMouseMove: function (e) {
      var col = this.mouseCol
      if (!col) return
      var now = Date.now()
      var dy = e.clientY - this.touchState[col].startY
      var translate = this.touchState[col].startTranslate + dy

      var maxTranslate = this.getMaxTranslatePx()
      var minTranslate = this.getMinTranslate(col)
      var edgeStiffness = 0.3

      if (translate > maxTranslate) {
        translate = maxTranslate + (translate - maxTranslate) * edgeStiffness
      } else if (translate < minTranslate) {
        translate = minTranslate + (translate - minTranslate) * edgeStiffness
      }

      this.currentTranslate[col] = translate
      this.scrollStyles[col] = {
        transform: 'translateY(' + translate + 'px)',
        transition: 'none'
      }

      var dt = now - this.touchState[col].lastTime
      if (dt > 0) {
        this.touchState[col].speed = (e.clientY - this.touchState[col].lastY) / dt
        this.touchState[col].lastY = e.clientY
        this.touchState[col].lastTime = now
      }
    },
    onMouseUp: function () {
      var col = this.mouseCol
      if (!col) return
      this.mouseCol = null
      document.removeEventListener('mousemove', this.onMouseMove)
      document.removeEventListener('mouseup', this.onMouseUp)
      this.finishDrag(col)
    },

    updateSelected: function (col, index) {
      var list = this[col + 'List']
      var val = list[index]
      if (val !== undefined) {
        this.selected[col] = val
      }
    },

    onConfirm: function () {
      var dateParts = []
      if (this.columns.includes('year')) dateParts.push(this.selected.year)
      if (this.columns.includes('month')) dateParts.push(pad(this.selected.month))
      if (this.columns.includes('day')) dateParts.push(pad(this.selected.day))
      var timeParts = []
      if (this.columns.includes('hour')) timeParts.push(pad(this.selected.hour))
      if (this.columns.includes('minute')) timeParts.push(pad(this.selected.minute))
      var val = dateParts.join('-')
      if (timeParts.length) val += ' ' + timeParts.join(':')
      this.$emit('input', val)
      this.$emit('change', val)
      this.$emit('confirm', val)
    },

    onCancel: function () {
      this.$emit('cancel')
    }
  }
}
</script>

<style lang="scss" scoped>
$item-height: 44px;
$visible-count: 5;
$picker-height: $item-height * $visible-count;
$highlight-bg: rgba(64, 158, 255, 0.06);
$highlight-border-color: rgba(64, 158, 255, 0.15);

.xt-mobile-date-picker {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 16px 16px 0 0;
  padding-bottom: env(safe-area-inset-bottom, 12px);
  user-select: none;
  -webkit-user-select: none;
}

.xt-mobile-date-picker__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding: 0 16px;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.xt-mobile-date-picker__btn {
  border: none;
  background: none;
  font-size: 15px;
  padding: 8px 4px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;

  &--cancel { color: #999; }
  &--confirm { color: var(--xt-color-primary, #409eff); font-weight: 600; }
}

.xt-mobile-date-picker__title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.xt-mobile-date-picker__title-divider {
  display: inline-block;
  width: 1px;
  height: 16px;
  background: #e0e0e0;
}

.xt-mobile-date-picker__body {
  position: relative;
  height: $picker-height;
  overflow: hidden;
}

.xt-mobile-date-picker__columns {
  display: flex;
  height: 100%;
  cursor: grab;
}

.xt-mobile-date-picker__column {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.xt-mobile-date-picker__scroll {
  display: flex;
  flex-direction: column;
}

.xt-mobile-date-picker__item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: $item-height;
  font-size: 17px;
  color: #999;
  white-space: nowrap;
  padding: 0 4px;
  transition: color 0.2s;

  &.is-selected {
    color: #333;
    font-weight: 600;
    font-size: 18px;
  }
}

.xt-mobile-date-picker__highlight {
  position: absolute;
  top: $item-height * 2;
  left: 0;
  right: 0;
  height: $item-height;
  background: $highlight-bg;
  border-top: 1px solid $highlight-border-color;
  border-bottom: 1px solid $highlight-border-color;
  pointer-events: none;
  z-index: 1;
}

.xt-mobile-date-picker__body::before,
.xt-mobile-date-picker__body::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: $item-height * 2;
  pointer-events: none;
  z-index: 2;
}

.xt-mobile-date-picker__body::before {
  top: 0;
  background: linear-gradient(to bottom, #fff 0%, rgba(255, 255, 255, 0) 100%);
}

.xt-mobile-date-picker__body::after {
  bottom: 0;
  background: linear-gradient(to top, #fff 0%, rgba(255, 255, 255, 0) 100%);
}
</style>
