<!-- GithubContributions.vue -->
<template>
  <!-- 无样式 -->
  <div
    v-if="!widgetData.style"
    class="wrapper-card rounded-xl bg-slate-900 flex justify-center items-center"
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
        src="../../../assets/icons/github-96-white.png"
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
    class="rounded-xl border flex justify-center items-center bg-white text-[#1f2328]"
  >
    <Loader v-if="isLoading" />
    <!-- graph -->
    <div
      v-else-if="!isLoadFailed && gridList"
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
        <div v-for="item in monthList">{{ item.slice(0, 3) }}</div>
      </div>
      <!-- 格子 -->
      <div
        v-for="rowItem in gridList"
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
    <!-- 错误 -->
    <LoadFailed
      v-else
      :tooltip="'加载失败, 请检查用户名和网络。'"
      :retryFn="loadData"
      :btnColor="'#666666'"
    />
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
        <div class="form p-8 pt-14 w-full h-full relative">
          <div
            class="text-[24px] font-bold text-slate-100 cursor-pointer hover:underline"
            @click="openGithub"
          >
            @{{ username }}
          </div>
          <p class="description text-slate-300">
            请输入你想查看的 Github 用户名, 每小时自动更新一次。受网络影响,
            若重试过后依旧不行，请勿使用该组件。
          </p>
          <div class="my-2">
            <input
              type="text"
              v-model="username"
              placeholder="输入github用户名"
            />
            <button class="ml-2" @click="loadData">确定</button>
          </div>
          <div class="text-[12px] text-slate-300">
            最近更新：{{ lastUpdateTime }}
          </div>
        </div>
      </CustomWindow>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, onMounted, Ref, onBeforeMount, computed } from "vue";
import CustomWindow from "../../CustomWindow.vue";
import Loader from "../../Loader.vue";
import LoadFailed from "../../LoadFailed.vue";
import Icon from "../../icon/Icon.vue";

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

interface cellItem {
  date: string | null;
  level: string | null;
}

const gridList: Ref<Array<cellItem>[]> = ref([]);
const monthList: Ref<Array<string>> = ref([]);
const isLoading = ref(false);
const intervalTimer: Ref<number | null | NodeJS.Timeout> = ref(null);
const lastUpdate = ref(Date.now());
const lastUpdateTime = computed(() => {
  return new Date(lastUpdate.value).toLocaleString();
});

const fillColors = ["#EBEDF0", "#9BE9A8", "#40C463", "#30A14E", "#216E39"];
const borderColors = ["#DFE1E4", "#94DDA0", "#3EBA5F", "#2F9A4B", "#216A38"];
const username = ref(props.widgetData.data?.username || "yyx990803");
const isShowSetting = ref(false);
const isLoadFailed = ref(false);

onMounted(async () => {
  if (props.widgetData.style) {
    loadData();
    // 设置定时器
    intervalTimer.value = setInterval(() => {
      loadData();
    }, 1000 * 60 * 60);
  }
});

onBeforeMount(() => {
  if (intervalTimer.value) {
    clearInterval(intervalTimer.value);
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
  // 保存用户名
  const widgetData = {
    ...props.widgetData,
    data: {
      username: username.value,
    },
  };

  if (props.modifyWidgetData) {
    props.modifyWidgetData(widgetData);
  }

  try {
    // 重置状态
    isLoading.value = true;
    isLoadFailed.value = false;
    // 获取数据 & 更新数据
    const res = await fetchGitHubContributions();
    gridList.value = res.gridList;
    monthList.value = res.monthList;
  } catch (error) {
    isLoadFailed.value = true;
  } finally {
    isLoading.value = false;
    utools.clearUBrowserCache();
    lastUpdate.value = Date.now();
  }
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
.form {
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

.form div input {
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

.form div input::placeholder {
  color: rgb(216, 212, 212);
}

.form div input:focus {
  border: 1px solid rgb(99 102 241);
}

.form div button {
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
