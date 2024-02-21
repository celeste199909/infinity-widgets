<template>
  <!-- 无样式 -->
  <div
    class="rounded-xl w-full h-full bg-gradient-to-r from-violet-200 to-pink-200 text-slate-800 backdrop-blur-sm flex justify-center items-center"
    :style="{
      width: width + 'px',
      height: height + 'px',
    }"
  >
    <div class="w-14 h-14 backdrop-blur-[5px] flex justify-center items-center">
      <img
        draggable="false"
        class="rounded-xl w-14 h-14"
        src="../../../assets/icons/stopwatch-64.png"
        alt=""
      />
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
