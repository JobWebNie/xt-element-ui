<script>
export default {
  name: 'XtTableCell',
  functional: true,
  props: {
    row: Object,
    index: Number,
    render: Function,
    column: { type: Object, default: null }
  },
  render: (h, ctx) => {
    const params = {
      row: ctx.props.row,
      index: ctx.props.index
    }
    if (ctx.props.column) params.column = ctx.props.column
    const isVnode = (it) => it !== null && it !== undefined && typeof it === 'object' && it.hasOwnProperty('componentOptions')
    const renderNode = ctx.props.render(h, params)
    if (renderNode === null || renderNode === undefined || renderNode === '') return h('span', '')
    return isVnode(renderNode) ? renderNode : h('span', String(renderNode))
  }
}
</script>