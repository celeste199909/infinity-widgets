<template>
  <div class="px-3 w-screen h-screen flex flex-col justify-center dark:text-slate-100">
    <!-- 小组件列表 -->
    <div
      class="w-full flex-1 py-1 overflow-y-scroll flex flex-row flex-wrap justify-start items-start gap-2"
    >
      <div
        v-for="item in allWidgets"
        :key="item.key"
        class="flex flex-col items-center gap-2"
      >
        <div class="cursor-pointer" @click="addWidget(item.key)">
          <WidgetComp
            :widgetName="item.key"
            :widgetData="item"
            :id="item.key"
            :disabledFn="true"
          />
        </div>
        <div class="text-slate-700 dark:text-slate-100 font-bold text-center">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted } from "vue";
import WidgetComp from "../w-common/components/WidgetComp.vue";
import { Widget } from "../w-common/types/widget";
// 组合函数
import { useLayout } from "../win-widgets/composables/useLayout";
const { layout, nearestPosition } = useLayout();

function getWidgetLength(units: number) {
  const cellSize = layout.value.cellSize;
  const widgetUnit = layout.value.widgetUnit;
  return (
    units * widgetUnit +
    (Math.floor((units * widgetUnit) / cellSize) - 1) * layout.value.gap
  );
}

const allWidgets: Widget[] = [
  {
    key: "starter",
    name: "启动器",
    position: {
      x: 0,
      y: 0,
    },
    size: {
      w: getWidgetLength(3),
      h: getWidgetLength(2),
    },
  },
  {
    key: "weather",
    name: "天气",
    position: {
      x: 0,
      y: 0,
    },
    size: {
      w: getWidgetLength(3),
      h: getWidgetLength(2),
    },
  },
  {
    key: "calendar",
    name: "日历",
    position: {
      x: 0,
      y: 0,
    },
    size: {
      w: getWidgetLength(3),
      h: getWidgetLength(2),
    },
  },
  {
    key: "todo",
    name: "待办",
    position: {
      x: 0,
      y: 0,
    },
    size: {
      w: getWidgetLength(3),
      h: getWidgetLength(2),
    },
  },
  {
    key: "woodfish",
    name: "电子木鱼",
    position: {
      x: 0,
      y: 0,
    },
    size: {
      w: getWidgetLength(3),
      h: getWidgetLength(2),
    },
  },
];
function addWidget(key: string) {
  window.preload.addWidget(key);
}

onMounted(() => {
  window.utools.isDarkColors()
      ? document.documentElement.classList.add("dark")
      : document.documentElement.classList.remove("dark");
});
</script>
<style scoped></style>
