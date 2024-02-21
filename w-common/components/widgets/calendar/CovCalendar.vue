<template>
  <!-- 封面 -->
  <div
    class="rounded-xl w-full h-full bg-white text-slate-900 backdrop-blur-sm flex justify-center items-center"
    :style="{
      width: width + 'px',
      height: height + 'px',
    }"
  >
    <div class="flex w-full h-full p-3 flex-col justify-between items-center">
      <!-- 年月 -->
      <div class="text-lg font-bold">2024年2月</div>
      <!-- 日 -->
      <div class="text-6xl font-bold">20</div>
      <!-- 农历和周几 -->
      <div class="flex justify-center items-center">
        <div>星期二</div>
      </div>
    </div>
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
