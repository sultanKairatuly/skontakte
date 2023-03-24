<template>
  <div class="message_manager">
    <q-input
      :model-value="props.modelValue"
      outlined
      dense
      @update:model-value="updateModel"
      style="width: 80%"
      placeholder="Напишите сообщение..."
      autogrow
    />
    <q-icon
      name="send"
      @click="$emit('sendMessage')"
      class="text-blue-grey-4 send-icon"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: "update:model-value", value: string | number | null): void;
}>();

function updateModel(value: string | number | null) {
  emit("update:model-value", value);
}
</script>

<style scoped>
.message_manager {
  background-color: #fafbfc;
  padding: 10px 20px;
  align-items: center;
  border-top: 1px solid #dbe2e9;
  display: flex;
  align-items: flex-end;
  column-gap: 10px;
}
.message_input {
  width: 80%;
  border: 1px solid #bdbdbd;
  padding: 5px 10px;
  font-size: 15px;
  outline: none;
  border-radius: 10px;
}

.send-icon {
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
}
</style>
