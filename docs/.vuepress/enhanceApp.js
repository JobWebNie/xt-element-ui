import Vue from 'vue'

// 为浏览器环境添加 global 对象 polyfill（解决 ECharts 依赖问题）
if (typeof global === 'undefined') {
  window.global = window
}

// 导入 ElementUI（用于二次封装组件）
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 导入 xt-element-ui 模块包（包含所有 Xt 和 Ex 组件）
import XtElementUI, { createVirtualScrollData, setTheme } from '../../src/index'
// 导入项目全局样式
// import '../../src/styles/css-variables.scss'
import '../../src/styles/variables.scss'
import '../../src/components/index.scss'


// 导入覆盖主题样式的 CSS
import './styles/override.css'

// 导入统一的 Element UI 组件注册配置
import { registerElementExComponents, registerElementDirectives } from '../../src/config/element-registry'



export default ({ Vue, options, router, siteData }) => {
  // 注册 ElementUI（为二次封装组件提供基础组件）
  Vue.use(ElementUI)
  
  // 使用 xt-element-ui 模块包注册所有组件
  Vue.use(XtElementUI)
  Vue.prototype.createVirtualScrollData = createVirtualScrollData

  
  // 调用统一的注册函数注册 Ex 开头的组件
  registerElementExComponents(Vue, ElementUI)
  
  // 调用统一的注册函数注册指令
  registerElementDirectives(Vue, ElementUI)


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