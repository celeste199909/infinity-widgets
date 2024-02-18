<template>
  <!-- 无样式 -->
  <div
    v-if="!widgetData.style"
    class="rounded-xl bg-green-300 backdrop-blur-sm flex justify-center items-center"
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
    class="rounded-xl w-full h-full p-2 pb-3 bg-gradient-to-br from-cyan-200 to-slate-100 backdrop-blur-sm flex flex-col justify-start items-center relative"
    :style="{
      width: widgetData.style[widgetData.currentStyle].w + 'px',
      height: widgetData.style[widgetData.currentStyle].h + 'px',
    }"
  >
    <!-- ToDo 列表 -->
    <div
      class="w-full text-[12px] gap-y-2 flex-1 flex flex-col justify-start items-center overflow-y-scroll pb-14"
    >
      <!-- 一个todo -->
      <div
        v-for="(todo, index) in todos"
        :key="index"
        class="flex w-full h-fit border rounded-xl justify-between items-center bg-white px-14 py-4 relative"
      >
        <!-- 完成 删除 -->
        <div
          class="w-full px-4 h-[50px] flex flex-row justify-between items-center gap-x-1 absolute top-0 left-0"
        >
          <div
            class="w-6 h-6 border-2 rounded-full flex justify-center items-center overflow-hidden"
            @click="toggleComplete(todo)"
          >
            <Icon v-if="todo.completed" name="check" class="w-5 h-5" />
          </div>
          <Icon name="close" class="w-6 h-6" @click="deleteTodo(index)" />
        </div>
        <!-- 文字 -->
        <span
          class="w-full h-fit text-slate-500"
          :class="{ 'line-through': todo.completed }"
          >{{ todo.text }}</span
        >
      </div>
    </div>
    <!-- 输入框和添加按钮 -->
    <div
      class="flex text-[12px] w-full h-14 flex-row gap-x-2 justify-between items-center absolute bottom-2 left-0 px-2 py-2 rounded-lg"
    >
      <input
        v-model="newTodo"
        @keyup.enter="addTodo"
        class="px-3 w-full bg-white text-slate-500 h-12 outline-none py-2 border rounded-lg flex-1 border-slate-100 focus:border-slate-200"
        type="text"
        placeholder="添加"
      />
      <Icon name="add" class="w-8 h-8" @click="addTodo" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, computed } from "vue";
import Icon from "../../icon/Icon.vue";

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
const isOnEdit = computed(() => {
  return props.widgetData.draggable;
});

function addTodo() {
  if (isOnEdit.value) return;
  if (newTodo.value.trim() !== "") {
    todos.value.push({ text: newTodo.value, completed: false });
    newTodo.value = "";
  }
}

function toggleComplete(todo: Todo) {
  if (isOnEdit.value) return;
  todos.value.forEach((item) => {
    if (item === todo) {
      item.completed = !item.completed;
    }
  });
}

function deleteTodo(index: number) {
  if (isOnEdit.value) return;
  todos.value.splice(index, 1);
}
</script>
<style scoped>
.widget:hover {
  filter: drop-shadow(0 0 0.5rem rgba(206, 206, 206, 0.438));
}
</style>
