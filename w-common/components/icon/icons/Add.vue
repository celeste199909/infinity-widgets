<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48">
    <path
      stroke-linejoin="round"
      :stroke-width="width"
      :stroke="color"
      d="M24 44c11.046 0 20-8.954 20-20S35.046 4 24 4 4 12.954 4 24s8.954 20 20 20Z"
      data-follow-stroke="#333"
    />
    <path
      stroke-linejoin="round"
      stroke-linecap="round"
      :stroke-width="width"
      :stroke="color"
      d="M24 16v16M16 24h16"
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
