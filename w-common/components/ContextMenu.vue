<template>
  <div
    v-if="isShowContextMenu"
    class="absolute w-52 p-3 select-none text-slate-700 bg-gradient-to-br from-cyan-100 to-sky-100 dark:text-slate-100 dark:bg-gradient-to-r dark:from-slate-700 dark:to-slate-600 rounded-md flex flex-col gap-y-1 z-10"
    :style="{
      left: contextMenuPosition.x - 5 + 'px',
      top: contextMenuPosition.y - 5 + 'px',
    }"
    @mouseleave="isShowContextMenu = false"
  >
    <div
      class="w-full h-full backdrop-blur-lg bg-white/50 rounded-lg dark:bg-transparent flex flex-col"
    >
      <!-- 编辑 -->
      <div
        @click="toggleEdit"
        class="cursor-pointer transition hover:bg-white/80 dark:hover:bg-black/20 p-2 rounded-lg flex flex-row justify-start items-center gap-x-2"
      >
        <Icon :name="'edit'" class="w-5 h-5" color="#8d8df9" :width="3" />
        <div>{{ clickTargetData?.draggable ? "退出编辑" : "进入编辑" }}</div>
      </div>
      <!-- 置顶 -->
      <div
        @click="toggleOnTop"
        class="cursor-pointer transition hover:bg-white/80 dark:hover:bg-black/20 p-2 rounded-lg flex flex-row justify-start items-center gap-x-2"
      >
        <Icon name="top" class="w-5 h-5" color="#8d8df9" :width="3" />
        <div>{{ clickTargetData?.onTop ? "取消置顶" : "置顶" }}</div>
      </div>
      <!-- 尺寸 -->
      <div
        class="cursor-pointer transition hover:bg-white/80 dark:hover:bg-black/20 p-2 rounded-lg flex flex-row justify-start items-center gap-x-2"
      >
        <Icon name="change-size" class="w-5 h-5" color="#8d8df9" :width="3" />
        <div>尺寸</div>
      </div>
      <div class="flex flex-row flex-wrap gap-2 p-2 my-1">
        <div
          v-for="(item, key) in clickTargetData?.style"
          class="px-3 py-1 transition text-sm rounded-2xl flex justify-center items-center cursor-pointer"
          @click="changeStyle(key as string)"
          :class="
            clickTargetData?.currentStyle === key
              ? 'bg-[#8d8df9] text-white hover:bg-[#8080ff] dark:bg-[#8d8df9] dark:hover:bg-[#8080ff]'
              : 'bg-white/80 hover:bg-[#8d8df9] hover:text-white dark:bg-slate-500 dark:hover:bg-[#8080ff]'
          "
        >
          {{ key }}
        </div>
      </div>
      <!-- 批量编辑 -->
      <div
        class="cursor-pointer transition hover:bg-white/80 dark:hover:bg-black/20 p-2 rounded-lg flex flex-row justify-start items-center gap-x-2"
        @click="bulkEdit()"
      >
        <Icon :name="'edit'" class="w-5 h-5" color="#8d8df9" :width="3" />
        <div>{{ onBulkEdit ? "退出批量编辑" : "批量编辑" }}</div>
      </div>
      <!-- 删除组件 -->
      <div
        class="cursor-pointer transition hover:bg-white/80 dark:hover:bg-black/20 p-2 rounded-lg flex flex-row justify-start items-center gap-x-2"
        @click="handleRemoveWidget(clickTargetData)"
      >
        <Icon name="delete" class="w-5 h-5" color="#8d8df9" :width="3" />
        <div>删除组件</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, onMounted, ref, Ref } from "vue";
import { useMouse } from "@vueuse/core";
import _ from "lodash";
import { Widget } from "../types/widget";

import Icon from "./icon/Icon.vue";
import gsap from "gsap";

const props = defineProps({
  showWidgets: {
    type: Array<Widget>,
    required: true,
  },
  onBulkEdit: {
    type: Boolean,
    required: true,
  },
  modifyWidgetData: {
    type: Function,
    required: true,
  },
  removeWidget: {
    type: Function,
    required: true,
  },
  bulkEdit: {
    type: Function,
    required: true,
  },
  addWidgetFromTop: {
    type: Function,
    required: false,
  },
});

const clickTargetId: Ref<string | null> = ref(null); // 点击的目标
// 当前点击的目标数据
const clickTargetData = computed(() => {
  return props.showWidgets.find((item) => item.id === clickTargetId.value);
});
const contextMenuPosition = ref({ x: 0, y: 0 }); // 右键菜单位置
const { x, y, sourceType } = useMouse();

const isShowContextMenu = ref(false);

onMounted(() => {
  // 监听鼠标右键, 显示右键菜单，获取点击的目标id
  window.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    event.stopPropagation();
    // 获取path上class 包含 widget 的元素, 再获取它的id
    const path = event.composedPath(); // 获取 DOM 元素路径
    const widget = path.find((item) => {
      if (item instanceof HTMLElement && item.classList.contains("widget")) {
        contextMenuPosition.value = { x: x.value, y: y.value };
        isShowContextMenu.value = true;
        return true;
      }
      return false;
    });

    if (widget instanceof HTMLElement) {
      const widgetId = widget.id; // 这里可以安全地访问 id 属性
      clickTargetId.value = widgetId;
    }
  });
});

function toggleEdit() {
  // 通过点击的目标id, 获取对应的widgetData
  const widgetData = props.showWidgets.find(
    (item) => item.id === clickTargetId.value
  );
  if (widgetData) {
    widgetData.draggable = !widgetData.draggable;
    props.modifyWidgetData(widgetData);
  }
  isShowContextMenu.value = false;
}

function toggleOnTop() {
  const isOnTopWidgetContainer =
    utools.dbStorage.getItem("isOnTopWidgetContainer") || false;

  if (!isOnTopWidgetContainer) {
    utools.showNotification("请先在设置中开启【置顶功能】");
    return;
  }

  // 通过点击的目标id, 获取对应的widgetData
  const widgetData = props.showWidgets.find(
    (item) => item.id === clickTargetId.value
  );
  if (widgetData) {
    // 标记为置顶
    // widgetData.onTop = !widgetData.onTop;
    // props.modifyWidgetData(widgetData);
    // // 把组件添加到顶部容器
    // window.preload.addWidgetToTop(widgetData);
    if (widgetData.onTop) {
      // 鼠标右键点击位于顶部容器的组件, 移除置顶
      // 1 通知原来的容器添加组件
      // 添加到顶部容器
      window.winTop.addWidgetToOrigin(JSON.stringify(widgetData));
      // 2 从当前顶部容器移除组件
      props.removeWidget(widgetData.id);
    } else {
      // 添加到顶部容器
      window.winWidget.addWidgetToTop(JSON.stringify(widgetData));
      // 从原来的容器移除
      props.removeWidget(widgetData.id);
    }
  }
  isShowContextMenu.value = false;
}

function handleRemoveWidget(widgetData: Widget | undefined) {
  if (widgetData) {
    const widget = document.getElementById("w-" + clickTargetId.value);
    if (widget) {
      gsap.to(`#w-${clickTargetId.value}`, {
        duration: 0.3,
        scale: 0,
        ease: "back.in(1.4)",
      });
    }
    setTimeout(() => {
      props.removeWidget(widgetData.id);
    }, 300);
  }
  isShowContextMenu.value = false;
}

function changeStyle(key: string) {
  // 通过点击的目标id, 获取对应的widgetData
  const widgetData = props.showWidgets.find(
    (item) => item.id === clickTargetId.value
  );

  if (widgetData && widgetData.style) {
    widgetData.currentStyle = key;
    widgetData.size.w = widgetData.style[key].w;
    widgetData.size.h = widgetData.style[key].h;
    props.modifyWidgetData(widgetData);
  }
}

function handleAddWidget() {
  // window.utools.showMainWindow();
  window.utools.redirect("无限小组件", "无限小组件");
  isShowContextMenu.value = false;
}
</script>
<style scoped></style>
