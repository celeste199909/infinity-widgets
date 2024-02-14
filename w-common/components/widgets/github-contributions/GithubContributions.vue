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
  >
    <div
      class="w-18 h-18 rounded-full backdrop-blur-[10px] flex justify-center items-center"
    >
      <img
        class="rounded-xl w-14 h-14"
        src="../../../assets/icons/github-96.png"
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
    <div
      v-else
      class="absolute w-full h-full flex flex-col justify-center items-center space-y-3 rounded-xl"
    >
      <div class="text-slate-800">
        加载失败，请检测用户名是否正确，或者网络是否可用。
      </div>
      <!-- 重试 -->
      <div class="button" @click="handleSubmit">重试</div>
    </div>
    <!-- 设置 -->
    <div
      class="absolute flex justify-center items-center gap-x-1 bottom-4 right-4 cursor-pointer"
      @click="openSetting"
    >
      <img class="w-3 h-3" src="../../../assets/icons/edit-48-666.png" />
    </div>
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
      :closeBtnStyle="'white'"
      :showTitle="false"
    >
      <!--  -->
      <div class="form p-8 pt-14 w-full h-full relative">
        <div
          class="text-2xl font-bold text-slate-100 cursor-pointer hover:underline"
          @click="openGithub"
        >
          @{{ username }}
        </div>
        <p class="description">
          请输入你想查看的 Github 用户名, 点击确定即可查看该用户的 Github
          贡献图, 每小时更新一次。
        </p>
        <div>
          <input
            type="text"
            class="title"
            v-model="username"
            placeholder="输入github用户名"
          />
          <button @click="handleSubmit">确定</button>
        </div>
        <div class="mt-2 text-[10px] text-slate-100">
          最近更新：{{ lastUpdateTime }}
        </div>
      </div>
    </CustomWindow>
  </Teleport>
</template>

<script setup lang="ts">
import { defineProps, ref, onMounted, Ref, onBeforeMount, computed } from "vue";
import CustomWindow from "../../CustomWindow.vue";
import Loader from "../../Loader.vue";

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
const intervalTimer: Ref<null | number> = ref(null);
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
  handleSubmit();
});

onBeforeMount(() => {
  if (intervalTimer.value) {
    clearInterval(intervalTimer.value);
  }
  utools.clearUBrowserCache();
});

async function fetchGitHubContributions(): Promise<any> {
  const url = "https://github.com/" + username.value;
  let data;
  try {
    data = await utools.ubrowser
      .goto(url)
      .wait(".js-calendar-graph table tbody")
      .evaluate(() => {
        // 1 获取月份数据
        const monthList: string[] = [];
        const tdEls = Array.from(
          document.querySelectorAll(
            ".js-calendar-graph table thead td.ContributionCalendar-label"
          )
        );

        tdEls.forEach((tdEl) => {
          const month = tdEl.firstElementChild?.textContent || "";
          monthList.push(month);
        });

        // 2 获取贡献图数据
        const gridList: Array<Object>[] = [];
        const trEls = Array.from(
          document.querySelectorAll(".js-calendar-graph table tbody tr")
        );

        trEls.forEach((trEl) => {
          const rowList: Object[] = [];
          const tdEls = Array.from(trEl.querySelectorAll("td"));
          tdEls.forEach((tdEl) => {
            if (!tdEl.classList.contains("ContributionCalendar-label")) {
              rowList.push({
                date: tdEl.getAttribute("data-date"),
                level: tdEl.getAttribute("data-level"),
              });
            }
          });
          gridList.push(rowList);
        });

        // 3 返回数据
        return {
          monthList,
          gridList,
        };
      })
      .run({ show: false, width: 1000, height: 600 });
    return data[0] as any;
  } catch (error) {
    return Error("获取数据失败");
  }
}

async function handleSubmit() {
  if (intervalTimer.value) clearInterval(intervalTimer.value!);
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
    isLoading.value = true;
    isLoadFailed.value = false;
    const res = await fetchGitHubContributions();
    gridList.value = res.gridList;
    monthList.value = res.monthList;

    intervalTimer.value = setInterval(() => {
      handleSubmit();
    }, 3600000);
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
.wrapper-card {
  background-image: url(../../../assets/images/github-contribution.png);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: grayscale(50%);
}
.form {
  display: flex;
  flex-direction: column;
  background: #606c88;
  background: -webkit-linear-gradient(to right, #3f4c6b, #606c88);
  background: linear-gradient(to right, #3f4c6b, #606c88);
  border-radius: 10px;
}

.title {
  font-size: 2rem;
  line-height: 2rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: #fff;
}

.description {
  line-height: 1.5rem;
  font-size: 1rem;
  margin-top: 1rem;
  color: rgb(209 213 219);
}

.form div {
  display: flex;
  max-width: 28rem;
  margin-top: 1rem;
  column-gap: 0.5rem;
}

.form div input {
  outline: none;
  line-height: 1.5rem;
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
