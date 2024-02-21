<template>
  <!-- 无样式 -->
  <div
    class="rounded-xl w-full h-full p-4 flex justify-center items-center bg-white overflow-hidden relative"
    :style="{
      width: width + 'px',
      height: height + 'px',
    }"
  >
    <img
      class="w-18 h-18"
      draggable="false"
      src="../../../assets/icons/start-48.png"
    />
  </div>
</template>

<script setup lang="ts">
defineProps({
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
});
</script>
<style scoped></style>
