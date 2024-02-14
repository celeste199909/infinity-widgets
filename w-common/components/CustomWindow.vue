<template>
  <div
    :id="winId"
    class="custom-window flex flex-col overflow-hidden absolute select-none box-border m-0"
    :style="{
      width: windowState.windowWidth + 'px',
      height: windowState.windowHeight + 'px',
      left: windowState.windowLeft + 'px',
      top: windowState.windowTop + 'px',
      borderRadius: borderRadius,
    }"
  >
    <!-- bar -->
    <div
      class="w-full h-12 absolute top-0 left-0 right-0 text-slate-200 min-h-12 max-h-12 p-4 flex flex-row justify-between items-center z-10"
      @mousedown="startDrag"
    >
      <!-- 名字 -->
      <div class="font-bold" v-if="showTitle">{{ name }}</div>
      <div v-else></div>
      <!-- 操作按钮 -->
      <div class="flex flex-row gap-3">
        <div v-if="maxminze" @click="toggleFullscreen">
          <img
            v-if="maxminzeBtnStyle === 'black'"
            src="../assets/icons/maxminze-50-black.png"
            class="w-6 h-6"
          />
          <img
            v-else
            src="../assets/icons/maxminze-50-white.png"
            class="w-6 h-6"
          />
        </div>
        <div @click="closeWindow" class="flex justify-center items-center overflow-hidden">
          <img
            v-if="closeBtnStyle === 'black'"
            src="../assets/icons/close-50-black.png"
            class="w-6 h-6"
          />
          <img
            v-else
            src="../assets/icons/close-50-white.png"
            class="w-6 h-6"
          />
        </div>
      </div>
    </div>
    <!-- 内容 -->
    <div class="flex-1 w-full overflow-hidden">
      <slot></slot>
    </div>
    <!-- 伸缩句柄 -->
    <!-- 右边 -->
    <div
      class="handle-r cursor-ew-resize absolute right-0 top-0 w-1 h-full"
      @mousedown="startResize"
    ></div>
    <!-- 下边 -->
    <div
      class="handle-b cursor-ns-resize absolute bottom-0 left-0 right-0 w-full h-1"
      @mousedown="startResize"
    ></div>
    <!-- 右下角 -->
    <div
      class="handle-rb cursor-nwse-resize absolute right-0 bottom-0 w-3 h-3 rounded-full opacity-20 hover:opacity-50 hover:w-5 hover:h-5 transition bg-blue-500 z-10"
      @mousedown="startResize"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, defineProps, onMounted } from "vue";
import { gsap } from "gsap";
import { set } from "@vueuse/core";
const props = defineProps({
  winId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  width: {
    type: Number,
    default: 1000,
  },
  height: {
    type: Number,
    default: 700,
  },
  closeFunction: {
    type: Function,
    required: true,
  },
  maxminze: {
    type: Boolean,
    default: true,
    required: false,
  },
  showTitle: {
    type: Boolean,
    default: true,
    required: false,
  },
  closeBtnStyle: {
    type: String,
    default: "white",
    required: false,
  },
  maxminzeBtnStyle: {
    type: String,
    default: "white",
    required: false,
  },
});

const borderRadius = ref("12px");
const initWindowWidth = props.width;
const initWindowHeight = props.height;
const screenWidth = document.documentElement.clientWidth;
const screenHeight = document.documentElement.clientHeight;
const initwindowLeft = (screenWidth - initWindowWidth) / 2;
const initwindowTop = (screenHeight - initWindowHeight) / 2 - 60;

const windowState = reactive({
  isDragging: false,
  isResizing: false,
  offsetX: 0,
  offsetY: 0,
  originalWidth: 0,
  originalHeight: 0,
  windowWidth: initWindowWidth,
  windowHeight: initWindowHeight,
  windowLeft: initwindowLeft,
  windowTop: initwindowTop,
  clickTarget: null as EventTarget | null,
  isMaximized: false,
});

const startDrag = (e: MouseEvent) => {
  if (windowState.isMaximized) {
    return;
  }
  windowState.isDragging = true;
  windowState.offsetX = e.clientX - windowState.windowLeft;
  windowState.offsetY = e.clientY - windowState.windowTop;
};

const startResize = (e: MouseEvent) => {
  if (windowState.isMaximized) {
    return;
  }
  windowState.isResizing = true;
  windowState.clickTarget = e.target;
  windowState.originalWidth = document.documentElement.clientWidth;
  windowState.originalHeight = document.documentElement.clientHeight;
};

const onMouseMove = (e: MouseEvent) => {
  if (windowState.isDragging) {
    windowState.windowLeft = e.clientX - windowState.offsetX;
    windowState.windowTop = e.clientY - windowState.offsetY;
  }
  if (windowState.isResizing) {
    const target = windowState.clickTarget as HTMLElement;
    if (target.classList.contains("handle-r")) {
      windowState.windowWidth =
        windowState.originalWidth +
        e.clientX -
        windowState.originalWidth -
        windowState.windowLeft;
    }

    if (target.classList.contains("handle-b")) {
      windowState.windowHeight =
        windowState.originalHeight +
        e.clientY -
        windowState.originalHeight -
        windowState.windowTop;
    }

    if (target.classList.contains("handle-rb")) {
      windowState.windowWidth =
        windowState.originalWidth +
        e.clientX -
        windowState.originalWidth -
        windowState.windowLeft;
      windowState.windowHeight =
        windowState.originalHeight +
        e.clientY -
        windowState.originalHeight -
        windowState.windowTop;
    }
  }
};

const stopDrag = () => {
  windowState.isDragging = false;
};

const stopResize = () => {
  windowState.isResizing = false;
};

const toggleFullscreen = () => {
  // Add your logic to toggle fullscreen mode here
  if (windowState.isMaximized) {
    gsap.to(`#${props.winId}`, {
      duration: 0.3,
      width: initWindowWidth,
      height: initWindowHeight,
      left: initwindowLeft,
      top: initwindowTop,
      borderRadius: "12px",
    });

    setTimeout(() => {
      windowState.windowWidth = initWindowWidth;
      windowState.windowHeight = initWindowHeight;
      windowState.windowLeft = initwindowLeft;
      windowState.windowTop = initwindowTop;
      borderRadius.value = "12px";
      windowState.isMaximized = false;
    }, 300);
  } else {
    gsap.to(`#${props.winId}`, {
      duration: 0.3,
      width: screenWidth,
      height: screenHeight,
      left: 0,
      top: 0,
      borderRadius: "0px",
    });

    setTimeout(() => {
      windowState.windowWidth = screenWidth;
      windowState.windowHeight = screenHeight;
      windowState.windowLeft = 0;
      windowState.windowTop = 0;
      borderRadius.value = "0px";
      windowState.isMaximized = true;
    }, 300);
  }
};

const closeWindow = () => {
  const winId = props.winId;
  const win = document.getElementById(winId);
  if (win) {
    gsap.to(`#${winId}`, {
      duration: 0.2,
      scale: 0,
    });
  }
  setTimeout(() => {
    props.closeFunction();
  }, 200);
};

window.addEventListener("mousemove", onMouseMove);
window.addEventListener("mouseup", () => {
  stopDrag();
  stopResize();
});

onMounted(() => {
  const winId = props.winId;
  const win = document.getElementById(winId);
  if (win) {
    gsap.from(`#${winId}`, {
      duration: 0.3,
      scale: 0,
      ease: "back.out(1.4)",
    });
  }
});
</script>

<style scoped>
/* .custom-window {
    transition: width 0.3s, height 0.3s, left 50ms, top 50ms;
} */
</style>
