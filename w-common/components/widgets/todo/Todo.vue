<template>
  <!-- 无样式 -->
  <div
    v-if="!widgetData.style"
    class="rounded-xl bg-fuchsia-200 backdrop-blur-sm flex justify-center items-center"
    :style="{
      width: widgetData.size.w + 'px',
      height: widgetData.size.h + 'px',
    }"
  >
    <!-- completed-96.png -->
    <img
      class="w-14 h-14"
      draggable="false"
      src="../../../assets/icons/completed-96.png"
    />
  </div>
  <!-- 有样式 -->
  <div
    v-else
    class="rounded-xl w-full h-full px-2 pb-2 pb-4 bg-gradient-to-br from-cyan-50 to-slate-50 backdrop-blur-sm flex flex-col justify-start items-center relative"
    :style="{
      width: widgetData.style[widgetData.currentStyle].w + 'px',
      height: widgetData.style[widgetData.currentStyle].h + 'px',
    }"
  >
    <div
      class="text-xl px-1 w-full h-12 font-bold text-blue-500 flex flex-row justify-start items-center"
    >
      To Do
    </div>
    <!-- ToDo 列表 -->
    <div
      class="w-full flex-1 flex flex-col justify-start items-center gap-y-2 overflow-y-scroll pb-14"
    >
      <div
        v-for="(todo, index) in todos"
        :key="index"
        class="flex w-full h-12 border rounded-lg justify-between items-center bg-white px-4 py-2"
      >
        <div class="flex flex-row justify-start items-center gap-x-1">
          <input
            type="checkbox"
            v-model="todo.completed"
            class="h-5 w-5 text-blue-400 outline-none border-slate-200 focus:border-slate-300"
          />
          <span
            class="flex-1 text-slate-500"
            :class="{ 'line-through': todo.completed }"
            >{{ todo.text }}</span
          >
        </div>
        <div
          @click="deleteTodo(index)"
          class="text-gray-300 font-thin hover:text-gray-400 text-[32px] mb-[2px] flex justify-center items-center"
        >
          –
        </div>
      </div>
    </div>
    <!-- 输入框和添加按钮 -->
    <div class="flex p-1 h-12 w-full relative">
      <input
        v-model="newTodo"
        @keyup.enter="addTodo"
        class="px-3 w-full text-slate-500 h-12 outline-none py-2 border rounded-lg flex-1 border-slate-100 focus:border-slate-200"
        type="text"
        placeholder="添加"
      />
      <div
        @click="addTodo"
        class="w-12 h-12 rounded-lg flex justify-center items-center font-thin text-gray-300 hover:text-gray-400 text-[36px] absolute right-1 top-0 bottom-0"
      >
        +
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from "vue";

const props = defineProps({
  widgetData: {
    type: Object,
    required: true,
  },
  modifyWidgetData: {
    type: Function,
    required: false,
  },
});

interface Todo {
  text: string;
  completed: boolean;
}

const newTodo = ref("");
const todos = ref<Todo[]>([]);

function addTodo() {
  if (newTodo.value.trim() !== "") {
    todos.value.push({ text: newTodo.value, completed: false });
    newTodo.value = "";
  }
}

function deleteTodo(index: number) {
  todos.value.splice(index, 1);
}
</script>
<style scoped>
.widget:hover {
  filter: drop-shadow(0 0 0.5rem rgba(206, 206, 206, 0.438));
}
</style>
