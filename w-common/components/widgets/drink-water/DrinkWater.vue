<!-- GithubContributions.vue -->
<template>
  <!-- 有样式 -->
  <div
    :style="{
      width: widgetData.style[widgetData.currentStyle].w + 'px',
      height: widgetData.style[widgetData.currentStyle].h + 'px',
    }"
    class="rounded-xl p-3 border flex justify-center items-center bg-white text-[#1f2328]"
  >
    <!-- 内容 -->
    <div
      class="w-full h-full flex flex-col justify-center items-center space-y-[2px]"
    >
      <div
        @click="increase"
        class="w-full h-full flex flex-col justify-center items-center"
      >
        <CircleProgress :count="count">
          <div
            class="w-full h-full flex flex-col justify-center items-center p-8"
          >
            <!-- 水杯图标-->
            <div class="w-1/2 flex justify-center items-center">
              <img src="../../../assets/icons/glass-96.png" alt="" srcset="" />
            </div>
            <!-- 文字 -->
            <div
              v-if="widgetData.currentStyle === '2x2'"
              class="w-full h-10 flex justify-center items-center font-bold"
            >
              {{ current + " / " + total }}
            </div>
            <div
              v-else
              class="w-full h-10 flex justify-center items-center font-bold"
            >
              {{ "每天" + current + " / " + total + "杯水" }}
            </div>
          </div>
        </CircleProgress>
      </div>
    </div>
    <!-- 设置 -->
    <div
      class="absolute w-10 h-10 flex justify-center rounded-full hover:bg-slate-100 items-center top-2 right-2 cursor-pointer"
      @click="openSetting"
    >
      <Icon name="three-dots-menu" />
    </div>
    <!-- 设置 -->
    <Teleport to="body">
      <CustomWindow
        v-if="isShowSetting"
        class="bg-white"
        :widgetData="widgetData"
        :name="'设置'"
        :winId="'custom-win-' + widgetData.id"
        :width="300"
        :height="500"
        :maxminze="false"
        :closeFunction="closeSetting"
        :btnColor="'#666'"
        :showTitle="false"
      >
        <div
          class="w-full h-full overflow-hidden py-4 pt-10 px-6 text-[#8d8df9] bg-slate-100"
        >
          <div
            class="w-full h-full overflow-y-scroll flex flex-col justify-start items-start gap-4 gap-y-6 pb-40"
          >
            <!-- 每天数量 -->
            <div>
              <div class="font-bold text-[16px]">
                {{ "每天" + total + "杯水" }}
              </div>
              <div class="w-48">
                <input
                  type="range"
                  :min="current === 0 ? 1 : current"
                  max="16"
                  v-model="count.total"
                  class="slider-thumb appearance-none w-full h-1 bg-gray-200 rounded-full outline-none focus:outline-none"
                />
              </div>
            </div>
            <!-- 提醒 -->
            <div>
              <div class="font-bold text-[16px]">提醒</div>
              <div class="mt-1 mb-2 text-[14px] text-slate-600">
                window11 确保请勿打扰模式关闭
              </div>
              <div class="container my-4">
                <div class="w-24" @click="handleOnReminder">
                  <div :class="isOnReminder ? 'current' : ''"></div>
                  <span>开启</span>
                </div>
                <div class="w-24" @click="handleOffReminder">
                  <div :class="isOnReminder ? '' : 'current'"></div>
                  <span>关闭</span>
                </div>
              </div>
              <div v-if="isOnReminder">
                <div
                  class="mt-1 mb-2 text-[14px] text-slate-600 dark:text-slate-300"
                >
                  每 {{ reminderInterval }} 分钟提醒一次
                </div>
                <div class="w-48">
                  <input
                    type="range"
                    min="10"
                    max="180"
                    v-model="reminderInterval"
                    @change="handleOnReminder"
                    class="slider-thumb appearance-none w-full h-1 bg-gray-200 rounded-full outline-none focus:outline-none"
                  />
                </div>
              </div>
            </div>
            <!-- 重新计数 -->
            <div>
              <div class="font-bold text-[16px]">重新计数</div>
              <div class="mt-1 mb-2 text-[14px] text-slate-600">
                把当前计数重置为 0, 目前还不能在新的一天开始时自动重置,
                需要手动操作。
              </div>
              <button
                @click="count.current = 0"
                class="inline-flex select-none cursor-pointer items-center px-4 py-2 bg-blue-400 transition ease-in-out delay-75 hover:bg-blue-500 text-white text-sm font-medium rounded-md"
              >
                <svg
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  fill="none"
                  class="h-5 w-5 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    stroke-width="2"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                  ></path>
                </svg>
                重新计数
              </button>
            </div>
            <!-- 重置 -->
            <div>
              <div class="mt-2 font-bold text-[16px]">重置设置</div>
              <div
                class="mt-1 mb-2 text-[14px] text-slate-600 dark:text-slate-300"
              >
                重置为初始状态
              </div>
              <button
                @click="resetCount"
                class="inline-flex select-none cursor-pointer items-center px-4 py-2 bg-red-400 transition ease-in-out delay-75 hover:bg-red-500 text-white text-sm font-medium rounded-md"
              >
                <svg
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  fill="none"
                  class="h-5 w-5 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    stroke-width="2"
                    stroke-linejoin="round"
                    stroke-linecap="round"
                  ></path>
                </svg>
                重置
              </button>
            </div>
          </div>
        </div>
      </CustomWindow>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, computed, reactive, Ref, onMounted } from "vue";
import CustomWindow from "../../CustomWindow.vue";
import CircleProgress from "./CircleProgress.vue";

import Icon from "../../icon/Icon.vue";
import { watchDeep } from "@vueuse/core";

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

const isOnEdit = computed(() => {
  return props.widgetData.draggable;
});

const count = reactive(
  props.widgetData.data?.count || { total: 8, current: 0 }
);
const total = computed(() => {
  return count.total;
});

const current = computed(() => {
  return count.current;
});

watchDeep(count, (newVal) => {
  if (props.modifyWidgetData) {
    const _widgetData = { ...props.widgetData };
    _widgetData.data.count = newVal;
    props.modifyWidgetData(_widgetData);
  }
});

const isShowSetting = ref(false);

const isOnReminder = ref(props.widgetData.data?.isOnReminder || false);
watchDeep(isOnReminder, (newVal) => {
  if (props.modifyWidgetData) {
    const _widgetData = { ...props.widgetData };
    _widgetData.data.isOnReminder = newVal;
    props.modifyWidgetData(_widgetData);
  }
});

const reminderInterval = ref(props.widgetData.data?.reminderInterval || 60);
watchDeep(reminderInterval, (newVal) => {
  if (props.modifyWidgetData) {
    const _widgetData = { ...props.widgetData };
    _widgetData.data.reminderInterval = newVal;
    props.modifyWidgetData(_widgetData);
  }
});

onMounted(() => {
  if (props.widgetData.data?.isOnReminder) {
    handleOnReminder();
  }
});

let interval: Ref<string | number | NodeJS.Timeout | undefined> = ref();

function handleOnReminder() {
  isOnReminder.value = true;

  if (interval.value) {
    clearInterval(interval.value);
  }

  interval.value = setInterval(() => {
    if (isOnReminder.value) {
      utools.showNotification("喝水时间到啦！");
    }
  }, reminderInterval.value * 60 * 1000);
}

function handleOffReminder() {
  isOnReminder.value = false;
  if (interval.value) {
    clearInterval(interval.value);
  }
}

function increase() {
  if (isOnEdit.value) return;
  count.current++;
  if (count.current >= count.total) {
    count.current = count.total;
  }
}

function resetCount() {
  count.current = 0;
  count.total = 8;
  isOnReminder.value = false;
  reminderInterval.value = 60;
}

function openSetting() {
  isShowSetting.value = true;
}

function closeSetting() {
  isShowSetting.value = false;
}
</script>
<style scoped>
.container > div {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
}

.container div {
  display: flex;
  cursor: pointer;
  font-weight: 500;
  position: relative;
  overflow: hidden;
  margin-bottom: 0.375em;
}

.container div div {
  position: absolute;
  left: -9999px;
}

.container div.current + span {
  background-color: #8f8ffc;
  color: white;
}

.container div.current + span:before {
  box-shadow: inset 0 0 0 0.4375em #575793;
}

.container span {
  display: flex;
  align-items: center;
  padding: 0.375em 0.75em 0.375em 0.375em;
  border-radius: 99em;
  transition: 0.25s ease;
  color: #8282ff;
}

.container span:hover {
  background-color: #d6d6e5be;
}
.dark .container span:hover {
  background-color: #51516b;
}

.container span:before {
  display: flex;
  flex-shrink: 0;
  content: "";
  background-color: #fff;
  width: 1.5em;
  height: 1.5em;
  border-radius: 50%;
  margin-right: 0.375em;
  transition: 0.25s ease;
  box-shadow: inset 0 0 0 0.125em #2e2e60;
}
</style>
