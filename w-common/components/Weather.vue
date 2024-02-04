<template>
  <div
    class="widget rounded-xl bg-green-100 flex justify-center items-center"
    :style="{
      width: widgetData.position.w + 'px',
      height: widgetData.position.h + 'px',
    }"
  >
    <div>{{ widgetData.name }}</div>
    <div>X: {{ widgetData.position.x }}</div>
    <div>Y: {{ widgetData.position.y }}</div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps({
  widgetData: {
    type: Object,
    required: true,
  },
  nearestPosition: {
    type: Object,
    required: true,
  },
});
</script>
<style scoped>
.widget:hover {
  filter: drop-shadow(0 0 0.5rem rgba(206, 206, 206, 0.438));
}
.widget:active {
  animation: widget-hover 0.6s ease-in-out forwards;
}
@keyframes widget-hover {
  0% {
    transform: scale(0.98);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
}
</style>
