import Vue from 'vue'

// 为浏览器环境添加 global 对象 polyfill（解决 ECharts 依赖问题）
if (typeof window !== 'undefined' && typeof global === 'undefined') {
  window.global = window
}

// 导入 ElementUI（用于二次封装组件）
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import XtElementUI, { createVirtualScrollData, setTheme } from '../../src/index'
// 导入项目全局样式
// import '../../src/styles/css-variables.scss'
import '../../src/styles/variables.scss'
import '../../src/components/index.scss'





export default ({ Vue, options, router, siteData }) => {
  // 注册 ElementUI（为二次封装组件提供基础组件）
  Vue.use(ElementUI)
  
  // 使用 xt-element-ui 模块包注册所有组件
  Vue.use(XtElementUI)
  Vue.prototype.createVirtualScrollData = createVirtualScrollData

  // 手动注册 DemoBlock 组件（修复 demo-container 插件注册问题）
  const DemoBlock = require('../../node_modules/vuepress-plugin-demo-container/src/DemoBlock.vue').default
  Vue.component('DemoBlock', DemoBlock)
  Vue.component('demo-block', DemoBlock)

  // SSR 兼容：仅在浏览器环境中执行 DOM 操作
  if (typeof window === 'undefined') return

  const htmlEl = document.documentElement;
  // 页面初始化先获取一次当前主题
  const initMode = htmlEl.classList.contains('dark') ? 'dark' : 'white';
  console.log('页面初始主题：', initMode);

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((item) => {
      if (item.attributeName === 'class') {
        const isDark = htmlEl.classList.contains('dark');
        const mode = isDark ? 'dark' : 'white';
        console.log('主题切换成功，当前模式：', mode);
        // 自定义逻辑
        setTheme(mode)
      }
    });
  });

  observer.observe(htmlEl, {
    attributes: true,
    attributeFilter: ['class']
  });

  window.addEventListener('beforeunload', () => {
    observer.disconnect();
  });
}