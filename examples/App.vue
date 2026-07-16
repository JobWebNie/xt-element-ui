<template>
  <!-- 使用 tag="template" 和 proxyElement 将样式应用到 html 标签 -->
  <xt-config-provider 
    tag="template"
    :proxyElement="htmlElement"
    :primaryColor="primaryColor" 
    :size="size" 
    :theme="theme"
    :injectBackground="true"
  >
    <h3>使用 ConfigProvider + proxyElement（推荐方式）</h3>
    <p>主题样式已应用到 html 标签上，实现全局主题切换</p>
    
    <div style="padding: 20px; border: 1px solid #eee; margin-bottom: 20px;">
      <h4>配置面板</h4>
      <div>
        <span>主题：</span>
        <el-button @click="changeTheme('white')">浅色</el-button>
        <el-button @click="changeTheme('dark')">暗色</el-button>
      </div>
      <div>
        <xt-button>详情</xt-button>
        <xt-button type="primary">查询</xt-button>
        <xt-button type="success">上传</xt-button>
        <xt-button type="danger">作废</xt-button>
        <xt-button type="primary" plain>重置</xt-button>
      </div>
      <div>
        <span>禁用：</span>
        <xt-button type="primary" disabled>查询</xt-button>
        <xt-button type="success" disabled>上传</xt-button>
        <xt-button type="danger" disabled>作废</xt-button>
        <xt-button type="primary" plain disabled>重置</xt-button>
        <xt-button disabled>详情</xt-button> 
      </div>
      <div>
        <span>文字：</span>
        <xt-text type="primary">文字</xt-text> 
        <xt-text type="danger">文字</xt-text> 
        <xt-text type="warning">文字</xt-text> 
        <xt-text>文字</xt-text> 
        <xt-text letterSpacing="2px">文字</xt-text> 
        <xt-text :bold="true">文字</xt-text> 
      </div>
      <div style="margin-top: 10px;">
        <span>字体大小：</span>
        <xt-button type="success" @click="size = 'small'">小</xt-button>
        <xt-button @click="size = 'medium'">中</xt-button>
        <xt-button @click="size = 'large'">大</xt-button>
      </div>
      <div style="margin-top: 10px;">
        <span>主色调：</span>
        <el-color-picker v-model="primaryColor"></el-color-picker>
        <span style="margin-left: 10px;">{{ primaryColor }}</span>
      </div>
      
      <h4 style="margin-top: 20px;">预设颜色</h4>
      <xt-flex-box>
        <xt-button v-for="color in presetColors" :key="color.value"
                    :style="{ backgroundColor: color.value, color: '#fff', marginRight: '8px' }"
                    @click="primaryColor = color.value">
          {{ color.label }}
        </xt-button>
      </xt-flex-box>
      
      <h4 style="margin-top: 20px;">效果预览</h4>
      <xt-card>
        <xt-card-item iconType="icon" icon="el-icon-user" label="知识问答" :value="0" type="primary"></xt-card-item>
      </xt-card>

      <xt-chart type="bar" :chartData="chartData" style="height: 400px;" />

      <!-- 极简模式 -->
      <xt-chart type="bar" :chart-data="chartData" simple-mode  style="height: 400px;" />

      <XtCardItem style="margin-top: 10px;" v-for="item in cardList" :key="item.title" :type="item.type" :title="item.title" :diff="item.diff" v-model="item.value" :change="item.change" />

      <h4 style="margin-top: 20px;">虚拟滚动测试（10000条数据）</h4>
      <xt-table 
        :height="400"
        :virtual-scroll="true"
        :row-init-height="48"
        :buffer-size="3"
        :tableData="virtualScrollData"
        :columns="virtualColumns"
        :selection="true"
      />
      <h4>阶梯价格</h4>
      <price />
      <h4>阶梯价格</h4>
      <XtTabs v-model="activeName">
        <XtTabPane label="用户管理" name="first">用户管理内容</XtTabPane>
        <XtTabPane label="配置管理" name="second" disabled>配置管理内容</XtTabPane>
        <XtTabPane label="角色管理" name="third">角色管理内容</XtTabPane>
      </XtTabs>

      
    </div>
  </xt-config-provider>
</template>

<script>
import { createVirtualScrollData, virtualScrollColumns } from '../src/components/xt-table/virtualScrollData'
import price from './demo/price.vue'
export default {
  name: 'App',
  components: {
    price
  },
  data() {
    return {
      activeName: 'first',
      cardList: [{title: '卡片标题',diff: 301, value: 123321.889, change: 301, type: 'primary'},{title: '卡片标题',diff: 301, value: 123321.889, change: 301, type: 'success'},{title: '卡片标题',diff: 301, value: 123321.889, change: 301, type: 'warning'},{title: '卡片标题',diff: 301, value: -1232889, change: 301, type: 'danger'}],
      theme: 'white',
      size: 'small',
      primaryColor: '#1890ff',
      globalColor: '#1890ff',
      presetColors: [
        { label: 'XT蓝', value: '#1890ff' },
        { label: '成功绿', value: '#37c3a4' },
        { label: '警告橙', value: '#FFB74D' },
        { label: '危险红', value: '#EA1D34' },
        { label: '科技紫', value: '#9C27B0' },
        { label: '青春粉', value: '#E91E63' }
      ],
      htmlElement: null,
      chartData: [
        { value: 65, name: "吴十" },
        { value: 70, name: "唐九" },
        { value: 73, name: "钱一" },
        { value: 78, name: "孙二" },
        { value: 88, name: "刘八" },
        { value: 93, name: "王七" },
        { value: 99, name: "赵六" },
        { value: 103, name: "宋五" },
        { value: 113, name: "李四" },
        { value: 125, name: "张三" }
      ],
      virtualColumns: virtualScrollColumns,
      virtualScrollData: createVirtualScrollData(10000)
    }
  },
  mounted() {
    // 获取 html 标签作为代理元素
    this.htmlElement = document.querySelector('html')
  },
  methods: {
    changeSize(size) {
      this.$xt.setSize(size)
    },
    changeTheme(theme) {
      this.theme = theme;
      this.primaryColor = "#1060ff"
      this.$xt.setTheme(theme)
    },
    changeColor(color) {
      this.$xt.setPrimaryColor(color)
    }
  }
}
</script>
<style scoped>
</style>
