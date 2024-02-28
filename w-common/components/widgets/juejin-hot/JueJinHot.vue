<!-- GithubContributions.vue -->
<template>
  <!-- 有样式 -->
  <div
    :style="{
      width: widgetData.style[widgetData.currentStyle].w + 'px',
      height: widgetData.style[widgetData.currentStyle].h + 'px',
    }"
    class="p-[10px] w-full h-full overflow-y-scroll rounded-xl flex flex-col justify-center items-center text-white bg-gradient-to-tr from-blue-500 to-sky-500 gap-y-[1px]"
  >
    <slot></slot>
    <!-- 首次无任何数据时,显示加载动画 -->
    <Loader v-if="isFirstLoading" />
    <!-- 无任何数据时 且 不是在首次加载中 -->
    <LoadFailed
      v-else-if="hotArticles.list.length === 0"
      :retryFn="loadData"
      :btnColor="'#ffffff'"
    />
    <!-- 内容, 如果有数据 -->
    <div
      v-else
      class="w-full h-full overflow-y-scroll flex flex-col justify-start items-start gap-y-[5px]"
    >
      <div
        v-for="item in hotArticles.list"
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
      <!-- 更新时间 不需要日期， 只需要时和分-->
      <div
        class="text-sm my-1 text-[#ffffff] flex flex-row justify-start items-center gap-x-1"
      >
        <div>
          更新于: {{ new Date(hotArticles.updateTime).toLocaleTimeString() }}
        </div>
        <!-- <Icon class="w-4 h-4 cursor-pointer" name="redo" color="#ffffff" @click="loadData" /> -->
      </div>
    </div>
  </div>
</template>

<!-- 更新内容：无感更新，用户体验更好 -->

<script setup lang="ts">
import { defineProps, ref, onMounted, Ref, computed, onBeforeUnmount } from "vue";
import Loader from "../../Loader.vue";
import LoadFailed from "../../LoadFailed.vue";
import { getRandomUA } from "../../../utils/getRandomUA";
import _ from "lodash";
// import Icon from "../../icon/Icon.vue";

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

interface HotArticle {
  rank: string;
  link: string;
  title: string;
  authorImg: string;
  authorName: string;
  hotNumber: string;
}

interface HotArticleData {
  list: HotArticle[];
  updateTime: number;
}

const isFirstLoading = ref(false);
const isLoadFailed = ref(false);
const intervalId = ref<number | null | NodeJS.Timeout>(null);

const hotArticles: Ref<HotArticleData> = ref({
  list: [],
  updateTime: 0,
});
const lastHotArticles: Ref<HotArticleData> = ref(
  props.widgetData.data.lastHotArticles || {
    list: [],
    updateTime: 0,
  }
);

const isOnEdit = computed(() => {
  return props.widgetData.draggable;
});

onMounted(async () => {
  // 如果没有数据, 则加载数据
  if (lastHotArticles.value.list.length === 0) {
    loadData();
  }
  // 如果有数据，
  if (lastHotArticles.value.list.length !== 0) {
    // 判断上次更新时间是否超过1小时
    const now = Date.now();
    const lastUpdateTime = lastHotArticles.value.updateTime;
    const isOverOneHour = now - lastUpdateTime > 1000 * 60 * 60;
    // const isOverOneHour = now - lastUpdateTime > 1000 * 30;

    // 但是超过1小时，也加载数据
    if (isOverOneHour) {
      // utools.showNotification("数据超过30秒 正在加载数据...");
      loadData();
    } else {
      // 否则，使用上次数据
      hotArticles.value = lastHotArticles.value;
      // utools.showNotification("未超过30秒,使用上次数据");
    }
  }
  intervalId.value = setInterval(loadData, 1000 * 60 * 60);
  // intervalId.value = setInterval(loadData, 1000 * 30);
});

onBeforeUnmount(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
  }
});

// 获取并更新数据
async function loadData() {
  // hotArticleList.value = [];
  try {
    // 首次加载中
    if (lastHotArticles.value.list.length === 0) {
      isFirstLoading.value = true;
      // utools.showNotification("首次加载中...");
    } else {
      // utools.showNotification("非首次加载中...");
    }

    isLoadFailed.value = false;
    const res = await fetchHotArticle();

    // 更新数据
    hotArticles.value.list = res.slice(0, 10);
    hotArticles.value.updateTime = Date.now();
    // 保存最近数据
    lastHotArticles.value.list = hotArticles.value.list;
    lastHotArticles.value.updateTime = hotArticles.value.updateTime;

    // 保存数据
    const widgetData = _.cloneDeep(props.widgetData);
    widgetData.data.lastHotArticles = lastHotArticles.value;
    if (props.modifyWidgetData) {
      props.modifyWidgetData(widgetData);
    }
  } catch (error) {
    console.log(
      "%c [ error ]-114",
      "font-size:13px; background:pink; color:#bf2c9f;",
      error
    );
    // 加载失败 读取上次数据
    if (lastHotArticles.value.list.length > 0) {
      hotArticles.value.list = lastHotArticles.value.list;
      hotArticles.value.updateTime = lastHotArticles.value.updateTime;
    } else {
      // 无数据 且 加载失败
      isLoadFailed.value = true;
    }
  } finally {
    isFirstLoading.value = false;
    // utools.clearUBrowserCache();
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
