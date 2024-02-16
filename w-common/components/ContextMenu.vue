<template>
  <div
    v-if="isShowContextMenu"
    class="absolute w-48 p-3 select-none text-white bg-slate-700 rounded-md flex flex-col gap-y-1 z-10"
    :style="{
      left: contextMenuPosition.x - 5 + 'px',
      top: contextMenuPosition.y - 5 + 'px',
    }"
    @mouseleave="isShowContextMenu = false"
  >
    <!-- 编辑 -->
    <div
      @click="toggleEdit"
      class="cursor-pointer hover:bg-slate-500 p-2 rounded-xl"
    >
      {{ clickTargetData?.draggable ? "退出编辑" : "进入编辑" }}
    </div>
    <!-- 尺寸 -->
    <div class="cursor-pointer hover:bg-slate-500 p-2 rounded-xl">更改尺寸</div>
    <div class="flex flex-row flex-wrap gap-2 p-2">
      <div
        v-for="(item, key) in clickTargetData?.style"
        class="px-2 py-1 rounded-xl flex justify-center items-center cursor-pointer"
        @click="changeStyle(key as string)"
        :class="
          clickTargetData?.currentStyle === key
            ? 'bg-blue-400 hover:bg-blue-400'
            : 'bg-slate-500 hover:bg-slate-400'
        "
      >
        {{ key }}
      </div>
    </div>
    <!-- 批量编辑 -->
    <div
      class="cursor-pointer hover:bg-slate-500 p-2 rounded-xl"
      @click="bulkEdit()"
    >
      {{ onBulkEdit ? "退出批量编辑" : "进入批量编辑" }}
    </div>
    <!-- 添加新组件 -->
    <!-- <div class="cursor-pointer hover:bg-slate-500 p-2 rounded-xl"
    @click="handleAddWidget"
    >
      添加新组件
    </div> -->
    <!-- 删除组件 -->
    <div
      class="text-red-500 cursor-pointer hover:bg-slate-500 p-2 rounded-xl"
      @click="handleRemoveWidget(clickTargetData)"
    >
      删除组件
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, onMounted, ref, Ref } from "vue";
import { useMouse } from "@vueuse/core";
import _ from "lodash";
import { Widget } from "../types/widget";
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
