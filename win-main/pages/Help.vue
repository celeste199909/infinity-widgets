<template>
  <div class="p-4 flex flex-col justify-start items-start gap-4">
    <!-- 组件晃动用不了啊！ -->
    <div>
      <div class="mt-2 font-bold text-[16px]">Q: 组件晃动用不了啊！</div>
      <div class="mt-1 mb-2 text-[14px] text-slate-600 dark:text-slate-400">
        A:小组件被添加时自动进入编辑模式，右键退出编辑模式即可。
      </div>
    </div>
    <!-- 设置中的小组件容器开关无法打开！ -->
    <div>
      <div class="mt-2 font-bold text-[16px]">
        Q: 设置选项无法打开！
      </div>
      <div class="mt-1 mb-2 text-[14px] text-slate-600 dark:text-slate-400">
        A:可以尝试手动格式化这个插件的数据。
      </div>
    </div>
    <!-- 所有的小组件怎么突然消失了？ -->
    <div>
      <div class="mt-2 font-bold text-[16px]">
        Q: 小组件怎么突然都消失了？(Window系统)
      </div>
      <div class="mt-1 mb-2 text-[14px] text-slate-600 dark:text-slate-400">
        A: 可能是点到右下角的 “显示桌面” 按钮了，再点击一下即可恢复。
      </div>
    </div>
    <!-- 你这小组件功能不完善呀！ -->
    <div>
      <div class="mt-2 font-bold text-[16px]">Q: 你这小组件功能不完善呀！</div>
      <div class="mt-1 mb-2 text-[14px] text-slate-600 dark:text-slate-400">
        A: 请容我先凑一凑数量😁。
      </div>
    </div>
    <!-- 退出编辑的时候不是所有的组件都退出编辑？ -->
    <div>
      <div class="mt-2 font-bold text-[16px]">
        Q: 退出编辑的时候不是所有的组件都退出编辑？
      </div>
      <div class="mt-1 mb-2 text-[14px] text-slate-600 dark:text-slate-400">
        A:有顶置的小组件，会出现此问题，之后会优化。
      </div>
    </div>
    <!-- 添加小组件时会重叠？ -->
    <div>
      <div class="mt-2 font-bold text-[16px]">Q: 添加小组件时会重叠？</div>
      <div class="mt-1 mb-2 text-[14px] text-slate-600 dark:text-slate-400">
        A:有顶置的小组件，会出现此问题，之后会考虑优化。
      </div>
    </div>
    <!-- 小组件更新频率说明 -->
    <div>
      <div class="mt-2 font-bold text-[16px]">小组件更新频率说明</div>
      <div class="mt-1 mb-2 text-[14wpx] text-slate-600 dark:text-slate-400">
        <span class="font-bold">微博：</span>每<span class="font-bold"
          >30 分</span
        >更新一次。
        <br />
        <span class="font-bold">掘金：</span>每<span class="font-bold"
          >1 小时</span
        >更新一次。
        <br />
        <span class="font-bold">GitHub：</span>每<span class="font-bold"
          >1 小时</span
        >更新一次。
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
