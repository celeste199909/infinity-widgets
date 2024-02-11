<!-- GithubContributions.vue -->
<template>
  <!-- 无样式 -->
  <div
    v-if="!widgetData.style"
    class="rounded-xl bg-blue-400 backdrop-blur-sm flex justify-center items-center"
    :style="{
      width: widgetData.size.w + 'px',
      height: widgetData.size.h + 'px',
    }"
  >
    <img
      class="w-14 h-14"
      draggable="false"
      src="../../../assets/icons/paint-palette-96.png"
    />
  </div>
  <!-- 有样式 -->
  <div
    v-else
    :style="{
      width: widgetData.style[widgetData.currentStyle].w + 'px',
      height: widgetData.style[widgetData.currentStyle].h + 'px',
    }"
    class="rounded-xl border flex justify-center items-center bg-white"
  >
    <!-- graph -->
    <div
      class="w-fit pt-4 h-fit flex flex-col justify-center items-start space-y-1 relative"
    >
      <!-- 用户名 -->
      <div
        class="absolute -top-2 left-2 text-[12px] text-gray-500 underline cursor-pointer hover:text-gray-800"
        @click="openGithub"
      >
        @{{ username }}
      </div>
      <!-- 星期 -->
      <div
        class="absolute -left-4 top-0 text-[12px] flex flex-col h-full justify-evenly"
      >
        <div>一</div>
        <div>三</div>
        <div>五</div>
      </div>
      <!-- 格子 -->
      <div
        v-for="rowItem in contributionsData"
        class="w-fit h-fit flex flex-row justify-start items-center space-x-1"
      >
        <template v-for="cellItem in rowItem">
          <div
            v-if="cellItem"
            class="w-[10px] h-[10px] rounded-[2px] border-1 border-[#DFE1E4]"
            :style="{ 'background-color': colors[Number(cellItem)] }"
          ></div>
          <div
            v-else
            class="w-[10px] h-[10px] rounded-[2px] bg-transparent"
          ></div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, onMounted } from "vue";

const props = defineProps({
  widgetData: {
    type: Object,
    required: true,
  },
  modifyWidgetData: {
    type: Function,
    required: false,
  },
});

const contributionsData = ref([
  [
    null,
    "0",
    "1",
    "1",
    "0",
    "1",
    "1",
    "1",
    "1",
    "3",
    "1",
    "2",
    "2",
    "1",
    "1",
    "2",
    "1",
    "1",
    "1",
    "1",
    "1",
    "2",
    "2",
    "1",
    "1",
    "3",
    "2",
    "3",
    "1",
    "2",
    "2",
    "1",
    "1",
    "1",
    "1",
    "2",
    "1",
    "1",
    "1",
    "1",
    "1",
    "1",
    "1",
    "2",
    "2",
    "1",
    "1",
    "1",
    "1",
    "4",
    "1",
    "1",
    "3",
    "1",
  ],
  [
    null,
    "1",
    "1",
    "3",
    "2",
    "1",
    "2",
    "2",
    "2",
    "1",
    "1",
    "2",
    "1",
    "1",
    "1",
    "1",
    "1",
    "2",
    "1",
    "1",
    "2",
    "1",
    "2",
    "1",
    "1",
    "1",
    "1",
    "3",
    "2",
    "2",
    "1",
    "1",
    "2",
    "2",
    "1",
    "2",
    "1",
    "2",
    "1",
    "1",
    "3",
    "2",
    "2",
    "4",
    "2",
    "1",
    "2",
    "2",
    "3",
    "3",
    "2",
    "1",
    "2",
    null,
  ],
  [
    null,
    "1",
    "1",
    "2",
    "1",
    "2",
    "2",
    "2",
    "3",
    "2",
    "3",
    "1",
    "2",
    "2",
    "2",
    "3",
    "2",
    "1",
    "1",
    "1",
    "1",
    "2",
    "1",
    "2",
    "2",
    "2",
    "1",
    "2",
    "1",
    "3",
    "2",
    "2",
    "3",
    "1",
    "1",
    "1",
    "2",
    "1",
    "1",
    "1",
    "2",
    "2",
    "1",
    "2",
    "3",
    "1",
    "2",
    "2",
    "3",
    "3",
    "1",
    "1",
    "2",
    null,
  ],
  [
    null,
    "1",
    "3",
    "1",
    "1",
    "1",
    "1",
    "1",
    "2",
    "3",
    "1",
    "1",
    "1",
    "2",
    "2",
    "1",
    "2",
    "2",
    "1",
    "2",
    "2",
    "2",
    "2",
    "2",
    "1",
    "2",
    "2",
    "1",
    "1",
    "1",
    "2",
    "1",
    "2",
    "2",
    "1",
    "2",
    "1",
    "1",
    "1",
    "1",
    "2",
    "2",
    "1",
    "1",
    "2",
    "3",
    "4",
    "1",
    "2",
    "4",
    "1",
    "1",
    "1",
    null,
  ],
  [
    null,
    "3",
    "3",
    "1",
    "2",
    "2",
    "2",
    "2",
    "3",
    "4",
    "2",
    "1",
    "1",
    "1",
    "1",
    "1",
    "1",
    "1",
    "1",
    "1",
    "1",
    "1",
    "2",
    "3",
    "1",
    "1",
    "2",
    "2",
    "1",
    "4",
    "2",
    "2",
    "1",
    "2",
    "1",
    "1",
    "1",
    "2",
    "2",
    "4",
    "4",
    "4",
    "3",
    "4",
    "2",
    "2",
    "3",
    "1",
    "2",
    "2",
    "2",
    "1",
    "1",
    null,
  ],
  [
    null,
    "1",
    "3",
    "1",
    "1",
    "1",
    "1",
    "1",
    "2",
    "3",
    "1",
    "1",
    "1",
    "1",
    "1",
    "1",
    "1",
    "2",
    "2",
    "2",
    "2",
    "1",
    "1",
    "1",
    "1",
    "1",
    "4",
    "1",
    "3",
    "2",
    "1",
    "1",
    "3",
    "3",
    "1",
    "2",
    "1",
    "1",
    "2",
    "2",
    "4",
    "2",
    "2",
    "2",
    "3",
    "1",
    "2",
    "1",
    "3",
    "2",
    "3",
    "4",
    "1",
    null,
  ],
  [
    null,
    "1",
    "1",
    "1",
    "1",
    "2",
    "1",
    "1",
    "1",
    "1",
    "1",
    "2",
    "2",
    "1",
    "1",
    "1",
    "1",
    "1",
    "1",
    "1",
    "2",
    "1",
    "1",
    "1",
    "1",
    "1",
    "2",
    "1",
    "2",
    "1",
    "1",
    "1",
    "2",
    "1",
    "2",
    "1",
    "1",
    "1",
    "1",
    "3",
    "2",
    "2",
    "2",
    "1",
    "4",
    "1",
    "1",
    "1",
    "1",
    "1",
    "1",
    "1",
    "1",
    null,
  ],
]);
const colors = ["#EBEDF0", "#9BE9A8", "#40C463", "#30A14E", "#216E39"];

// const url =
//   "https://service-6db672ow-1322077646.gz.tencentapigw.com.cn/release/api/github-contributions";
const username = "celeste199909";

// onMounted(() => {
//   fetch(`${url}?username=${username}`)
//     .then((res) => {
//       return res.json();
//     })
//     .then((data) => {
//       console.log(data);
//       contributionsData.value = data.data[0];
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

function openGithub() {
  const url = "https://github.com/" + username;
  utools.shellOpenExternal(url);
}
</script>
<style scoped></style>
