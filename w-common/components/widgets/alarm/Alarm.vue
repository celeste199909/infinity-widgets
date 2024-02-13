<template>
  <!-- 无样式 -->
  <div
    v-if="!widgetData.style"
    class="rounded-xl w-full h-full bg-gradient-to-l from-amber-200 to-yellow-200 text-slate-800 backdrop-blur-sm flex justify-center items-center"
    :style="{
      width: widgetData.size.w + 'px',
      height: widgetData.size.h + 'px',
    }"
  >
    <div class="w-16 h-16 backdrop-blur-[5px] flex justify-center items-center">
      <img
        class="rounded-xl w-14 h-14"
        src="../../../assets/icons/alarm-64.png"
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
      <!-- 闹钟列表 -->
      <div class="mb-6">
        <div
          v-for="(alarm, index) in alarms"
          :key="index"
          class="flex items-center justify-between px-4 py-2 bg-gray-100 mb-2 rounded"
        >
          <div class="flex items-center space-x-4">
            <input
              type="checkbox"
              v-model="alarm.enabled"
              class="form-checkbox h-5 w-5 text-blue-600"
            />
            <span class="text-lg">{{ alarm.time }}</span>
          </div>
          <button
            @click="removeAlarm(index)"
            class="px-3 py-1 bg-red-500 text-white rounded"
          >
            删除
          </button>
        </div>
      </div>

      <!-- 添加闹钟按钮 -->
      <div class="mb-6">
        <input v-model="newAlarmTime" type="time" class="p-2 border rounded" />
        <button
          @click="addAlarm"
          class="px-6 py-3 bg-blue-500 text-white rounded-lg text-xl"
        >
          添加闹钟
        </button>
      </div>
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

// 闹钟列表
const alarms = ref<{ time: string; enabled: boolean }[]>([]);

// 新闹钟的时间
const newAlarmTime = ref<string>("00:00");

// 添加闹钟
const addAlarm = () => {
  alarms.value.push({ time: newAlarmTime.value, enabled: true });
};

// 删除闹钟
const removeAlarm = (index: number) => {
  alarms.value.splice(index, 1);
};

// 模拟闹钟提醒
setInterval(() => {
  const currentTime = new Date().toLocaleTimeString("en-US", { hour12: false });
  alarms.value.forEach((alarm) => {
    if (alarm.enabled && alarm.time === currentTime) {
      alert("闹钟时间到！");
    }
  });
}, 1000);
</script>
<style scoped></style>
