<!-- GithubContributions.vue -->
<template>
  <!-- 无样式 -->
  <div
    v-if="!widgetData.style"
    class="wrapper-card bg-white border-2 rounded-xl flex justify-center items-center"
    :style="{
      width: widgetData.size.w + 'px',
      height: widgetData.size.h + 'px',
    }"
  >
    <div
      class="w-18 h-18 rounded-full backdrop-blur-[10px] flex justify-center items-center"
    >
      <img
        class="rounded-xl w-14 h-14"
        src="../../../assets/icons/weibo.png"
        alt=""
      />
    </div>
  </div>
  <!-- 有样式 -->
  <div
    v-else
    :style="{
      width: widgetData.style[widgetData.currentStyle].w + 'px',
      height: widgetData.style[widgetData.currentStyle].h + 'px',
    }"
    class="p-[10px] w-full h-full overflow-y-hidden rounded-xl flex flex-col justify-center items-center text-white bg-gradient-to-r from-orange-600 to-amber-500 gap-y-[1px]"
  >
    <!-- 加载动画 -->
    <Loader v-if="isLoading" />
    <!-- 内容 --> 
    <div
      v-else-if="!isLoadFailed && hotSearchList"
      class="w-full h-full overflow-y-scroll flex flex-col justify-start items-start gap-y-[5px]"
    >
      <div
        v-for="item in hotSearchList"
        class="w-full flex flex-row flex-nowrap justify-start items-center gap-x-[6px]"
      >
        <div class="text-sm">
          {{ item.rank }}
        </div>
        <div
          class="truncate text-sm cursor-pointer"
          @click="openLink(item.link)"
        >
          {{ item.title }}
        </div>
      </div>
    </div>
    <!-- 加载失败 -->
    <LoadFailed v-else :retryFn="loadData" :retryBtnStyle="'circle-white'" />
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, onMounted, Ref, computed, onBeforeMount } from "vue";
import Loader from "../../Loader.vue";
import LoadFailed from "../../LoadFailed.vue";

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

const isLoading = ref(false);
const isLoadFailed = ref(false);
const intervalTimer = ref<number | null>(null);
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
const isOnEdit = computed(() => {
  return props.widgetData.draggable;
});

onMounted(async () => {
  if (props.widgetData.style) {
    loadData();
    intervalTimer.value = setInterval(loadData, 1000 * 60 * 60);
  }
});

onBeforeMount(() => {
  if (intervalTimer.value) {
    clearInterval(intervalTimer.value);
  }
  utools.clearUBrowserCache();
});

// 获取并更新数据
async function loadData() {
  hotSearchList.value = [];
  try {
    // 加载中
    isLoading.value = true;
    isLoadFailed.value = false;
    const res = await fetchHotSearch();
    hotSearchList.value = res.slice(0, 10);
  } catch (error) {
    isLoadFailed.value = true;
  } finally {
    isLoading.value = false;
    utools.clearUBrowserCache();
  }
}

// 获取数据
async function fetchHotSearch(cate: string = "realtimehot") {
  let data;
  try {
    data = await utools.ubrowser
      .goto(
        `https://s.weibo.com/top/summary?cate=${cate}`,
        { Referer: "", userAgent: "" },
        10000
      )
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
          .slice(0, 15);
        return list;
      })
      .run({ show: false, width: 1000, height: 600 });

    const res = data[0].filter((item: any) => item);
    return res;
  } catch (error) {
    return Error("获取数据失败");
  }
}

function openLink(link: string) {
  if (isOnEdit.value) return;
  const baseUri = "https://s.weibo.com";
  utools.shellOpenExternal(baseUri + link);
}
</script>
<style scoped></style>
