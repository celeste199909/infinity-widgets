<template>
  <div class="px-3 w-screen h-screen flex flex-col justify-center">
    <!-- 编辑模式 -->
    <div class="h-6 my-3  flex flex-row items-center gap-1">
      <div class="font-bold text-slate-700">编辑模式：</div>
      <div
        class="cursor-pointer text-blue-500 hover:text-blue-700"
        @click="handleToggleditMode"
      >
        {{ onEditMode ? "关闭" : "开启" }}
      </div>
    </div>
    <!-- 小组件列表 -->
    <div class="w-full h-full py-1 overflow-y-scroll flex flex-row justify-start items-start flex-wrap gap-2">
      <div
        v-for="item in allWidgets"
        :key="item.key"
        class="flex flex-col items-center gap-2"
      >
        <div class="cursor-pointer" @click="toggleUseWidget(item.key)">
          <Widget :widgetName="item.key" :widgetData="item" :id="item.key" :disabledFn="true" />
        </div>
        <div class="text-slate-700 font-bold text-center">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";

import Widget from "../w-common/components/Widget.vue";

const onEditMode = ref(false);

const allWidgets = ref([
{
    key: "starter",
    name: "启动器",
    use: false,
    draggable: false,
    resizable: false,
    isDragging: false,
    position: {
      x: 0,
      y: 0,
      w: 180,
      h: 120,
    },
  },
  {
    key: "weather",
    name: "天气",
    use: false,
    draggable: false,
    resizable: false,
    isDragging: false,
    position: {
      x: 0,
      y: 0,
      w: 180,
      h: 120,
    },
  },
  {
    key: "calendar",
    name: "日历",
    use: false,
    draggable: false,
    resizable: false,
    isDragging: false,
    position: {
      x: 0,
      y: 0,
      w: 180,
      h: 120,
    },
  },
  {
    key: "todo",
    name: "待办",
    use: false,
    draggable: false,
    resizable: false,
    isDragging: false,
    position: {
      x: 0,
      y: 0,
      w: 180,
      h: 120,
    },
  },
  {
    key: "woodfish",
    name: "电子木鱼",
    use: false,
    draggable: false,
    resizable: false,
    isDragging: false,
    position: {
      x: 0,
      y: 0,
      w: 180,
      h: 120,
    },
  },
]);

function handleToggleditMode() {
  onEditMode.value = !onEditMode.value;
  window.preload.setEditMode(onEditMode.value);
}

function toggleUseWidget(key: string) {
  allWidgets.value.forEach((item) => {
    if (item.key === key && item.use) {
      item.use = false;
      window.preload.removeWidget(key);
    }else if (item.key === key && !item.use) {
      item.use = true;
      window.preload.addWidget(key);
    }
  });

}

</script>
<style scoped></style>
