<template>
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48">
    <path
      stroke-linejoin="round"
      :stroke-width="width"
      :stroke="color"
      d="m15 12 1.2-7h15.6l1.2 7"
      data-follow-stroke="#333"
    />
    <path
      stroke-linecap="round"
      :stroke-width="width"
      :stroke="color"
      d="M6 12h36"
      data-follow-stroke="#333"
    />
    <path
      stroke-linejoin="round"
      stroke-linecap="round"
      :stroke-width="width"
      :stroke="color"
      d="m37 12-2 31H13l-2-31h26Z"
      clip-rule="evenodd"
      data-follow-stroke="#333"
    />
    <path
      stroke-linecap="round"
      :stroke-width="width"
      :stroke="color"
      d="M19 35h10"
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
