<template>
  <!-- 一张卡片 -->
  <div
    class="suggetion-card text-[14px] w-60 max-w-60 text-slate-600 dark:text-slate-400 rounded-lg  dark:bg-slate-700 p-5 flex flex-col gap-y-2"
    :class="
      version === '未实现'
        ? 'border-2 border-slate-200 dark:border-slate-500'
        : 'border-2 border-[#8d8df9] dark:border-[#8d8df9]'
    "
  >
    <!-- 头像和用户名 -->
    <div class="flex flex-row justify-start items-center gap-x-3">
      <div
        class="w-12 h-12 rounded-full overflow-hidden flex justify-center items-center"
      >
        <img :src="getAvatarUrl(avatar)" />
      </div>
      <div class="font-bold">{{ username }}</div>
    </div>
    <!-- 意见 -->
    <div :class="{ 'whitespace-pre-line': suggetion.length > 10 }">
      {{ suggetion }}
    </div>
    <!-- 交易 -->
    <!-- <div v-if="trade" :class="{ 'whitespace-pre-line': suggetion.length > 10 }">
      py交易：{{ trade }}
    </div> -->
    <!-- 时间 版本-->
    <div
      class="text-slate-500 text-[12px] flex flex-row justify-between items-center"
    >
      <div class="text-slate-500 text-[12px]">{{ time }}</div>
      <div class="font-bold">v: {{ version }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  avatar: {
    type: String,
    default: "user.png",
  },
  username: {
    type: String,
    default: "用户名",
  },
  suggetion: {
    type: String,
    default: "意见",
  },
  trade: {
    type: String,
    default: "",
  },
  time: {
    type: String,
    default: "2024-02-20 18:19",
  },
  version: {
    type: String,
    default: "1.2.0",
  },
});

function getAvatarUrl(avatar: string) {
  return new URL(`/w-common/assets/users/${avatar}`, import.meta.url).href;
}

// function getLocalImage(name: string) {
//   return new URL(`/w-common/assets/icons/weather/${name}.svg`, import.meta.url)
//     .href;
// }
</script>

<style scoped>
.suggetion-card {
  /* filter: drop-shadow(6px 6px 1rem rgba(0, 0, 0, 0.2)); */

  box-shadow: 0px 0px 1rem rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}
.suggetion-card:hover {
  /* box-shadow: 0px 0px 1rem rgba(0, 0, 0, 0.2); */
  transform: scale(0.98);
}
</style>
