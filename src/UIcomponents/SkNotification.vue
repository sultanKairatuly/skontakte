<template>
  <Teleport to=".app">
    <div class="message">
      <slot>Сохранено</slot>
    </div>
  </Teleport>
</template>

<script setup lang="ts"></script>

<style scoped>
.message {
  padding: 10px 20px;
  border-radius: 10px;
  background-color: #fff;
  border: 1px solid #e5e5e5;
  color: #5384bc;
  position: fixed;
  bottom: 50px;
  font-weight: bold;
  transform: translateX(-50%);
  left: 50%;
  font-size: 17px;
  transition: 0.3s ease-in-out;
}
</style>
