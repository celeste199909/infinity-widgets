<!-- GithubContributions.vue -->
<template>
  <!-- 无样式 -->
  <div
    class="wrapper-card rounded-xl bg-slate-900 flex justify-center items-center"
    :style="{
      width: width + 'px',
      height: height + 'px',
    }"
  >
    <div
      class="w-18 h-18 rounded-full backdrop-blur-[10px] flex justify-center items-center"
    >
      <img
        draggable="false"
        class="rounded-xl w-14 h-14"
        src="../../../assets/icons/github-96-white.png"
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
