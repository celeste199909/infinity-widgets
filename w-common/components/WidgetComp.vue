<template>
  <component
    :is="widgets.get(widgetData.key)"
    :widgetData="widgetData"
    :modifyWidgetData="modifyWidgetData"

    class="transition-class rounded-xl overflow-hidden select-none"
    @click="playAnimation"
  />
</template>
<!-- :id="'w-' + widgetData.id" -->
<script setup lang="ts">
import Calendar from "./widgets/calendar/Calendar.vue";
import AppStarter from "./widgets/app-starter/AppStarter.vue";
import Todo from "./widgets/todo/Todo.vue";
import Weather from "./widgets/weather/Weather.vue";
import GithubContributions from "./widgets/github-contributions/GithubContributions.vue";
import Countdown from "./widgets/countdown/Countdown.vue";
import Alarm from "./widgets/alarm/Alarm.vue";
import HotSearch from "./widgets/hot-search/HotSearch.vue";
import JueJinHot from "./widgets/juejin-hot/JueJinHot.vue";

import { gsap } from "gsap";

import { defineProps, onMounted } from "vue";

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

const widgetId = props.widgetData.id;

const widgets = new Map([
  ["calendar", Calendar],
  ["app-starter", AppStarter],
  ["todo", Todo],
  ["weather", Weather],
  ["github-contributions", GithubContributions],
  ["countdown", Countdown],
  ["alarm", Alarm],
  ["hot-search", HotSearch],
  ["juejin-hot", JueJinHot],
]);

onMounted(() => {
  const widget = document.getElementById("w-" + widgetId);
  if (widget) {
    gsap.from(`#w-${widgetId}`, {
      duration: 0.3,
      scale: 0,
      ease: "back.out(1.4)",
    });
  }
});

function playAnimation() {
  const widget = document.getElementById("w-" + widgetId);
  // 播放弹一弹动画
  if (widget) {
    gsap.to(`#w-${widgetId}`, {
      duration: 0.3,
      scale: 1.05,
      ease: "back.out(1.4)",
    });
    setTimeout(() => {
      gsap.to(`#w-${widgetId}`, {
        duration: 0.3,
        scale: 1,
        ease: "back.out(1.4)",
      });
    }, 300);
  }
}
</script>
<style scoped>
.transition-class {
  transition: width 0.3s, height 0.3s;
}
</style>
