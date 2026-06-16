<template>
  <div class="el-select select-tree">
    <el-popover ref="elPopover" v-model="visible" transition="el-zoom-in-top" popper-class="select-tree__popover" trigger="click" :disabled="disabled" :placement="placement" :width="popoverWidth" @after-enter="handleScroll" @show="handleFocus" @hide="handleBlur">
      <el-scrollbar ref="scrollbar" wrap-class="el-select-dropdown__wrap" view-class="el-select-dropdown__list">
        <el-tree
          ref="elTree"
          class="select-tree__list"
          :default-expand-keys="defaultExpandKeys"
          :show-checkbox="multiple"
          :expand-on-click-node="multiple"
          :style="{minWidth: minWidth + 'px'}"
          :data="data"
          :props="props"
          :node-key="propsValue"
          :default-expand-all="defaultExpandAll"
          :check-strictly="checkStrictly"
          :lazy="lazy"
          :load="load"
          :icon-class="iconClass"
          :highlight-current="highlightCurrent"
          :indent="indent"
          :accordion="accordion"
          :filter-node-method="filterNodeMethod"
          :auto-expand-parent="autoExpandParent"
          :render-content="renderContent"
          :render-after-expand="renderAfterExpand"
          @check-change="checkChange"
          @node-click="nodeClick"
          @transitionend.native="$refs.elPopover.updatePopper()"
        >
          <div slot-scope="{data}" class="select-tree__item" :class="treeItemClass(data)">
            {{ data[propsLabel] }}
          </div>
        </el-tree>
      </el-scrollbar>
      <el-input
        ref="reference"
        slot="reference"
        v-model="selectedLabel"
        :clearable="clearable"
        :readonly="!filterable"
        :validate-event="false"
        :size="size"
        :class="{'is-active': visible, 'is-selected': selectedLabel}"
        :disabled="disabled"
        :placeholder="query || placeholder"
        @input="getTreeFilter"
        @clear="clear"
      >
        <i slot="suffix" class="el-input__icon el-input__icon-arrow-down el-icon-arrow-down"></i>
      </el-input>
    </el-popover>
  </div>
</template>
<script>
import Emitter from "element-ui/lib/mixins/emitter";
import { addResizeListener, removeResizeListener } from "element-ui/lib/utils/resize-event";
export default {
  name: "ExSelectTree",
  mixins: [Emitter],
  inheritAttrs: false,
  model: {
    prop: "value",
    event: "change"
  },
  props: {
    data: {
      type: Array,
      default() {
        return [];
      }
    },
    props: {
      type: Object,
      default: () => {
        return {
          value: "value",
          label: "label",
          children: "children",
          disabled: "disabled",
          isLeaf: "isLeaf"
        };
      }
    },
    checkStrictly: Boolean,
    nodeKey: String,
    defaultExpandAll: Boolean,
    lazy: Boolean,
    load: Function,
    iconClass: String,
    indent: Number,
    accordion: Boolean,
    filterNodeMethod: {
      type: Function,
      default(v, data, node) {
        if (!v) return true;
        return node.label.indexOf(v) !== -1;
      }
    },
    autoExpandParent: {
      type: Boolean,
      default: true
    },
    renderContent: Function,
    renderAfterExpand: Boolean,
    clearable: Boolean,
    placeholder: {
      type: String,
      default: "请选择"
    },
    placement: {
      type: String,
      default: "bottom-start"
    },
    size: {
      type: String,
      default: ""
    },
    disabled: Boolean,
    highlightCurrent: {
      default: true,
      type: Boolean
    },
    filterable: {
      type: Boolean,
      default: true
    },
    multiple: Boolean,
    value: {
      type: [Number, String, Array],
      default: ""
    },
    defaultValue: {
      type: [Number, String, Array],
      default: ""
    },
    nodeAbleClick: {
      type: Function,
      default() {
        return (node, data) => true;
      }
    },
    popoverWidth: Number,
    checkLeafOnly: {
      default: false,
      type: Boolean
    },
    includeHalfChecked: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      timer: null,
      selectedLabel: "",
      minWidth: 0,
      visible: false,
      query: ""
    };
  },
  computed: {
    triggerEventImmediate() {
      return this.defaultValue == this.value;
    },
    propsValue() {
      return this.nodeKey || this.props.value || "value";
    },
    propsLabel() {
      return this.props.label || "label";
    },
    propsIsLeaf() {
      return this.props.isLeaf || "isLeaf";
    },
    defaultExpandKeys() {
      return Array.isArray(this.value) ? this.value : (this.value || this.value === 0) ? [this.value] : [];
    }
  },
  watch: {
    value: {
      handler() {
        this.setSelected(this.triggerEventImmediate);
        this.dispatch("ElFormItem", "el.form.change");
      }
    },
    data() {
      this.setSelected();
    }
  },
  created() {
    if (this.multiple && !Array.isArray(this.value)) {
      throw new Error("[select-tree] props value must be array if use multiple");
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setSelected();
    });
    addResizeListener(this.$el, this.handleResize);
  },
  beforeDestroy() {
    if (this.$el && this.handleResize) {
      removeResizeListener(this.$el, this.handleResize);
    }
  },
  methods: {
    getTreeFilter(v) {
      this.$refs.elTree && this.$refs.elTree.filter(v);
    },
    handleFocus() {
      if (this.filterable) {
        this.$refs.elTree.filter("");
        this.query = this.selectedLabel;
        this.selectedLabel = "";
      }
    },
    handleBlur() {
      if (this.filterable) {
        this.selectedLabel = this.query;
        this.$refs.reference.blur();
      }
    },
    valueChange(value, node) {
      this.$emit("change", value, node);
    },
    clear() {
      this.visible = false;
      if (this.multiple) {
        this.valueChange([]);
        this.$nextTick(() => {
          this.$refs.elTree.setCheckedKeys([]);
        });
      } else {
        this.valueChange("");
      }
      this.$emit("clear");
    },
    handleScroll() {
      this.$refs.scrollbar && this.$refs.scrollbar.handleScroll();
    },
    nodeClick(data, node, component) {
      // const children = data[this.props.children];
      const value = data[this.propsValue];
      if (this.nodeAbleClick(data, node)) {
        this.valueChange(value, data);
        this.selectedLabel = data[this.propsLabel];
        if (!this.multiple && !data.disabled) {
          this.visible = false;
        }
      }
      // if (((children && children.length) || (this.lazy && !data[this.propsIsLeaf])) && !this.checkStrictly) {
      //   component.handleExpandIconClick();
      // } else if (!this.multiple && !data.disabled) {
      //   this.valueChange(value, data);
      //   this.selectedLabel = data[this.propsLabel];
      //   this.visible = false;
      // }
    },
    checkChange(data, checked, inderterminate) {
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        const elTree = this.$refs.elTree;
        const leafOnly = this.checkLeafOnly;
        const includeHalfChecked = this.includeHalfChecked;
        const nodes = elTree.getCheckedNodes(leafOnly, includeHalfChecked);
        const keys = elTree.getCheckedKeys(leafOnly);
        this.valueChange(keys, nodes);
        this.setMultipleSelectedLabel();
      }, 50);
    },
    setSelected(triggerEvent) {
      this.$nextTick(() => {
        const elTree = this.$refs.elTree;
        if (this.multiple) {
          elTree.setCheckedKeys(this.value);
          this.setMultipleSelectedLabel();
          triggerEvent && this.checkChange();
        } else {
          if (this.value) {
            const selectedNode = elTree.getNode(this.value);
            elTree.setCurrentKey(this.value);
            if (selectedNode && selectedNode.visible && !this.lazy) {
              if (!selectedNode.isLeaf) {
                selectedNode.expand();
              } else {
                selectedNode.parent.expand();
              }
            }
            this.selectedLabel = selectedNode ? selectedNode.data[this.propsLabel] : "";
            triggerEvent && this.valueChange(this.value, selectedNode);
          } else {
            elTree.setCurrentKey("");
            this.selectedLabel = "";
            triggerEvent && this.valueChange("");
          }
        }
      });
    },
    setMultipleSelectedLabel() {
      const elTree = this.$refs.elTree;
      const selectedNodes = elTree.getCheckedNodes(!this.checkStrictly);
      this.selectedLabel = selectedNodes.map((item) => item[this.propsLabel]).join(",");
    },
    treeItemClass(data) {
      return {
        "is-selected": this.multiple ? false : data[this.propsValue] === this.value, "is-disabled": data.disabled
      };
    },
    handleResize() {
      this.minWidth = this.$el.clientWidth - 2;
    },
    getNodeById(id) {
      return this.$refs.elTree.getNode(id);
    }
  }
};
</script>
<style scoped lang="scss">
.select-tree{
  display: inline-block;
  .el-input__icon{
    cursor: pointer;
    transition: transform 0.3s;
    &-close{
      display: none;
    }
  }
  .el-input__inner{
    cursor: pointer;
    padding-right: 30px;
  }
  .el-input{
    &:hover:not(.is-disabled) {
      .el-input__inner{
        @include border_color("borderColor");
      }
      &.is-selected.isclearable{
        .el-input__icon{
          &.close{
            display: inline-block;
          }
          &.arrow-down{
            display: none;
          }
        }
      }
    }
    &.is-active{
      .el-input__icon-arrow-down{
        transition: rotate(-180deg);
      }
      .el-input__inner{
        @include border_color("$subMenuActiveText");
      }
    }
  }
}
</style>
<style lang="scss">
.select-tree{
  display: inline-block;
  &__popover{
    padding: 0 !important;
    .popper__arrow{
      left: 35px !important;
    }
    .el-tree-node__expand-icon.is-leaf{
      cursor: pointer;
    }
  }
  &__list{
    &::-webkit-scrollbar{
      width: 4px;
    }
  }
}
.el-tree-node__content{
  height: 34px;
  line-height: 34px;
}
.el-tree--highlight-current .el-tree-node.is-current > .el-tree-node__content{
  color: #409EFF;
  @include font_color("primaryColor");
  font-weight: bold;
}
</style>
