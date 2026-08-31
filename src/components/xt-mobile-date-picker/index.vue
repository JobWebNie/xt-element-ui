<template>
  <div class="xt-mobile-picker__wrapper">
    <transition name="picker-fade">
      <div v-if="visible" class="xt-mobile-picker__mask" @click="onCancel" />
    </transition>
    <transition name="picker-slide">
      <div v-if="visible" class="xt-mobile-picker" @touchmove.prevent>
        <!-- 顶部工具栏 -->
        <div class="xt-mobile-picker__toolbar">
          <button class="xt-mobile-picker__btn xt-mobile-picker__btn--cancel" @click="onCancel">取消</button>
          <span class="xt-mobile-picker__title">
            {{ displayDate }}
            <span v-if="hasTime" class="xt-mobile-picker__title-divider" />
            <span v-if="hasTime">{{ displayTime }}</span>
          </span>
          <button class="xt-mobile-picker__btn xt-mobile-picker__btn--confirm" @click="onConfirm">确定</button>
        </div>

        <!-- 滚轮选择区 -->
        <div class="xt-mobile-picker__body">
          <div class="xt-mobile-picker__highlight" />
          <div class="xt-mobile-picker__columns">
            <!-- 年 -->
            <div v-if="columns.includes('year')" class="xt-mobile-picker__column" ref="colYear">
              <div class="xt-mobile-picker__scroll" :style="scrollStyles.year" @touchstart="onTouchStart('year', $event)" @touchmove="onTouchMove('year', $event)" @touchend="onTouchEnd('year')">
                <div v-for="item in yearList" :key="item" class="xt-mobile-picker__item" :class="{ 'is-selected': item === selected.year }">{{ item }}年</div>
              </div>
            </div>
            <!-- 月 -->
            <div v-if="columns.includes('month')" class="xt-mobile-picker__column" ref="colMonth">
              <div class="xt-mobile-picker__scroll" :style="scrollStyles.month" @touchstart="onTouchStart('month', $event)" @touchmove="onTouchMove('month', $event)" @touchend="onTouchEnd('month')">
                <div v-for="item in monthList" :key="item" class="xt-mobile-picker__item" :class="{ 'is-selected': item === selected.month }">{{ pad(item) }}月</div>
              </div>
            </div>
            <!-- 日 -->
            <div v-if="columns.includes('day')" class="xt-mobile-picker__column" ref="colDay">
              <div class="xt-mobile-picker__scroll" :style="scrollStyles.day" @touchstart="onTouchStart('day', $event)" @touchmove="onTouchMove('day', $event)" @touchend="onTouchEnd('day')">
                <div v-for="item in dayList" :key="item" class="xt-mobile-picker__item" :class="{ 'is-selected': item === selected.day }">{{ pad(item) }}日</div>
              </div>
            </div>
            <!-- 时 -->
            <div v-if="columns.includes('hour')" class="xt-mobile-picker__column" ref="colHour">
              <div class="xt-mobile-picker__scroll" :style="scrollStyles.hour" @touchstart="onTouchStart('hour', $event)" @touchmove="onTouchMove('hour', $event)" @touchend="onTouchEnd('hour')">
                <div v-for="item in 24" :key="item" class="xt-mobile-picker__item" :class="{ 'is-selected': item - 1 === selected.hour }">{{ pad(item - 1) }}时</div>
              </div>
            </div>
            <!-- 分 -->
            <div v-if="columns.includes('minute')" class="xt-mobile-picker__column" ref="colMinute">
              <div class="xt-mobile-picker__scroll" :style="scrollStyles.minute" @touchstart="onTouchStart('minute', $event)" @touchmove="onTouchMove('minute', $event)" @touchend="onTouchEnd('minute')">
                <div v-for="item in 60" :key="item" class="xt-mobile-picker__item" :class="{ 'is-selected': item - 1 === selected.minute }">{{ pad(item - 1) }}分</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
var ITEM_HEIGHT = 44
var VISIBLE_COUNT = 5
var OFFSET_ROWS = 2

function pad(n) {
  return String(n).length < 2 ? '0' + n : String(n)
}

function daysInMonth(year, month) {
  return new Date(year, month, 0).getDate()
}

export default {
  name: 'XtMobileDatePicker',

  props: {
    value: {
      type: [String, Date],
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    },
    minYear: {
      type: Number,
      default: function () { return new Date().getFullYear() - 10 }
    },
    maxYear: {
      type: Number,
      default: function () { return new Date().getFullYear() + 10 }
    },
    columns: {
      type: Array,
      default: function () { return ['year', 'month', 'day', 'hour', 'minute'] }
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
      }
    }
  },

  computed: {
    yearList: function () {
      var list = []
      for (var y = this.minYear; y <= this.maxYear; y++) list.push(y)
      return list
    },
    monthList: function () {
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    },
    dayList: function () {
      var max = daysInMonth(this.selected.year, this.selected.month)
      var list = []
      for (var d = 1; d <= max; d++) list.push(d)
      return list
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
    visible: function (val) {
      if (val) {
        this.initFromValue()
        var self = this
        this.$nextTick(function () {
          self.columns.forEach(function (col) {
            self.resetScroll(col)
          })
        })
      }
    },
    'selected.year': function () {
      this.adjustDay()
    },
    'selected.month': function () {
      this.adjustDay()
    }
  },

  methods: {
    pad: pad,

    initFromValue: function () {
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
      this.selected.year = d.getFullYear()
      this.selected.month = d.getMonth() + 1
      this.selected.day = d.getDate()
      this.selected.hour = d.getHours()
      this.selected.minute = d.getMinutes()
    },

    adjustDay: function () {
      var max = daysInMonth(this.selected.year, this.selected.month)
      if (this.selected.day > max) {
        this.selected.day = max
      }
    },

    getListLength: function (col) {
      switch (col) {
        case 'year': return this.yearList.length
        case 'month': return 12
        case 'day': return this.dayList.length
        case 'hour': return 24
        case 'minute': return 60
      }
    },

    getSelectedIndex: function (col) {
      switch (col) {
        case 'year': return this.yearList.indexOf(this.selected.year)
        case 'month': return this.selected.month - 1
        case 'day': return this.selected.day - 1
        case 'hour': return this.selected.hour
        case 'minute': return this.selected.minute
      }
    },

    getTargetTranslate: function (col) {
      return -(this.getSelectedIndex(col) * ITEM_HEIGHT) + OFFSET_ROWS * ITEM_HEIGHT
    },

    getMaxTranslate: function (col) {
      return (this.getListLength(col) - 1) * ITEM_HEIGHT
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

      var maxTranslate = 0
      var minTranslate = -this.getMaxTranslate(col)
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
      var speed = this.touchState[col].speed
      var inertia = speed * 120
      var target = this.currentTranslate[col] + inertia

      var maxTranslate = 0
      var minTranslate = -this.getMaxTranslate(col)
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

    updateSelected: function (col, index) {
      switch (col) {
        case 'year': this.selected.year = this.yearList[index] || this.selected.year; break
        case 'month': this.selected.month = index + 1; break
        case 'day': this.selected.day = index + 1; break
        case 'hour': this.selected.hour = index; break
        case 'minute': this.selected.minute = index; break
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
      this.$emit('update:visible', false)
    },

    onCancel: function () {
      this.$emit('cancel')
      this.$emit('update:visible', false)
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

.xt-mobile-picker__wrapper {
  /* 占位 wrapper */
}

.xt-mobile-picker__mask {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.5);
}

.xt-mobile-picker {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2001;
  background: #fff;
  border-radius: 16px 16px 0 0;
  padding-bottom: env(safe-area-inset-bottom, 12px);
  user-select: none;
}

.xt-mobile-picker__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding: 0 16px;
  border-bottom: 1px solid #f0f0f0;
}

.xt-mobile-picker__btn {
  border: none;
  background: none;
  font-size: 15px;
  padding: 8px 4px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;

  &--cancel { color: #999; }
  &--confirm { color: var(--xt-color-primary, #409eff); font-weight: 600; }
}

.xt-mobile-picker__title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

.xt-mobile-picker__title-divider {
  display: inline-block;
  width: 1px;
  height: 16px;
  background: #e0e0e0;
}

.xt-mobile-picker__body {
  position: relative;
  height: $picker-height;
  overflow: hidden;
}

.xt-mobile-picker__columns {
  display: flex;
  height: 100%;
}

.xt-mobile-picker__column {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.xt-mobile-picker__scroll {
  display: flex;
  flex-direction: column;
}

.xt-mobile-picker__item {
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

.xt-mobile-picker__highlight {
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

.xt-mobile-picker__body::before,
.xt-mobile-picker__body::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: $item-height * 2;
  pointer-events: none;
  z-index: 2;
}

.xt-mobile-picker__body::before {
  top: 0;
  background: linear-gradient(to bottom, #fff 0%, rgba(255, 255, 255, 0) 100%);
}

.xt-mobile-picker__body::after {
  bottom: 0;
  background: linear-gradient(to top, #fff 0%, rgba(255, 255, 255, 0) 100%);
}

.picker-fade-enter-active,
.picker-fade-leave-active {
  transition: opacity 0.3s;
}

.picker-fade-enter,
.picker-fade-leave-to {
  opacity: 0;
}

.picker-slide-enter-active,
.picker-slide-leave-active {
  transition: transform 0.35s cubic-bezier(0.23, 1, 0.32, 1);
}

.picker-slide-enter,
.picker-slide-leave-to {
  transform: translateY(100%);
}
</style>