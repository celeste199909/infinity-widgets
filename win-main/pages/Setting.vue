<template>
  <div class="p-3">
    <div class="py-2 font-bold">设置</div>
    <div class="text-red-400 cursor-pointer" @click="removeAllWidgets">删除所有小组件</div>
  </div>
</template>

<script setup lang="ts">
function removeAllWidgets() {   
//   utools.dbStorage.setItem("showWidgets", []);
  window.preload.removeAllWidgets();
}
</script>
<style scoped></style>
