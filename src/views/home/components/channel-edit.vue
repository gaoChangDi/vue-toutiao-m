// 编辑频道列表弹出层（爸）
<template>
  <div class="channel-edit">
    <!-- 1.我的频道单元格 -->
    <van-cell :border="false">
      <!-- 1.1文本 -->
      <div slot="title" class="title-text">我的频道</div>
      <!-- 1.2编辑按钮 -->
      <van-button
        type="danger"
        plain
        round
        size="mini"
        @click="isEdit = !isEdit"
        >{{ isEdit ? "完成" : "编辑" }}</van-button
      >
    </van-cell>

    <!-- 2.我的频道宫格导航 -->
    <van-grid :gutter="10">
      <!-- 2.1宫格item项 -->
      <van-grid-item
        v-for="(channel, index) in myChannels"
        :key="index"
        @click="onMyChannelClick(channel, index)"
      >
        <!-- 2.1.1自定义控制图标 -->
        <van-icon
          v-show="isEdit && !fiexdChannels.includes(channel.id)"
          slot="icon"
          name="close"
        ></van-icon>

        <!-- 2.1.2文本样式 -->
        <span
          slot="text"
          class="my-text"
          :class="{ active: index === active }"
          >{{ channel.name }}</span
        >
      </van-grid-item>
    </van-grid>

    <!--3. 频道推荐单元格 -->
    <van-cell :border="false">
      <!-- 3.1文本 -->
      <div slot="title" class="title-text">频道推荐</div>
    </van-cell>

    <!-- 4.频道推荐宫格导航 -->
    <van-grid :gutter="10" class="recommend-grid">
      <!-- 4.1宫格item项 -->
      <van-grid-item
        icon="plus"
        :text="channel.name"
        v-for="(channel, index) in recommendChannels"
        :key="index"
        @click="onAddChannel(channel)"
      />
    </van-grid>
  </div>
</template>

<script>
// 全部频道列表接口getAllChannels
// 批量修改用户频道列表（部分覆盖）addUserChannel
// 删除指定用户频道deleteUserChannel
import {
  getAllChannels,
  addUserChannel,
  deleteUserChannel,
} from "@/api/channel";
// 获取user数据
import { mapState } from "vuex";
// 将myChannels数据放本地存储（属性名TOUTIAO_CHANNELS）
import { setItem } from "@/utils/storage";

export default {
  name: "ChannelEdit",
  props: {
    // 我的频道列表数据
    myChannels: {
      type: Array,
      required: true,
    },
    // 激活频道项
    active: {
      type: Number,
      require: true,
    },
  },
  data() {
    return {
      allChannels: [], // 所有频道
      isEdit: false, // 控制编辑按钮状态的显示
      fiexdChannels: [0, 4], // 固定频道(根据id控制)，不允许删除
    };
  },
  created() {
    this.loadAllChannels();
  },
  computed: {
    ...mapState(["user"]),
    // 频道推荐 = 所有频道列表 - 我的频道
    recommendChannels() {
      // const channels = [];
      // this.allChannels.forEach((item1) => {
      //   const ret = this.myChannels.find((item2) => {
      //     return item2.id === item1.id;
      //   });
      //   if (!ret) {
      //     channels.push(item1);
      //   }
      // });
      // return channels;
      return this.allChannels.filter((channel) => {
        // 数组的 filter 方法：遍历数组，把符合条件的元素存储到新数组中并返回
        // 数组的 find 方法：遍历数组，把符合条件的第1个元素返回
        return !this.myChannels.find((myChannel) => {
          return myChannel.id === channel.id;
        });
      });
    },
  },
  methods: {
    // 获取所有列表数据
    async loadAllChannels() {
      try {
        const { data } = await getAllChannels();
        console.log(data);
        this.allChannels = data.data.channels;
      } catch (err) {
        this.$toast("全部频道获取失败");
      }
    },
    // 频道推荐 追加到  我的频道
    async onAddChannel(channel) {
      // console.log(channel);
      this.myChannels.push(channel);

      // 添加频道持久化
      if (this.user) {
        // 添加频道：已登录状态
        try {
          await addUserChannel({
            id: channel.id,
            seq: this.myChannels.length,
          });
        } catch (err) {
          this.$toast("修改用户频道列表失败");
        }
      } else {
        // 添加频道：未登录状态
        setItem("TOUTIAO_CHANNELS", this.myChannels);
      }
    },
    // 我的频道切换 + 删除事件
    onMyChannelClick(channel, index) {
      // console.log(channel, index);
      if (this.isEdit) {
        // 1.删除
        // 1.1如果是固定频道，则不删除
        if (this.fiexdChannels.includes(channel.id)) {
          return;
        }
        // 1.2如果删除的激活频道之前的频道，则更新激活的频道项
        if (index <= this.active) {
          this.$emit("update-active", this.active - 1, true);
        }
        // 1.3删除频道项
        this.myChannels.splice(index, 1);
        // 1.4. 处理持久化
        this.deleteChannel(channel);
      } else {
        // 2.切换
        this.$emit("update-active", index, false);
      }
    },
    // 删除频道持久化
    async deleteChannel(channel) {
      if (this.user) {
        // 添加频道：已登录状态
        try {
          await deleteUserChannel(channel.id);
        } catch (err) {
          this.$toast("删除用户频道列表失败");
        }
      } else {
        // 添加频道：未登录状态
        setItem("TOUTIAO_CHANNELS", this.myChannels);
      }
    },
  },
};
</script>

<style lang="less" scoped>
.channel-edit {
  padding: 85px 0;
  // 标题
  .title-text {
    font-size: 32px;
    color: #333333;
  }
  // 编辑按钮
  .van-button {
    width: 104px;
    height: 48px;
    font-size: 26px;
    color: #f85959;
    border: 1px solid #f85959;
  }

  // 我的频道
  /deep/.van-grid-item {
    width: 160px;
    height: 86px;
    .van-grid-item__icon-wrapper {
      position: unset;
    }
    .van-grid-item__content {
      background-color: #f4f5f6;
      // 阻止换行
      white-space: nowrap;
      .van-icon-close {
        position: absolute;
        right: -10px;
        top: -10px;
        z-index: 2;
        font-size: 33px;
      }
      .van-grid-item__text,
      .my-text {
        font-size: 28px;
        color: #222;
        margin-top: 0;
      }
      .active {
        color: red;
      }
    }
  }
  // 频道列表
  /deep/.recommend-grid {
    .van-grid-item__content {
      flex-direction: row;
      .van-icon-plus {
        font-size: 28px;
        margin-right: 6px;
      }
    }
  }
}
</style>