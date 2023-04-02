<template>
  <div class="message"><slot></slot></div>
</template>

<script setup lang="ts"></script>

<style scoped>
.message {
  text-align: center;
  margin: 20px 0;
  color: #bfc6cf;
  font-size: 20px;
}

@media (max-width: 1440px) {
  .message {
    font-size: 16px;
  }
}

@media (max-width: 800px) {
  .message {
    font-size: 14px;
  }
}
</style>
