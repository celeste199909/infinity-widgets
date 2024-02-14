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
    class="p-[10px] w-full h-full overflow-y-scroll rounded-xl border flex flex-col justify-start items-start bg-slate-100 gap-y-[1px]"
  >
    <div
      v-for="item in hotArticleList"
      class="w-full flex flex-row flex-nowrap justify-start items-center gap-x-[6px]"
    >
      <div class="text-red-400 text-sm font-bold">
        {{ item.rank }}
      </div>
      <div
        class="truncate text-gray-800 text-sm cursor-pointer"
        @click="openLink(item.link)"
      >
        {{ item.title }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, onMounted, Ref, computed } from "vue";

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

const url = "https://juejin.cn/hot/articles";
const hotArticleList: Ref<any[]> = ref([]);
const isOnEdit = computed(() => {
  return props.widgetData.draggable;
});

onMounted(async () => {
  const res = await fetchHotArticle(url);
  console.log(
    "%c [ res ]-63",
    "font-size:13px; background:pink; color:#bf2c9f;",
    res
  );
  hotArticleList.value = res;
});

async function fetchHotArticle(url: string) {
  const data = await utools.ubrowser
    .goto(url)
    .hide()
    .wait(".hot-list")
    .evaluate(() => {
      const list = Array.from(
        document.querySelectorAll(".hot-list a.article-item-link")
      )
        .map((aEl) => {
          const rank = aEl.querySelector(".article-number")?.textContent || "";
          const link = aEl.getAttribute("href") || "";
          const title =
            aEl.querySelector(".article-detail .article-title")?.textContent ||
            "";
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
    .run({ show: false, width: 1000, height: 600 });

  const res = data[0].filter((item: any) => item);
  return res;
}

function openLink(link: string) {
  if (isOnEdit.value) return;
  const baseUri = "https://juejin.cn";
  console.log(
    "%c [ baseUri + link ]-97",
    "font-size:13px; background:pink; color:#bf2c9f;",
    baseUri + link
  );
  utools.shellOpenExternal(baseUri + link);
}
</script>
<style scoped></style>
