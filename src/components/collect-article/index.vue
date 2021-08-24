<template>
  <van-button
    :icon="isCollected ? 'star' : 'star-o'"
    :class="{
      collected: isCollected,
    }"
    :loading="loading"
    @click="onCollect"
  />
</template>

<script>
// 收藏文章 / 取消收藏文章接口
import { addCollect, delCollect } from "@/api/article";
export default {
  name: "CollectArticle",

  components: {},
  // 自定义 v-model 的数据名称
  model: {
    prop: "isCollected", // 默认是 value
    event: "update-is_collected", // 默认是 input
  },
  props: {
    // 收藏按钮状态切换
    isCollected: {
      type: Boolean,
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
      // console.log(this.isCollected);
      // console.log(this.userId);
      try {
        if (this.isCollected) {
          // 已收藏，取消收藏
          await delCollect(this.userId);
        } else {
          //没有收藏，添加收藏
          await addCollect(this.userId);
        }
        this.$emit("update-is_collected", !this.isCollected);
        this.$toast.success(!this.isCollected ? "收藏成功" : "取消收藏");
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
.collected {
  .van-icon {
    color: #ffa500;
  }
}
</style>