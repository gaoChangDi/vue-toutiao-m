// 《 首页 + 问答 + 视频 + 我的 》《的爸爸》

<template>
  <div class="layout-container">
    <!-- 子路由出口 home/qa/video/my-->
    <router-view></router-view>


    <van-tabbar route>
      <van-tabbar-item to="/">
        <span>首页</span>
        <i slot="icon" class="iconfont icon-shouye"></i>
      </van-tabbar-item>
      <van-tabbar-item to="/qa">
        <span>问答</span>
        <i slot="icon" class="iconfont icon-wenda"></i>
      </van-tabbar-item>
      <van-tabbar-item to="/video">
        <span>视频</span>
        <i slot="icon" class="iconfont icon-shipin"></i>
      </van-tabbar-item>
      <van-tabbar-item to="/my">
        <span>{{$store.state.user ? '我的' : '未登录'}}</span>
        <i slot="icon" class="iconfont icon-wode"></i>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  name: "LayoutIndex",
  data() {
    return {
      // active: 0,
    };
  },

  mounted() {},

  methods: {},
};
</script>

<style lang="less" scoped>
.layout-container {
  .van-tabbar {
    .van-tabbar-item {
      i {
        font-size: 40px;
      }
      span {
        font-size: 20px;
      }
    }
  }
}
</style>