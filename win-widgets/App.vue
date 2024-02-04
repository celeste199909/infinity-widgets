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
      :disabled="true"
      :style="{
        width: `${layout.gridWidth}px`,
        height: `${layout.gridHeight}px`,
      }"
    >
      <Vue3DraggableResizable
        v-for="(item, index) in showWidgets"
        :key="item.key"
        class="widgets select-none border-0 "
        :class="item.draggable ? 'drag-mode' : ''"
        :initW="item.position.w"
        :initH="item.position.h"
        v-model:x="item.position.x"
        v-model:y="item.position.y"
        v-model:w="item.position.w"
        v-model:h="item.position.h"
        :lockAspectRatio="true"
        :draggable="item.draggable"
        :resizable="item.resizable"
        :active="true"
        :parent="true"
        classNameDragging="dragging"
        classNameDraggable="draggable"
        @drag-start="dragStartHandle"
        @dragging="draggingHandle"
        @drag-end="dragEndHandle"
        @mousedown="dragTarget = item"
      >
        <component
          :is="item.component"
          :widgetData="item"
          :id="item.key"
          :nearestPosition="nearestPosition"
        />
      </Vue3DraggableResizable>
      <!-- 下一个位置 -->
      <Vue3DraggableResizable
        v-if="dragTarget && onEditMode"
        class="next-position border-[1px] border-blue-300 bg-blue-300/20 backdrop-blur-sm -z-10 rounded-xl"
        :initW="nextPosistion.position.w"
        :initH="nextPosistion.position.h"
        v-model:x="nextPosistion.position.x"
        v-model:y="nextPosistion.position.y"
        v-model:w="nextPosistion.position.w"
        v-model:h="nextPosistion.position.h"
        classNameDragging="next-dragging"
        classNameDraggable="next-draggable"
      >
      </Vue3DraggableResizable>
    </DraggableContainer>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, computed, reactive, Ref } from "vue";
import Weather from "../w-common/components/Weather.vue";
import Calendar from "../w-common/components/Calendar.vue";
import Todo from "../w-common/components/Todo.vue";
// 组合函数
import { useLayout } from "./composables/useLayout";

const { layout, nearestPosition } = useLayout();

interface Widget {
  key: string;
  name: string;
  component: any;
  use: boolean;
  draggable: boolean;
  resizable: boolean;
  isDragging: boolean;
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

function getWidgetLength(units: number) {

  const cellSize = layout.value.cellSize;
  return units * cellSize  + (Math.floor(units * cellSize / cellSize) - 1) * layout.value.gap;
}

const allWidgets = ref([
  {
    key: "weather",
    name: "天气",
    component: Weather,
    use: false,
    draggable: false,
    resizable: false,
    isDragging: false,
    position: {
      x: 0,
      y: 0,
      w: getWidgetLength(1),
      h: getWidgetLength(1),
    },
  },
  {
    key: "calendar",
    name: "日历",
    component: Calendar,
    use: false,
    draggable: false,
    resizable: false,
    isDragging: false,
    position: {
      x: 0,
      y: 0,
      w: getWidgetLength(2),
      h: getWidgetLength(2),
    },
  },
  {
    key: "todo",
    name: "待办",
    component: Todo,
    use: false,
    draggable: false,
    resizable: false,
    isDragging: false,
    position: {
      x: 0,
      y: 0,
      w: getWidgetLength(2),
      h: 180 + (Math.floor(180 / layout.value.cellSize) - 1) * layout.value.gap,
    },
  },
]);

const onEditMode = ref(false);
const dragTarget: Ref<Widget | null> = ref(null);

const showWidgets = computed(() => {
  return allWidgets.value.filter((item) => item.use);
});

const nextPosistion = ref({
  key: "next-position",
  name: "下个位置",
  draggable: false,
  resizable: false,
  isDragging: false,
  position: {
    x: 0,
    y: 0,
    w: 0,
    h: 0,
  },
});

onMounted(() => {
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

  document.addEventListener("setEditModeEvent", function (event: any) {
    console.log("编辑模式！", event.detail);
    const eventDetail = event.detail;
    const editMode = eventDetail.key;
    onEditMode.value = editMode;
    allWidgets.value.forEach((item) => {
      item.draggable = editMode;
    });
  });
});

function dragStartHandle(payload: { x: number; y: number }) {}

function draggingHandle(payload: { x: number; y: number }) {
  const { x, y } = nearestPosition(payload.x, payload.y);
  if (dragTarget.value) {
    nextPosistion.value.position.w = dragTarget.value.position.w;
    nextPosistion.value.position.h = dragTarget.value.position.h;
  }
  nextPosistion.value.position.y = y;
  nextPosistion.value.position.x = x;
}

function dragEndHandle(payload: { x: number; y: number }) {
  const dragTargetId = dragTarget.value?.key;
  allWidgets.value.forEach((item) => {
    if (item.key === dragTargetId) {
      item.position.x = nextPosistion.value.position.x;
      item.position.y = nextPosistion.value.position.y;
    }
  });
  dragTarget.value = null;
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
.active {
  border: 0;
}
.drag-mode {
  animation: shake 0.5s ease-in-out infinite;
}

@keyframes shake {
  0% {
    transform: translateX(-1px);
  }
  50% {
    transform: translateX(1px);
  }
  100% {
    transform: translateX(-1px);
  }
}
</style>
