<template>
  <div class="box">
    <!-- <input
      class="input_item"
      :value="props.modelValue"
      @input="updateModel"
      :placeholder="props.placeholder"
      :type="props.type"
      :style="{
        padding: props.padding,
        fontSize: props.fontSize,
      }"
    />
    <i class="icon" :class="props.icon" @click="$emit('iconClicked')"></i> -->
    <q-input
      :modelValue="props.modelValue"
      @update:model-value="updateModel"
      :label="props.label"
      icon="check"
      outlined
      :placeholder="props.placeholder"
      :type="props.type"
    >
      <template v-slot:append>
        <q-icon class="icon" @click="$emit('iconClicked')" :name="icon" />
      </template>
    </q-input>
  </div>
</template>

<script setup lang="ts">
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
.input_item {
  position: relative;
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
  right: 10px;
  cursor: pointer;
  font-size: 20px;
  top: 50%;
  transform: translateY(-50%);
}
</style>
