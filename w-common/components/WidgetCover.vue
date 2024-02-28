<template>
  <component
    :is="widgets.get(widgetKey)"
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
import CovHeiShenHua from "./widgets/heishenhua/CovHeiShenHua.vue";
import CovWoodfish from "./widgets/woodfish/CovWoodfish.vue";

defineProps({
  widgetKey: {
    type: String,
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
  ["heishenhua", CovHeiShenHua],
  ["woodfish", CovWoodfish],
]);
</script>
<style scoped></style>
./widgets/heishenhua/CovWuKong.vue