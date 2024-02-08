<template>
  <!-- 无样式 -->
  <div
    v-if="!widgetData.style"
    class="rounded-xl bg-red-300 backdrop-blur-sm flex justify-center items-center"
    :style="{
      width: widgetData.size.w + 'px',
      height: widgetData.size.h + 'px',
    }"
  ></div>
  <!-- 有样式 -->
  <div
    v-else
    class="rounded-xl bg-slate-100/90 backdrop-blur-sm flex justify-center items-center"
    :style="{
      width: widgetData.style[widgetData.currentStyle].w + 'px',
      height: widgetData.style[widgetData.currentStyle].h + 'px',
    }"
  ></div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps({
  widgetData: {
    type: Object,
    required: true,
  },
  disabledFn: {
    type: Boolean,
    required: false,
    default: false,
  },
});
</script>
<style scoped>
.widget:hover {
  filter: drop-shadow(0 0 0.5rem rgba(206, 206, 206, 0.438));
}
</style>
