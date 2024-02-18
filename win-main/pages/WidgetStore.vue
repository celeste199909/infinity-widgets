<template>
  <!-- 小组件列表 -->
  <div
    class="w-full h-full gap-4 select-none flex-1 p-2 overflow-y-scroll flex flex-row flex-wrap content-start"
  > 
    <!-- 提示 -->
    <div v-if="!isOnWidgetContainer" class="w-full h-12 bg-orange-600 shadow-lg text-white p-2 px-4 rounded-xl flex flex-row justify-between items-center">
      <div>注意：使用前请先到设置中开启<span class="font-bold"> 小组件容器 </span>方可添加组件到桌面，开启前请仔细阅读说明。</div>
    </div>
    <!-- 列表 -->
    <div
      v-for="item in allWidgets"
      :key="item.key"
      class="flex flex-grow-0 flex-shrink-0 flex-col items-center gap-6 p-2"
    >
      <div class="card rounded-xl w-full overflow-hidden relative">
        <!-- 添加按钮 -->
        <div
          class="add w-7 h-7 absolute right-2 top-2 z-10 cursor-pointer"
          @click="addWidget(item.key)"
        >
          <img src="../../w-common/assets/icons/add-96-green.png" class="" />
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
import { onMounted, ref, Ref, inject } from "vue";
import WidgetComp from "../../w-common/components/WidgetComp.vue";
import { Widget } from "../../w-common/types/widget";
// 组合函数
import { useLayout } from "../../win-widgets/composables/useLayout";
const { layout } = useLayout();

const isOnWidgetContainer = inject("isOnWidgetContainer") as Ref<boolean>;

const widgetsList = [
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
  },
  // {
  //   key: "alarm",
  //   name: "闹钟",
  //   position: {
  //     x: 0,
  //     y: 0,
  //   },
  //   size: {
  //     w: getWidgetLength(2),
  //     h: getWidgetLength(2),
  //   },
  // },
  // {
  //   key: "countdown",
  //   name: "倒计时",
  //   position: {
  //     x: 0,
  //     y: 0,
  //   },
  //   size: {
  //     w: getWidgetLength(2),
  //     h: getWidgetLength(2),
  //   },
  // },
  // {
  //   key: "github-contributions",
  //   name: "GitHub贡献图(beta)",
  //   position: {
  //     x: 0,
  //     y: 0,
  //   },
  //   size: {
  //     w: getWidgetLength(3),
  //     h: getWidgetLength(2),
  //   },
  // },
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
      w: getWidgetLength(2),
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
    name: "To Do",
    position: {
      x: 0,
      y: 0,
    },
    size: {
      w: getWidgetLength(2),
      h: getWidgetLength(2),
    },
  },
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
  if(!isOnWidgetContainer.value) {
    window.utools.showNotification("请先在设置中开启【小组件容器】");
    return;
  }
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
  filter: drop-shadow(6px 6px 1rem rgba(0, 0, 0, 0.1));
}

.dark .card {
  filter: drop-shadow(6px 6px 1rem rgba(0, 0, 0, 0.3));
}

.card::after {
  content: "";
  display: block;
  position: absolute;
  top: 0;
  right: -100%;
  width: 200%;
  height: 20%;
  background: linear-gradient(
    transparent,
    rgba(255, 255, 255, 0.2),
    transparent
  );
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

/* .card:hover {
  transform: scale(1.05);
  border-radius: 12px;
} */

.add {
  display: none;
  opacity: 0.8;
  transition: opacity 0.5s;
}

.add:hover {
  opacity: 1;
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
