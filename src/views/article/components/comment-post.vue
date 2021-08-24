<template>
  <div class="comment-post">
    <van-field
      class="post-field"
      v-model="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="50"
      placeholder="请输入留言"
      show-word-limit
    />
    <van-button class="post-btn" @click="onPost">发布</van-button>
  </div>
</template>

<script>
// 添加评论或评论回复接口
import { addComment } from "@/api/comment";
export default {
  name: "CommentPost",
  components: {},
    // inject接受
   inject: {
    articleId: {
      type: [Number, String, Object],
      default: null
    }
  },
  props: {
    target: {
      type: [Number, String, Object],
      required: true,
    },
  },
  data() {
    return {
      message: "",
    };
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    // 添加评论
    async onPost() {
       this.$toast.loading({
        message: '发布中...',
        forbidClick: true, // 禁用背景点击
        duration: 0 // 持续时间，默认 2000，0 表示持续展示不关闭
      })

      try {
        const { data } = await addComment({
          // 评论的目标id（评论文章即为文章id，对评论进行回复则为评论id）
          target: this.target.toString(),
          // 评论内容
          content: this.message, 
          // 文章id，对评论内容发表回复时，需要传递此参数，表明所属文章id。对文章进行评论，不要传此参数。
          art_id: this.articleId ? this.articleId.toString() : this.articleId,
        });
        console.log(data);
        // 1.关闭弹出层（父组件开启的弹出层，父组件处理关闭）

        /* 2.将发布内容显示到列表顶部（父组件处理）
        （2.1子评论列表comment-list组件将已有评论列表数据传给父组件使用） 
        （2.2弹出层新文本框数据传给父组件使其置顶）
        */
        this.$emit("post-success", data.data);

        // 3.清空文本框（子组件处理）
        this.message = "";

        this.$toast.success('发布成功')
      } catch (err) {
        console.log(err);
         this.$toast.fail('发布失败')
      }
    },
  },
};
</script>

<style scoped lang="less">
.comment-post {
  display: flex;
  align-items: center;
  padding: 32px 0 32px 32px;
  .post-field {
    background-color: #f5f7f9;
  }
  .post-btn {
    width: 150px;
    border: none;
    padding: 0;
    color: #6ba3d8;
    &::before {
      display: none;
    }
  }
}
</style>