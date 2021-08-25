<template>
  <div class="user-profile">
    <!-- 1.导航栏 -->
    <van-nav-bar
      class="page-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />

    <!-- 2.个人信息 -->
    <!-- 头像 -->
    <van-cell title="头像" is-link @click="$refs.file.click()">
      <van-image class="avatar" fit="cover" round :src="user.photo" />
    </van-cell>
    <!-- 头像选择file文件 -->
    <input type="file" hidden ref="file" @change="onFileChange">
     <!-- 编辑头像弹出层 -->
    <van-popup
      v-model="isUpdatePhotoShow"
      style="height: 100%"
      position="bottom"
    >
      <update-photo
        v-if="isUpdatePhotoShow"
        @close="isUpdatePhotoShow = false"
        :img="img"
        @update-photo="user.photo = $event"
      />
    </van-popup>

    <!-- 昵称 -->
    <van-cell
      title="昵称"
      is-link
      :value="user.name"
      @click="isUpdateNameShow = true"
    >
    </van-cell>
     <!-- 编辑昵称弹出层 -->
    <van-popup
      v-model="isUpdateNameShow"
      style="height: 100%"
      position="bottom"
    >
      <update-name
        v-if="isUpdateNameShow"
        @close="isUpdateNameShow = false"
        v-model="user.name"
      />
    </van-popup>


    <!-- 性别 -->
    <van-cell
      title="性别"
      is-link
      :value="user.gender === 1 ? '女' : '男'"
      @click="isUpdateGenderShow = true"
    ></van-cell>
    <!-- 编辑性别弹出层 -->
    <van-popup v-model="isUpdateGenderShow" position="bottom">
      <update-gender
        v-if="isUpdateGenderShow"
        v-model="user.gender"
        @close="isUpdateGenderShow = false"
      />
    </van-popup>


    <!-- 生日 -->
    <van-cell
      title="生日"
      is-link
      :value="user.birthday"
      @click="isUpdateBirthdayShow = true"
    ></van-cell>
 <!-- 编辑生日弹出层 -->
    <van-popup v-model="isUpdateBirthdayShow" position="bottom">
      <update-birthday
        v-if="isUpdateBirthdayShow"
        v-model="user.birthday"
        @close="isUpdateBirthdayShow = false"
      />
    </van-popup>
  </div>
</template>

<script>
//获取用户个人资料接口
import { getUserProfile } from "@/api/user";
//编辑头像弹出层
import UpdatePhoto from './components/update-photo'
//编辑昵称弹出层
import UpdateName from "./components/update-name";
//编辑性别弹出层
import UpdateGender from "./components/update-gender";
//编辑生日弹出层
import UpdateBirthday from "./components/update-birthday";


export default {
  name: "UserProfile",
  components: {
    UpdatePhoto,
    UpdateName,
    UpdateGender,
    UpdateBirthday,
  },
  directives: {},
  data() {
    return {
      user: {}, // 个人信息
      isUpdatePhotoShow:false,
      isUpdateNameShow: false,
      isUpdateGenderShow: false,
      isUpdateBirthdayShow: false,
      img:null
    };
  },
  created() {
    this.loadUserProfile();
  },
  mounted() {},

  methods: {
    async loadUserProfile() {
      try {
        const { data } = await getUserProfile();
        console.log(data);
        this.user = data.data;
      } catch (err) {
        console.log(err);
      }
    },
    onFileChange(){
      // 获取文件对象
      const file = this.$refs.file.files[0]
      console.log(file);

      // 基于文章对象获取 blob 数据
      this.img = window.URL.createObjectURL(file)
      console.log(this.img);

       // 展示预览图片弹出层
      this.isUpdatePhotoShow = true

      // file-input 如果选了同一个文件不会触发 change 事件
      // 解决办法就是每次使用完毕，把它的 value 清空
      console.log(this.$refs.file.value);
      this.$refs.file.value = ''
      
    }
  },
};
</script>

<style lang="less" scoped>
/deep/.van-icon-arrow-left {
  color: #fff;
}
.user-profile {
  .avatar {
    width: 60px;
    height: 60px;
  }

  .van-popup {
    background-color: #f5f7f9;
  }
}
</style>