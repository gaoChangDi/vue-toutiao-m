<template>
  <div class="my-container">
    <!-- 已登录头部 -->
    <div class="header user-info" v-if="user">
      <div class="base-info">
        <div class="left">
          <van-image :src="userInfo.photo" fit="cover" />
          <span>{{ userInfo.name }}</span>
        </div>
        <div class="right">
          <van-button round size="small">编辑资料</van-button>
        </div>
      </div>
      <div class="data-stats">
        <div class="data-item">
          <span>{{ userInfo.art_count }}</span>
          <span>头条</span>
        </div>
        <div class="data-item">
          <span>{{ userInfo.follow_count }}</span>
          <span>关注</span>
        </div>
        <div class="data-item">
          <span>{{ userInfo.fans_count }}</span>
          <span>粉丝</span>
        </div>
        <div class="data-item">
          <span>{{ userInfo.like_count }}</span>
          <span>获赞</span>
        </div>
      </div>
    </div>

    <!-- 未登录头部 -->
    <div class="header not-login" v-else>
      <div class="login-btn" @click="$router.push('/login')">
        <img src="@/assets/mobile.png" class="mobile-img" />
        <span>登录 / 注册</span>
      </div>
    </div>

    <!-- 宫格导航 -->
    <!-- :column-num="2" 2列 -->
    <!-- clickable开启格子点击反馈 -->
    <van-grid :column-num="2" clickable>
      <van-grid-item>
        <i slot="icon" class="iconfont icon-shoucang"></i>
        <span slot="text">收藏</span>
      </van-grid-item>
      <van-grid-item>
        <i slot="icon" class="iconfont icon-lishi"></i>
        <span slot="text">历史</span>
      </van-grid-item>
    </van-grid>

<!-- 单元格 -->
<!-- is-link在单元格右侧显示箭头 -->
    <van-cell title="消息通知" is-link class="mb-9" />
    <van-cell title="小智同学" is-link />
    <van-cell
      title="退出登录"
      clickable
      class="logout-cell"
      v-if="user"
      @click="onLogout"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { getUserInfo } from "@/api/user";
export default {
  name: "MyIndex",
  data() {
    return {
      userInfo: {}, // 用户信息
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  created() {
    //有token即用户登录获取用户自己的数据（没登录则不获取）
    if (this.user) {
      this.loadUserInfo();
    }
  },
  methods: {
    //退出登录弹出框提示
    onLogout() {
      this.$dialog
        .confirm({
          title: "确认退出吗？",
        })
        .then(() => {
          this.$store.commit("setUser", null);
        })
        .catch(() => {
          console.log("取消执行这里");
        });
    },
    //获取用户自己的数据
    async loadUserInfo() {
      try {
        const { data} = await getUserInfo();
        this.userInfo = data.data  //获取回来的数据给userInfo
        console.log(data);
      } catch (err) {
        console.log("失败");
        this.$toast('获取数据失败，请稍后重试')
      }
    },
  },
};
</script>

<style lang="less" scoped>
.my-container {
  .header {
    height: 361px;
    background: url("~@/assets/banner.png");
    background-size: cover;
  }
  .user-info {
    .base-info {
      height: 231px;
      padding: 76px 32px 23px;
      box-sizing: border-box;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .left {
        display: flex;
        align-items: center;
        .van-image {
          width: 132px;
          height: 132px;
          border: 4px solid #fff;
          margin-right: 23px;
        }
        span {
          font-size: 30px;
          color: #fff;
        }
      }
      .right {
        .van-button {
          color: #747474;
        }
      }
    }

    .data-stats {
      display: flex;
      .data-item {
        height: 130px;
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #fff;
        span:first-child {
          font-size: 36px;
        }
        span:last-child {
          font-size: 23px;
        }
      }
    }
  }
  .not-login {
    display: flex;
    justify-content: center;
    align-items: center;
    .login-btn {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      img {
        width: 132px;
        height: 132px;
        margin-bottom: 15px;
      }
      span {
        font-size: 28px;
        color: #fff;
      }
    }
  }
  .van-grid {
    .van-grid-item {
      height: 141px;
      i {
        font-size: 45px;
      }
      .icon-shoucang {
        color: #eb5253;
      }
      .icon-lishi {
        color: #ff9d1d;
      }
      span {
        font-size: 28px;
      }
    }
  }
  .mb-9 {
    margin-top: 9px;
  }
  .logout-cell {
    text-align: center;
    color: #d86262;
    margin-top: 9px;
  }
}
</style>