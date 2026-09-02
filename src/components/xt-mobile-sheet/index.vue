<template>
  <div class="xt-mobile-sheet">
    <transition name="xt-sheet-fade">
      <div v-if="visible && modal" class="xt-mobile-sheet__mask" @click="onMaskClick" @touchmove.prevent />
    </transition>
    <transition name="xt-sheet-slide">
      <div v-if="visible" class="xt-mobile-sheet__panel" @touchmove.prevent>
        <slot />
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'XtMobileSheet',

  props: {
    visible: {
      type: Boolean,
      default: false
    },
    modal: {
      type: Boolean,
      default: true
    },
    closeOnClickModal: {
      type: Boolean,
      default: true
    }
  },

  methods: {
    onMaskClick() {
      if (this.closeOnClickModal) {
        this.$emit('close')
        this.$emit('update:visible', false)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.xt-mobile-sheet__mask {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.5);
}

.xt-mobile-sheet__panel {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2001;
  background: #fff;
  border-radius: 16px 16px 0 0;
  padding-bottom: env(safe-area-inset-bottom, 12px);
  user-select: none;
  -webkit-user-select: none;
  max-height: 70vh;
  display: flex;
  flex-direction: column;
}

/* ===== 动画 ===== */
.xt-sheet-fade-enter-active,
.xt-sheet-fade-leave-active {
  transition: opacity 0.3s;
}
.xt-sheet-fade-enter,
.xt-sheet-fade-leave-to {
  opacity: 0;
}

.xt-sheet-slide-enter-active,
.xt-sheet-slide-leave-active {
  transition: transform 0.35s cubic-bezier(0.23, 1, 0.32, 1);
}
.xt-sheet-slide-enter,
.xt-sheet-slide-leave-to {
  transform: translateY(100%);
}
</style>
