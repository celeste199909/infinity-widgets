<!-- GithubContributions.vue -->
<template>
  <!-- 无样式 -->
  <div
    v-if="!widgetData.style"
    class="wrapper-card rounded-xl flex justify-center items-center"
    :style="{
      width: widgetData.size.w + 'px',
      height: widgetData.size.h + 'px',
    }"
  ></div>
  <!-- 有样式 -->
  <div
    v-else
    :style="{
      width: widgetData.style[widgetData.currentStyle].w + 'px',
      height: widgetData.style[widgetData.currentStyle].h + 'px',
    }"
    class="p-[10px] w-full h-full overflow-y-scroll rounded-xl border flex flex-col justify-start items-start bg-slate-100 gap-y-[1px]"
  >
    <div
      v-for="item in hotSearchList"
      class="w-full flex flex-row flex-nowrap justify-start items-center gap-x-[6px]"
    >
      <div class="text-red-400 text-sm font-bold">
        {{ item.rank }}
      </div>
      <div class="truncate text-gray-800  text-sm cursor-pointer" @click="openLink(item.link)">
        {{ item.title }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, onMounted, Ref } from "vue";

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

const url = "https://s.weibo.com/top/summary";
const cate = "realtimehot";
const cateMap = new Map([
  ["热搜", "realtimehot"],
  ["要闻", "socialevent"],
  ["文娱", "entrank"],
  ["体育", "sport"],
  ["游戏", "game"],
]);

const hotSearchList: Ref<any[]> = ref([]);

onMounted(async () => {
  const res = await fetchHotSearch();
  console.log(
    "%c [ res ]-63",
    "font-size:13px; background:pink; color:#bf2c9f;",
    res
  );

  hotSearchList.value = res;
});

async function fetchHotSearch(cate: string = "realtimehot") {
  const data = await utools.ubrowser
    .goto(`https://s.weibo.com/top/summary?cate=${cate}`)
    .hide()
    .wait(".m-wrap table tbody")
    .evaluate(() => {
      const list = Array.from(
        document.querySelectorAll(".m-wrap table tbody tr")
      )
        .map((tr) => {
          const isAd = tr.querySelector(".td-01 i");
          const rank = tr.querySelector(".td-01")?.textContent || "";
          // 排名不是广告
          if (!isAd && !isNaN(Number(rank))) {
            const aEl = tr.querySelector(".td-02 a");
            return {
              rank: rank,
              link: aEl?.getAttribute("href") || "",
              title: aEl?.textContent || "",
              hot: tr.querySelector(".td-02 span")?.textContent || "",
            };
          }
        })
        .slice(0, 16);
      return list;
    })
    .run({ width: 1000, height: 600 });

  const res = data[0].filter((item: any) => item);
  return res;
}

function openLink(link: string) {
  const baseUri = "https://s.weibo.com";
  console.log(
    "%c [ baseUri + link ]-97",
    "font-size:13px; background:pink; color:#bf2c9f;",
    baseUri + link
  );
  utools.shellOpenExternal(baseUri + link);
}
</script>
<style scoped>
.wrapper-card {
  background-image: url(../../../assets/images/github-contribution.png);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: grayscale(50%);
}
</style>
