<template>
    <component
      :is="widgets.get(widgetData.key)"
      :widgetData="widgetData"
      class="transition-class rounded-xl overflow-hidden select-none"
    />
</template>

<script setup lang="ts">
import Calendar from "./widgets/calendar/Calendar.vue";
import AppStarter from "./widgets/app-starter/AppStarter.vue"; 
import Todo from "./widgets/todo/Todo.vue";
import Weather from "./widgets/weather/Weather.vue";
import Woodfish from "./widgets/woodfish/Woodfish.vue";
import PaintBoard from "./widgets/paint-board/PaintBoard.vue";

import { gsap } from "gsap";

import { defineProps, onMounted } from "vue";

const props = defineProps({
  widgetData: {
    type: Object,
    required: true,
  },
});

const widgetId = props.widgetData.id;

const widgets = new Map([
  ["calendar", Calendar],
  ["app-starter", AppStarter],
  ["todo", Todo],
  ["weather", Weather],
  ["woodfish", Woodfish],
  ["paint-board", PaintBoard],
]);

onMounted(() => {
  const widget = document.getElementById('w-'+widgetId);
  if (widget) {
    gsap.from(`#w-${widgetId}`, {
      duration: 0.3,
      scale: 0,
      ease: "back.out(1.4)",
    });
  }
});
</script>
<style scoped>
.transition-class {
  transition: width 0.3s, height 0.3s;
}
</style>
