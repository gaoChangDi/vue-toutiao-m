// 每个频道列表显示对应的文章列表（共享孙）
<template>
  <div class="article-item">
    <van-cell >
      <!-- 标题 -->
      <div slot="title" class="title van-multi-ellipsis--l2">
        {{ article.title }}
      </div>
      <!-- 描述信息内容 -->
      <div slot="label">
        <!-- 3张图片 -->
        <div v-if="article.cover.type === 3" class="cover-wrap">
          <div
            class="cover-item"
            v-for="(img, index) in article.cover.images"
            :key="index"
          >
            <van-image :src="img" />
          </div>
        </div>
        <!-- 没图片+ 1/3张图片均需要显示 -->
        <div class="label-info-wrap">
          <span>{{ article.aut_name }}</span>
          <span>{{ article.comm_count }}评论</span>
          <span>{{ article.pubdate | relativeTime}}</span>
        </div>
      </div>
      <!-- 1张图片 -->
      <div slot="default" v-if="article.cover.type === 1" class="right-cover">
        <van-image :src="article.cover.images[0]" fit="cover" />
      </div>
    </van-cell>
  </div>
</template>

<script>
export default {
  name: "ArticleItem",
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {};
  },
  mounted() {
    // console.log(this.article);
  },
  methods: {},
};
</script>

<style lang="less" scoped>
.article-item {
  // 标题
  .title {
    font-size: 32px;
    color: #3a3a3a;
  }
  // .van-cell__title {
  //   display: flex;
  //   flex-direction: column;
  //   justify-content: space-between;
  // }
  // 单图封面容器
  .van-cell__value {
    flex: unset;
    width: 232px;
    height: 146px;
    padding-left: 25px;
  }
  // 单图封面图片
  .right-cover {
    width: 100%;
    height: 146px;
  }
  // 底部文本信息
  .label-info-wrap span {
    font-size: 22px;
    color: #b4b4b4;
    margin-right: 25px;
  }
  // 多图封面
  .cover-wrap {
    display: flex;
    padding: 30px 0;
    .cover-item {
      flex: 1;
      height: 146px;
      &:not(:last-child) {
        padding-right: 4px;
      }
      .van-image {
        width: 100%;
        height: 146px;
      }
    }
  }
}
</style>