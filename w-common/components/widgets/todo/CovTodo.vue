<template>
  <!-- 无样式 -->
  <div
    class="rounded-xl bg-gradient-to-br from-cyan-100 to-slate-50 backdrop-blur-sm flex justify-center items-center"
    :style="{
      width: width + 'px',
      height: height + 'px',
    }"
  >
    <!-- completed-96.png -->
    <img
      class="w-14 h-14"
      draggable="false"
      src="../../../assets/icons/completed-96.png"
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
