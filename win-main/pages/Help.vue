<template>
  <div class="p-4 flex flex-col justify-start items-start gap-4">
    <!-- 说明 -->
    <div>
      <div class="mt-2 font-bold text-[16px]">Q: 组件晃动用不了啊！</div>
      <div class="mt-1 mb-2 text-[14px] text-slate-600 dark:text-slate-400">
        A: 每一个小组件被添加时自动进入编辑模式，处于编辑模式的小组件可以拖动位置，右键退出编辑模式即可正常使用功能。
      </div>
    </div>
    <div>
      <div class="mt-2 font-bold text-[16px]">Q: 所有的小组件怎么突然消失了？(Window系统)</div>
      <div class="mt-1 mb-2 text-[14px] text-slate-600 dark:text-slate-400">
        A: 你可能是点到右下角的 “显示桌面” 按钮了，这个按钮会隐藏所有小组件，再点击一下即可恢复。
      </div>
    </div>
    <div>
      <div class="mt-2 font-bold text-[16px]">Q: 你这小组件功能不完善呀！</div>
      <div class="mt-1 mb-2 text-[14px] text-slate-600 dark:text-slate-400">
        A: 请容我先凑一凑数量😁。
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, Ref } from "vue";

const isOnWidgetContainer = inject("isOnWidgetContainer") as Ref<boolean>;
const turnOnWidgetContainer = inject("turnOnWidgetContainer") as () => void;
const turnOffWidgetContainer = inject("turnOffWidgetContainer") as () => void;

function removeAllWidgets() {
  //   utools.dbStorage.setItem("showWidgets", []);
  window.preload.removeAllWidgets();
}
</script>
<style scoped>
.container > div {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
}

.container div {
  display: flex;
  cursor: pointer;
  font-weight: 500;
  position: relative;
  overflow: hidden;
  margin-bottom: 0.375em;
}

.container div div {
  position: absolute;
  left: -9999px;
}

.container div.current + span {
  background-color: #8f8ffc;
  color: white;
}

.container div.current + span:before {
  box-shadow: inset 0 0 0 0.4375em #575793;
}

.container span {
  display: flex;
  align-items: center;
  padding: 0.375em 0.75em 0.375em 0.375em;
  border-radius: 99em;
  transition: 0.25s ease;
  color: #8282ff;
}

.container span:hover {
  background-color: #d6d6e5be;
}
.dark .container span:hover {
  background-color: #51516b;
}

.container span:before {
  display: flex;
  flex-shrink: 0;
  content: "";
  background-color: #fff;
  width: 1.5em;
  height: 1.5em;
  border-radius: 50%;
  margin-right: 0.375em;
  transition: 0.25s ease;
  box-shadow: inset 0 0 0 0.125em #2e2e60;
}
</style>
