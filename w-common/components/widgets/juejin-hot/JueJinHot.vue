<!-- GithubContributions.vue -->
<template>
  <!-- 无样式 -->
  <div
    v-if="!widgetData.style"
    class="wrapper-card bg-[#1E80FF] rounded-xl flex justify-center items-center"
    :style="{
      width: widgetData.size.w + 'px',
      height: widgetData.size.h + 'px',
    }"
  >
    <div
      class="w-18 h-18 rounded-full backdrop-blur-[10px] flex justify-center items-center"
    >
      <img
        draggable="false"
        class="rounded-xl w-14 h-14"
        src="../../../assets/icons/juejin.png"
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
    class="p-[10px] w-full h-full overflow-y-scroll rounded-xl flex flex-col justify-center items-center text-white bg-gradient-to-tr from-blue-500 to-sky-500 gap-y-[1px]"
  >
    <!-- 加载动画 -->
    <Loader v-if="isLoading" />

    <!-- 内容 -->
    <div
      v-else-if="!isLoadFailed && hotArticleList.length > 0"
      class="w-full h-full overflow-y-scroll flex flex-col justify-start items-start gap-y-[5px]"
    >
      <div
        v-for="item in hotArticleList"
        class="w-full flex flex-row flex-nowrap justify-start items-center gap-x-[6px]"
      >
        <div class="text-sm font-bold">
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
    <LoadFailed v-else :retryFn="loadData" :btnColor="'#ffffff'" />
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, onMounted, Ref, computed, onBeforeMount } from "vue";
import Loader from "../../Loader.vue";
import LoadFailed from "../../LoadFailed.vue";
import { getRandomUA } from "../../../utils/getRandomUA";

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
const intervalTimer = ref<number | null | NodeJS.Timeout>(null);

const hotArticleList: Ref<any[]> = ref([]);
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
});

// 获取并更新数据
async function loadData() {
  hotArticleList.value = [];
  try {
    // 加载中
    isLoading.value = true;
    isLoadFailed.value = false;
    const res = await fetchHotArticle();
    hotArticleList.value = res.slice(0, 10);
  } catch (error) {
    isLoadFailed.value = true;
    console.log(
      "%c [ error ]-114",
      "font-size:13px; background:pink; color:#bf2c9f;",
      error
    );
  } finally {
    isLoading.value = false;
    utools.clearUBrowserCache();
  }
}

// 获取数据
async function fetchHotArticle() {
  const url = "https://juejin.cn/hot/articles";
  let data;
  try {
    data = await utools.ubrowser
      .goto(
        url,
        {
          Referer: "https://juejin.cn/",
          userAgent: getRandomUA(),
        },
        10000
      )
      .wait(".hot-list")
      .evaluate(() => {
        const list = Array.from(
          document.querySelectorAll(".hot-list a.article-item-link")
        )
          .map((aEl) => {
            const rank =
              aEl.querySelector(".article-number")?.textContent || "";
            const link = aEl.getAttribute("href") || "";
            const title =
              aEl.querySelector(".article-detail .article-title")
                ?.textContent || "";
            const authorImg =
              aEl
                .querySelector(".article-author .article-author-img img")
                ?.getAttribute("src") || "";
            const authorName =
              aEl.querySelector(".article-author .article-author-name-text")
                ?.textContent || "";
            const hotNumber =
              aEl.querySelector(".article-hot .hot-number")?.textContent || "";

            return {
              rank,
              link,
              title,
              authorImg,
              authorName,
              hotNumber,
            };
          })
          .slice(0, 15);
        return list;
      })
      .hide()
      .run({ show: false, width: 1000, height: 600 });

    const res = data[0].filter((item: any) => item);
    return res;
  } catch (error) {
    console.log(
      "%c [ error ]-174",
      "font-size:13px; background:pink; color:#bf2c9f;",
      error
    );
    throw Error(JSON.stringify(error));
  }
}

function openLink(link: string) {
  if (isOnEdit.value) return;
  const baseUri = "https://juejin.cn";
  utools.shellOpenExternal(baseUri + link);
}
</script>
<style scoped></style>
