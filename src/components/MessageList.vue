<template>
  <div class="messages" v-if="props.chat.messages.length">
    <MessageItem
      :message="message"
      v-for="message in props.chat?.messages"
      :key="message.id"
    />
  </div>
  <div class="messages" v-else>
    <NoMessage>Сообщений нет</NoMessage>
  </div>
</template>

<script setup lang="ts">
import type { Chat } from "env";
import MessageItem from "../components/MessageItem.vue";

const props = defineProps<{
  chat: Chat;
}>();
</script>

<style scoped>
.messages {
  height: 85%;
  overflow: scroll;
  padding: 20px;
  display: flex;
  flex-direction: column;
  row-gap: 5px;
}
</style>
