<template>
  <div
    data-widgets=""
    id="widgets-wrapper"
    class="flex flex-row gap-4 w-screen h-screen"
  >
    <!-- <div v-for="(item, index) in showWidgetList" :key="index">
        <component :is="item" />
      </div> -->
    <DraggableContainer
      :referenceLineVisible="true"
      :referenceLineColor="'#0f0'"
    >
      <!-- <div v-for="(item, index) in showWidgetList" :key="index">
        <component :is="item" />
      </div> -->
      <Vue3DraggableResizable
        :initW="120"
        :initH="80"
        v-model:x="x"
        v-model:y="y"
        v-model:w="w"
        v-model:h="h"
        v-model:active="active"
        :lockAspectRatio="true"
        :draggable="true"
        :resizable="true"
        :parent="true"
        :handles="['br']"
      >
        This is a test example
      </Vue3DraggableResizable>
    </DraggableContainer>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted, computed, reactive } from "vue";
import Weather from "../w-common/components/Weather.vue";
import Calendar from "../w-common/components/Calendar.vue";
import Todo from "../w-common/components/Todo.vue";

const x = ref(0);
const y = ref(0);
const w = ref(100);
const h = ref(100);
const active = ref(false);

const usedWidgets = ref<string[]>([]);
const showWidgetList = computed(() => {
  return usedWidgets.value.map((item) => {
    switch (item) {
      case "weather":
        return Weather;
      case "calendar":
        return Calendar;
      case "todo":
        return Todo;
      default:
        return Weather;
    }
  });
});
interface EventDetail {
  key: string;
}

onMounted(() => {
  // 监听自定义事件
  document.addEventListener("addWidgetEvent", function (event: any) {
    console.log("添加小组件", event.detail.key);
    const eventDetail: EventDetail = event.detail;
    usedWidgets.value.push(eventDetail.key);
  });

  document.addEventListener("removeWidgetEvent", function (event: any) {
    console.log("移除小组件！", event.detail.key);
    const eventDetail: EventDetail = event.detail;
    usedWidgets.value = usedWidgets.value.filter(
      (item) => item !== eventDetail.key
    );
  });
});
</script>
<style scoped></style>
