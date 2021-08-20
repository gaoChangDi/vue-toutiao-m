<template>
  <div class="search-contain">
    <form action="/">
      <van-search
        v-model="searchText"
        show-action
        placeholder="请输入搜索关键词"
        background="#3296fa"
        @search="onSearch"
        @cancel="onCancel"
        @focus="isResultShow = false"
      />
    </form>

    <!-- 搜索结果 默认隐  回车search后显-->
    <search-result v-if="isResultShow" :search-text="searchText" />

    <!-- 搜索建议 search框有内容-->
    <search-suggest
      v-else-if="searchText"
      :search-text="searchText"
      @search="onSearch"
    />

    <!-- 搜索历史 search框无内容-->
    <search-history
      v-else
      :search-histories="searchHistories"
      @search="onSearch"
      @clearAllHistory="searchHistories = []"
    />
  </div>
</template>

<script>
import SearchResult from "./components/search-result"; //搜索结果
import SearchSuggest from "./components/search-suggest"; //搜索建议
import SearchHistory from "./components/search-history"; //搜索历史
import {setItem,getItem} from '@/utils/storage'

export default {
  name: "SearchIndex",
  components: { SearchResult, SearchSuggest, SearchHistory },
  data() {
    return {
      searchText: "", //双向绑定search框内容
      isResultShow: false, // 控制搜索结果的展示
      searchHistories: getItem('TOUTIAO_HISTORY') || [], //存储历史记录
    };
  },
  watch: {
    //简单写法
    searchHistories(value) {
      // console.log(value);
      setItem('TOUTIAO_HISTORY',value)
    },
    //复杂写法（配置更多属性）
    // searchHistories: {
    //   handler() {},
    // }
  },
  methods: {
    // 回车search框触发的事件（展示搜索结果 + 拿到search框最新值）
    onSearch(val) {
      console.log(val);
      this.searchText = val; //建议子 传 index的search-suggest父 传 结果子

      //有相同的val不追加且排名不动
      // if(this.searchHistories.indexOf(val) == -1){
      //       this.searchHistories.unshift(val)
      //   }

      // 删除已重复的val，且重复新的val向前排名
      const index = this.searchHistories.indexOf(val);
      if (index !== -1) {
        this.searchHistories.splice(index, 1);
      }
      this.searchHistories.unshift(val);

      this.isResultShow = true; //搜索结果展示
    },
    // 取消按钮触发的事件
    onCancel() {
      // console.log(onCancel);
      //从哪来回哪去   从首页来回首页去
      this.$router.back();
    },
  },
};
</script>

<style lang="less" scoped>
.search-contain {
  .van-search__action {
    color: #fff;
  }
}
</style>