<template>
  <div class="chats_content" v-if="Object.keys(activeChat).length">
    <MessageHeader
      :search-text="searchText"
      @update:modelValue="(value) => (searchText = value)"
      :searching="props.searching"
      :active-chat="props.activeChat"
      @searchMessages="$emit('searchMessages')"
      @cancelSearching="$emit('cancelSearching')"
      @startSearching="startSearching"
      @clearModelValue="searchText = ''"
      @clearChatHistory="clearChatHistory"
      @blockChat="blockChat"
    />
    <MessageList
      :messages="activeChat.messages"
      v-if="!searching"
      @deleteMessage="(value) => $emit('deleteMessage', value)"
      style="height: 85%"
      @addImportantMessage="(value) => $emit('addImportantMessage', value)"
      @removeImportantMessage="
        (value) => $emit('removeImportantMessage', value)
      "
    />
    <MessageList :readonly="true" v-else :messages="foundMessages" />
    <MessageManager
      v-if="!props.activeChat.blocked"
      :model-value="message"
      @update:model-value="(newValue) => (message = newValue as string)"
      @sendMessage="sendMessage"
    />
    <NoMessage v-else>Отправка сообщений заблокирована</NoMessage>
  </div>
  <div class="chats_content" v-else>
    <NoMessage>Выберите чат</NoMessage>
  </div>
</template>

<script setup lang="ts">
import type { Chat, Message } from "env";
import { ref, computed, reactive } from "vue";
import MessageList from "./MessageList.vue";
import MessageManager from "./MessageManager.vue";
import MessageHeader from "./MessageHeader.vue";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
const searchText = ref<string>("");
const message = ref<string>("");
const searching = ref<boolean>(false);
// const foundMessages = computed<Array<Message>>(() => {
//   const result: Array<Message> = [];
//   authStore.user.chats.forEach((chat: Chat) => {
//     if (chat.id === props.activeChat.id) {
//       let item = chat.messages.find((message) =>
//         message.message.toLowerCase().includes(searchText.value.toLowerCase())
//       );
//       if (item) result.push(item);
//     }
//   });

//   return result;
// });

const foundMessages: Array<Message> = reactive([]);

function findMessages(text: string) {
  const result: Array<Message> = [];
  foundMessages.splice(0);

  authStore.user.chats.forEach((chat: Chat) => {
    if (chat.id === props.activeChat.id) {
      let item = chat.messages.find((message) =>
        message.message.toLowerCase().includes(searchText.value.toLowerCase())
      );
      if (item) result.push(item);
    }
  });

  foundMessages.push(...result);
}

function blockChat() {
  authStore.blockChat(props.activeChat.id);
}
const emit = defineEmits<{
  (e: "sendMessage", value: string): void;
  (e: "searchMessages"): void;
  (e: "cancelSearching"): void;
  (e: "addImportantMessage", value: Message): void;
  (e: "removeImportantMessage", value: Message): void;
  (e: "deleteMessage", value: string): void;
}>();

const props = defineProps<{
  activeChat: Chat;
  searching: boolean;
}>();

function sendMessage() {
  emit("sendMessage", message.value);
  message.value = "";
}

function clearChatHistory() {
  authStore.clearChatHistory(props.activeChat.id);
}

function startSearching() {
  searching.value = true;
  findMessages(searchText.value);
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

.dark .chats_content {
  background-color: #222222;
}
</style>
