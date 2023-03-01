<template>
  <button
    class="btn"
    :style="{
      padding: props.padding,
      fontSize: props.fontSize,
    }"
  >
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    fontSize?: string;
    padding?: string;
  }>(),
  {
    fontSize: "16px",
    padding: "20px",
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
