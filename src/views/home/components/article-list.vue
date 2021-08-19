// 频道列表子组件（爸）
<template>
  <div class="article-list">
    <!-- 1.下拉刷新 -->
    <!-- @refresh 下拉刷新时触发-->
    <!-- :success-text 刷新成功提示文案 -->
    <!-- :success-duration 刷新成功提示展示时长(ms) -->
    <van-pull-refresh
      v-model="isreFreshLoading"
      @refresh="onRefresh"
      :success-text="refreshSuccessText"
      :success-duration="1500"
    >


      <!-- 1.1初始化或上拉滚动 -->
      <!-- @load  初始化或滚动到底部的时触发 -->
      <!-- :error.sync 是否加载失败，加载失败后点击错误提示可以重新
                       触发load事件，必须使用sync修饰符 -->
      <van-list
        v-model="loading"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >


       <!-- 1.1.1每个频道列表显示对应的文章列表 -->
        <article-item
          v-for="(article, index) in list"
          :key="index"
          :article="article"
        >
        </article-item>
        <!-- <van-cell
          v-for="(item, index) in list"
          :key="index"
          :title="item.title"
        /> -->
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
// 获取文章列表接口
import { getArticles } from "@/api/article";
// 每个频道列表显示对应的文章列表子组件
import ArticleItem from "@/components/article-item";

export default {
  name: "ArticleList",
  components: { ArticleItem },
  directives: {},
  props: {
    // 获取频道列表的数据（id，name）
    item: {
      type: Object, //item类型为object
      required: true, //必须传item频道列表数据给文章列表
    },
  },
  data() {
    return {
      list: [], // 存储文章列表数据的数组
      loading: false, // 控制加载中 loading 状态
      finished: false, // 控制数据加载结束的状态
      timestamp: null, // 请求获取下一页数据的时间戳
      error: false, // 控制列表加载失败的提示状态
      isreFreshLoading: false, // 控制下拉刷新的 loading 状态
      refreshSuccessText: "刷新成功", // 下拉刷新成功提示文本
    };
  },
  mounted() {
    // console.log(this.list);
  },
  methods: {
    // 初始化或滚动到底部的时候会触发调用 onLoad（获取对应的文章列表数据渲染页面，依次滚动刷新追加到后面）
    async onLoad() {
      try {
        // 1. 请求获取数据
        const { data } = await getArticles({
          channel_id: this.item.id,
          timestamp: Date.now(),
          with_top: 1,
        });
        // console.log(data);

        // 模拟随机文章列表获取失败的情况
        // console.log(Math.random());
        // console.log(Math.random() > 0.2);
        // if (Math.random() > 0.5) {
        //           JSON.parse("dsnajndjsa")
        //         }

        // 2. 把请求结果数据放到 list 数组中
        const { results } = data.data;
        // console.log(results);
        this.list.push(...results);

        // 3. 本次数据加载结束之后要把加载状态设置为结束
        this.loading = false;

        // 4. 判断数据是否全部加载完成
        if (results.length) {
          // console.log(data.data.pre_timestamp);
          // console.log(Date.now());
          this.timestamp = data.data.pre_timestamp;
        } else {
          this.finished = true;
        }
      } catch (err) {
        console.log("文章列表获取失败", err);
        this.error = true;
        this.loading = false;
      }
    },
    // 下拉刷新时触发（重新获取文章列表新数据，追加最顶部）
    async onRefresh() {
      try {
        // 1. 请求获取数据
        const { data } = await getArticles({
          channel_id: this.item.id,
          timestamp: Date.now(),
          with_top: 1,
        });
        // console.log(data);

        // 模拟随机文章列表获取失败的情况
        // console.log(Math.random());
        // console.log(Math.random() > 0.2);
        // if (Math.random() > 0.5) {
        //   JSON.parse("dsnajndjsa");
        // }

        // 2. 把请求结果数据放到 list 数组中
        const { results } = data.data;
        // console.log(results);
        // console.log(results.length);
        this.list.unshift(...results);

        // 3. 关闭下拉刷新的 loading 状态
        this.isreFreshLoading = false;

        // 4. 判断数据是否全部加载完成
        this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`;
      } catch (err) {
        console.log("文章列表获取失败", err);
        this.refreshSuccessText = "刷新失败";
        this.isreFreshLoading = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.article-list {
  height: 80vh;
  overflow-y: auto;
}
</style>