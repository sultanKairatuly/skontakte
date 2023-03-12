<template>
<q-btn color="#e5ebf1" q-pa="md" text-color="#346bb4" :label="props.label" class="btn" />
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label?: string
    }>(),
  {
    label: 'Подтвердить'
  }
);
</script>

<style scoped>
.btn {
  background-color: #e5ebf1;
  color: #346bb4;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.1s ease-in-out;
}

.btn:hover {
  background-color: #d3d6da;
}
</style>
