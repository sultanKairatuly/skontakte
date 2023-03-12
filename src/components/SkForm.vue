<template>
  <form class="form">
    <div class="main">
      <div class="inputs">
        <slot name="inputs"></slot>
      </div>
      <div class="inputs">
        <slot name="inputs2"></slot>
      </div>
    </div>
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

.main {
  display: flex;
  column-gap: 30px;
  align-items: flex-start;
}
</style>
