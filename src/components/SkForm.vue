<template>
  <form class="form">
    <slot name="inputs"></slot>
    <slot name="btns"></slot>
  </form>
</template>

<script setup lang="ts"></script>

<style scoped>
.form {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
