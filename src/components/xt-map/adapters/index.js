/**
 * 地图适配器索引
 * 根据 provider 字符串返回对应的适配器构造函数
 */

import { AMapAdapter } from './amap'
import { TiandituAdapter } from './tianditu'
import { BaiduAdapter } from './baidu'

export const adapters = {
  amap: AMapAdapter,
  tianditu: TiandituAdapter,
  baidu: BaiduAdapter
}

export const getAdapterClass = (provider) => {
  return adapters[provider] || AMapAdapter
}

export { AMapAdapter, TiandituAdapter, BaiduAdapter }
export { MapAdapterBase } from './base'

export default {
  adapters,
  getAdapterClass,
  AMapAdapter,
  TiandituAdapter,
  BaiduAdapter
}
