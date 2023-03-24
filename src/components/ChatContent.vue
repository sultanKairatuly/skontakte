<template>
  <div class="chats_content" v-if="Object.keys(activeChat).length">
    <MessageHeader
      :search-text="props.searchText"
      :searching="searching"
      :active-chat="props.activeChat"
      @searchMessages="$emit('searchMessages')"
      @cancelSearching="$emit('cancelSearching')"
    />
    <MessageList style="height: 85%" :chat="activeChat" />
    <MessageManager
      :model-value="message"
      @update:model-value="(newValue) => (message = newValue as string)"
      @sendMessage="sendMessage"
    />
  </div>
  <div class="chats_content" v-else></div>
</template>

<script setup lang="ts">
import type { Chat } from "env";
import { ref } from "vue";
import MessageList from "./MessageList.vue";
import MessageManager from "./MessageManager.vue";
import MessageHeader from "./MessageHeader.vue";

const message = ref<string>("");
const emit = defineEmits<{
  (e: "sendMessage", value: string): void;
  (e: 'searchMessages'): void;
  (e: 'cancelSearching'): void;
}>();

const props = defineProps<{
  activeChat: Chat;
  searching: boolean;
  searchText: string;
}>();

function sendMessage() {
  emit("sendMessage", message.value);
  message.value = "";
}
</script>

<style scoped>
.chats_content {
  width: 60%;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #fff;
}
</style>
