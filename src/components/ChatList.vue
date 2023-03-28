<template>
  <div class="chats_items" v-if="props.chats.length">
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
  <div class="chats_items">
    <NoMessage>Чатов нет</NoMessage>
  </div>
</template>

<script setup lang="ts">
import type { Chat } from "env";
import ChatItem from "../components/ChatItem.vue";

const props = defineProps<{
  chats: Array<Chat>;
  activeChat: Chat;
}>();

const emit = defineEmits<{
  (e: "chooseChat", value: Chat): void;
}>();
</script>

<style scoped>
.chats_items {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}
</style>
