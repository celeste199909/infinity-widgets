<template>
  <!-- 无样式 -->
  <div
    v-if="!widgetData.style"
    class="rounded-xl bg-gradient-to-br from-cyan-100 to-slate-50 backdrop-blur-sm flex justify-center items-center"
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
    class="rounded-xl w-full h-full p-2 pb-3 text-[#8D8EFC] bg-gradient-to-br from-cyan-200 to-cyan-100 backdrop-blur-sm flex flex-col justify-start items-center relative"
    :style="{
      width: widgetData.style[widgetData.currentStyle].w + 'px',
      height: widgetData.style[widgetData.currentStyle].h + 'px',
    }"
  >
    <!-- ToDo 列表 -->
    <div
      v-if="currentPage === 0"
      class="w-full text-[12px] gap-y-2 flex-1 flex flex-col rounded-lg justify-start items-center overflow-y-scroll pb-32"
    >
      <template v-if="notCompletedTodos.length === 0">
        <div class="w-full h-full flex justify-center items-center text-[12px]">
          <div class="font-bold">在下方输入后按回车添加</div>
        </div>
      </template>
      <!-- 一个todo -->
      <template v-else>
        <template v-for="(todo, index) in notCompletedTodos" :key="index">
          <TodoCard
            :todo="todo"
            :toggleComplete="toggleComplete"
            :deleteTodo="deleteTodo"
          />
        </template>
      </template>
    </div>
    <!-- 完成的列表 -->
    <div
      v-else
      class="w-full text-[12px] gap-y-2 flex-1 flex flex-col rounded-lg justify-start items-center overflow-y-scroll pb-32"
    >
      <template v-if="completedTodos.length === 0">
        <div class="w-full h-full flex justify-center items-center text-[12px]">
          <div class="font-bold">还没有已完成的任务</div>
        </div>
      </template>
      <template v-else>
        <!-- 一个todo -->
        <template v-for="(todo, index) in completedTodos" :key="index">
          <TodoCard
            :todo="todo"
            :toggleComplete="toggleComplete"
            :deleteTodo="deleteTodo"
          />
        </template>
      </template>
    </div>
    <!-- 输入框和添加按钮 -->
    <div
      class="flex text-[12px] w-full h-16 bg-white/60 backdrop-blur-sm flex-row gap-x-2 justify-between items-center absolute bottom-0 left-0 px-2 py-3 rounded-bl-lg rounded-br-lg"
    >
      <input
        v-model="newTodo"
        @keyup.enter="addTodo"
        class="todo-input px-3 w-full bg-white text-slate-600 h-12 outline-none py-2 border rounded-lg flex-1 border-slate-100 focus:border-slate-200"
        type="text"
        placeholder="按下回车添加"
        :disabled="isOnEdit"
      />
      <!-- <Icon name="add" class="w-8 h-8" @click="addTodo" /> -->
      <Icon
        v-if="currentPage === 1"
        name="list-todo"
        color="#777"
        class="w-11 h-11 p-2 cursor-pointer hover:bg-slate-200 rounded-xl"
        @click="toggleList"
      />
      <Icon
        v-else
        name="list-completed"
        color="#777"
        class="w-11 h-11 p-2 cursor-pointer hover:bg-slate-200 rounded-xl"
        @click="toggleList"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref, computed } from "vue";
import Icon from "../../icon/Icon.vue";
import TodoCard from "./TodoCard.vue";
import { watchDeep } from "@vueuse/core";
import _ from "lodash";

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
const todos = ref<Todo[]>(props.widgetData.data?.todos || []);
watchDeep(todos, (newVal) => {
  const _widgetData = _.cloneDeep(props.widgetData);
  _widgetData.data.todos = todos.value;
  if (props.modifyWidgetData) {
    props.modifyWidgetData(_widgetData);
  }
});

const notCompletedTodos = computed(() => {
  return todos.value.filter((todo) => !todo.completed);
});

const completedTodos = computed(() => {
  return todos.value.filter((todo) => todo.completed);
});
const isOnEdit = computed(() => {
  return props.widgetData.draggable;
});

const currentPage = ref(0);

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

function deleteTodo(todo: Todo) {
  if (isOnEdit.value) return;
  todos.value = todos.value.filter((item) => item !== todo);
}

function toggleList() {
  if (isOnEdit.value) return;
  currentPage.value = currentPage.value === 0 ? 1 : 0;
}
</script>
<style scoped>
.widget:hover {
  filter: drop-shadow(0 0 0.5rem rgba(206, 206, 206, 0.438));
}

.todo-input {
  filter: drop-shadow(0 0 0.5rem 0.5rem rgba(206, 206, 206, 0.299));
}
</style>
