<template>
  <!-- 有样式 -->
  <div
    class="rounded-xl w-full h-full bg-white text-slate-900 backdrop-blur-sm flex justify-center items-center"
    :style="{
      width: widgetData.style[widgetData.currentStyle].w + 'px',
      height: widgetData.style[widgetData.currentStyle].h + 'px',
    }"
  >
    <div class="flex w-full h-full p-3 flex-col justify-between items-center">
      <!-- 年月 -->
      <div class="text-lg font-bold">{{ currentYearMonth }}</div>
      <!-- 日 -->
      <div class="text-6xl font-bold">{{ currentDay }}</div>
      <!-- 农历和周几 -->
      <div class="flex justify-center items-center">
        <div>{{ currentWeekday }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { defineProps } from "vue";
// 组合函数
import { useLayout } from "../../../composables/useLayout";
// const { layout, nearestPosition } = useLayout();

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

interface LunarDate {
  month: number;
  day: number;
}

// 获取当前日期
const currentDate = ref<Date>(new Date());

// 获取年月日
const currentYearMonth = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth() + 1;
  return `${year}年${month}月`;
});

const currentDay = computed(() => currentDate.value.getDate());

// 获取星期几
const currentWeekday = computed(() => {
  const weekdays = [
    "星期日",
    "星期一",
    "星期二",
    "星期三",
    "星期四",
    "星期五",
    "星期六",
  ];
  const weekdayIndex = currentDate.value.getDay();
  return weekdays[weekdayIndex];
});

// 获取农历日期（示例，实际需要根据算法获取）
const lunarDate = ref<LunarDate>({ month: 12, day: 15 }); // 示例数据，需要根据实际情况计算
</script>
<style scoped></style>
