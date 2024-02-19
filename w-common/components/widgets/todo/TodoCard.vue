<template>
  <!-- 一个todo -->
  <div
    class="todo-card flex w-full h-fit border rounded-lg justify-between items-center bg-white px-14 py-4 relative"
  >
    <!-- 完成 删除 -->
    <div
      class="w-full px-4 h-[50px] flex flex-row justify-between items-center gap-x-1 absolute -top-[1px] left-0"
    >
      <div
        class="group w-6 h-6 border-2 border-[#8F4EFF] hover:border-[#5E17EB] cursor-pointer rounded-full flex justify-center items-center overflow-hidden"
        @click="toggleComplete(todo)"
      >
        <Icon
          v-if="todo.completed"
          color="#8F4EFF"
          :width="3"
          name="check"
          class="w-5 h-5"
        />
        <Icon
          v-else
          color="#8F4EFF"
          :width="3"
          name="check"
          class="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
        />
      </div>
      <!-- 删除 -->
      <Icon
        name="close"
        color="#8F4EFF"
        class="w-8 h-8 p-1 rounded-lg hover:bg-slate-200 cursor-pointer"
        @click="deleteTodo(todo)"
      />
    </div>
    <!-- 文字 -->
    <span
      class="w-full h-fit text-slate-500"
      :class="{ 'line-through': todo.completed }"
      >{{ todo.text }}</span
    >
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import Icon from "../../icon/Icon.vue";

const props = defineProps({
  todo: {
    type: Object,
    required: true,
  },
  toggleComplete: {
    type: Function,
    required: true,
  },
  deleteTodo: {
    type: Function,
    required: true,
  },
});
</script>
<style scoped>
.todo-card {
  filter: drop-shadow(0 0 0.5rem 0.5rem rgba(206, 206, 206, 0.299));
}
</style>
