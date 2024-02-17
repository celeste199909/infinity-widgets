<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48">
    <path
      stroke-linejoin="round"
      stroke-linecap="round"
      :stroke-width="width"
      :stroke="color"
      d="M9.858 32.757C6.238 33.843 4 35.343 4 37c0 3.314 8.954 6 20 6s20-2.686 20-6c0-1.657-2.239-3.157-5.858-4.243"
      data-follow-stroke="#333"
    />
    <path
      stroke-linejoin="round"
      :stroke-width="width"
      :stroke="color"
      d="M24 35s13-8.496 13-18.318C37 9.678 31.18 4 24 4S11 9.678 11 16.682C11 26.504 24 35 24 35Z"
      data-follow-stroke="#333"
    />
    <path
      stroke-linejoin="round"
      :stroke-width="width"
      :stroke="color"
      d="M24 22a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"
      data-follow-stroke="#333"
    />
  </svg>
</template>

<script setup lang="ts">
const props = defineProps({
  color: {
    type: String,
    default: "#666",
  },
  width: {
    type: Number,
    default: 2,
  },
});
</script>

<style scoped></style>
