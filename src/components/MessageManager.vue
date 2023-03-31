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
      ref="textarea"
    />
    <i class="fa-solid fa-face-smile send-icon" @click="emojis = !emojis"></i>
    <EmojiPicker v-if="emojis" class="emojis" @select="onSelectEmoji" />
    <q-icon
      name="send"
      @click="$emit('sendMessage')"
      class="text-blue-grey-4 send-icon"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import EmojiPicker from "vue3-emoji-picker";

const emojis = ref<boolean>(false);
const props = defineProps<{
  modelValue: string;
}>();
const sendKey = ref<string>("Enter");
const textarea = ref<HTMLElement | null>(null);

const emit = defineEmits<{
  (e: "update:model-value", value: string | number | null): void;
  (e: "sendMessage"): void;
}>();

function updateModel(value: string | number | null) {
  emit("update:model-value", value);
}

function onSelectEmoji(em: Record<string, any>) {
  emit("update:model-value", em.i);
}
</script>

<style scoped>
.message_manager {
  background-color: #fafbfc;
  padding: 15px 30px;
  align-items: center;
  border-top: 1px solid #dbe2e9;
  display: flex;
  align-items: flex-end;
  column-gap: 10px;
  position: relative;
}

.emojis {
  position: absolute;
  right: 0;
  bottom: 60px;
}
.message_input {
  width: 80%;
  border: 1px solid #bdbdbd;
  padding: 15px 20px;
  font-size: 18px;
  outline: none;
  border-radius: 10px;
}

.send-icon {
  color: #90a4ae;
  font-size: 25px;
  cursor: pointer;
  padding: 10px;
}

@media (max-width: 1440px) {
  .message_manager {
    padding: 10px 20px;
    column-gap: 10px;
  }
  .message_input {
    width: 80%;
    padding: 5px 10px;
    font-size: 15px;
  }

  .send-icon {
    font-size: 20px;
    padding: 5px;
  }
}
</style>
