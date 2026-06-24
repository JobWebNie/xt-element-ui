<template>
  <div class="xt-progress" :class="[
    `xt-progress--${type}`,
    `xt-progress--${size}`
  ]">
    <div v-if="type === 'line'" class="xt-progress__bar">
      <div 
        class="xt-progress__bar-inner" 
        :style="{ width: `${percentage}%`, backgroundColor: color }"
      >
        <transition name="xt-progress-fade">
          <div v-if="showText" class="xt-progress__bar-text">{{ percentage }}%</div>
        </transition>
      </div>
    </div>
    
    <div v-else-if="type === 'circle'" class="xt-progress__circle">
      <svg :width="circleSize" :height="circleSize" class="xt-progress__circle-svg">
        <circle
          class="xt-progress__circle-bg"
          :cx="circleSize / 2"
          :cy="circleSize / 2"
          :r="circleRadius"
          fill="none"
          :stroke="bgColor"
          :stroke-width="strokeWidth"
        />
        <circle
          class="xt-progress__circle-bar"
          :cx="circleSize / 2"
          :cy="circleSize / 2"
          :r="circleRadius"
          fill="none"
          :stroke="color"
          :stroke-width="strokeWidth"
          :stroke-dasharray="circleLength"
          :stroke-dashoffset="circleOffset"
          stroke-linecap="round"
          transform="rotate(-90 ${circleSize / 2} ${circleSize / 2})"
        />
      </svg>
      <div v-if="showText" class="xt-progress__circle-text">
        <span class="xt-progress__circle-percent">{{ percentage }}%</span>
      </div>
    </div>
    
    <div v-if="showText && type === 'line'" class="xt-progress__text">{{ percentage }}%</div>
  </div>
</template>

<script>
export default {
  name: 'XtProgress',
  props: {
    percentage: {
      type: Number,
      default: 0,
      validator: (val) => val >= 0 && val <= 100
    },
    type: {
      type: String,
      default: 'line',
      validator: (val) => ['line', 'circle'].includes(val)
    },
    size: {
      type: String,
      default: 'medium',
      validator: (val) => ['small', 'medium', 'large'].includes(val)
    },
    color: {
      type: String,
      default: '#1890ff'
    },
    bgColor: {
      type: String,
      default: '#ebeef5'
    },
    showText: {
      type: Boolean,
      default: true
    },
    strokeWidth: {
      type: Number,
      default: 6
    },
    circleSize: {
      type: Number,
      default: 120
    }
  },
  computed: {
    circleRadius() {
      return (this.circleSize - this.strokeWidth) / 2
    },
    circleLength() {
      return 2 * Math.PI * this.circleRadius
    },
    circleOffset() {
      return this.circleLength * (1 - this.percentage / 100)
    }
  }
}
</script>
