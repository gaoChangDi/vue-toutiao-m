<template>
  <div>
    <van-cell title="搜索历史">
      <div v-if="isDeleteShow">
        <span @click="$emit('clearAllHistory')">全部删除</span>
        &nbsp;&nbsp;
        <span @click="isDeleteShow = false">完成</span>
      </div>
      <van-icon name="delete-o" v-else @click="isDeleteShow = true" />
    </van-cell>

    <van-cell
      :title="history"
      v-for="(history, index) in searchHistories"
      :key="index"
      @click="onSearchItemClick(history, index)"
    >
      <van-icon name="close" v-show="isDeleteShow" />
    </van-cell>
  </div>
</template>

<script>
export default {
  name: "SearchHistory",

  components: {},
  props: {
    searchHistories: {
      type: Array,
      required: true,
    },
  },
  directives: {},

  data() {
    return {
      isDeleteShow: false, // 控制删除按钮显示状态
    };
  },

  mounted() {},

  methods: {
    onSearchItemClick(history, index){
      // console.log(history, index);
      if(this.isDeleteShow){
        // 删除单个
        this.searchHistories.splice(index,1)
      }else{
        //切换
        this.$emit('search', history);
      }
      
    }
  },
};
</script>

<style lang="less" scoped>
</style>