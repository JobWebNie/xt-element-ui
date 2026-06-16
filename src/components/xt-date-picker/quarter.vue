 
 
 <template>
  <el-popover v-model="popoverVisible" trigger="click" :disabled="disabled" transition="el-zoom-in-top" :placement="placement" :width="popoverWidth" @hide="handleBlur">
    <div class="quarter-wrapper">
      <BaseFlexBox content="between">
        <i class="el-icon-d-arrow-left" @click="prev"></i>
        <span>{{ selectYear }}</span>
        <i class="el-icon-d-arrow-right" @click="after"></i>
      </BaseFlexBox>
      <BaseFlexBox content="between" style="margin-top: 10px">
        <el-button v-for="item in quarterList" :key="item.value" :disabled="getDisable(item)" :type="currentyear==selectYear&&item.value == currentQuarter ?'primary':''" size="mini" round @click="setCurrent(item)">{{ item.label }}</el-button>
      </BaseFlexBox>
    </div>
    <el-input slot="reference" ref="reference" size="small" :value="quarterLabel" readonly :title="value" :placeholder="placeholder" prefix-icon="el-icon-date" clearable />
  </el-popover>
</template>

<script>
import BaseFlexBox from "../xt-flex-box/index.vue";
import dateFns from "date-fns";
export default {
  name: "DateQuarter",
  components: {
    BaseFlexBox
  },
  model: {
    props: "value",
    event: "change"
  },
  props: {
    value: {},
    quarterType: { // value绑定值类型 1.quarter为时返回当前时间 2.quarter-start时返回季的开始时间 3. quarter-end时返回季的结束时间
      type: String,
      default: "quarter"
    },
    placement: {
      type: String,
      default: "bottom-start"
    },
    // valueFormat: {
    //   type: String,
    //   default: "yyyy-Qq"
    // },
    format: { // 同时支持字符串 "yyyy-Qq" 使用小写q进行格式化数据
      type: String,
      default: "yy-Qq"
    },
    popoverWidth: Number,
    placeholder: {},
    pickerOptions: {
      type: Object,
      default: () => {
        return {
          disabledDate: () => {
            return false;
          }
        };
      }
    },
    disabled: {}
  },
  data() {
    const dateVal = this.getQuarterDate(this.value);
    const currentyear = dateVal ? dateVal.getFullYear() : "";
    const month = dateVal ? dateVal.getMonth() : "";
    const selectYear = dateVal ? dateVal.getFullYear() : new Date().getFullYear();
    return {
      dateVal: dateVal,
      currentyear: currentyear,
      currentQuarter: dateFns.getQuarter(dateVal),
      selectYear: selectYear,
      currentMonth: month,
      popoverVisible: false,
      quarterList: [
        { label: "Q1", value: 1 },
        { label: "Q2", value: 2 },
        { label: "Q3", value: 3 },
        { label: "Q4", value: 4 }
      ]
    };
  },
  computed: {
    diffQuarter() {
      return (this.selectYear - this.currentyear) * 4 - this.currentQuarter;
    },
    quarterLabel: {
      get() {
        if (!this.currentyear || !this.currentQuarter) {
          return "";
        }
        return this.getFormatVal();
      }
    }
  },
  methods: {
    getQuarterDate(val) {
      if (!val) return null;
      if (this.quarterType == "quarter-start") {
        return dateFns.startOfQuarter(val);
      } else if (this.quarterType == "quarter-end") {
        return dateFns.endOfQuarter(val);
      } else {
        const currentQuarter = dateFns.getQuarter(val);
        return dateFns.setQuarter(this.value, currentQuarter);
      }
    },
    getDisable(it) {
    },
    handleChangeVal(v) {
    },
    getFormatVal() {
      if (!this.format) {
        return `${this.currentyear}-Q${this.currentQuarter}`;
      }
      const formatMap = {
        y: this.currentyear,
        q: this.currentQuarter
      };
      const val = this.format.replace(/(y|q)+/g, (result, key) => {
        const value = formatMap[key];
        return value || "";
      });
      return val;
    },
    setCurrent(item) {
      if (!this.dateVal) {
        this.dateVal = new Date();
      }
      this.dateVal.setFullYear(this.selectYear);
      this.dateVal = dateFns.setQuarter(this.dateVal, item.value);
      this.$emit("change", this.dateVal);
      this.currentQuarter = item.value;
      this.currentyear = this.selectYear;
      this.popoverVisible = false;
    },
    after() {
      this.dateVal.setFullYear(this.dateVal.getFullYear() + 1);
      this.selectYear = this.dateVal.getFullYear();
    },
    prev() {
      this.dateVal.setFullYear(this.dateVal.getFullYear() - 1);
      this.selectYear = this.dateVal.getFullYear();
    },
    handleBlur() {
      this.$refs.reference.blur();
    }
  }
};
</script>

<style>

</style>
