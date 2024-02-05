<template>
  <component
    :is="widgets.get(widgetName)"
    :widgetData="widgetData"
    :disabledFn="disabledFn"
    class="cursor-pointer rounded-xl overflow-hidden"
  />
</template>

<script setup lang="ts">
import Calendar from "./widgets/Calendar.vue";
import Starter from "./widgets/Starter.vue";
import Todo from "./widgets/Todo.vue";
import Weather from "./widgets/weather/Weather.vue";
import Woodfish from "./widgets/woodfish/Woodfish.vue";

import { defineProps } from "vue";

const props = defineProps({
  widgetName: {
    type: String,
    required: true,
  },
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

const widgets = new Map([
  ["calendar", Calendar],
  ["starter", Starter],
  ["todo", Todo],
  ["weather", Weather],
  ["woodfish", Woodfish],
]);
</script>
<style scoped></style>
