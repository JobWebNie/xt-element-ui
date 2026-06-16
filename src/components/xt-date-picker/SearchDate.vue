<template>
  <el-form-item label="日期类型">
    <el-select v-model="params.SearchCondition" style="width:120px;">
      <el-option label="建档日期" value="建档日期"></el-option>
      <el-option label="更新日期" value="更新日期"></el-option>
    </el-select>
    <el-select v-model="params.SearchType" style="width:120px;">
      <el-option v-for="item in searchList" :key="item.value" :label="item.name" :value="item.value"></el-option>
    </el-select>
    <el-date-picker v-model="params.SearchValue" :style="'width:'+txtInputWidth+'px;'" value-format="yyyy-MM-dd" placeholder=""></el-date-picker>
  </el-form-item>
</template>
<script>
export default {
  name: "SearchDate",
  props: {
    searchList: {
      type: Array,
      default() {
        return [];
      }
    },
    params: {
      type: Object,
      default() {
        return {
          SearchType: "",
          SearchCondition: "建档日期",
          SearchValue: ""
        };
      }
    },
    /** 查询文本输入框宽度 */
    txtInputWidth: {
      type: Number,
      default: 130
    }
  },
  created() {
    if (this.searchList.length > 0 && !this.params.SearchType) {
      this.params.SearchType = this.searchList[0].value;
    }
  }
};
</script>
