// ==================== 工具函数聚合入口 ====================
// 保持对外 API 不变：默认导出合并对象，同时 re-export 所有命名导出
// 具体实现拆分至各职责模块，便于维护与按需引入

export * from './config'
export * from './format-number'
export * from './format-date'
export * from './format-money'

import * as config from './config'
import * as formatNumber from './format-number'
import * as formatDate from './format-date'
import * as formatMoney from './format-money'

export default Object.assign({}, config, formatNumber, formatDate, formatMoney)