export default ({ Vue }) => {
  // SSR 兼容：仅在浏览器环境中执行
  if (typeof window === 'undefined') return

  const defaultOptions = {
    defaultSize: 'medium',
    sizes: ['small', 'medium', 'large'],
    sizeLabels: {
      small: '小号',
      medium: '中号',
      large: '大号'
    }
  }

  let opts = defaultOptions
  try {
    if (typeof FONT_SIZE_OPTIONS !== 'undefined' && FONT_SIZE_OPTIONS) {
      opts = JSON.parse(FONT_SIZE_OPTIONS)
    }
  } catch (e) {
    console.warn('[FontSizeSwitch] 解析配置失败，使用默认配置:', e)
    opts = defaultOptions
  }

  let currentSize = opts.defaultSize
  let isOpen = false

  function getSize() {
    const saved = localStorage.getItem('xt-font-size')
    if (saved && opts.sizes && opts.sizes.includes(saved)) {
      return saved
    }
    const htmlSize = document.documentElement.getAttribute('data-size')
    if (htmlSize && opts.sizes && opts.sizes.includes(htmlSize)) {
      return htmlSize
    }
    return opts.defaultSize
  }

  function setSize(size) {
    if (!opts || !opts.sizes || !opts.sizes.includes(size)) {
      console.warn('[FontSizeSwitch] 无效的字体大小:', size)
      return
    }

    localStorage.setItem('xt-font-size', size)
    document.documentElement.setAttribute('data-size', size)

    const sizeMap = {
      small: '12px',
      medium: '14px',
      large: '16px'
    }
    document.documentElement.style.setProperty('--xt-font-size-base', sizeMap[size] || sizeMap.medium)

    window.dispatchEvent(new CustomEvent('xt-font-size-change', { detail: size }))
  }

  function createFontSizeSwitch() {
    const container = document.createElement('div')
    container.className = 'xt-font-size-switch'

    const labels = opts.sizeLabels || { small: '小号', medium: '中号', large: '大号' }

    const trigger = document.createElement('button')
    trigger.className = 'font-size-trigger'
    trigger.innerHTML = `
      <svg class="font-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M5 4h14l1 12H4L5 4z"/>
        <polyline points="12 6 12 12 15 15"/>
      </svg>
      <span class="font-size-current">${labels[currentSize] || '中号'}</span>
      <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    `

    const dropdown = document.createElement('div')
    dropdown.className = 'font-size-dropdown'
    dropdown.style.display = 'none'

    const title = document.createElement('h4')
    title.className = 'font-size-dropdown-title'
    title.textContent = 'Choose font size'

    const radioGroup = document.createElement('div')
    radioGroup.className = 'font-size-radio-group'

    dropdown.appendChild(title)

    const sizes = opts.sizes || ['small', 'medium', 'large']
    sizes.forEach(size => {
      const button = document.createElement('button')
      button.className = `radio-btn ${currentSize === size ? 'is-active' : ''}`
      button.setAttribute('data-size', size)
      button.textContent = labels[size] || size
      button.addEventListener('click', (e) => {
        e.stopPropagation()
        selectSize(size)
      })
      radioGroup.appendChild(button)
    })

    dropdown.appendChild(radioGroup)
    container.appendChild(trigger)
    container.appendChild(dropdown)

    trigger.addEventListener('click', (e) => {
      e.stopPropagation()
      toggleDropdown()
    })

    return container
  }

  function toggleDropdown() {
    const container = document.querySelector('.xt-font-size-switch')
    if (!container) return

    const dropdown = container.querySelector('.font-size-dropdown')
    const arrow = container.querySelector('.arrow-icon')

    isOpen = !isOpen
    dropdown.style.display = isOpen ? 'block' : 'none'
    arrow.classList.toggle('open', isOpen)
  }

  function selectSize(size) {
    setSize(size)
    currentSize = size

    const container = document.querySelector('.xt-font-size-switch')
    if (!container) return

    const currentSpan = container.querySelector('.font-size-current')
    const labels = opts.sizeLabels || { small: '小号', medium: '中号', large: '大号' }
    currentSpan.textContent = labels[size] || size

    container.querySelectorAll('.radio-btn').forEach(btn => {
      btn.classList.remove('is-active')
      if (btn.getAttribute('data-size') === size) {
        btn.classList.add('is-active')
      }
    })

    toggleDropdown()
  }

  function injectIntoNavbar() {
    if (document.querySelector('.xt-font-size-switch')) {
      return
    }

    const navbar = document.querySelector('.reco-navbar') || 
                  document.querySelector('nav.navbar') ||
                  document.querySelector('.navbar')

    if (!navbar) {
      return
    }

    let navbarRight = navbar.querySelector('.links')

    if (!navbarRight) {
      navbarRight = document.createElement('div')
      navbarRight.className = 'navbar-right'
      navbarRight.style.cssText = 'display: flex; align-items: center; margin-left: auto;'
      navbar.appendChild(navbarRight)
    }

    const fontSizeSwitch = createFontSizeSwitch()
    navbarRight.appendChild(fontSizeSwitch)
  }

  const style = document.createElement('style')
  style.textContent = `
    .xt-font-size-switch {
      position: relative;
      display: inline-flex;
      align-items: center;
      padding: 0 4px;
    }

    .font-size-trigger {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 10px;
      border: none;
      border-radius: 0.25rem;
      background: transparent;
      color: var(--text-color);
      font-size: 0.9rem;
      cursor: pointer;
      transition: all 0.2s ease;
      outline: none;
    }

    .font-size-trigger:hover {
      color: #3eaf7c;
    }

    .font-icon {
      width: 16px;
      height: 16px;
    }

    .font-size-current {
      min-width: 36px;
      text-align: center;
      font-weight: 500;
    }

    .arrow-icon {
      width: 14px;
      height: 14px;
      transition: transform 0.2s ease;
    }

    .arrow-icon.open {
      transform: rotate(180deg);
    }

    .font-size-dropdown {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      padding: 1em;
      background: var(--background-color);
      border-radius: 0.25rem;
      box-shadow: var(--box-shadow);
      min-width: 150px;
      z-index: 9999;
      border: 1px solid var(--border-color);
    }

    .font-size-dropdown::before {
      content: '';
      position: absolute;
      top: -6px;
      right: 16px;
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-bottom: 6px solid var(--border-color);
    }

    .font-size-dropdown::after {
      content: '';
      position: absolute;
      top: -5px;
      right: 17px;
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-bottom: 5px solid var(--background-color);
    }

    .font-size-dropdown-title {
      margin-top: 0;
      margin-bottom: 0.6rem;
      font-weight: bold;
      color: var(--text-color);
      font-size: 0.85rem;
    }

    .font-size-radio-group {
      display: flex;
      flex-wrap: wrap;
      margin: 0;
      padding: 0;
    }

    .radio-btn {
      flex: 1;
      text-align: center;
      font-size: 12px;
      color: var(--text-color);
      line-height: 18px;
      padding: 3px 6px;
      border-top: 1px solid #666;
      border-bottom: 1px solid #666;
      background-color: var(--background-color);
      cursor: pointer;
      border-radius: 0;
      border-left: none;
      border-right: none;
      outline: none;
      transition: all 0.2s ease;
    }

    .radio-btn:first-child {
      border-radius: 0.25rem 0 0 0.25rem;
      border-left: 1px solid #666;
    }

    .radio-btn:last-child {
      border-radius: 0 0.25rem 0.25rem 0;
      border-right: 1px solid #666;
    }

    .radio-btn:not(:first-child):not(:last-child) {
      border-right: 1px solid #666;
    }

    .radio-btn:hover {
      color: #3eaf7c;
      background: rgba(62, 175, 124, 0.08);
    }

    .radio-btn.is-active {
      color: #fff;
      background: #3eaf7c;
      border-color: #3eaf7c;
    }

    .radio-btn.is-active:hover {
      background: #369d6c;
    }
  `
  document.head.appendChild(style)

  currentSize = getSize()
  setSize(currentSize)

  document.addEventListener('click', () => {
    if (isOpen) {
      toggleDropdown()
    }
  })

  const tryInject = () => {
    injectIntoNavbar()
  }

  tryInject()

  const observer = new MutationObserver(() => {
    tryInject()
  })

  if (document.body) {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  }

  window.addEventListener('load', () => {
    setTimeout(tryInject, 300)
  })
}
