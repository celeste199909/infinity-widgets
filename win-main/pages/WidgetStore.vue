<template>
  <!-- 小组件列表 -->
  <div class="w-full h-full select-none flex-1 p-2 overflow-y-scroll flex flex-row flex-wrap content-start gap-2">
    <div v-for="item in allWidgets" :key="item.key"
      class="flex flex-grow-0 flex-shrink-0 flex-col items-center gap-2 p-2">
      <div class="card rounded-xl w-full overflow-hidden relative">
        <!-- 添加按钮 -->
        <div class="add absolute right-2 top-2 z-10 cursor-pointer" @click="addWidget(item.key)">
          <img src="../../w-common/assets/icons/add-100.png" class="w-7 h-7">
        </div>
        <WidgetComp :widgetName="item.key" :widgetData="item" :id="item.key" />
      </div>
      <div class="text-slate-700 dark:text-slate-100 font-bold text-center">
        {{ item.name }}
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { onMounted, ref, Ref } from "vue";
import WidgetComp from "../../w-common/components/WidgetComp.vue";
import { Widget } from "../../w-common/types/widget";
// 组合函数
import { useLayout } from "../../win-widgets/composables/useLayout";
const { layout, nearestPosition } = useLayout();

const widgetsList = [
  {
    key: "app-starter",
    name: "应用启动器",
    position: {
      x: 0,
      y: 0,
    },
    size: {
      w: getWidgetLength(2),
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
      w: getWidgetLength(2),
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
      w: getWidgetLength(2),
      h: getWidgetLength(2),
    },
  },
  {
    key: "paint-board",
    name: "画板",
    position: {
      x: 0,
      y: 0,
    },
    size: {
      w: getWidgetLength(2),
      h: getWidgetLength(2),
    },
  }
];

function getWidgetLength(units: number) {
  const cellSize = layout.value.cellSize;
  const widgetUnit = layout.value.widgetUnit;
  return (
    units * widgetUnit +
    (Math.floor((units * widgetUnit) / cellSize) - 1) * layout.value.gap
  );
}

const allWidgets: Ref<Widget[]> = ref(widgetsList);

function addWidget(key: string) {
  window.preload.addWidget(key);
}

onMounted(() => {
  window.utools.isDarkColors()
    ? document.documentElement.classList.add("dark")
    : document.documentElement.classList.remove("dark");
});

</script>
<style scoped>
.ghost {
  opacity: 0;
}

.dragging {
  opacity: 1;
}

.card {
  transition: all 0.2s;
  position: relative;
}

.card::after {
  content: "";
  display: block;
  position: absolute;
  top: 0;
  right: -100%;
  width: 200%;
  height: 20%;
  background: linear-gradient(transparent,
      rgba(255, 255, 255, 0.2),
      transparent);
  z-index: 1;
  transform: rotate(30deg) translateY(0);
  transform-origin: top right;
  /* 设置为右上角 */
}

.card:hover::after {
  animation: shine 0.5s linear;
}

@keyframes shine {
  0% {
    transform: rotate(30deg) translateY(0);
  }

  100% {
    transform: rotate(30deg) translateY(1200%);
  }
}

.card:hover {
  transform: scale(1.05);
  border-radius: 12px;
}

.add {
  display: none;
  opacity: 0.8;
}

.card:hover .add {
  display: block;
  animation: add-btn-fade-in 0.5s;
}

@keyframes add-btn-fade-in {
  0% {
    opacity: 0;
  }

  100% {
    opacity: 0.8;
  }
}
</style>
  