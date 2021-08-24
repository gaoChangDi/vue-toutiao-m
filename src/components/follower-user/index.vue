<template>
  <van-button
    v-if="isFollowed"
    round
    size="small"
    :loading="loading"
    @click="onFllow"
    >已关注</van-button
  >
  <van-button
    v-else
    type="badge"
    color="#3296fa"
    round
    size="small"
    icon="plus"
    :loading="loading"
    @click="onFllow"
    >关注</van-button
  >
</template>

<script>
// 关注/取关接口
import { addFollow, delFollow } from "@/api/user";

export default {
  name: "FollowerUser",
  components: {},
  // 自定义 v-model 的数据名称
  model: {
    prop: "isFollowed", // 默认是 value
    event: "update-is_followed", // 默认是 input
  },
  props: {
    // 关注按钮状态切换
    isFollowed: {
      type: [Boolean],
      required: true,
    },
    // 用户id
    userId: {
      type: [Number, String, Object],
      required: true,
    },
  },
  directives: {},
  data() {
    return {
      // 关注/取关按钮loading处理（默认关）
      loading: false,
    };
  },
  methods: {
    // 关注/取关
    async onFllow() {
      this.loading = true; //请求数据时loading开
      // console.log(this.isFollowed);
      // console.log(this.userId);
      try {
        if (this.isFollowed) {
          // 已关，需取关
          const { data } = await delFollow(this.userId);
          console.log(data);
          // this.isFollowed = false
        } else {
          //无关，需添加关注
          const { data } = await addFollow(this.userId);
          console.log(data);
          //  this.isFollowed = true
        }
        // this.isFollowed = !this.isFollowed;
        this.$emit("update-is_followed", !this.isFollowed);
      } catch (err) {
        console.log(err);
        let message = "操作失败，请重试！";
        if (err.response && err.response.status === 400) {
          message = "不能关注自己！";
        }
        this.$toast(message);
      }
      this.loading = false; //请求数据结束时loading关
    },
  },
};
</script>

<style lang="less" scoped>
</style>