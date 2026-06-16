/**
 * XT-UI 组件注册配置文件
 * 用于统一管理 Element UI 组件的自动注册配置
 */

// 已存在的 Ex 组件列表（不需要从 Element UI 自动注册）
export const existingExComponents = [
  'Button',       // ExButton 已存在
  'Card',         // ExCard 已存在
  'Input',        // XtInput 已存在（用户要求不自动注册）
  'Table',        // ExTable 已存在（在 ex-table 目录中）
  'TableColumn',  // ExColumn 已存在（在 ex-table 目录中）
  'Chart'         // ExChart 已存在
]

// Element UI 组件列表（用于自动注册为 Ex 开头，但排除已存在的组件）
export const elementComponentNames = [
  'Autocomplete',
  'Avatar',
  'Backtop',
  'Badge',
  'Breadcrumb',
  'BreadcrumbItem',
  'ButtonGroup',
  'Calendar',
  'Carousel',
  'CarouselItem',
  'Cascader',
  'Checkbox',
  'CheckboxButton',
  'CheckboxGroup',
  'Col',
  'Collapse',
  'CollapseItem',
  'ColorPicker',
  'Container',
  'DatePicker',
  'Dialog',
  'Divider',
  'Drawer',
  'Dropdown',
  'DropdownItem',
  'DropdownMenu',
  'Footer',
  'Form',
  'FormItem',
  'Header',
  'Icon',
  'Image',
  'InputNumber',
  'Link',
  'Main',
  'Menu',
  'MenuItem',
  'MenuItemGroup',
  'Option',
  'OptionGroup',
  'Pagination',
  'Popconfirm',
  'Popover',
  'Progress',
  'Radio',
  'RadioButton',
  'RadioGroup',
  'Rate',
  'Row',
  'Scrollbar',
  'Select',
  'Slider',
  'Step',
  'Steps',
  'Submenu',
  'Switch',
  'TabPane',
  'Tabs',
  'Tag',
  'TimePicker',
  'TimeSelect',
  'Timeline',
  'TimelineItem',
  'Tooltip',
  'Transfer',
  'Tree',
  'Upload'
]

// Element UI 指令列表
export const elementDirectives = [
  'Loading',
  'Popover',
  'Tooltip'
]

// 注册 Element UI 组件为 Ex 开头的工具函数
export function registerElementExComponents(Vue, ElementUI) {
  if (!ElementUI) {
    console.warn('[XT-UI] ElementUI not found, skipping Ex- prefix registration')
    return
  }

  elementComponentNames.forEach(componentName => {
    // 如果组件已存在于排除列表中，则跳过
    if (existingExComponents.includes(componentName)) {
      console.log(`[XT-UI] ${componentName} already exists, skipping registration`)
      return
    }
    
    const exComponentName = `Ex${componentName}`
    
    // 检查是否已经注册过该组件
    if (Vue.options.components[exComponentName]) {
      return
    }
    
    // 注册 Element 的组件为 Ex 开头
    const elementComponent = ElementUI[componentName]
    if (elementComponent) {
      Vue.component(exComponentName, elementComponent)
      console.log(`[XT-UI] Registered Element component as ${exComponentName}`)
    }
  })
}

// 注册 Element UI 指令的工具函数
export function registerElementDirectives(Vue, ElementUI) {
  if (!ElementUI) {
    return
  }

  elementDirectives.forEach(directiveName => {
    const directive = ElementUI[directiveName]
    if (directive && directive.install) {
      Vue.use(directive)
    }
  })
}