<template>
  <div>
    <!-- :immediate-check="false" -->
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <comment-item
        v-for="(item, index) in list"
        :key="index"
        :comment="item"
        @reply-click="$emit('reply-click', $event)"
      />
    </van-list>
  </div>
</template>

<script>
// 获取评论或评论回复
import { getComments } from "@/api/comment";
//评论项
import CommentItem from "./comment-item";
export default {
  name: "CommentList",
  components: {
    CommentItem,
  },
  props: {
    source: {
      type: [Number, String, Object],
      required: true,
    },
    //不强制传list，父用就自己拿，不用默认default空数组[]
    list: {
      type: Array,
      default: () => [],
    },
    type:{
      type:String,
      // 自定义 Prop 数据验证
      validator (value) {
        return ['a', 'c'].includes(value)
      },
      default:'a'
    }
  },
  directives: {},

  data() {
    return {
      // list: [],
      loading: false,
      finished: false,
      offset: null,
      limit: 10,
    };
  },
  created () {
    // 1.当你手动初始 onLoad 的话，它不会自动开始初始的 loading
    // 2.所以我们要手动的开启初始 loading
    this.loading = true
    // 3.页面初始化将评论总数量传给父子间底部区域显示（即初始化即调用一次）
    // 4.当再点击评论列表的回复按钮又再次加载评论列表（即调用二次）
    this.onLoad()
  },
  mounted() {},

  methods: {
    //获取评论列表数据
    async onLoad() {
      try {
        // 1. 请求获取数据
        const { data } = await getComments({
          //评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
          type: this.type,
          // 源id，文章id或评论id
          source: this.source.toString(),
          // source: JSON.parse(this.source),
          // 获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据
          offset: this.offset,
          // 获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量
          limit: this.limit,
        });
        console.log(data);

        // 2. 将数据添加到列表中
        const { results } = data.data;
        this.list.push(...results);

        // 把文章评论的总数量传递到外部
        this.$emit("onload-success", data.data.total_count);

        // 3. 将 loading 设置为 false
        this.loading = false;

        // 4. 判断是否还有数据
        if (this.results) {
          // 有就更新获取下一页的数据页码
          this.offset = data.data.last_id;
        } else {
          // 没有就将 finished 设置结束
          this.finished = true;
        }
      } catch (err) {
        console.log(err);
        this.error = true;
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
</style>