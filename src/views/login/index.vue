// 《 /login登录页 》

<template>
  <div class="login-container">
    <!-- 登录导航栏 -->
    <van-nav-bar class="page-nav-bar" title="登录">
      <!-- 导航栏左侧" x " -->
      <van-icon slot="left" name="cross" @click="$router.back()" />
    </van-nav-bar>

    <!-- 登录表单 -->
    <van-form @submit="onSubmit" ref="loginFormRef">
      <!-- 表单手机号项 -->
      <van-field
        v-model="user.mobile"
        name="mobile"
        placeholder="请输入手机号"
        type="number"
        maxlength="11"
        :rules="userFormRules.mobile"
      >
        <!-- 自定义手机号图标插槽 -->
        <i slot="left-icon" class="iconfont icon-shouji"></i>
      </van-field>

      <!-- 表单验证码项 -->
      <van-field
        v-model="user.code"
        name="code"
        placeholder="请输入验证码"
        type="number"
        maxlength="6"
        :rules="userFormRules.code"
      >
        <!-- 自定义验证码图标插槽 -->
        <i slot="left-icon" class="iconfont icon-yanzhengma"></i>
        <!-- 发送验证码区域 -->
        <template #button>
          <!-- 倒计时 -->
          <van-count-down
            :time="1000 * 5"
            format=" ss s"
            v-if="isCountDownShow"
            @finish="isCountDownShow = false"
          />
          <!-- 发送验证码按钮 -->
          <van-button
            v-else
            native-type="button"
            class="send-sms-btn"
            round
            size="small"
            type="default"
            @click="onSendSms"
            >发送验证码</van-button
          >
        </template>
      </van-field>

      <!-- 登录按钮 -->
      <div style="margin: 16px">
        <van-button round block type="info" native-type="submit"
          >登录</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
// 按需导入登录请求接口login + 发送验证码接口sendSms
import { login, sendSms } from "@/api/user";
export default {
  name: "LoginIndex",
  data() {
    return {
      // 双向绑定表单数据
      user: {
        mobile: "13911111111", // 手机号
        code: "246810", // 验证码
      },

      // 表单数据规则
      userFormRules: {
        mobile: [
          {
            required: true,
            message: "手机号不能为空",
          },
          {
            pattern: /^1[3|5|7|8]\d{9}$/,
            message: "手机号格式错误",
          },
        ],
        code: [
          {
            required: true,
            message: "验证码不能为空",
          },
          {
            pattern: /^\d{6}$/,
            message: "验证码格式错误",
          },
        ],
      },

      // 是否展示倒计时
      isCountDownShow: false,
    };
  },
  methods: {
    // 提交表单
    async onSubmit() {
      // 1.拿到表单数据
      const user = this.user;

      // 2. 表单验证
      this.$toast.loading({
        message: "加载中...",
        forbidClick: true,
        duration: 0, // 持续时间，默认2000      0表示持续展示不关闭
      });

      // 3. 提交表单请求登录
      try {
        const {
          data: { data },
        } = await login(user);
        console.log("登录成功", data);
        this.$toast.success("登录成功");
        this.$store.commit("setUser", data);
        // back 的方式不严谨，后面讲功能优化的时候再说
        this.$router.back(); // 登录成功，跳转回原来页面
      } catch (err) {
        if (err.response.status === 400) {
          console.log("手机号或验证码错误");
          this.$toast.fail("手机号或验证码错误");
        } else {
          console.log("登录失败，请稍后重试", err);
          this.$toast.fail("登录失败，请稍后重试");
        }
        // console.log(err);
      }
    },

    //发送验证码
    async onSendSms() {
      // 1. 校验手机号是否合规
      try {
        await this.$refs.loginFormRef.validate("mobile");
      } catch (err) {
        return console.log("验证失败", err);
      }

      // 2. 验证通过，显示倒计时
      this.isCountDownShow = true;

      // 3. 请求发送验证码
      try {
        const res = await sendSms(this.user.mobile);
        console.log("获取验证码成功", res);
        this.$toast("发送成功");
      } catch (err) {
        this.isCountDownShow = false;
        if (err.response.status === 429) {
          console.log("获取验证码失败频繁", err);
          this.$toast("发送太频繁了，请稍后重试");
        } else {
          this.$toast("发送失败，请稍后重试");
          this.$toast("发送失败，请稍后重试");
        }
        // console.log(err);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.login-container {
  .iconfont {
    font-size: 37px;
  }
  .van-icon {
    color: #fff;
  }
}

.send-sms-btn {
  width: 168px;
  height: 48px;
  line-height: 46px;
  background-color: #ededed;
  color: #666;
}

.login-btn-wrap {
  padding: 53px 33px;
  .van-button {
    background-color: #6db4fb;
    border: none;
  }
}
</style>