<template>
  <div class="xt-mobile-picker">
    <!-- 顶部工具栏 -->
    <div class="xt-mobile-picker__toolbar">
      <button class="xt-mobile-picker__btn xt-mobile-picker__btn--cancel" @click="onCancel">{{ cancelText }}</button>
      <span class="xt-mobile-picker__title">{{ title }}</span>
      <button class="xt-mobile-picker__btn xt-mobile-picker__btn--confirm" @click="onConfirm">{{ confirmText }}</button>
    </div>

    <!-- 单选滚轮模式 -->
    <div v-if="mode === 'single'" class="xt-mobile-picker__body" @touchmove.prevent>
      <div class="xt-mobile-picker__highlight" />
      <div class="xt-mobile-date-picker__columns" :style="scrollStyle" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd" @mousedown="onMouseDown">
        <div class="xt-mobile-date-picker__column">
          <div
            v-for="(item, idx) in options"
            :key="idx"
            class="xt-mobile-picker__item"
            :class="{ 'is-selected': idx === selectedIndex, 'is-disabled': getDisabled(item) }"
          >{{ getLabel(item) }}</div>
        </div>
      </div>
    </div>

    <!-- 多选列表模式 -->
    <div v-else class="xt-mobile-picker__list">
      <div
        v-for="(item, idx) in options"
        :key="idx"
        class="xt-mobile-picker__list-item"
        :class="{ 'is-checked': isChecked(item), 'is-disabled': getDisabled(item) }"
        @click="toggleItem(item)"
      >
        <span class="xt-mobile-picker__list-label">{{ getLabel(item) }}</span>
        <span class="xt-mobile-picker__checkmark">
          <svg v-if="isChecked(item)" viewBox="0 0 24 24" width="18" height="18">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/>
          </svg>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
var ITEM_HEIGHT = 44
var OFFSET_ROWS = 2

export default {
  name: 'XtMobilePicker',

  props: {
    value: {
      type: [String, Number, Array],
      default: ''
    },
    options: {
      type: Array,
      default: function () { return [] }
    },
    mode: {
      type: String,
      default: 'single',
      validator: function (v) { return ['single', 'multiple'].indexOf(v) !== -1 }
    },
    title: {
      type: String,
      default: '请选择'
    },
    confirmText: {
      type: String,
      default: '确定'
    },
    cancelText: {
      type: String,
      default: '取消'
    },
    fieldKeys: {
      type: Object,
      default: function () { return { label: 'label', value: 'value', disabled: 'disabled' } }
    }
  },

  data: function () {
    return {
      selectedIndex: 0,
      checkedValues: [],
      scrollStyle: { transform: '', transition: 'none' },
      currentTranslate: 0,
      touch: { startY: 0, startTranslate: 0, lastY: 0, lastTime: 0, speed: 0 },
      lastTouchEndTime: 0,
      isMouseDragging: false
    }
  },

  mounted: function () {
    this.initFromValue()
    if (this.mode === 'single') {
      var self = this
      this.$nextTick(function () { self.resetScroll() })
    }
  },

  beforeDestroy: function () {
    document.removeEventListener('mousemove', this.onMouseMove)
    document.removeEventListener('mouseup', this.onMouseUp)
  },

  methods: {
    getLabel: function (item) {
      return item[this.fieldKeys.label]
    },
    getValue: function (item) {
      return item[this.fieldKeys.value]
    },
    getDisabled: function (item) {
      return !!item[this.fieldKeys.disabled]
    },

    initFromValue: function () {
      if (this.mode === 'single') {
        var idx = -1
        for (var i = 0; i < this.options.length; i++) {
          if (this.getValue(this.options[i]) === this.value) { idx = i; break }
        }
        this.selectedIndex = idx >= 0 ? idx : 0
      } else {
        if (Array.isArray(this.value)) {
          this.checkedValues = this.value.slice()
        } else if (this.value !== '' && this.value !== null && this.value !== undefined) {
          this.checkedValues = [this.value]
        } else {
          this.checkedValues = []
        }
      }
    },

    /* ===== 单选滚轮 ===== */
    getTargetTranslate: function () {
      return -(this.selectedIndex * ITEM_HEIGHT) + OFFSET_ROWS * ITEM_HEIGHT
    },
    getMaxTranslate: function () {
      return (this.options.length - 1) * ITEM_HEIGHT
    },
    getMinTranslate: function () {
      return -this.getMaxTranslate() + OFFSET_ROWS * ITEM_HEIGHT
    },
    getMaxTranslatePx: function () {
      return OFFSET_ROWS * ITEM_HEIGHT
    },
    resetScroll: function () {
      this.currentTranslate = this.getTargetTranslate()
      this.scrollStyle = {
        transform: 'translateY(' + this.currentTranslate + 'px)',
        transition: 'none'
      }
    },
    onTouchStart: function (e) {
      var t = e.touches[0]
      this.touch = { startY: t.clientY, startTranslate: this.currentTranslate, lastY: t.clientY, lastTime: Date.now(), speed: 0 }
      this.scrollStyle = { transform: 'translateY(' + this.currentTranslate + 'px)', transition: 'none' }
    },
    onTouchMove: function (e) {
      var t = e.touches[0]
      var dy = t.clientY - this.touch.startY
      var translate = this.touch.startTranslate + dy
      var maxT = this.getMaxTranslatePx()
      var minT = this.getMinTranslate()
      var stiff = 0.3
      if (translate > maxT) translate = maxT + (translate - maxT) * stiff
      else if (translate < minT) translate = minT + (translate - minT) * stiff
      this.currentTranslate = translate
      this.scrollStyle = { transform: 'translateY(' + translate + 'px)', transition: 'none' }
      var now = Date.now()
      var dt = now - this.touch.lastTime
      if (dt > 0) {
        this.touch.speed = (t.clientY - this.touch.lastY) / dt
        this.touch.lastY = t.clientY
        this.touch.lastTime = now
      }
    },
    onTouchEnd: function () {
      this.lastTouchEndTime = Date.now()
      this.finishDrag()
    },

    finishDrag: function () {
      var inertia = this.touch.speed * 120
      var target = this.currentTranslate + inertia
      var maxT = this.getMaxTranslatePx()
      var minT = this.getMinTranslate()
      target = Math.max(minT, Math.min(maxT, target))
      var adjusted = target - OFFSET_ROWS * ITEM_HEIGHT
      var index = Math.round(-adjusted / ITEM_HEIGHT)
      var clamped = Math.max(0, Math.min(this.options.length - 1, index))
      target = -(clamped * ITEM_HEIGHT) + OFFSET_ROWS * ITEM_HEIGHT
      this.currentTranslate = target
      this.scrollStyle = { transform: 'translateY(' + target + 'px)', transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)' }
      this.selectedIndex = clamped
    },

    /* ===== 鼠标拖拽（PC 端） ===== */
    onMouseDown: function (e) {
      // 屏蔽触摸结束后浏览器派发的合成 mousedown（500ms 内）
      if (Date.now() - this.lastTouchEndTime < 500) return
      e.preventDefault()
      this.isMouseDragging = true
      this.touch = { startY: e.clientY, startTranslate: this.currentTranslate, lastY: e.clientY, lastTime: Date.now(), speed: 0 }
      this.scrollStyle = { transform: 'translateY(' + this.currentTranslate + 'px)', transition: 'none' }
      document.addEventListener('mousemove', this.onMouseMove)
      document.addEventListener('mouseup', this.onMouseUp)
    },
    onMouseMove: function (e) {
      if (!this.isMouseDragging) return
      var dy = e.clientY - this.touch.startY
      var translate = this.touch.startTranslate + dy
      var maxT = this.getMaxTranslatePx()
      var minT = this.getMinTranslate()
      var stiff = 0.3
      if (translate > maxT) translate = maxT + (translate - maxT) * stiff
      else if (translate < minT) translate = minT + (translate - minT) * stiff
      this.currentTranslate = translate
      this.scrollStyle = { transform: 'translateY(' + translate + 'px)', transition: 'none' }
      var now = Date.now()
      var dt = now - this.touch.lastTime
      if (dt > 0) {
        this.touch.speed = (e.clientY - this.touch.lastY) / dt
        this.touch.lastY = e.clientY
        this.touch.lastTime = now
      }
    },
    onMouseUp: function () {
      if (!this.isMouseDragging) return
      this.isMouseDragging = false
      document.removeEventListener('mousemove', this.onMouseMove)
      document.removeEventListener('mouseup', this.onMouseUp)
      this.finishDrag()
    },

    /* ===== 多选列表 ===== */
    isChecked: function (item) {
      return this.checkedValues.indexOf(this.getValue(item)) !== -1
    },
    toggleItem: function (item) {
      if (this.getDisabled(item)) return
      var val = this.getValue(item)
      var idx = this.checkedValues.indexOf(val)
      if (idx === -1) {
        this.checkedValues.push(val)
      } else {
        this.checkedValues.splice(idx, 1)
      }
    },

    /* ===== 公共 ===== */
    onConfirm: function () {
      var val
      if (this.mode === 'single') {
        val = this.options.length ? this.getValue(this.options[this.selectedIndex]) : ''
      } else {
        val = this.checkedValues.slice()
      }
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

.xt-mobile-picker {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 16px 16px 0 0;
  padding-bottom: env(safe-area-inset-bottom, 12px);
  user-select: none;
  -webkit-user-select: none;
}

.xt-mobile-picker__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding: 0 16px;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
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
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

/* ===== 滚轮模式 ===== */
.xt-mobile-picker__body {
  position: relative;
  height: $picker-height;
  overflow: hidden;
}

.xt-mobile-picker__highlight {
  position: absolute;
  top: $item-height * 2;
  left: 0;
  right: 0;
  height: $item-height;
  background: rgba(64, 158, 255, 0.06);
  border-top: 1px solid rgba(64, 158, 255, 0.15);
  border-bottom: 1px solid rgba(64, 158, 255, 0.15);
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

.xt-mobile-date-picker__columns {
  display: flex;
  flex-direction: column;
  cursor: grab;
}
.xt-mobile-date-picker__column {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.xt-mobile-picker__item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: $item-height;
  font-size: 17px;
  color: #999;
  white-space: nowrap;
  padding: 0 12px;
  transition: color 0.2s;

  &.is-selected {
    color: #333;
    font-weight: 600;
    font-size: 18px;
  }

  &.is-disabled {
    color: #c0c4cc;
  }
}

/* ===== 列表模式 ===== */
.xt-mobile-picker__list {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  max-height: 50vh;
  padding: 4px 0;
}

.xt-mobile-picker__list-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 52px;
  padding: 0 20px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  border-bottom: 1px solid #f5f5f5;

  &:active {
    background: #f9f9f9;
  }

  &.is-disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

.xt-mobile-picker__list-label {
  font-size: 16px;
  color: #333;
}

.xt-mobile-picker__checkmark {
  display: flex;
  align-items: center;
  color: var(--xt-color-primary, #409eff);
}
</style>
