<template>
  <component
    :is="widgets.get(widgetData.key)"
    :widgetData="widgetData"
    :modifyWidgetData="modifyWidgetData"
    class="transition-class rounded-xl overflow-hidden select-none relative group"
    @mouseleave="handleResizeWidget"
  >
    <!-- 扩大 -->
    <!-- 条状 -->
    <!-- <div
      @click="handleExpandWidget"
      class="w-10 h-2 left-1/2 bottom-1 -translate-x-1/2 rounded-sm bg-white/60 hover:bg-white/80 transition-all absolute group-hover:opacity-100 opacity-0"
    > -->
    <!-- 圆形状 -->
    <div
      @mouseenter="handleExpandWidget"
      class="w-5 h-5 bottom-1 right-1 rounded-full bg-white/30 hover:bg-white/60 transition-all absolute group-hover:opacity-100 opacity-0"
    ></div>
  </component>
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
import DrinkWater from "./widgets/drink-water/DrinkWater.vue";
import HeiShenHua from "./widgets/heishenhua/HeiShenHua.vue";
import Woodfish from "./widgets/woodfish/Woodfish.vue";

import { gsap } from "gsap";

import { defineProps, onMounted } from "vue";

import _ from "lodash";

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
  ["drink-water", DrinkWater],
  ["heishenhua", HeiShenHua],
  ["woodfish", Woodfish],
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

function handleExpandWidget() {
  const _widgetData = _.cloneDeep(props.widgetData);
  console.log(
    "%c [ _widgetData.tempStyle ]-83",
    "font-size:13px; background:pink; color:#bf2c9f;",
    _widgetData.tempStyle
  );

  if (!_widgetData.tempStyle) {
    _widgetData.tempStyle = _widgetData.currentStyle;
    // 获取style列表的最后一个
    const styleList = Object.keys(_widgetData.style as { [key: string]: any });
    const lastStyle = styleList[styleList.length - 1];
    _widgetData.currentStyle = lastStyle;
    _widgetData.size.w = _widgetData.style[lastStyle].w;
    _widgetData.size.h = _widgetData.style[lastStyle].h;
  }
  if (props.modifyWidgetData) {
    props.modifyWidgetData(_widgetData);
  }
}

function handleResizeWidget() {
  const _widgetData = _.cloneDeep(props.widgetData);
  console.log(
    "%c [ _widgetData.tempStyle ]-83",
    "font-size:13px; background:pink; color:#bf2c9f;",
    _widgetData.tempStyle
  );
  if (_widgetData.tempStyle) {
    _widgetData.currentStyle = _widgetData.tempStyle;
    _widgetData.size.w = _widgetData.style[_widgetData.tempStyle].w;
    _widgetData.size.h = _widgetData.style[_widgetData.tempStyle].h;
    _widgetData.tempStyle = "";
  }
  if (props.modifyWidgetData) {
    props.modifyWidgetData(_widgetData);
  }
}

// let timerout: NodeJS.Timeout;

// function handleMouseDown(event: MouseEvent) {
//   if (event.button === 0) {
//     clearTimeout(timerout);
//     timerout = setTimeout(() => {
//       enterDraggable();
//     }, 1000);
//   }
// }

// function handleMouseUp(event: MouseEvent) {
//   if (event.button === 0) {
//     clearTimeout(timerout);
//   }
// }

// function enterDraggable() {
//   const widget = document.getElementById("w-" + widgetId);
//   if (widget) {
//     const widgetDate = _.cloneDeep(props.widgetData);
//     widgetDate.draggable = true;
//     if (props.modifyWidgetData) {
//       props.modifyWidgetData(widgetDate);
//     }
//   }
// }

// function setWindowToBottom() {
//   const newCustomEvent = new CustomEvent("widget-on-click", {
//     detail: { key: "value" },
//   });
//   document.dispatchEvent(newCustomEvent);
// }
</script>
<style scoped>
.transition-class {
  transition: width 0.3s, height 0.3s;
}
</style>
./widgets/heishenhua/WuKong.vue
