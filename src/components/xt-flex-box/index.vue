<template>
  <div class="xt-flex-box" :class="classAttrs" :style="flexStyle">
    <slot></slot>
  </div>
</template>

<script>
// 运行时检测 flex gap 支持
// @supports 无法区分 grid gap 与 flex gap（Safari <14.1 支持 grid gap 但不支持 flex gap），需 DOM 检测
let _flexGapSupported
function supportsFlexGap() {
  if (_flexGapSupported !== undefined) return _flexGapSupported
  if (typeof window === 'undefined') return (_flexGapSupported = false)
  const flex = document.createElement('div')
  flex.style.display = 'flex'
  flex.style.flexDirection = 'column'
//   flex.style.gap = '10px'
  flex.style.position = 'absolute'
  flex.style.visibility = 'hidden'
  const a = document.createElement('div')
  a.style.height = '10px'
  const b = document.createElement('div')
  b.style.height = '10px'
  flex.appendChild(a)
  flex.appendChild(b)
  document.body.appendChild(flex)
  _flexGapSupported = flex.scrollHeight === 30
  document.body.removeChild(flex)
  console.log("是否支持：", _flexGapSupported)
  return _flexGapSupported
}

export default {
    name: "XtFlexBox",
    props: {
        type: { type: String, default: "flex" },
        align: { type: String, default: "center" },
        content: { type: String, default: "start" },
        direction: { type: String, default: "row" },
        wrap: { type: String, default: "unset" },
        gap: { type: String, default: "" }
    },
    computed: {
        classAttrs(){
            const { type, align, wrap, direction, content, gap } = this;
            const arr = [`${type}`, `align-${align}`, `content-${content}`, `direction-${direction}`, `wrap-${wrap}`]
            if (gap && !supportsFlexGap()) {
                arr.push('no-flex-gap')
            }
            return arr
        },
        flexStyle() {
            const result = {}
            if (this.gap) {
                result['--xt-flex-gap'] = this.gap
                // result.gap = this.gap
            }
            return result
        }
    }
}
</script>