<template>
  <select
    class="select"
    :value="props.modelValue"
    @change="updateModel"
    :style="{
      'font-size': props.fontSize,
    }"
  >
    <option value="Не выбрано" key="Не выбрано">Не выбрано</option>
    <option :value="option" :key="option" v-for="option in props.options">
      {{ option }}
    </option>
  </select>
</template>

<script lang="ts" setup>
import type { Months } from "env";

const props = withDefaults(
  defineProps<{
    modelValue: string | number;
    options: any[];
    fontSize?: string;
  }>(),
  {
    fontSize: "16px",
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string | Months): void;
}>();

function updateModel(e: Event) {
  const target = e.target as HTMLInputElement;
  emit("update:modelValue", target.value);
}
</script>

<style scoped>
.select {
  padding: 5px;
  border: 1px solid #edeef0;
  outline: none;
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  display: block;
  border-radius: 10px;
  margin-top: 10px;
  margin-bottom: 25px;
}

.dark .select {
  border: 1px solid #424242;
  color: #ffff;
  background-color: #222222;
}

@media (max-width: 320px) {
  .select {
    font-size: 10px;
  }
}
</style>
