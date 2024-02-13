<template>
  <!-- 无样式 -->
  <div
    v-if="!widgetData.style"
    class="rounded-xl w-full h-full bg-gradient-to-r from-violet-200 to-pink-200 text-slate-800 backdrop-blur-sm flex justify-center items-center"
    :style="{
      width: widgetData.size.w + 'px',
      height: widgetData.size.h + 'px',
    }"
  >
  <div class="w-14 h-14 backdrop-blur-[5px] flex justify-center items-center">
      <img
        class="rounded-xl w-14 h-14"
        src="../../../assets/icons/stopwatch-64.png"
        alt=""
      />
    </div>
</div>
  <!-- 有样式 -->
  <div
    v-else
    class="rounded-xl w-full h-full bg-slate-100 text-slate-800 backdrop-blur-sm flex justify-center items-center"
    :style="{
      width: widgetData.style[widgetData.currentStyle].w + 'px',
      height: widgetData.style[widgetData.currentStyle].h + 'px',
    }"
  >
    <div class="container mx-auto text-center pt-10">
      <!-- 倒计时总时间 -->
      <div class="text-4xl font-bold mb-6">
        {{ formatNumber(hours) }}:{{ formatNumber(minutes) }}:{{
          formatNumber(seconds)
        }}
      </div>

      <!-- 选择时分秒 -->
      <div class="flex justify-center items-center space-x-6 mb-6">
        <div>
          <div class="text-xs text-gray-400">小时</div>
          <div @wheel.prevent="scrollHours" class="text-xl font-semibold">
            {{ formatNumber(selectedHours) }}
          </div>
        </div>
        <div>
          <div class="text-xs text-gray-400">分钟</div>
          <div @wheel.prevent="scrollMinutes" class="text-xl font-semibold">
            {{ formatNumber(selectedMinutes) }}
          </div>
        </div>
        <div>
          <div class="text-xs text-gray-400">秒钟</div>
          <div @wheel.prevent="scrollSeconds" class="text-xl font-semibold">
            {{ formatNumber(selectedSeconds) }}
          </div>
        </div>
      </div>

      <!-- 开始/暂停按钮 -->
      <button
        @click="startOrPauseTimer"
        class="px-6 py-3 bg-blue-500 text-white rounded-lg text-xl"
      >
        {{ timerStatus }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { defineProps } from "vue";

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

// 当前选中的时分秒
const selectedHours = ref<number>(0);
const selectedMinutes = ref<number>(0);
const selectedSeconds = ref<number>(0);

// 开始/暂停按钮状态
const isTimerRunning = ref<boolean>(false);
const timerStatus = computed(() => (isTimerRunning.value ? "暂停" : "开始"));

// 格式化数字，补零
const formatNumber = (num: number) => {
  return num.toString().padStart(2, "0");
};

// 滚动选择时
const scrollHours = (event: WheelEvent) => {
  event.deltaY > 0 ? selectedHours.value++ : selectedHours.value--;
};

const scrollMinutes = (event: WheelEvent) => {
  event.deltaY > 0 ? selectedMinutes.value++ : selectedMinutes.value--;
};

const scrollSeconds = (event: WheelEvent) => {
  event.deltaY > 0 ? selectedSeconds.value++ : selectedSeconds.value--;
};

// 开始/暂停倒计时
const startOrPauseTimer = () => {
  isTimerRunning.value = !isTimerRunning.value;
};

// 将时分秒转换为秒数
const totalSeconds = computed(() => {
  return (
    selectedHours.value * 3600 +
    selectedMinutes.value * 60 +
    selectedSeconds.value
  );
});

// 获取时分秒
const hours = computed(() => Math.floor(totalSeconds.value / 3600));
const minutes = computed(() => Math.floor((totalSeconds.value % 3600) / 60));
const seconds = computed(() => totalSeconds.value % 60);

// 倒计时
let countdownInterval: any = null;
const remainingSeconds = ref<number>(0);
watch(isTimerRunning, (newValue) => {
  if (newValue) {
    remainingSeconds.value = totalSeconds.value;
    countdownInterval = setInterval(() => {
      if (remainingSeconds.value > 0) {
        remainingSeconds.value--;
      } else {
        clearInterval(countdownInterval);
        isTimerRunning.value = false;
      }
    }, 1000);
  } else {
    clearInterval(countdownInterval);
  }
});
</script>
<style scoped></style>
