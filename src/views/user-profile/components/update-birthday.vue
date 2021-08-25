<template>
  <div class="update-birthday">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      title="选择年月日"
      :min-date="minDate"
      :max-date="maxDate"
      @cancel="$emit('close')"
      @confirm="onConfirm"
    />
  </div>
</template>

<script>
import { updateUserProfile } from "@/api/user";
import dayjs from "dayjs";
export default {
  name: "UpdateBirthday",

  components: {},
  model: {
    prop: "userBirthday", // 默认是 value
    event: "editUserBirthday", // 默认是 input
  },
  props: {
    userBirthday: {
      type: String,
      required: true,
    },
  },
  directives: {},

  data() {
    return {
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(),
      currentDate: new Date(this.userBirthday),
    };
  },

  mounted() {},

  methods: {
    async onConfirm() {
         this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示
      })
      try {
        const currentDate = dayjs(this.currentDate).format("YYYY-MM-DD");
        const { data } = await updateUserProfile({
          birthday: currentDate,
        });
        console.log(data);

        
        // 更新视图
        this.$emit('editUserBirthday', currentDate)

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