<template>
  <div class="article-container markdown-body">
    <!-- 1.导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      left-arrow
      title="黑马头条"
      @click-left="$router.back()"
    ></van-nav-bar>
    <!-- /导航栏 -->

    <div class="main-wrap">
      <!-- 2.加载中 -->
      <div class="loading-wrap" v-if="loading">
        <van-loading color="#3296fa" vertical>加载中</van-loading>
      </div>
      <!-- /加载中 -->

      <!-- 3.加载完成-文章详情 -->
      <div v-else-if="article.title" class="article-detail">
        <!-- 3.1文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>
        <!-- /文章标题 -->

        <!-- 3.2用户信息 -->
        <van-cell class="user-info" center :border="false">
          <!-- 3.2.1头像 -->
          <van-image
            class="avatar"
            slot="icon"
            round
            fit="cover"
            :src="article.aut_photo"
          />
          <!-- 3.2.2网名 -->
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <!-- 3.2.3时间 -->
          <div slot="label" class="publish-date">
            {{ article.pubdate | relativeTime }}
          </div>

          <!-- :is-followed="article.is_followed"
          @update-is_followed="article.is_followed = $event" -->
          <!-- 3.2.4关注/取关按钮 -->
          <follower-user
            class="follow-btn"
            :user-id="article.aut_id"
            v-model="article.is_followed"
          />
        </van-cell>
        <!-- /用户信息 -->

        <!-- 3.3文章内容 -->
        <div
          class="article-content"
          v-html="article.content"
          ref="article-content"
        ></div>

        <van-divider>正文结束</van-divider>

          <!-- 3.4评论列表 -->
        <comment-list
          :source="article.art_id"
          :list="commentList"
          @onload-success="totalCommentCount = $event"
          @reply-click="onReplyClick"
        />

        <!-- 3.5底部区域 -->
        <div class="article-bottom">
          <!-- 3.5.1写评论按钮 -->
          <van-button
            class="comment-btn"
            type="default"
            round
            size="small"
            @click="isPostShow = true"
            >写评论</van-button
          >
          <!-- 3.5.2写评论文本图标 -->
          <van-icon name="comment-o" :badge="totalCommentCount" color="#777" />
          <!-- 3.5.3点赞/取赞按钮子组件 -->
          <collect-article
            class="btn-item"
            :user-id="article.art_id"
            v-model="article.is_collected"
          />
          <!-- 3.5.4收藏/取收按钮子组件 -->
          <like-article
            class="btn-item"
            :user-id="article.art_id"
            v-model="article.attitude"
          />
          <!-- 3.5.5分享 -->
          <van-icon name="share" color="#777777"></van-icon>
        </div>
        <!-- /底部区域 -->

        <!-- 3.6发布评论弹出层 -->
        <van-popup v-model="isPostShow" position="bottom">
          <comment-post
            :target="article.art_id"
            @post-success="onPostSuccess"
          />
        </van-popup>
      </div>
      <!-- /加载完成-文章详情 -->

      <!-- 8.加载失败：404 -->
      <div class="error-wrap" v-else-if="errStatus === 404">
        <van-icon name="failure" />
        <p class="text">该资源不存在或已删除！</p>
      </div>
      <!-- /加载失败：404 -->

      <!-- 9.加载失败：其它未知错误（例如网络原因或服务端异常） -->
      <div class="error-wrap" v-else>
        <van-icon name="failure" />
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
      </div>
      <!-- /加载失败：其它未知错误（例如网络原因或服务端异常） -->
    </div>

    <!-- 回复评论弹出层 -->
    <van-popup v-model="isReplyShow" position="bottom" style="height: 100%">
       <!-- v-if 条件渲染  true：渲染元素节点 false：不渲染 -->
      <comment-reply 
      v-if="isReplyShow"
      :comment="currentComment"
      @close="isReplyShow = false"
      />
    </van-popup>
  </div>
</template>

<script>
// 获取新闻文章详情
import { getArticleById } from "@/api/article";
// ImagePreview 是一个函数，调用函数后会直接在页面中展示图片预览界面。
import { ImagePreview } from "vant";
// 关注/取关按钮子组件
import FollowerUser from "@/components/follower-user";
// 收藏/取消收藏按钮子组件
import CollectArticle from "@/components/collect-article";
// 点赞/取消点赞按钮子组件
import LikeArticle from "@/components/like-article";
// 评论列表
import CommentList from "./components/comment-list";
// 发布评论弹出层
import CommentPost from "./components/comment-post";
// 回复评论弹出层
import CommentReply from "./components/comment-reply";

export default {
  // ImagePreview({
  //   images: [
  //     'https://img01.yzcdn.cn/vant/apple-1.jpg',
  //     'https://img01.yzcdn.cn/vant/apple-2.jpg',
  //   ],
  // 起始位置，从 0 开始
  // startPosition: 1
  //   onClose() {
  //     console.log('关闭');
  //   },
  // });
  name: "ArticleIndex",
   // 给所有的后代组件提供数据
  // 注意：不要滥用
  provide: function () {
    return {
      articleId: this.articleId
    }
  },
  props: {
    articleId: {
      type: [String, Number, Object],
      required: true,
    },
  },
  components: {
    FollowerUser,
    CollectArticle,
    LikeArticle,
    CommentList,
    CommentPost,
    CommentReply,
    // CommentItem
  },

  directives: {},

  data() {
    return {
      article: {}, // 文章详情
      loading: true, // 初始页面加载中的 loading 状态
      errStatus: 0, // 失败的状态码
      followLoading: false, // 关注/取关按钮loading状态
      totalCommentCount: 0, //评论总数量
      isPostShow: false, // 控制发布评论的弹出层状态
      commentList: [], // 评论列表
      isReplyShow: false, // 控制回复评论的弹出层状态(v-if条件渲染)
      currentComment: {}, // 当前点击回复的评论项
    };
  },
  created() {
    this.loadArticle();
  },
  mounted() {},

  methods: {
    // 获取文章详情
    async loadArticle() {
      try {
        const { data } = await getArticleById(this.articleId);
        console.log(data);

        //模拟随机失败的情况
        // if (Math.random() > 0.5) {
        //   JSON.parse('dsankljdnskaljndlkjsa')
        // }

        // 数据驱动视图这件事儿不是立即的
        this.article = data.data;

        // 初始化图片点击预览
        setTimeout(() => {
          // console.log(this.$refs['article-content']);
          // console.log(this.$refs['article-content'].querySelectorAll('img'));
          this.previewImage();
        }, 0);
      } catch (err) {
        // 如果失败状态码为404（该资源不存在或已删除）
        if (err.response && err.response.status === 404) {
          this.errStatus = 404;
        }
        // 其他失败状态码展示其它未知错误 + 并让客户重新加载（v-else）
      }

      // 无论成功还是失败，都需要关闭 loading
      this.loading = false;
    },
    // 图片预览
    previewImage() {
      // 拿到"文章内容"
      const articleContent = this.$refs["article-content"];

      // 拿到文章内容中所有的"img节点"
      const imgs = articleContent.querySelectorAll("img");

      //拿到文章内容中所有的img节点中的"src属性"
      const images = [];
      imgs.forEach((item, index) => {
        images.push(item.src);

        // 给每个 img 注册点击事件，在处理函数中调用预览
        item.onclick = () => {
          ImagePreview({
            // 预览的图片地址数组
            images,
            // 起始位置，从 0 开始
            startPosition: index,
          });
        };
      });
      // console.log(images);
    },
    // 子弹出层文本框内容 置顶显示在评论列表
    onPostSuccess(data) {
      console.log(data);
      // 1.关闭弹出层（父组件开启的弹出层，父组件处理关闭）
      this.isPostShow = false;

      // 2.将发布内容显示到列表顶部（父组件处理）
      // （2.1子评论列表comment-list组件将已有评论列表数据传给父组件使用）
      console.log(this.commentList);
      // （2.2弹出层新文本框数据传给父组件使其置顶）
      this.commentList.unshift(data.new_obj);
    },
    onReplyClick(comment) {
      console.log(comment);
     this.currentComment = comment
     // 显示评论回复弹出层
      this.isReplyShow = true
    },
  },
};
</script>

<style lang="less" scoped>
@import "./github-markdown.css";

.article-container {
  .main-wrap {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #fff;
  }
  .article-detail {
    position: fixed;
    left: 0;
    right: 0;
    top: 92px;
    bottom: 88px;
    overflow-y: scroll;
    background-color: #fff;
    .article-title {
      font-size: 40px;
      padding: 50px 32px;
      margin: 0;
      color: #3a3a3a;
    }

    .user-info {
      padding: 0 32px;
      .avatar {
        width: 70px;
        height: 70px;
        margin-right: 17px;
      }
      .van-cell__label {
        margin-top: 0;
      }
      .user-name {
        font-size: 24px;
        color: #3a3a3a;
      }
      .publish-date {
        font-size: 23px;
        color: #b7b7b7;
      }
      .follow-btn {
        width: 170px;
        height: 58px;
      }
    }

    .article-content {
      padding: 55px 32px;
      /deep/ p {
        text-align: justify;
      }
    }
  }

  .loading-wrap {
    padding: 200px 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
  }

  .error-wrap {
    padding: 200px 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    .van-icon {
      font-size: 122px;
      color: #b4b4b4;
    }
    .text {
      font-size: 30px;
      color: #666666;
      margin: 33px 0 46px;
    }
    .retry-btn {
      width: 280px;
      height: 70px;
      line-height: 70px;
      border: 1px solid #c3c3c3;
      font-size: 30px;
      color: #666666;
    }
  }

  .article-bottom {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    box-sizing: border-box;
    height: 88px;
    border-top: 1px solid #d8d8d8;
    background-color: #fff;
    .comment-btn {
      width: 282px;
      height: 46px;
      border: 2px solid #eeeeee;
      font-size: 30px;
      line-height: 46px;
      color: #a7a7a7;
    }
    /deep/ .van-icon {
      font-size: 40px;
    }
    .comment-icon {
      top: 2px;
      color: #777;
      .van-info {
        font-size: 16px;
        background-color: #e22829;
      }
    }
    .btn-item {
      border: none;
      padding: 0;
      height: 40px;
      line-height: 40px;
      color: #777777;
    }
    .collect-btn--collected {
      color: #ffa500;
    }
    .like-btn--liked {
      color: #e5645f;
    }
  }
  /deep/.van-icon-arrow-left{
    color: #fff;
  }
}
</style>