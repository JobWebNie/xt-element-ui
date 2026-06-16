<template>
  <ex-bar v-if="type=='bar'" v-bind="$attrs" :theme="myTheme" :size="mySize"></ex-bar>
  <ex-line v-else-if="type=='line'" v-bind="$attrs" :theme="myTheme" :size="mySize"></ex-line>
  <ex-pie v-else-if="type=='pie'" v-bind="$attrs" :theme="myTheme" :size="mySize"></ex-pie>
  <ex-multi v-else-if="type=='multi'" v-bind="$attrs" :theme="myTheme" :size="mySize"></ex-multi>
</template>
<script>
import ExBar from "./ExBar.vue"
import ExLine from "./ExLine.vue"
import ExPie from "./ExPie.vue"
import ExMulti from "./ExMulti.vue"

export default {
  name: "ExChart",
  components: {
    ExBar,
    ExLine,
    ExPie,
    ExMulti
  },
  props: {
    theme: {
      type: String,
      default: ""
    },
    size: {
      type: String,
      default: "medium",
      validator: (value) => {
        return ['small', 'medium', 'large'].includes(value)
      }
    },
    type: {
      type: String,
      required: true,
      default: "bar"
    }
  },
  data() {
    return {
      myTheme: this.theme,
      mySize: this.size,
      observer: null
    };
  },
  mounted() {
    // 初始化时检测父元素的 data-theme
    this.detectParentTheme();
    
    // 监听父元素的 data-theme 属性变化
    this.observeThemeChange();
  },
  beforeUnmount() {
    // 清理观察器
    if (this.observer) {
      this.observer.disconnect();
    }
  },
  watch: {
    theme(newVal) {
      this.myTheme = newVal;
    },
    size(newVal) {
      this.mySize = newVal;
    }
  },
  methods: {
    // 检测父元素的 data-theme 属性
    detectParentTheme() {
      if (this.theme) {
        // 如果用户显式传入了 theme prop，使用传入的值
        this.myTheme = this.theme;
        return;
      }
      
      // 查找最近的带有 data-theme 属性的父元素
      let parent = this.$el ? this.$el.parentElement : null;
      while (parent) {
        const parentTheme = parent.getAttribute('data-theme');
        if (parentTheme) {
          this.myTheme = parentTheme === 'dark' ? 'dark' : 'default';
          return;
        }
        parent = parent.parentElement;
      }
      
      // 如果没有找到，检查 document.body 或 document.documentElement
      const bodyTheme = document.body.getAttribute('data-theme');
      const htmlTheme = document.documentElement.getAttribute('data-theme');
      if (bodyTheme === 'dark' || htmlTheme === 'dark') {
        this.myTheme = 'dark';
      } else {
        this.myTheme = 'default';
      }
    },
    
    // 监听主题变化
    observeThemeChange() {
      if (!this.$el) return;
      
      // 创建 MutationObserver 监听父元素的属性变化
      this.observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
            const newTheme = mutation.target.getAttribute('data-theme');
            if (newTheme === 'dark') {
              this.myTheme = 'dark';
            } else if (newTheme === 'light') {
              this.myTheme = 'default';
            }
          }
        });
      });
      
      // 监听当前元素和所有父元素的属性变化
      let parent = this.$el.parentElement;
      while (parent) {
        this.observer.observe(parent, {
          attributes: true,
          attributeFilter: ['data-theme']
        });
        parent = parent.parentElement;
      }
      
      // 同时监听 body 和 html 的变化
      this.observer.observe(document.body, {
        attributes: true,
        attributeFilter: ['data-theme']
      });
      this.observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['data-theme']
      });
    }
  }
};
</script>