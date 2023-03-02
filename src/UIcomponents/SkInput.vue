<template>
  <div class="box">
    <input
      class="input_item"
      :value="props.modelValue"
      @input="updateModel"
      :placeholder="props.placeholder"
      :type="props.type"
    />
    <i class="icon" :class="props.icon" @click="$emit('iconClicked')"></i>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const input = ref<null | HTMLInputElement>(null);
const props = withDefaults(
  defineProps<{
    modelValue?: string;
    placeholder?: string;
    type?: string;
    icon?: string;
  }>(),
  {
    type: "text",
  }
);
const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "emitNodeRef", value: HTMLInputElement | null): void;
}>();

function updateModel(e: Event) {
  const target = e.target as HTMLInputElement;
  emit("update:modelValue", target.value);
}
</script>

<style scoped>
.box {
  position: relative;
}
.input_item {
  position: relative;
  padding: 15px 35px;
  background-color: #edeef0;
  border-radius: 10px;
  border: none;
  font-size: 18px;
  width: 100%;
  outline: none;
  border: 1px solid #dadbdd;
  display: block;
}

.input:focus {
  border: 1px solid #2b8cfc;
}

.icon {
  color: #447bba;
  position: absolute;
  right: 50px;
  cursor: pointer;
  font-size: 20px;
  top: 50%;
  transform: translateY(-50%);
}
</style>
