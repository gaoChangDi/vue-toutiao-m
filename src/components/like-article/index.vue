<template>
  
  <van-button
    :icon="attitude === 1 ? 'good-job' : 'good-job-o'"
    :class="{
      liked: attitude === 1,
    }"
    :loading="loading"
    @click="onCollect"
  />
</template>

<script>
// 点赞文章 / 取消点赞文章接口
import { addLike, delLike } from "@/api/article";
export default {
  name: "LikeArticle",

  components: {},
  // 自定义 v-model 的数据名称
  model: {
    prop: "attitude", // 默认是 value
    event: "update-is_collected", // 默认是 input
  },
  props: {
    // 点赞按钮状态切换
    attitude: {
      type: Number,
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
      loading: false,
    };
  },

  mounted() {},

  methods: {
    async onCollect() {
      this.loading = true; //请求数据时loading开
      // console.log(this.attitude);
      // console.log(this.userId);
      try {
        let status = -1
        if (this.attitude === 1) {
          // 已点赞，取消点赞
          await delLike(this.userId);
        } else {
          //没有点赞，添加点赞
          await addLike(this.userId);
          status = 1
        }
        this.$emit("update-is_collected", status);
        this.$toast.success(status === 1 ? "点赞成功" : "点赞点赞");
      } catch (err) {
        console.log(err);
        this.$toast.fail("操作失败，请重试！");
      }
      this.loading = false; //请求数据结束时loading关
    },
  },
};
</script>

<style lang="less" scoped>
.liked {
  .van-icon {
    color: #e5645f;
  }
}
</style>