<template>
  <div class="update-gender">
    <!-- 点击取消按钮触发 cancel 事件 -->
    <!-- 点击确认按钮触发 confirm 事件 -->
    <van-picker
      title="性别"
      show-toolbar
      :columns="columns"
      :default-index="userGender"
      @confirm="onConfirm"
      @cancel="$emit('close')"
    />
  </div>
</template>

<script>
import { updateUserProfile } from "@/api/user";
export default {
  name: "UpdateGender",

  components: {},
  model: {
    prop: "userGender", // 默认是 value
    event: "editUserGender", // 默认是 input
  },
  props: {
    userGender: {
      type: Number,
      required: true,
    },
  },
  directives: {},

  data() {
    return {
      columns: ["男", "女"],
    };
  },

  mounted() {},

  methods: {
    async onConfirm(value, index) {
      // console.log(`当前值：${value}, 当前索引：${index}`);

      this.$toast.loading({
        message: "保存中...",
        forbidClick: true, // 禁止背景点击
        duration: 0, // 持续展示
      });
      try {
        const { data } = await updateUserProfile({
          gender: index,
        });
        console.log(data);
        // 更新视图
        this.$emit('editUserGender', index)

        // 关闭弹层
        this.$emit('close')

        // 提示成功
        this.$toast.success('更新成功')
      } catch (err) {
        console.log(err);
         this.$toast.fail('更新失败')
      }
    },
  },
};
</script>

<style lang="less" scoped>
</style>