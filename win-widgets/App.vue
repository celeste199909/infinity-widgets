<template>
  <div
    id="widgets-wrapper"
    class="flex flex-row gap-4 w-screen h-screen overflow-hidden justify-center items-center relative"
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
        :key="item.id"
        :id="item.id"
        class="widget select-none border-0"
        :class="item.draggable ? 'drag-mode' : ''"
        :initW="item.size.w"
        :initH="item.size.h"
        v-model:x="item.position.x"
        v-model:y="item.position.y"
        v-model:w="item.size.w"
        v-model:h="item.size.h"
        :lockAspectRatio="true"
        :draggable="item.draggable"
        :resizable="false"
        :active="true"
        :parent="true"
        classNameDragging="dragging"
        classNameDraggable="draggable"
        @drag-start="dragStartHandle"
        @dragging="draggingHandle"
        @drag-end="dragEndHandle"
        @mousedown="handleMouseDown(item, $event)"
      >
        <WidgetComp
          :widgetData="item"
          :id="'w-' + item.id"
          :modifyWidgetData="modifyWidgetData"
        />
      </Vue3DraggableResizable>
      <!-- 下一个位置 -->
      <Vue3DraggableResizable
        v-if="dragTarget?.draggable === true"
        class="next-position bg-blue-300/60 backdrop-blur-sm -z-10 rounded-xl"
        :initW="nextPosistion.size.w"
        :initH="nextPosistion.size.h"
        v-model:x="nextPosistion.position.x"
        v-model:y="nextPosistion.position.y"
        v-model:w="nextPosistion.size.w"
        v-model:h="nextPosistion.size.h"
        classNameDragging="next-dragging"
        classNameDraggable="next-draggable"
      >
      </Vue3DraggableResizable>
    </DraggableContainer>
    <!-- 右键菜单 -->
    <ContextMenu
      :showWidgets="showWidgets"
      :onBulkEdit="onBulkEdit"
      :modifyWidgetData="modifyWidgetData"
      :removeWidget="removeWidget"
      :bulkEdit="bulkEdit"
    />
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, Ref, toValue, computed } from "vue";
import WidgetComp from "../w-common/components/WidgetComp.vue";
import ContextMenu from "../w-common/components/ContextMenu.vue";
// 组合函数
import { useLayout } from "./composables/useLayout";
import { watchDeep } from "@vueuse/core";

import { customAlphabet } from "nanoid";

const nanoid = customAlphabet(
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  16
);

import { Widget } from "../w-common/types/widget";

const { layout, nearestPosition, getNearestEmptyPosition } = useLayout();

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
    key: "juejin-hot",
    name: "掘金热榜",
    position: {
      x: 0,
      y: 0,
    },
    size: {
      w: getWidgetLength(2),
      h: getWidgetLength(2),
    },
    currentStyle: "2x2",
    style: {
      "2x2": {
        w: getWidgetLength(2),
        h: getWidgetLength(2),
      },
      "3x2": {
        w: getWidgetLength(3),
        h: getWidgetLength(2),
      },
      "3x3": {
        w: getWidgetLength(3),
        h: getWidgetLength(3),
      },
      "4x2": {
        w: getWidgetLength(4),
        h: getWidgetLength(2),
      },
      "4x3": {
        w: getWidgetLength(4),
        h: getWidgetLength(3),
      },
    },
    data: {},
  },
  {
    key: "hot-search",
    name: "热搜",
    position: {
      x: 0,
      y: 0,
    },
    size: {
      w: getWidgetLength(2),
      h: getWidgetLength(2),
    },
    currentStyle: "2x2",
    style: {
      "2x2": {
        w: getWidgetLength(2),
        h: getWidgetLength(2),
      },
      "3x2": {
        w: getWidgetLength(3),
        h: getWidgetLength(2),
      },
      "3x3": {
        w: getWidgetLength(3),
        h: getWidgetLength(3),
      },
    },
    data: {},
  },
  {
    key: "alarm",
    name: "闹钟",
    position: {
      x: 0,
      y: 0,
    },
    size: {
      w: getWidgetLength(3),
      h: getWidgetLength(3),
    },
    currentStyle: "3x3",
    style: {
      "3x3": {
        w: getWidgetLength(3),
        h: getWidgetLength(3),
      },
    },
    data: {},
  },
  {
    key: "countdown",
    name: "倒计时",
    position: {
      x: 0,
      y: 0,
    },
    size: {
      w: getWidgetLength(3),
      h: getWidgetLength(3),
    },
    currentStyle: "3x3",
    style: {
      "3x3": {
        w: getWidgetLength(3),
        h: getWidgetLength(3),
      },
    },
    data: {},
  },
  // {
  //   key: "github-contributions",
  //   name: "GitHub贡献图(beta)",
  //   position: {
  //     x: 0,
  //     y: 0,
  //   },
  //   size: {
  //     w: getWidgetLength(9),
  //     h: getWidgetLength(2),
  //   },
  //   currentStyle: "9x2",
  //   style: {
  //     "9x2": {
  //       w: getWidgetLength(9),
  //       h: getWidgetLength(2),
  //     },
  //   },
  //   data: {},
  // },
  {
    key: "app-starter",
    name: "应用启动器",
    position: {
      x: 0,
      y: 0,
    },
    size: {
      w: getWidgetLength(1),
      h: getWidgetLength(1),
    },
    currentStyle: "1x1",
    style: {
      "1x1": {
        w: getWidgetLength(1),
        h: getWidgetLength(1),
      },
      "2x2": {
        w: getWidgetLength(2),
        h: getWidgetLength(2),
      },
    },
    data: {},
  },
  {
    key: "weather",
    name: "天气",
    position: {
      x: 0,
      y: 0,
    },
    size: {
      w: getWidgetLength(2),
      h: getWidgetLength(2),
    },
    currentStyle: "2x2",
    style: {
      "2x2": {
        w: getWidgetLength(2),
        h: getWidgetLength(2),
      },
      "3x2": {
        w: getWidgetLength(3),
        h: getWidgetLength(2),
      },
    },
    data: {},
  },
  {
    key: "calendar",
    name: "日历",
    position: {
      x: 0,
      y: 0,
    },
    size: {
      w: getWidgetLength(2),
      h: getWidgetLength(2),
    },
    currentStyle: "2x2",
    style: {
      "2x2": {
        w: getWidgetLength(2),
        h: getWidgetLength(2),
      },
      "3x3": {
        w: getWidgetLength(3),
        h: getWidgetLength(3),
      },
    },
    data: {},
  },
  {
    key: "todo",
    name: "To do",
    position: {
      x: 0,
      y: 0,
    },
    size: {
      w: getWidgetLength(3),
      h: getWidgetLength(4),
    },
    currentStyle: "3x4",
    style: {
      "3x4": {
        w: getWidgetLength(3),
        h: getWidgetLength(4),
      },
      "4x5": {
        w: getWidgetLength(4),
        h: getWidgetLength(5),
      },
    },
    data: {},
  },
  {
    key: "drink-water",
    name: "喝水",
    position: {
      x: 0,
      y: 0,
    },
    size: {
      w: getWidgetLength(2),
      h: getWidgetLength(2),
    },
    currentStyle: "2x2",
    style: {
      "2x2": {
        w: getWidgetLength(2),
        h: getWidgetLength(2),
      },
      "3x3": {
        w: getWidgetLength(3),
        h: getWidgetLength(3),
      },
    },
    data: {},
  },
];

const dragTarget: Ref<Widget | null> = ref(null);
const showWidgets = ref<Widget[]>(
  utools.dbStorage.getItem("showWidgets") || []
);
watchDeep(showWidgets, () => {
  saveWidgetData();
});
// 如果至少有一个小组件的 draggable 为 true，则onBulkEdit 为 true
const onBulkEdit = computed(() => {
  return showWidgets.value.some((item) => item.draggable);
});
const nextPosistion: Ref<Widget> = ref({
  id: "next-position",
  key: "next-position",
  name: "下个位置",
  draggable: false,
  resizable: false,
  position: {
    x: 0,
    y: 0,
  },
  size: {
    w: 0,
    h: 0,
  },
});

onMounted(() => {
  // 系统主题
  // window.utools.isDarkColors()
  //   ? document.documentElement.classList.add("dark")
  //   : document.documentElement.classList.remove("dark");

  // 监听自定义事件
  document.addEventListener("addWidgetEvent", function (event: any) {
    console.log("添加小组件", event.detail.key);
    const eventDetail = event.detail;
    const widgetName = eventDetail.key;
    addWidget(widgetName);
  });

  document.addEventListener("winBlurEvent", function (event: any) {
    console.log("失去焦点", event.detail.key);
    window.utools.isDarkColors()
      ? document.documentElement.classList.add("dark")
      : document.documentElement.classList.remove("dark");
  });

  document.addEventListener("winFocusEvent", function (event: any) {
    console.log("获得焦点", event.detail.key);
    window.utools.isDarkColors()
      ? document.documentElement.classList.add("dark")
      : document.documentElement.classList.remove("dark");
  });

  document.addEventListener("removeAllWidgetsEvent", function (event: any) {
    console.log("删除所有小组件", event.detail.key);
    showWidgets.value = [];
    utools.dbStorage.setItem("showWidgets", []);
  });
});

// 保存widget数据
function saveWidgetData() {
  utools.dbStorage.setItem(
    "showWidgets",
    JSON.parse(JSON.stringify(toValue(showWidgets.value)))
  );
}

// 修改widget数据
function modifyWidgetData(widgetData: Widget, attribution: string) {
  showWidgets.value.forEach((item) => {
    if (item.id === widgetData.id) {
      item.currentStyle = widgetData.currentStyle;
      item.size = widgetData.size;
      item.style = widgetData.style;
      item.data = widgetData.data;
      item.name = widgetData.name;
      item.draggable = widgetData.draggable;
      item.resizable = widgetData.resizable;
      item.position = widgetData.position;
    }
  });
}

// 添加 widget
function addWidget(key: string) {
  const widget = allWidgets.find((item) => item.key === key);
  if (widget) {
    const { x, y } = getNearestEmptyPosition(
      toValue(showWidgets.value),
      toValue(widget)
    );
    showWidgets.value.push({
      id: nanoid(),
      key: widget.key,
      name: widget.name,
      draggable: true,
      resizable: false,
      position: {
        x: x,
        y: y,
      },
      size: {
        w: widget.size.w,
        h: widget.size.h,
      },
      currentStyle: widget.currentStyle,
      style: widget.style,
      data: widget.data,
    });
  }
}

// 删除 widget
function removeWidget(id: string) {
  showWidgets.value = showWidgets.value.filter((item) => item.id !== id);
}

// 批量编辑
function bulkEdit() {
  if (onBulkEdit.value) {
    showWidgets.value.forEach((item) => {
      item.draggable = false;
    });
  } else {
    showWidgets.value.forEach((item) => {
      item.draggable = true;
    });
  }
}

function handleMouseDown(item: Widget, event: MouseEvent) {
  dragTarget.value = item;
}

function dragStartHandle(payload: { x: number; y: number }) {
  if (dragTarget.value) {
    nextPosistion.value.size.w = dragTarget.value?.size.w;
    nextPosistion.value.size.h = dragTarget.value?.size.h;
  }
  nextPosistion.value.position.x = nearestPosition(payload.x, payload.y).x;
  nextPosistion.value.position.y = nearestPosition(payload.x, payload.y).y;
}

function draggingHandle(payload: { x: number; y: number }) {
  const { x, y } = nearestPosition(payload.x, payload.y);
  if (dragTarget.value) {
    nextPosistion.value.size.w = dragTarget.value.size.w;
    nextPosistion.value.size.h = dragTarget.value.size.h;
  }
  nextPosistion.value.position.y = y;
  nextPosistion.value.position.x = x;
}

function dragEndHandle(payload: { x: number; y: number }) {
  if (!dragTarget.value) return;
  const dragTargetId = dragTarget.value?.id;
  showWidgets.value.forEach((item) => {
    if (item.id === dragTargetId) {
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

/* .widget {
  transition: width 0.3s, height 0.3s;
} */

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
