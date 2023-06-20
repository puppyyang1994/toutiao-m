<template>
  <div class="search-suggestion">
    <!-- 给父组件发一个自定义事件 search 然后去父组件中监听 -->
    <van-cell
      icon="search"
      v-for="(text, index) in suggestions"
      :key="index"
      @click="$emit('search', text)"
    >
      <div slot="title" v-html="highlight(text)"></div>
    </van-cell>
    <!-- 使用双花括号绑定会直接输出纯文本内容 -->
    <!-- <div>{{ htmlStr }}</div> -->

    <!-- 使用v-html指令可以绑定渲染带有html标签的字符串 -->
    <!-- <div v-html="htmlStr"></div> -->
  </div>
</template>

<script>
import { getSearchSuggestions } from '@/api/search'
//按需加载 需要谁使用谁：只会把使用到的成员打包到结果中
import { debounce } from 'lodash'
export default {
  // 组件名称
  name: 'SearchSuggestion',
  // 局部注册的组件
  components: {},
  // 组件参数 接收来自父组件的数据
  props: {
    searchText: {
      type: String,
      required: true
    }
  },
  // 组件状态值
  data() {
    return {
      suggestions: [], //联想建议数据列表
      htmlStr: ''
    }
  },
  // 计算属性
  computed: {},
  // 侦听器
  watch: {
    searchText: {
      // 监视searchText 当searchText发生改变时，就会调用handler函数
      // 注意 handler函数 名称是固定的
      /*  handler(value) {
        this.loadSearchSuggestions(value)
      }, */

      //   debounce函数 参数1 函数  参数2 延迟的时间 单位是毫秒
      // 返回值：防抖之后的函数
      handler: debounce(function (value) {
        this.loadSearchSuggestions(value)
      }, 200),
      immediate: true //该回调将会在侦听开始之后立即调用
    }
  },
  // 生命周期钩子   注：没用到的钩子请自行删除
  /**
   * 组件实例创建完成，属性已绑定，但DOM还未生成，el属性还不存在
   */
  created() {},
  /**
   * el 被新创建的 vm.el 替换，并挂载到实例上去之后调用该钩子。
   * 如果 root 实例挂载了一个文档内元素，当 mounted 被调用时 vm.el 也在文档内。
   */
  mounted() {},
  // 组件方法
  methods: {
    async loadSearchSuggestions(q) {
      try {
        const { data } = await getSearchSuggestions(q)
        this.suggestions = data.data.options
      } catch (error) {
        this.$toast('获取数据失败，请稍后重试')
      }
    },
    // 高亮文字
    highlight(text) {
      // 在调用replace方法之前，text参数的值为null或undefined。
      // 请确保在调用highlight方法时，传递一个有效的文本值作为参数。
      if (!text || !this.searchText) {
        return text // 如果text或searchText为空，直接返回原始的text
      }
      // 拼接高亮字符串
      const highlightStr = `<span class="active">${this.searchText}</span>`
      //   正则表达式 //中间的内容 都会当做匹配字符来使用而不是数据
      //   如果 需要根据数据变量动态的创建正则表达式 则需要new RegExp
      //   RegExp 正则表达式构造函数
      // 参数1：匹配模式 字符串， 他会根据字符串创建正则表达式
      // 参数2：匹配模式， 要写到字符串中
      const reg = new RegExp(this.searchText, 'gi')
      return text.replace(reg, highlightStr) //replace不会修改原数据
    }
  }
}
</script>

<style scoped lang="less">
.search-suggestion {
  /deep/ span.active {
    color: #3296fa;
  }
}
</style>
