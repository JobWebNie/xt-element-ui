<template>
  <fieldset class="exFieldset" :class="[border ? 'is-border' : 'part',type ? `is-${type}`: '',effect?`effect-${effect}`:'' ]">
    <legend class="fix-top legend">
      <BaseFlexBox class="title" content="between">
        <slot name="legend">
          {{ legend }}
        </slot>
      </BaseFlexBox>
    </legend>
    <legend class="fix-top tool" v-if="$slots.tool">
      <BaseFlexBox content="end" gap="0 5">
        <slot name="tool"></slot>
      </BaseFlexBox>
    </legend>
    <div class="field" v-if="$slots.default">
      <slot />
    </div>
  </fieldset>
</template>
<script>
export default {
  name: "ExFieldset",
  props: {
    legend: {},
    type: {
      type: String,
      default: "info"
    },
    effect: {
      type: String,
      default: "" // plain  dark
    },
    border: {
      type: Boolean,
      default: false
    }
  }
};
</script>
<style scoped lang="scss">
.exFieldset {
  position: relative;
  margin: 0;
  padding: 0;
  min-inline-size: unset;
  border: transparent;
  &.part{
    padding: 20px 0 10px;
    >.legend{
      >.title{
        padding-left: 10px;
        font-weight: 700;
        border-left: 3px solid #409EFF;
      }
    }
    >.field{
      padding: 10px 10px 0px;
    }
  }
  &.is-border{
    >.field{
      margin-top: 15px;
      padding: 20px 10px 10px;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      border: 1px solid #dedcdc;
    }
    &.is{
      &-primary{
        border-color: #409EFF;
        .legend{
          color: #409EFF;
        }
        &.effect-plain{
          background-color: #fff;
          border-color: #409EFF;
          .legend{
            border: 1px solid #409EFF;
            background-color: #fff;
            color: #409EFF;
          }
        }
        &.effect-dark{
          .legend{
            color: #fff;
            background: #409EFF;
          }
        }
      }
      &-success{
        border-color: #67C23A;
        .legend{
          color: #67C23A;
          background-color: #fff;
        }
        &.effect-plain{
          background-color: #fff;
          border-color: #67C23A;
          .legend{
            border: 1px solid #67C23A;
            background-color: #fff;
            color: #67C23A;
          }
        }
        &.effect-dark{
          .legend{
            color: #fff;
            background: #67C23A;
          }
        }
      }
      &-info{
        border-color: #dcdfe6;
        .legend{
          color: #a9a9a9;
          background-color: #fff;
        }
        &.effect-plain{
          background-color: #fff;
          border-color: #dcdfe6;
          .legend{
            border: 1px solid #dcdfe6;
            background-color: #fff;
            color: #a9a9a9;
          }
        }
        &.effect-dark{
          .legend{
            color: #fff;
            background-color: #a9a9a9;
          }
        }
      }
      &-danger{
        border-color: #F56C6C;
        .legend{
          color: #F56C6C;
          background-color: #fff;
        }
        &.effect-plain{
          border-color: #F56C6C;
          background-color: #fff;
          .legend{
            border: 1px solid #F56C6C;
            background-color: #fff;
            color: #F56C6C;
          }
        }
        &.effect-dark{
          .legend{
            color: #fff;
            background: #F56C6C;
          }
        }
      }
      &-warning{
        border-color: #E6A23C;
        .legend{
          color: #E6A23C;
          background-color: #fff;
        }
        &.effect-plain{
          border-color: #E6A23C;
          background-color: #fff;
          .legend{
            background-color: #fff;
            border: 1px solid #E6A23C;
            color: #E6A23C;
          }
        }
        &.effect-dark{
          .legend{
            color: #fff;
            background: #E6A23C;
          }
        }
      }
    }
  }
  .fix-top{
    position: absolute;
    top: 0px;
    padding: 0;
    background-color: #fff;
    @include background_color("mainBg");
  }
  .tool{
    right: 10px;
  }
  .legend {
    line-height: 20px;
    left: 10px;
    @include addSize($font_size_16, $size_diff_2);
    padding: 5px 0;
    border-radius: 2px;
    background-color: inherit;
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(144,147,153,0.3);
    box-shadow: inset 0 0 5px rgba(144,147,153,0.3) !important;
    -webkit-box-shadow: inset 0 0 5px rgba(144,147,153,0.3) !important;
  }
}
</style>
