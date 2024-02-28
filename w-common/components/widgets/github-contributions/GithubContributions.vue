<!-- GithubContributions.vue -->
<template>
  <!-- 有样式 -->
  <div
    :style="{
      width: widgetData.style[widgetData.currentStyle].w + 'px',
      height: widgetData.style[widgetData.currentStyle].h + 'px',
    }"
    class="rounded-xl border flex justify-center items-center bg-white text-[#1f2328]"
  >
    <Loader v-if="isFirstLoading" />
    <!-- 错误 -->
    <!-- 无任何数据时 且 不是在首次加载中 -->
    <LoadFailed
      v-else-if="contributionsData.gridList.length === 0"
      :tooltip="'加载失败, 请检查用户名和网络。'"
      :retryFn="loadData"
      :btnColor="'#666666'"
    />
    <!-- graph -->
    <div
      v-else
      class="w-fit pt-4 h-fit flex flex-col justify-center items-start space-y-[2px] relative"
    >
      <!-- 星期 -->
      <div
        class="absolute -left-[26px] top-0 text-[9px] flex flex-col h-full pt-[26px] pb-[14px] justify-between"
      >
        <div>Mon</div>
        <div>Wed</div>
        <div>Fri</div>
      </div>
      <!-- 月份 -->
      <div
        class="absolute w-full left-0 -top-1 text-[10px] flex flex-row justify-between items-center"
      >
        <div v-for="item in contributionsData.monthList">
          {{ item.slice(0, 3) }}
        </div>
      </div>
      <!-- 格子 -->
      <div
        v-for="rowItem in contributionsData.gridList"
        class="w-fit h-fit flex flex-row justify-start items-center space-x-[2px]"
      >
        <template v-for="cellItem in rowItem">
          <!-- 一个格子 -->
          <div
            v-if="cellItem.date && cellItem.level"
            class="w-[10px] h-[10px] box-border rounded-[2px] border-[1px]"
            :style="{
              'background-color': fillColors[Number(cellItem.level)],
              'border-color': borderColors[Number(cellItem.level)],
            }"
          ></div>
          <div
            v-else
            class="w-[10px] h-[10px] rounded-[2px] bg-transparent"
          ></div>
        </template>
      </div>
    </div>

    <!-- 设置 -->
    <div
      class="absolute flex justify-center items-center gap-x-1 bottom-4 right-4 cursor-pointer"
      @click="openSetting"
    >
      <Icon :name="'edit'" :color="'#666'" class="w-5 h-5" />
    </div>
    <!-- 设置 -->
    <Teleport to="body">
      <CustomWindow
        v-if="isShowSetting"
        :widgetData="widgetData"
        :name="'设置'"
        :winId="'custom-win-' + widgetData.id"
        :width="400"
        :height="300"
        :maxminze="false"
        :closeFunction="closeSetting"
        :btnColor="'#ffffff'"
        :showTitle="false"
      >
        <!--  -->
        <div class="window-content p-8 pt-14 w-full h-full relative">
          <div
            class="text-[24px] font-bold text-slate-100 cursor-pointer hover:underline"
            @click="openGithub"
          >
            @{{ username }}
          </div>
          <p class="description text-slate-300">
            请输入你想查看的 Github 用户名。点击确定后，如果过几秒还不行，多试两次。（交互还没做，先用文字说明）
          </p>
          <div class="my-2">
            <input
              type="text"
              v-model="username"
              placeholder="输入github用户名"
            />
            <button class="ml-2" @click="SaveUsernameAndLoadData">确定</button>
          </div>
          <!-- 更新时间 -->
          <div class="text-[12px] text-slate-300">
            <!-- 最近更新：{{ lastUpdateTime }} -->
            更新于：{{
              new Date(contributionsData.updateTime).toLocaleString()
            }}
          </div>
        </div>
      </CustomWindow>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, onMounted, Ref, onBeforeUnmount } from "vue";
import CustomWindow from "../../CustomWindow.vue";
import Loader from "../../Loader.vue";
import LoadFailed from "../../LoadFailed.vue";
import Icon from "../../icon/Icon.vue";
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

interface ContributionsData {
  gridList: Array<Array<cellItem>>;
  monthList: Array<string>;
  updateTime: number;
}

interface cellItem {
  date: string | null;
  level: string | null;
}

const intervalId: Ref<number | null | NodeJS.Timeout> = ref(null);
const isFirstLoading = ref(false);

const contributionsData: Ref<ContributionsData> = ref({
  gridList: [],
  monthList: [],
  updateTime: 0,
});

const lastContributionsData: Ref<ContributionsData> = ref(
  props.widgetData.data.lastContributionsData || {
    gridList: [],
    monthList: [],
    updateTime: 0,
  }
);

const fillColors = ["#EBEDF0", "#9BE9A8", "#40C463", "#30A14E", "#216E39"];
const borderColors = ["#DFE1E4", "#94DDA0", "#3EBA5F", "#2F9A4B", "#216A38"];
const username = ref(props.widgetData.data?.username || "yyx990803");
const isShowSetting = ref(false);
const isLoadFailed = ref(false);

onMounted(async () => {
  // 如果没有任何数据, 则加载数据
  if (lastContributionsData.value.gridList.length === 0) {
    loadData();
  }
  // 如果有数据，
  if (lastContributionsData.value.gridList.length !== 0) {
    // 判断上次更新时间是否超过1小时
    const now = Date.now();
    const lastUpdateTime = lastContributionsData.value.updateTime;
    const isOverOneHour = now - lastUpdateTime > 1000 * 60 * 60;
    // const isOverOneHour = now - lastUpdateTime > 1000 * 30;

    // 但是超过1小时，也加载数据
    if (isOverOneHour) {
      // 暂时使用上次数据，避免空白
      contributionsData.value = lastContributionsData.value;
      // utools.showNotification("数据超过30秒 正在加载数据...");
      loadData();
    } else {
      // 否则，使用上次数据
      contributionsData.value = lastContributionsData.value;
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

async function fetchGitHubContributions() {
  const baseUrl =
    "https://fc-mp-88e0a288-76cf-4cb2-a4ef-ea52b8178603.next.bspapp.com/github-contributions";

  try {
    const res = await fetch(`${baseUrl}?username=${username.value}`);
    const data = await res.json();

    return data.contributions;
  } catch (error) {
    throw new Error("获取数据失败");
  }
}

async function loadData() {
  // hotArticleList.value = [];
  try {
    // 首次加载中
    if (lastContributionsData.value.gridList.length === 0) {
      isFirstLoading.value = true;
      // utools.showNotification("首次加载中...");
    } else {
      // utools.showNotification("非首次加载中...");
    }

    isLoadFailed.value = false;
    const res = await fetchGitHubContributions();
    console.log(
      "%c [ res ]-260",
      "font-size:13px; background:pink; color:#bf2c9f;",
      res
    );
    // 更新数据
    contributionsData.value.gridList = res.gridList;
    contributionsData.value.monthList = res.monthList;
    contributionsData.value.updateTime = Date.now();
    // 保存最近数据
    lastContributionsData.value = _.cloneDeep(contributionsData.value);

    // 保存数据
    const widgetData = _.cloneDeep(props.widgetData);
    widgetData.data.lastContributionsData = lastContributionsData.value;
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
    if (lastContributionsData.value.gridList.length > 0) {
      contributionsData.value = _.cloneDeep(lastContributionsData.value);
    } else {
      // 无数据 且 加载失败
      isLoadFailed.value = true;
    }
  } finally {
    isFirstLoading.value = false;
    // utools.clearUBrowserCache();
  }
}

function SaveUsernameAndLoadData() {
  const widgetData = _.cloneDeep(props.widgetData);
  widgetData.data.username = username.value;

  if (props.modifyWidgetData) {
    props.modifyWidgetData(widgetData);
  }
  loadData();
}

function openSetting() {
  isShowSetting.value = true;
}

function closeSetting() {
  isShowSetting.value = false;
}

function openGithub() {
  const url = "https://github.com/" + username.value;
  utools.shellOpenExternal(url);
}
</script>
<style scoped>
.window-content{
  display: flex;
  flex-direction: column;
  background: #606c88;
  background: -webkit-linear-gradient(to right, #3f4c6b, #606c88);
  background: linear-gradient(to right, #3f4c6b, #606c88);
  border-radius: 10px;
}

.description {
  line-height: 1.5rem;
  font-size: 1rem;
  margin-top: 1rem;
}

.window-content div input {
  outline: none;
  line-height: 2;
  font-size: 1rem;
  color: rgb(255 255 255);
  padding: 0.5rem 1rem;
  background-color: rgb(255 255 255 / 0.05);
  border: 1px solid rgba(253, 253, 253, 0.363);
  border-radius: 0.375rem;
  flex: 1 1 auto;
}

.window-content div input::placeholder {
  color: rgb(216, 212, 212);
}

.window-content div input:focus {
  border: 1px solid rgb(99 102 241);
}

.window-content div button {
  color: #fff;
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.5rem;
  padding: 0.8rem 1.2rem;
  background-color: rgb(99 102 241);
  border-radius: 0.375rem;
  border: none;
  outline: none;
}
.button {
  color: #fff;
  font-weight: 600;
  font-size: 1rem;
  line-height: 1rem;
  padding: 0.8rem 1.2rem;
  background-color: rgb(99 102 241);
  border-radius: 0.375rem;
  border: none;
  outline: none;
}
</style>
