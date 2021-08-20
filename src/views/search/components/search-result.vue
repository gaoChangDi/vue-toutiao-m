<template>
  <div>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      @load="onLoad"
    >
      <van-cell
        v-for="(item, index) in list"
        :key="index"
        :title="item.title"
      />
    </van-list>
  </div>
</template>

<script>
// 获取搜索结果接口
import { getSearchResult } from "@/api/search";

export default {
  name: "SearchResult",
  components: {},
  props: {
    searchText: {
      type: String,
      required: true,
    },
  },
  directives: {},

  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      error: false,
      page: 1,
      per_page: 20,
    };
  },

  mounted() {},

  methods: {
    async onLoad() {
      try {
        // 1. 请求获取数据
        const { data } = await getSearchResult({
          page: this.page,
          per_page: this.per_page,
          q: this.searchText,
        });
        console.log(data);
        // 2. 将数据添加到数组列表中
        const { results } = data.data;
        console.log(results);
        this.list.push(...results);
        // 3. 将本次加载中的 loading 关闭
        this.loading = false;
        // 4. 判断是否还有数据
        if (results.length) {
          // 如果有，则更新获取下一个数据的页码
          this.page++;
        } else {
          // 如果没有，则将加载状态 finished 设置为结束
          this.finished = true;
        }
      } catch (err) {
        // 展示加载失败的提示状态
        this.error = true;
        // 加载失败了 loading 也要关闭
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
</style>