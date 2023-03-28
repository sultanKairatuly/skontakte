<template>
  <div class="chats_sidebar">
    <ChatHeaderInput
      :model-value="searchText"
      @update:modelValue="(value) => (searchText = value)"
      @clearModelValue="searchText = ''"
    />
    <ChatList
      :activeChat="props.activeChat"
      :chats="props.chats"
      @chooseChat="(value: Chat) => $emit('chooseChat', value)"
    />
  </div>
</template>

<script setup lang="ts">
import type { Chat } from "env";
import { ref } from "vue";
import ChatHeaderInput from "../components/ChatHeaderInput.vue";
import ChatList from "../components/ChatList.vue";

const emit = defineEmits<{
  (e: "chooseChat", value: Chat): void;
}>();

const props = defineProps<{
  chats: Array<Chat>;
  activeChat: Chat;
}>();

const searchText = ref<string>("");
</script>

<style scoped>
.chats_sidebar {
  width: 40%;
  height: 100%;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  overflow: hidden;
  border-right: 1px solid #dde1e5;
}

.list {
  margin-top: 5px;
  height: 100%;
  background-color: #fff;
}
</style>
