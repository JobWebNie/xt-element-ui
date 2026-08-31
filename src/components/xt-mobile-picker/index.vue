<template>
  <div class="xt-mobile-select__wrapper">
    <transition name="xt-msk-fade">
      <div v-if="visible" class="xt-mobile-select__mask" @click="onCancel" />
    </transition>
    <transition name="xt-msk-slide">
      <div v-if="visible" class="xt-mobile-select" @touchmove.prevent>
        <!-- 顶部工具栏 -->
        <div class="xt-mobile-select__toolbar">
          <button class="xt-mobile-select__btn xt-mobile-select__btn--cancel" @click="onCancel">{{ cancelText }}</button>
          <span class="xt-mobile-select__title">{{ title }}</span>
          <button class="xt-mobile-select__btn xt-mobile-select__btn--confirm" @click="onConfirm">{{ confirmText }}</button>
        </div>

        <!-- 单选滚轮模式 -->
        <div v-if="mode === 'single'" class="xt-mobile-select__body">
          <div class="xt-mobile-select__highlight" />
          <div class="xt-mobile-select__scroll" :style="scrollStyle" @touchstart="onTouchStart" @touchmove="onTouchMove" @touchend="onTouchEnd">
            <div
              v-for="(item, idx) in options"
              :key="idx"
              class="xt-mobile-select__item"
              :class="{ 'is-selected': idx === selectedIndex, 'is-disabled': getDisabled(item) }"
            >{{ getLabel(item) }}</div>
          </div>
        </div>

        <!-- 多选列表模式 -->
        <div v-else class="xt-mobile-select__list">
          <div
            v-for="(item, idx) in options"
            :key="idx"
            class="xt-mobile-select__list-item"
            :class="{ 'is-checked': isChecked(item), 'is-disabled': getDisabled(item) }"
            @click="toggleItem(item)"
          >
            <span class="xt-mobile-select__list-label">{{ getLabel(item) }}</span>
            <span class="xt-mobile-select__checkmark">
              <svg v-if="isChecked(item)" viewBox="0 0 24 24" width="18" height="18">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="currentColor"/>
              </svg>
            </span>
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

export default {
  name: 'XtMobilePicker',

  props: {
    value: {
      type: [String, Number, Array],
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
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
      touch: { startY: 0, startTranslate: 0, lastY: 0, lastTime: 0, speed: 0 }
    }
  },

  watch: {
    visible: function (val) {
      if (val) {
        this.initFromValue()
        var self = this
        if (this.mode === 'single') {
          this.$nextTick(function () { self.resetScroll() })
        }
      }
    }
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
      var maxT = 0
      var minT = -this.getMaxTranslate()
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
      var inertia = this.touch.speed * 120
      var target = this.currentTranslate + inertia
      var maxT = 0
      var minT = -this.getMaxTranslate()
      target = Math.max(minT, Math.min(maxT, target))
      var adjusted = target - OFFSET_ROWS * ITEM_HEIGHT
      var index = Math.round(-adjusted / ITEM_HEIGHT)
      var clamped = Math.max(0, Math.min(this.options.length - 1, index))
      target = -(clamped * ITEM_HEIGHT) + OFFSET_ROWS * ITEM_HEIGHT
      this.currentTranslate = target
      this.scrollStyle = { transform: 'translateY(' + target + 'px)', transition: 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)' }
      this.selectedIndex = clamped
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
        this.$emit('input', val)
        this.$emit('change', val)
        this.$emit('confirm', val)
      } else {
        val = this.checkedValues.slice()
        this.$emit('input', val)
        this.$emit('change', val)
        this.$emit('confirm', val)
      }
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

.xt-mobile-select__wrapper {}

.xt-mobile-select__mask {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.5);
}

.xt-mobile-select {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2001;
  background: #fff;
  border-radius: 16px 16px 0 0;
  padding-bottom: env(safe-area-inset-bottom, 12px);
  user-select: none;
  max-height: 70vh;
  display: flex;
  flex-direction: column;
}

.xt-mobile-select__toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 50px;
  padding: 0 16px;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.xt-mobile-select__btn {
  border: none;
  background: none;
  font-size: 15px;
  padding: 8px 4px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;

  &--cancel { color: #999; }
  &--confirm { color: var(--xt-color-primary, #409eff); font-weight: 600; }
}

.xt-mobile-select__title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
}

/* ===== 滚轮模式 ===== */
.xt-mobile-select__body {
  position: relative;
  height: $picker-height;
  overflow: hidden;
}

.xt-mobile-select__highlight {
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

.xt-mobile-select__body::before,
.xt-mobile-select__body::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: $item-height * 2;
  pointer-events: none;
  z-index: 2;
}

.xt-mobile-select__body::before {
  top: 0;
  background: linear-gradient(to bottom, #fff 0%, rgba(255, 255, 255, 0) 100%);
}

.xt-mobile-select__body::after {
  bottom: 0;
  background: linear-gradient(to top, #fff 0%, rgba(255, 255, 255, 0) 100%);
}

.xt-mobile-select__scroll {
  display: flex;
  flex-direction: column;
}

.xt-mobile-select__item {
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
.xt-mobile-select__list {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  max-height: 50vh;
  padding: 4px 0;
}

.xt-mobile-select__list-item {
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

.xt-mobile-select__list-label {
  font-size: 16px;
  color: #333;
}

.xt-mobile-select__checkmark {
  display: flex;
  align-items: center;
  color: var(--xt-color-primary, #409eff);
}

/* ===== 动画 ===== */
.xt-msk-fade-enter-active,
.xt-msk-fade-leave-active {
  transition: opacity 0.3s;
}
.xt-msk-fade-enter,
.xt-msk-fade-leave-to {
  opacity: 0;
}

.xt-msk-slide-enter-active,
.xt-msk-slide-leave-active {
  transition: transform 0.35s cubic-bezier(0.23, 1, 0.32, 1);
}
.xt-msk-slide-enter,
.xt-msk-slide-leave-to {
  transform: translateY(100%);
}
</style>
