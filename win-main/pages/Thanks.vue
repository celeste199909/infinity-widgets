<template>
  <div class="p-4 flex flex-col justify-start items-start gap-4 text-slate-600 dark:text-slate-400 ">
    <!-- 说明 -->
    <div>
      <div class="mt-2 font-bold text-[16px]">
        感谢每一位使用的朋友！感谢每一位留下评论📝的朋友！感谢所有给予好评👍的朋友！
      </div>
      <div class="mt-1 font-bold text-[12px] text-slate-500">
        以下是 <span class="font-bold">被采纳</span> 的建议，若不想被展示或信息有误可以告诉我删改
      </div>
      <!-- 卡片容器 -->
      <div class="flex flex-row justify-start items-start flex-wrap gap-6 py-4">
        <!-- 一张卡片 -->
        <SuggetionCard
          v-for="suggetion in suggetions"
          :key="suggetion.time"
          :avatar="suggetion.avatar"
          :username="suggetion.username"
          :suggetion="suggetion.suggetion"
          :trade="suggetion.trade"
          :time="suggetion.time"
          :version="suggetion.version"
        ></SuggetionCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import SuggetionCard from "./SuggetionCard.vue";

const suggetions = ref([
  {
    avatar: "hutuchong.jpg",
    username: "糊涂虫",
    suggetion: "然后组件要是能设置成置顶就好了",
    trade:"",
    time: "2024-02-20 18:19",
    version: "1.2.0",
  },
  {
    avatar: "wuhen.jpg",
    username: "无痕",
    suggetion: "喜欢，电子木鱼搞一个！",
    trade:"⭐⭐⭐⭐⭐",
    time: "2024-02-26 15:57",
    version: "1.3.0",
  },
  {
    avatar: "hutuchong.jpg",
    username: "糊涂虫",
    suggetion: "开启和关闭编辑模式的开关只需要一个就够了",
    trade:"",
    time: "2024-02-20 18:43",
    version: "1.3.0",
  },
  {
    avatar: "hutuchong.jpg",
    username: "糊涂虫",
    suggetion: "天气超级难选，而且不能取消，只要点了定位就必须重新再选一遍，期待更复杂的天气组件",
    trade:"",
    time: "2024-02-20 18:18",
    version: "部分实现",
  },
  {
    avatar: "wangsong.jpg",
    username: "wangsong",
    suggetion: "应用启动器可以👍能放在任务栏->图标栏 就好了，这样就可以更快捷启动常用应用",
    trade:"",
    time: "2024-02-23 16:59",
    version: "未实现",
  },
  {
    avatar: "avatar.png",
    username: "吴道子",
    suggetion: "木鱼能弄成敲击一个键盘按键就功德+1吗 按鼠标太累了",
    trade:"",
    time: "2024-02-29 17:17",
    version: "1.3.2",
  },
])

</script>
<style scoped>
.container > div {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
}

.container div {
  display: flex;
  cursor: pointer;
  font-weight: 500;
  position: relative;
  overflow: hidden;
  margin-bottom: 0.375em;
}

.container div div {
  position: absolute;
  left: -9999px;
}

.container div.current + span {
  background-color: #8f8ffc;
  color: white;
}

.container div.current + span:before {
  box-shadow: inset 0 0 0 0.4375em #575793;
}

.container span {
  display: flex;
  align-items: center;
  padding: 0.375em 0.75em 0.375em 0.375em;
  border-radius: 99em;
  transition: 0.25s ease;
  color: #8282ff;
}

.container span:hover {
  background-color: #d6d6e5be;
}
.dark .container span:hover {
  background-color: #51516b;
}

.container span:before {
  display: flex;
  flex-shrink: 0;
  content: "";
  background-color: #fff;
  width: 1.5em;
  height: 1.5em;
  border-radius: 50%;
  margin-right: 0.375em;
  transition: 0.25s ease;
  box-shadow: inset 0 0 0 0.125em #2e2e60;
}
</style>
