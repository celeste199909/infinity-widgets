<template>
  <div
    class="widget rounded-xl bg-slate-100/90 backdrop-blur-sm flex justify-center items-center"
    :style="{
      width: widgetData.position.w + 'px',
      height: widgetData.position.h + 'px',
    }"
  >
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
// 组合函数
import { useLayout } from "../../../win-widgets/composables/useLayout";

const { layout, nearestPosition } = useLayout();

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
.widget:active {
  /* animation: widget-hover 0.6s ease-in-out forwards; */
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
