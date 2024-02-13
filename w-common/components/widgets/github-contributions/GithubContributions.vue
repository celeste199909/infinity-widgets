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
    <!-- 设置 -->
    <div
      class="absolute top-1 right-4 text-[10px] text-slate-300 hover:text-slate-500 underline cursor-pointer"
      @click="openSetting"
    >
      <img src="../../../assets/icons/github-96.png" class="w-5 h-5" />
    </div>
    <!-- graph -->
    <div
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
    <!-- 用户名 -->
    <div
      class="absolute bottom-1 right-4 text-[10px] text-slate-300 hover:text-slate-500 underline cursor-pointer"
      @click="openGithub"
    >
      @{{ username }}
    </div>
  </div>
  <!-- 设置 -->
  <Teleport to="body">
    <CustomWindow
      v-if="isShowSetting"
      :widgetData="widgetData"
      :name="'GitHub贡献图设置'"
      :winId="'custom-win-' + widgetData.id"
      :width="400"
      :height="200"
      :closeFunction="closeSetting"
    >
      <div class="bg-white w-full h-full p-4 pt-20">
        <div class="font-bold">github用户名</div>
        <input type="text" v-model="username" placeholder="输入github用户名" />
        <div @click="updateUsername">提交</div>
      </div>
    </CustomWindow>
  </Teleport>
</template>

<script setup lang="ts">
import { defineProps, ref, onMounted, Ref } from "vue";
import CustomWindow from "../../CustomWindow.vue";

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

const fillColors = ["#EBEDF0", "#9BE9A8", "#40C463", "#30A14E", "#216E39"];
const borderColors = ["#DFE1E4", "#94DDA0", "#3EBA5F", "#2F9A4B", "#216A38"];
const username = ref("yyx990803");
// const url = "https://github.com/";
const isShowSetting = ref(false);

onMounted(async () => {
  const res = await fetchGitHubContributions();
  console.log('%c [ res ]-137', 'font-size:13px; background:pink; color:#bf2c9f;', res)
  gridList.value = res.gridList;
  monthList.value = res.monthList;
  
  console.log('%c [ gridList ]-140', 'font-size:13px; background:pink; color:#bf2c9f;', gridList)
  console.log('%c [ monthList ]-140', 'font-size:13px; background:pink; color:#bf2c9f;', monthList)
});

async function fetchGitHubContributions(): Promise<any> {
  const url = "https://github.com/" + username.value;

  const data = await utools.ubrowser
    .goto(url)
    .hide()
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
    .run({ width: 1000, height: 600 });

  return data[0] as any;
}

async function updateUsername() {
  const res = await fetchGitHubContributions();
  console.log('%c [ res ]-137', 'font-size:13px; background:pink; color:#bf2c9f;', res)
  gridList.value = res.gridList;
  monthList.value = res.monthList;
  
  console.log('%c [ gridList ]-140', 'font-size:13px; background:pink; color:#bf2c9f;', gridList)
  console.log('%c [ monthList ]-140', 'font-size:13px; background:pink; color:#bf2c9f;', monthList)
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
</style>
