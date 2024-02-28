<!-- GithubContributions.vue -->
<template>
  <!-- 有样式 -->
  <div
    :style="{
      width: widgetData.style[widgetData.currentStyle].w + 'px',
      height: widgetData.style[widgetData.currentStyle].h + 'px',
    }"
    class="p-[10px] w-full h-full overflow-y-hidden rounded-xl flex flex-col justify-center items-center text-white bg-gradient-to-r from-orange-600 to-amber-500 gap-y-[1px]"
  >
    <slot></slot>
    <!-- 加载动画 -->
    <Loader v-if="isFirstLoading" />
    <LoadFailed
      v-else-if="hotSearch.list.length === 0"
      :retryFn="loadData"
      :btnColor="'#ffffff'"
    />
    <!-- 内容 -->
    <div
      v-else
      class="w-full h-full overflow-y-scroll flex flex-col justify-start items-start gap-y-[5px]"
    >
      <div
        v-for="item in hotSearch.list"
        class="w-full flex flex-row flex-nowrap justify-start items-center gap-x-[6px]"
      >
        <!-- 排名 -->
        <div class="text-sm">
          <div>{{ item.rank }}</div>
        </div>
        <!-- 关键词 -->
        <div class="truncate text-sm cursor-pointer" @click="openUrl(item.url)">
          {{ item.keyword }}
        </div>
        <!-- 热 新 沸 -->
        <div class="text-sm">
          <div
            v-if="item.isHot"
            class="w-5 h-5 p-1 rounded-md bg-orange-500 flex justify-center items-center"
          >
            热
          </div>
          <div
            v-else-if="item.isBoil"
            class="w-5 h-5 p-1 rounded-md bg-orange-500 flex justify-center items-center"
          >
            沸
          </div>
          <div
            v-else-if="item.isNew"
            class="w-5 h-5 p-1 rounded-md bg-orange-500 flex justify-center items-center"
          >
            新
          </div>
        </div>
      </div>
      <!-- 更新时间 不需要日期， 只需要时和分-->
      <div
        class="text-sm my-1 text-[#ffffff] flex flex-row justify-start items-center gap-x-1"
      >
        <div>
          更新于: {{ new Date(hotSearch.updateTime).toLocaleTimeString() }}
        </div>
        <!-- <Icon class="w-4 h-4 cursor-pointer" name="redo" color="#ffffff" @click="loadData" /> -->
      </div>
    </div>
    <!-- 加载失败 -->
  </div>
</template>
<!-- 更新内容：无感更新，用户体验更好 -->
<script setup lang="ts">
import {
  defineProps,
  ref,
  onMounted,
  Ref,
  computed,
  onBeforeUnmount,
} from "vue";
import Loader from "../../Loader.vue";
import LoadFailed from "../../LoadFailed.vue";
// import { getRandomUA } from "../../../utils/getRandomUA";
import _ from "lodash";

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

interface HotSearchItem {
  rank: number;
  keyword: string;
  url: string;
  isHot: boolean;
  isBoil: boolean;
  isNew: boolean;
}

interface HotSearchData {
  list: HotSearchItem[];
  updateTime: number;
}

const isFirstLoading = ref(false);
const isLoadFailed = ref(false);
const intervalId: Ref<number | null | NodeJS.Timeout> = ref(null);

const hotSearch: Ref<HotSearchData> = ref({
  list: [],
  updateTime: 0,
});

const lastHotSearch: Ref<HotSearchData> = ref(
  props.widgetData.data.lastHotSearch || {
    list: [],
    updateTime: 0,
  }
);

const isOnEdit = computed(() => {
  return props.widgetData.draggable;
});

onMounted(async () => {
  // 如果没有数据, 则加载数据
  if (lastHotSearch.value.list.length === 0) {
    loadData();
  }
  // 如果有数据，
  if (lastHotSearch.value.list.length !== 0) {
    // 判断上次更新时间是否超过1小时
    const now = Date.now();
    const lastUpdateTime = lastHotSearch.value.updateTime;
    const isOverOneHour = now - lastUpdateTime > 1000 * 60 * 30;
    // const isOverOneHour = now - lastUpdateTime > 1000 * 30;

    // 但是超过1小时，也加载数据
    if (isOverOneHour) {
      // utools.showNotification("数据超过30秒 正在加载数据...");
      loadData();
    } else {
      // 否则，使用上次数据
      hotSearch.value = lastHotSearch.value;
      // utools.showNotification("未超过30秒,使用上次数据");
    }
  }
  intervalId.value = setInterval(loadData, 1000 * 60 * 30);
});

onBeforeUnmount(() => {
  if (intervalId.value) {
    clearInterval(intervalId.value);
  }
});

// 获取并更新数据
async function loadData() {
  try {
    // 首次加载中
    if (lastHotSearch.value.list.length === 0) {
      isFirstLoading.value = true;
      // utools.showNotification("首次加载中...");
    } else {
      // utools.showNotification("非首次加载中...");
    }

    isLoadFailed.value = false;
    const res = await fetchHotSearchByApiOpen();

    // 更新数据
    hotSearch.value.list = res.slice(0, 10);
    hotSearch.value.updateTime = Date.now();
    // 保存最近数据
    lastHotSearch.value.list = hotSearch.value.list;
    lastHotSearch.value.updateTime = hotSearch.value.updateTime;

    // 保存数据
    const widgetData = _.cloneDeep(props.widgetData);
    widgetData.data.lastHotSearch = lastHotSearch.value;
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
    if (lastHotSearch.value.list.length > 0) {
      hotSearch.value.list = lastHotSearch.value.list;
      hotSearch.value.updateTime = lastHotSearch.value.updateTime;
    } else {
      // 无数据 且 加载失败
      isLoadFailed.value = true;
    }
  } finally {
    isFirstLoading.value = false;
    // utools.clearUBrowserCache();
  }
}

// 获取数据 By Api open
async function fetchHotSearchByApiOpen() {
  let res;
  const response = await fetch(
    "https://service-6db672ow-1322077646.gz.tencentapigw.com.cn/release/api/hot-search"
  );
  const data = await response.json();
  if (data.code === 200) {
    res = data.data;
  } else {
    return Error("获取数据失败");
  }
  return res as any;
}

function openUrl(url: string) {
  if (isOnEdit.value) return;
  utools.shellOpenExternal(url);
}

function openLink(link: string) {
  if (isOnEdit.value) return;
  const baseUri = "https://s.weibo.com";
  utools.shellOpenExternal(baseUri + link);
}
</script>
<style scoped></style>
