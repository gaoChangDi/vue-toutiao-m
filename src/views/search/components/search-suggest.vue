<template>
  <div>
    <van-cell
      title="黑马程序员..."
      icon="search"
      v-for="(text, index) in suggest"
      :key="index"
      @click="$emit('search',text)"
    >
      <!-- 自定义控制标题插槽 -->
      <!-- <div slot="title">{{text}}</div> -->
      <!-- 不识别html标签 -->
      <!-- <div slot="title">{{htmlStr}}</div> -->
      <!-- 识别html标签 -->
      <!-- <div slot="title" v-html="htmlStr"></div> -->
      <div slot="title" v-html="highlight(text)"></div>
    </van-cell>
  </div>
</template>

<script>
// 获取联想建议（自动补全）接口
import { getSearchSuggest } from "@/api/search";
// 按需加载debounce防抖函数有好处：只会把使用到的成员打包到结果中
import { debounce } from "lodash";

export default {
  name: "SearchSuggest",
  components: {},
  props: {
    searchText: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      // 联想建议数据列表
      suggest: [], 
      //模拟关键字高亮
      // htmlStr:'Hello <span style="color: red">World</span>'
    };
  },
  watch: {
    // 监听searchText的value值变化触发的事件函数
    searchText: {
      // 监听每次searchText的value值变化，得到最新值
      // handler(value) {
      //   console.log(value);
      // },

      // 监听每次searchText的value值变化，得到最新值，并每次发请求
      // handler(value) {
      //   this.loadSearchSuggestions(value);
      // },

      // debounce优化防抖
      handler: debounce(function (value) {
        this.loadSearchSuggestions(value);
      }, 500),
      // 该回调将会在侦听开始之后被立即调用
      immediate: true,
    },
  },
  methods: {
    // 获取联想建议（自动补全）接口
    async loadSearchSuggestions(q) {
      try {
        const { data } = await getSearchSuggest(q);
        // console.log(data);
        this.suggest = data.data.options;
      } catch (err) {
        this.$toast("数据获取失败，请稍后重试");
      }
    },

    // 不修改原数据，加工原数据（高亮关键字）再渲染
    highlight(text) {
      // console.log(text);
      // 正则表达式 // 中间的内容都会当作匹配字符来使用，而不是数据变量
      // 如果需要根据数据变量动态的创建正则表达式，则手动 new RegExp
      // RegExp 正则表达式构造函数
      //    参数1：匹配模式字符串，它会根据这个字符串创建正则对象
      //    参数2：匹配模式，要写到字符串中
      const highlightStr = `<span style="color: red">${this.searchText}</span>`;
      const reg = new RegExp(this.searchText, "gi");
      return text.replace(reg, highlightStr);
    },
  },
};
</script>

<style lang="less" scoped>
</style>