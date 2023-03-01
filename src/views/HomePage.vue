<template>
  <div class="container">
    <h1>Hello {{ store.user.displayName }}</h1>
    <h1>Skontakte home page</h1>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
const store = useAuthStore();
</script>

<style scoped>
h1 {
  text-align: center;
}
</style>
