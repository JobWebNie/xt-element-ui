const path = require('path');

module.exports = {
  base: '/xt-element-ui/',

  title: 'XT-Element-UI',
  description: '基于 Vue 2.7 + ElementUI 的企业级组件库',
  // 使用 vuepress-theme-reco 主题
  theme: 'reco',
  head: [
  ],
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

    // 修复 Node 18+ hashFunction 兼容性问题
    // Node 17+ 移除了 md4，而 webpack 4 默认使用 md4
    config.output.set('hashFunction', 'sha256');

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
      {
        text: '🏠 组件',
        link: '/'
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
        title: '🚀 快速上手', path: '/'
      },
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
          ['/components/base/xt-input', 'XtInput 输入框'],
          ['/components/base/xt-config-provider', 'XtConfigProvider 配置提供者'],
          ['/components/base/xt-map', 'XtMap 地图组件'],
          ['/components/base/xt-map-provider', 'XtMapProvider 地图提供者'],
          ['/components/base/xt-step-price', 'XtStepPrice 阶梯价格']
        ]
      },
      {
        title: '扩展组件',
        path: '/components/base/xt-date-picker',
        children: [
          ['/components/base/xt-date-picker', 'XtDatePicker 日期选择器'],
          ['/components/base/xt-icon', 'XtIcon 图标'],
          ['/components/base/xt-table', 'XtTable 扩展表格'],
          ['/components/base/xt-list', 'XtList 卡片列表'],
          ['/components/base/xt-select-tree', 'XtSelectTree 下拉选择树'],
          ['/components/base/xt-transfer-tree', 'XtTransferTree 树形穿梭框'],
          ['/components/base/xt-upload', 'XtUpload 上传组件'],
          ['/components/base/xt-page', 'XtPage 页面组件'],
          ['/components/base/xt-progress', 'XtProgress 进度条'],
          ['/components/base/xt-tabs', 'XtTabs 标签页'],
          ['/components/base/xt-badge', 'XtBadge 徽标'],
          ['/components/base/xt-scroll-arrow', 'XtScrollArrow 滚动箭头'],
          ['/components/base/xt-form-schema', 'XtFormSchema 配置化表单']
        ]
      },
      {
        title: '图表组件',
        path: '/components/base/xt-chart',
        children: [
          ['/components/base/xt-chart', 'XtChart 图表容器'],
          ['/components/base/xt-bar', 'XtBar 柱状图'],
          ['/components/base/xt-line', 'XtLine 折线图'],
          ['/components/base/xt-pie', 'XtPie 饼图'],
          ['/components/base/xt-multi', 'XtMulti 组合图']
        ]
      },
      {
        title: '工具类',
        path: '/components/utils/size',
        children: [
          ['/components/utils/size', '字体大小'],
          ['/components/utils/theme', '主题颜色'],
          ['/components/utils/config', '全局配置'],
          ['/components/utils/format', '格式化工具']
        ]
      }
    ]
  }
};
