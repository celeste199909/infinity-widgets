<template>
  <div class="w-56 h-40 bg-blue-400">
    <div class="text-white text-center">{{ widgetName }}</div>
    <div class="text-blue-500 text-center" @click="handleAddWidget(widgetName)">
      添加
    </div>
    <div class="text-red-500 text-center" @click="handleRemoveWidget(widgetName)">
      删除
    </div>

  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps({
  widgetName: {
    type: String,
    required: true,
  }
});

function handleAddWidget(widgetName: string) {
    window.preload.addWidget(widgetName);
}

function handleRemoveWidget(widgetName: string) {
    window.preload.removeWidget(widgetName);
}
</script>
<style scoped></style>
