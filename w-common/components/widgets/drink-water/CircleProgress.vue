<template>
  <div
    class="w-full h-full flex flex-col justify-center text-[#3FA1E6] gap-y-3 items-center relative"
  >
    <!-- 进度条 -->
    <div
      class="relative h-4/5 w-4/5 flex flex-col gap-y-2 justify-center items-center cursor-pointer"
    >
      <svg class="absolute top-0 left-0 w-full h-full" viewBox="0 0 120 120">
        <circle
          class="fill-transparent stroke-current text-gray-100"
          cx="60"
          cy="60"
          r="54"
          stroke-width="8"
        ></circle>
        <circle
          class="fill-transparent stroke-current"
          cx="60"
          cy="60"
          r="54"
          stroke-width="8"
          :style="circleStyle"
        ></circle>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" :stop-color="'#3FA1E6'"></stop>
            <stop offset="100%" :stop-color="'#3FA1E6'"></stop>
          </linearGradient>
        </defs>
      </svg>
      <!-- 内容  -->
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { watchDeep } from "@vueuse/core";

const props = defineProps({
  count: {
    type: Object,
    required: true,
  },
});

const count = computed(() => props.count);

const circleStyle = ref("");
watchDeep(count, () => {
  updataCircleStyle()
});

onMounted(() => {
  updataCircleStyle();
});

function updataCircleStyle() {
  circleStyle.value = `stroke-dasharray: ${
    2 * Math.PI * 54
  }; stroke-dashoffset: ${
    2 * Math.PI * 54 * (1 - count.value.current / count.value.total)
  }; transition: stroke-dashoffset 0.5s ease;`;
}
</script>

<style scoped></style>
