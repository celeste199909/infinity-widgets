<template>
  <div>
    <input
      type="checkbox"
      :id="name"
      class="checkboxInput"
      :checked="isOn"
      @click="handleClick"
    />
    <label :for="name" class="toggleSwitch "
      :style="{
        width: width + 'px',
        height: height + 'px',
      }"
    > </label>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  isOn: {
    type: Boolean,
    required: true,
    default: false,
  },
  turnOn: {
    type: Function,
    required: true,
  },
  turnOff: {
    type: Function,
    required: true,
  },
  width: {
    type: Number,
    default: 50,
    required: false,
  },
  height: {
    type: Number,
    default: 26,
    required: false,
  },
});

function handleClick() {
  if (props.isOn) {
    props.turnOff();
  } else {
    props.turnOn();
  }
}
</script>
<style scoped>
/* To hide the checkbox */
.checkboxInput {
  display: none;
}

.toggleSwitch {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  /* width: 50px;
  height: 30px; */
  background-color: rgb(130, 130, 130);
  border-radius: 20px;
  cursor: pointer;
  transition-duration: 0.2s;
  padding: 5px;
}

.toggleSwitch::after {
  content: "";
  position: absolute;
  height: 18px;
  width: 18px;
  left: 4px;
  background-color: white;
  border-radius: 50%;
  transition-duration: 0.2s;
  /* box-shadow: 5px 2px 7px rgba(8, 8, 8, 0.26); */
  /* border: 5px solid white; */
}

.checkboxInput:checked + .toggleSwitch::after {
  transform: translateX(130%);
  transition-duration: 0.2s;
  background-color: white;
}
/* Switch background change */
.checkboxInput:checked + .toggleSwitch {
  background-color: #8080ff;
  transition-duration: 0.2s;
}
</style>
