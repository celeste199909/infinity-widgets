<template>
  <div
    id="widgets-wrapper"
    class="flex flex-row gap-4 w-screen h-screen overflow-hidden justify-center items-center"
    :style="{
      padding: `${layout.padding}px`,
      paddingBottom: `${layout.padding + layout.extraPaddingBottom}px`,
    }"
  >
    <DraggableContainer
      :referenceLineVisible="true"
      :referenceLineColor="'#0f0'"
      :style="{
        width: `${layout.gridWidth}px`,
        height: `${layout.gridHeight}px`,
      }"
    >
      <Vue3DraggableResizable
        v-for="(item, index) in showWidgets"
        :key="item.key"
        class="widgets select-none"
        :initW="item.position.w"
        :initH="item.position.h"
        v-model:x="item.position.x"
        v-model:y="item.position.y"
        v-model:w="item.position.w"
        v-model:h="item.position.h"
        :lockAspectRatio="true"
        :draggable="true"
        :resizable="item.resizable"
        :parent="true"
        classNameDragging="dragging"
        classNameDraggable="draggable"
        @drag-start="dragStartHandle"
        @dragging="draggingHandle"
        @drag-end="dragEndHandle"
      >
        <component
          :is="item.component"
          :widgetData="item"
          :nearestPosition="nearestPosition"
        />
      </Vue3DraggableResizable>
    </DraggableContainer>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, computed, reactive } from "vue";
import Weather from "../w-common/components/Weather.vue";
import Calendar from "../w-common/components/Calendar.vue";
import Todo from "../w-common/components/Todo.vue";
// 组合函数
import { useLayout } from "./composables/useLayout";

const { layout, nearestPosition } = useLayout();
console.log(
  "%c [ layout ]-50",
  "font-size:13px; background:pink; color:#bf2c9f;",
  layout
);

const allWidgets = ref([
  {
    key: "weather",
    name: "天气",
    component: Weather,
    use: false,
    draggable: false,
    resizable: false,
    position: {
      x: 0,
      y: 0,
      w: 200,
      h: 160,
    },
  },
  {
    key: "calendar",
    name: "日历",
    component: Calendar,
    use: false,
    draggable: false,
    resizable: false,
    position: {
      x: 0,
      y: 0,
      w: 200,
      h: 160,
    },
  },
  {
    key: "todo",
    name: "待办",
    component: Todo,
    use: false,
    draggable: false,
    resizable: false,
    position: {
      x: 0,
      y: 0,
      w: 200,
      h: 160,
    },
  },
]);

const showWidgets = computed(() => {
  return allWidgets.value.filter((item) => item.use);
});

const widgetsWrapperLayout = ref({ width: 0, height: 0, cellSize: 0 });

onMounted(() => {
  // 设置小组件容器布局
  widgetsWrapperLayout.value = {
    width: document.getElementById("widgets-wrapper")!.offsetWidth,
    height: document.getElementById("widgets-wrapper")!.offsetHeight,
    cellSize: 60,
  };

  // 监听自定义事件
  document.addEventListener("addWidgetEvent", function (event: any) {
    console.log("添加小组件", event.detail.key);
    const eventDetail = event.detail;
    const widgetName = eventDetail.key;
    allWidgets.value.forEach((item) => {
      if (item.key === widgetName) {
        item.use = true;
      }
    });
  });

  document.addEventListener("removeWidgetEvent", function (event: any) {
    console.log("移除小组件！", event.detail.key);
    const eventDetail = event.detail;
    const widgetName = eventDetail.key;
    allWidgets.value.forEach((item) => {
      if (item.key === widgetName) {
        item.use = false;
      }
    });
  });
});

function dragStartHandle(payload: { x: number; y: number }) {
  // active.value = true;
  console.log(
    "%c [ dragStartHandle ]-135",
    "font-size:13px; background:pink; color:#bf2c9f;",
    payload
  );
}

function draggingHandle(payload: { x: number; y: number }) {
  // active.value = true;
  console.log(
    "%c [ draggingHandle ]-135",
    "font-size:13px; background:pink; color:#bf2c9f;",
    payload
  );
}

function dragEndHandle(payload: { x: number; y: number }) {
  // active.value = false;
  console.log(
    "%c [ dragEndHandle ]-135",
    "font-size:13px; background:pink; color:#bf2c9f;",
    payload
  );
}

</script>
<style scoped>
.dragging {
  border: 0;
  transform: scale(1.1);
  opacity: 0.8;
}
.draggable {
  border: 0;
}
</style>
