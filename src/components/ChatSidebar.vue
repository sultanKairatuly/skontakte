<template>
  <div class="chats_sidebar">
    <ChatHeaderInput
      :ellipsis="true"
      :model-value="searchText"
      @showImportantMessages="$emit('showImportantMessages')"
      @update:modelValue="(value: string) => (searchText = value)"
      @clearModelValue="searchText = ''"
    />
    <ChatList
      :activeChat="props.activeChat"
      :chats="filteredChats"
      @chooseChat="(value: Chat) => $emit('chooseChat', value)"
    />
  </div>
</template>

<script setup lang="ts">
import type { Chat } from "env";
import { ref, computed } from "vue";
import ChatHeaderInput from "../components/ChatHeaderInput.vue";
import ChatList from "../components/ChatList.vue";

const emit = defineEmits<{
  (e: "chooseChat", value: Chat): void;
  (e: "showImportantMessages"): void;
}>();
const searchText = ref<string>("");

const filteredChats = computed(() => {
  return props.chats.filter((chat) =>
    chat.with.name.toLowerCase().startsWith(searchText.value.toLowerCase())
  );
});

const props = defineProps<{
  chats: Array<Chat>;
  activeChat: Chat;
}>();
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

.dark .list {
  background-color: #222222;
}

.dark .chats_sidebar {
  border-right: 1px solid #424242;
}

@media (max-width: 450px) {
  .chats_sidebar {
    border-radius: 0;
  }
}
</style>
