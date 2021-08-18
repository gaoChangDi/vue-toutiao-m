<template>
  <div class="home-container">
    <!-- 头部搜素 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <van-button
        slot="title"
        round
        type="info"
        size="small"
        icon="search"
        class="search-btn"
      >
        搜索
      </van-button>
    </van-nav-bar>

    <!-- 标签项 -->
    <van-tabs v-model="active" animated swipeable>
      <van-tab :title="item.name" v-for="item in channels" :key="item.id">
        <!-- 文章列表子组件占位符 -->
        <article-list :item="item" />
      </van-tab>
      <!-- 添加占位符充当内容区域 -->
      <div slot="nav-right" class="placeholder"></div>
      <!-- 汉堡按钮 -->
      <div slot="nav-right" class="hamburger-btn">
        <i class="iconfont icon-gengduo"></i>
      </div>
    </van-tabs>
  </div>
</template>

<script>
//获取频道列表数据接口
import { getUserList } from "@/api/user";
//文章列表数据vue子组件
import  ArticleList  from './components/article-list'

export default {
  name: "HomeIndex",
  components: {
    ArticleList
  },
  data() {
    return {
      active: 0,
      channels: [], // 频道列表
    }
  },
  created() {
    this.loadChannels();
  },
  mounted() {},

  methods: {
    async loadChannels() {
      try {
        const { data } = await getUserList();
        this.channels=data.data.channels
        console.log(data);
      } catch (err) {
        this.$toast("获取频道数据失败");
      }
    },
  },
};
</script>

<style lang="less" scoped>
.home-container {
  padding-top: 174px;
  padding-bottom: 100px;
  // 使用unset继承/取消样式
  /deep/.van-nav-bar__title {
    max-width: unset;
  }
  // 搜索按钮样式
  .van-button--info {
    width: 555px;
    height: 64px;
    background-color: #5babfb;
    border: 0;
    font-size: 28px;
    .van-icon {
      color: #fff;
      font-size: 32px;
    }
  }

  // /deep/深度操作符 让作用域在scoped组件中可以操作根节点的后代元素
  /deep/ .van-tabs__wrap {
     position: fixed;
    top: 92px;
    z-index: 1;
    left: 0;
    right: 0;
    height: 82px;
    .van-tab {
      min-width: 200px; //干掉平分的比例
      border-right: 1px solid #edeff3;
      font-size: 30px;
      color: #777777;
    }
    .van-tab--active {
      color: #333333;
    }
    .van-tabs__nav {
      padding-bottom: 0;
      padding-right: 0;
    }
    .van-tabs__line {
      bottom: 8px;
      width: 31px !important;
      height: 6px;
      background-color: #3296fa;
    }
    // 添加占位符充当内容区域
    .placeholder {
      //  默认flex-shrink：1，0代表不平分容器宽度
      flex-shrink: 0;
      width: 66px;
      height: 82px;
    }
    .hamburger-btn {
      // 固定右侧
      position: fixed;
      right: 0;
      // 水平居中对齐
      display: flex;
      justify-content: center;
      align-items: center;
      width: 66px;
      height: 82px;
      // 不透明度
      background-color: rgba(255, 255, 255, 0.902);
      i.toutiao {
        font-size: 33px;
      }
      // 伪元素设置渐变边框
      &:before {
        content: "";
        position: absolute;
        left: 0;
        width: 1px;
        height: 58px;
        background-image: url(~@/assets/gradient-gray-line.png);
        background-size: contain;
      }
    }
  }
}
</style>