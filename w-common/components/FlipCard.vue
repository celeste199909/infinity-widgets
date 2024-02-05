<template>
  <div class="myCard">
    <div class="innerCard">
      <div class="frontSide">
        <slot name="front"></slot>
      </div>
      <div class="backSide">
        <slot name="back"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
<style scoped>
.myCard {
  background-color: transparent;
  width: 100%;
  height: 100%;
  perspective: 1000px;
}

.title {
  font-size: 1.5em;
  font-weight: 900;
  text-align: center;
  margin: 0;
}

.innerCard {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.8s;
  transform-style: preserve-3d;
  cursor: pointer;
}

.myCard:hover .innerCard {
  transform: rotateY(180deg);
}

.frontSide,
.backSide {
  position: absolute;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 1rem;
  color: white;
  font-weight: 700;
}

.frontSide,
.frontSide::before {
  background: linear-gradient(45deg, #ff0000, #ff7300);
}

.backSide,
.backSide::before {
  background: linear-gradient(45deg, #ff0000, #ff7300);
}

.backSide {
  transform: rotateY(180deg);
}

.frontSide::before,
.backSide::before {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  content: "";
  width: 110%;
  height: 110%;
  position: absolute;
  z-index: -1;
  border-radius: 1em;
  filter: blur(10px);
  animation: animate 3s linear infinite;
}

@keyframes animate {
  0% {
    opacity: 0.3;
  }

  80% {
    opacity: 1;
  }

  100% {
    opacity: 0.3;
  }
}
</style>
