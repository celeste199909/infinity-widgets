<template>
  <!-- 无样式 -->
  <div
    class="rounded-xl w-full h-full bg-gradient-to-l from-amber-200 to-yellow-200 text-slate-800 backdrop-blur-sm flex justify-center items-center"
    :style="{
      width: width + 'px',
      height: height + 'px',
    }"
  >
    <div class="w-16 h-16 backdrop-blur-[5px] flex justify-center items-center">
      <img
        class="rounded-xl w-14 h-14"
        src="../../../assets/icons/alarm-64.png"
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
