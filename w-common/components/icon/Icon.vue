<template>
  <component
    :is="componentMap.get(name)"
    :color="color"
    :width="width"
    draggable="false"
  />
</template>

<script setup lang="ts">
import AllApp from "./icons/AllApp.vue";
import Setting from "./icons/Setting.vue";
import Add from "./icons/Add.vue";
import Close from "./icons/Close.vue";
import Maxmize from "./icons/Maxmize.vue";
import Plus from "./icons/Plus.vue";
import Minus from "./icons/Minus.vue";
import Edit from "./icons/Edit.vue";
import Location from "./icons/Location.vue";
import Redo from "./icons/Redo.vue";
import Check from "./icons/Check.vue";
import DataArrival from "./icons/DataArrival.vue";
import ListTodo from "./icons/ListTodo.vue";
import ListCompleted from "./icons/ListCompleted.vue";
import ThreeDotsMenu from "./icons/ThreeDotsMenu.vue";
import Picture from "./icons/Picture.vue";
import Help from "./icons/Help.vue";
import Download from "./icons/Download.vue";
import ChangeSize from "./icons/ChangeSize.vue";
import Delete from "./icons/Delete.vue";
import Top from "./icons/Top.vue";
import Like from "./icons/Like.vue";

const componentMap = new Map<string, any>([
  ["all-app", AllApp],
  ["setting", Setting],
  ["add", Add],
  ["close", Close],
  ["maxmize", Maxmize],
  ["plus", Plus],
  ["minus", Minus],
  ["edit", Edit],
  ["location", Location],
  ["redo", Redo],
  ["check", Check],
  ["data-arrival", DataArrival],
  ["list-todo", ListTodo],
  ["list-completed", ListCompleted],
  ["three-dots-menu", ThreeDotsMenu],
  ["picture", Picture],
  ["help", Help],
  ["download", Download],
  ["change-size", ChangeSize],
  ["delete", Delete],
  ["top", Top],
  ["like", Like],
]);

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
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
