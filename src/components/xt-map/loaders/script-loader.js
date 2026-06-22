/**
 * 动态脚本加载器
 * 负责动态注入地图 SDK <script> 标签，并返回 Promise
 * 同一 URL 只会加载一次，缓存已加载的结果
 */

const loadedScripts = new Map()      // URL -> Promise
const loadingScripts = new Map()     // URL -> Promise (正在加载中)

/**
 * 动态加载单个脚本
 * @param {string} url - 脚本 URL
 * @param {object} options - 配置
 * @param {string} options.charset - 字符集，默认 'utf-8'
 * @param {boolean} options.async - 是否异步，默认 true
 * @param {number} options.timeout - 超时时间(ms)，默认 30000
 * @returns {Promise<HTMLScriptElement>}
 */
export const loadScript = (url, options = {}) => {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('[XtMap] 非浏览器环境'))
  }

  const { charset = 'utf-8', async = true, timeout = 30000 } = options

  if (loadedScripts.has(url)) {
    return loadedScripts.get(url)
  }

  if (loadingScripts.has(url)) {
    return loadingScripts.get(url)
  }

  const promise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.type = 'text/javascript'
    script.src = url
    script.charset = charset
    script.async = async

    let timer = null
    let done = false

    const cleanup = () => {
      done = true
      if (timer) clearTimeout(timer)
      script.onload = null
      script.onerror = null
    }

    script.onload = () => {
      if (done) return
      cleanup()
      loadingScripts.delete(url)
      loadedScripts.set(url, Promise.resolve(script))
      resolve(script)
    }

    script.onerror = (err) => {
      if (done) return
      cleanup()
      loadingScripts.delete(url)
      reject(new Error(`[XtMap] 脚本加载失败: ${url}`))
    }

    if (timeout > 0) {
      timer = setTimeout(() => {
        if (done) return
        cleanup()
        loadingScripts.delete(url)
        reject(new Error(`[XtMap] 脚本加载超时: ${url}`))
      }, timeout)
    }

    document.head.appendChild(script)
  })

  loadingScripts.set(url, promise)
  return promise
}

/**
 * 批量加载脚本（按顺序）
 * @param {string[]} urls
 * @param {object} options
 */
export const loadScripts = async (urls, options = {}) => {
  for (const url of urls) {
    await loadScript(url, options)
  }
}

/**
 * 清除加载缓存（切换密钥等场景使用）
 */
export const clearScriptCache = () => {
  loadedScripts.clear()
  loadingScripts.clear()
}

/**
 * 检查全局对象是否存在
 */
export const hasGlobal = (name) => {
  if (typeof window === 'undefined') return false
  return window[name] !== undefined
}

export default {
  loadScript,
  loadScripts,
  clearScriptCache,
  hasGlobal
}
