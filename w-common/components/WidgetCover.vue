<template>
  <component
    :is="widgets.get(widgetData.key)"
    :widgetData="widgetData"
    class="transition-class rounded-xl overflow-hidden select-none"
  />
</template>
<script setup lang="ts">
import CovCalendar from "./widgets/calendar/CovCalendar.vue";
import CovAppStarter from "./widgets/app-starter/CovAppStarter.vue";
import CovTodo from "./widgets/todo/CovTodo.vue";
import CovWeather from "./widgets/weather/CovWeather.vue";
import CovGithubContributions from "./widgets/github-contributions/CovGithubContributions.vue";
import CovCountdown from "./widgets/countdown/CovCountdown.vue";
import CovAlarm from "./widgets/alarm/CovAlarm.vue";
import CovHotSearch from "./widgets/hot-search/CovHotSearch.vue";
import CovJueJinHot from "./widgets/juejin-hot/CovJueJinHot.vue";
import CovDrinkWater from "./widgets/drink-water/CovDrinkWater.vue";
import CovWuKong from "./widgets/wukong/CovWuKong.vue";

defineProps({
  widgetData: {
    type: Object,
    required: true,
  },
});

const widgets = new Map([
  ["calendar", CovCalendar],
  ["app-starter", CovAppStarter],
  ["todo", CovTodo],
  ["weather", CovWeather],
  ["github-contributions", CovGithubContributions],
  ["countdown", CovCountdown],
  ["alarm", CovAlarm],
  ["hot-search", CovHotSearch],
  ["juejin-hot", CovJueJinHot],
  ["drink-water", CovDrinkWater],
  ["wukong", CovWuKong],
]);
</script>
<style scoped></style>
