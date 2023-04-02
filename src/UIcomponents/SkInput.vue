<template>
  <div class="box">
    <q-input
      :modelValue="props.modelValue"
      @update:model-value="updateModel"
      :label="props.label"
      icon="check"
      outlined
      :placeholder="props.placeholder"
      :type="props.type"
      class="q-pa-xs input"
      :rules="props.rules"
    >
      <template v-slot:append>
        <q-icon class="icon" @click="$emit('iconClicked')" :name="icon" />
      </template>
    </q-input>
  </div>
</template>

<script setup lang="ts">
import { inject, watch } from "vue";

type InputTypes =
  | "number"
  | "text"
  | "search"
  | "textarea"
  | "time"
  | "password"
  | "email"
  | "tel"
  | "file"
  | "url"
  | "date"
  | undefined;

const props = withDefaults(
  defineProps<{
    padding?: string;
    fontSize?: string;
    modelValue?: string;
    placeholder?: string;
    type?: InputTypes;
    icon?: string;
    label?: string;
    rules?: [(...args: any[]) => any];
  }>(),
  {
    type: "text",
    padding: "15px 35px",
    fontSize: "18px",
  }
);

const emit = defineEmits<{
  (e: "update:modelValue", value: string | number | null): void;
}>();

function updateModel(value: string | number | null) {
  emit("update:modelValue", value);
}
</script>

<style scoped>
.box {
  position: relative;
}

.input:focus {
  border: 1px solid #2b8cfc;
}

.icon {
  color: #447bba;
  position: absolute;
  right: 10px;
  cursor: pointer;
  font-size: 20px;
  top: 50%;
  transform: translateY(-50%);
}

.dark .input_item {
  position: relative;
  background-color: #292929;
  border-radius: 10px;
  border: none;
  font-size: 18px;
  width: 100%;
  outline: none;
  border: 1px solid #424242;
  display: block;
  color: #fff;
}

.dark .input:focus {
  border: 1px solid #707274;
}

.dark .icon {
  color: #447bba;
  position: absolute;
  right: 10px;
  cursor: pointer;
  font-size: 20px;
  top: 50%;
  transform: translateY(-50%);
}
</style>
