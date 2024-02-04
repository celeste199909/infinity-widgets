<template>
  <div>
    <!-- 开启功能 -->
    <div class="font-bold my-4 text-red-400">1开启组件功能</div>
    <div
      class="my-4 cursor-pointer text-blue-500"
      @click="handleToggleWidgetFn"
    >
      {{ enableWidgetFn ? "关闭" : "开启" }}
    </div>
    <!-- 编辑模式 -->
    <div class="font-bold my-4 text-red-400">2开启编辑模式</div>
    <div class="my-4 cursor-pointer text-blue-500" @click="handleToggleditMode">
      {{ onEditMode ? "关闭" : "开启" }}
    </div>
    <div class="font-bold my-4">小组件列表</div>
    <div class="w-full h-full flex bg-orange-200">
      <Widget v-for="item in widgetList" :key="item" :widgetName="item" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import Widget from "../w-common/components/Widget.vue";

const enableWidgetFn = ref(false);
const onEditMode = ref(false);

const widgetList = ref(["weather", "calendar", "todo"]);

function handleToggleWidgetFn() {
  enableWidgetFn.value = !enableWidgetFn.value;
  if (enableWidgetFn.value) {
    window.preload.createWidgetsWrapper();
  } else {
    window.preload.removeWidgetsWrapper();
  }
}

function handleToggleditMode() {
  onEditMode.value = !onEditMode.value;
  window.preload.setEditMode(onEditMode.value);
}
</script>
<style scoped></style>
