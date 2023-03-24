<template>
  <div class="chats_items">
    <ChatItem
      @click="$emit('chooseChat', chat)"
      v-for="chat in props.chats"
      :key="chat.id"
      :chat="chat"
      :class="{
        active: chat.id === activeChat.id,
      }"
    />
  </div>
</template>

<script setup lang="ts">
import type { Chat } from "env";
import ChatItem from "../components/ChatItem.vue";

const props = defineProps<{
  chats: Array<Chat>;
  activeChat: Chat;
}>();
</script>

<style scoped>
.chats_items {
  display: flex;
  flex-direction: column;
}
</style>
