module.exports = {
  plugins: [
    [
      'component',
      {
        libraryName: 'xt-element-ui',
        libraryDirectory: 'lib',
        // 开启驼峰转连字符：XtButton → xt-button
        camel2Dash: true,
        // 自动引入组件样式
        style: true
      }
    ]
  ]
}
