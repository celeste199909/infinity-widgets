<!-- GithubContributions.vue -->
<template>
  <div
    class="bg-gradient-to-r from-[#060303] to-[#222120] rounded-xl p-3 flex flex-col justify-center items-center relative"
    :style="{
      width: width + 'px',
      height: height + 'px',
    }"
  >
    <img src="../../../assets/images/wukong_logo_a.png" />
    <img src="../../../assets/images/wukong_title.png" />
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
