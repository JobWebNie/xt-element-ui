const path = require('path');

module.exports = {
  base: '/xt-element-ui/',

  title: 'XT-Element-UI',
  description: '基于 Vue 2.7 + ElementUI 的企业级组件库',
  // 使用 vuepress-theme-reco 主题
  theme: 'reco',

  plugins: [
    ['demo-container', {
      locales: [
        {
          lang: 'zh-CN',
          'demo-block': {
            'hide-text': '隐藏代码',
            'show-text': '显示代码',
            'copy-text': '复制代码',
            'copy-success': '复制成功'
          }
        }
      ]
    }],
    [
      require.resolve(path.resolve(__dirname, './plugins/vuepress-plugin-font-size-switch')),
      {}
    ]
  ],

  // 使用 chainWebpack 区分客户端和服务端配置
  chainWebpack(config, isServer) {
    config.resolve.alias.set(
      'xt-element-ui',
      require('path').resolve(__dirname, '../../src/index.js')
    );

    if (!isServer) {
      // 仅在客户端构建时注入 global polyfill（兼容 ECharts 等依赖）
      config.plugin('define-global').use(require('webpack').DefinePlugin, [{
        'global': 'window'
      }]);
    }
  },

  themeConfig: {
    mode: 'auto',
    modePicker: true,
    search: true,
    searchPlaceholder: '搜索组件 / 关键字...',
    searchMaxSuggestions: 10,

    // 代码块默认显示行号
    codeTheme: 'okaidia',

    // 顶部导航栏
    nav: [
      { text: '🏠 首页', link: '/' },
      {
        text: '🎨 Xt 组件',
        link: '/components/base/xt-button'
      },
      {
        text: '✨ Ex 组件',
        link: '/components/extend/ex-button'
      },
      {
        text: '📖 更多',
        items: [
          { text: '📋 更新日志', link: 'https://github.com/JobWebNie/xt-element-ui/blob/main/CHANGELOG.md' },
          { text: '🤝 贡献指南', link: 'https://github.com/JobWebNie/xt-element-ui/blob/main/CONTRIBUTING.md' },
          { text: '📦 npm 主页', link: 'https://www.npmjs.com/package/xt-element-ui' }
        ]
      },
      {
        text: '🔗 GitHub',
        link: 'https://github.com/JobWebNie/xt-element-ui'
      }
    ],

    sidebarDepth: 2,
    nextLinks: true,
    prevLinks: true,

    sidebar: [
      {
        title: '🎨 Xt 组件',
        collapsable: true,
        children: [
          {
            title: '基础组件',
            path: '/components/base/xt-button',
            children: [
              ['/components/base/xt-button', 'XtButton 按钮'],
              ['/components/base/xt-card', 'XtCard 卡片'],
              ['/components/base/xt-card-item', 'XtCardItem 卡片项'],
              ['/components/base/xt-flex-box', 'XtFlexBox 弹性布局'],
              ['/components/base/xt-grid-box', 'XtGridBox 网格布局'],
              ['/components/base/xt-text', 'XtText 文本'],
              ['/components/base/xt-time', 'XtTime 时间'],
              ['/components/base/xt-step-price', 'XtStepPrice 阶梯价格'],
              ['/components/base/xt-input', 'XtInput 输入框'],
              ['/components/base/xt-config-provider', 'XtConfigProvider 配置提供者'],
              ['/components/base/xt-map', 'XtMap 地图组件'],
              ['/components/base/xt-map-provider', 'XtMapProvider 地图提供者']
            ]
          },
          {
            title: '工具类',
            path: '/components/utils/size',
            children: [
              ['/components/utils/size', '字体大小'],
              ['/components/utils/theme', '主题颜色']
            ]
          }
        ]
      },
      {
        title: '✨ Ex 组件',
        collapsable: true,
        children: [
          {
            title: '扩展组件',
            path: '/components/extend/ex-button',
            children: [
              ['/components/extend/ex-button', 'ExButton 扩展按钮'],
              ['/components/extend/ex-select-tree', '下拉选择树组件'],
              ['/components/extend/ex-upload', '上传组件'],
              ['/components/extend/ex-date-picker', '日期选择器组件'],
              ['/components/extend/ex-page', '页面组件'],
              ['/components/extend/ex-icon', '图标组件']
            ]
          },
          {
            title: '卡片组件',
            path: '/components/extend/ex-card',
            children: [
              ['/components/extend/ex-card', 'ExCard 扩展卡片']
            ]
          },
          {
            title: '表格组件',
            path: '/components/extend/ex-table',
            children: [
              ['/components/extend/ex-table', 'ExTable 扩展表格']
            ]
          },
          {
            title: '图表组件',
            path: '/components/extend/ex-chart',
            children: [
              ['/components/extend/ex-chart', 'ExChart 图表容器'],
              ['/components/extend/ex-bar', 'ExBar 柱状图'],
              ['/components/extend/ex-line', 'ExLine 折线图'],
              ['/components/extend/ex-pie', 'ExPie 饼图'],
              ['/components/extend/ex-multi', 'ExMulti 组合图']
            ]
          }
        ]
      }
    ]
  }
};
