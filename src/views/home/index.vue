// 首页根组件（爷）
<template>
  <div class="home-container">
    <!-- 1. 头部搜素 -->
    <van-nav-bar class="page-nav-bar" fixed>
      <!-- to="/search" 跳转到/search路由模块-->
      <van-button
        slot="title"
        round
        type="info"
        size="small"
        icon="search"
        class="search-btn"
        to="/search"
      >
        搜索
      </van-button>
    </van-nav-bar>

    <!-- 2.标签页 转场动画 + 滑动切换 -->
    <van-tabs v-model="active" animated swipeable>
      <!-- 2.1标签项 -->
      <van-tab :title="item.name" v-for="item in channels" :key="item.id">
        <!-- 文章列表子组件占位符 -->
        <article-list :item="item" />
      </van-tab>
      <!-- 2.2添加占位符充当内容区域（汉堡按钮的宽高 + 不平分flex布局） -->
      <div slot="nav-right" class="placeholder"></div>
      <!-- 2.3汉堡按钮 -->
      <div
        slot="nav-right"
        class="hamburger-btn"
        @click="isChennelEditShow = true"
      >
        <i class="iconfont icon-gengduo"></i>
      </div>
    </van-tabs>

    <!-- 3频道编辑弹出层 -->
    <van-popup
      v-model="isChennelEditShow"
      closeable
      position="bottom"
      close-icon-position="top-left"
      :style="{ height: '100%' }"
    >
      <!-- 3.1弹出层具体内容 -->
      <channel-edit
        :my-channels="channels"
        :active="active"
        @update-active="onUpdateActive"
      />
    </van-popup>
  </div>
</template>

<script>
//获取频道列表接口
import { getUserList } from "@/api/user";
//文章列表数据vue子组件
import ArticleList from "./components/article-list";
//汉堡按钮频道编辑弹出层vue子组件
import ChannelEdit from "./components/channel-edit";
// 获取user数据
import { mapState } from "vuex";
// 拿本地存储的myChannels数据（属性名TOUTIAO_CHANNELS）
import { getItem } from "@/utils/storage";

export default {
  name: "HomeIndex",
  components: {
    ArticleList,
    ChannelEdit,
  },
  data() {
    return {
      active: 0,
      channels: [], // 频道列表
      isChennelEditShow: false, // 控制编辑频道弹出层的显示状态
    };
  },
  created() {
    this.loadChannels();
  },
  computed: {
    ...mapState(["user"]),
  },
  methods: {
    // 获取我的频道列表数据
    async loadChannels() {
      try {
        // const { data } = await getUserList();
        // this.channels = data.data.channels;
        // console.log(data);
        // console.log(this.channels);

        let channels = [];
        if (this.user) {
          // 已登录
          const { data } = await getUserList();
          channels = data.data.channels;
        } else {
          // 未登录
          const localChannels = getItem("TOUTIAO_CHANNELS");
          if (localChannels) {
            //本地存储有TOUTIAO_CHANNELS
            channels = localChannels;
          } else {
            //本地存储无TOUTIAO_CHANNELS
            const { data } = await getUserList();
            channels = data.data.channels;
          }
        }
        this.channels = channels;
      } catch (err) {
        this.$toast("获取频道数据失败");
      }
    },
    // 拿到弹出层我的频道最新active值切换激活频道项 + 控制弹出层显（默认）/隐
    onUpdateActive(index, isChennelEditShow = true) {
      // console.log(index);
      this.active = index;
      this.isChennelEditShow = isChennelEditShow;
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