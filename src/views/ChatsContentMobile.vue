<template>
  <div class="chats_content" v-if="Object.keys(activeChat).length">
    <MessageHeader
      :search-text="searchText"
      @update:modelValue="(value) => (searchText = value)"
      :searching="searchingInput"
      :active-chat="props.activeChat"
      @searchMessages="searchingInput = true"
      @cancelSearching="searchingInput = false"
      @startSearching="startSearching"
      @clearModelValue="searchText = ''"
      @clearChatHistory="clearChatHistory"
      @blockChat="blockChat"
    />
    <MessageList
      :messages="activeChat.messages"
      v-if="!searching"
      @deleteMessage="
        (value) => authStore.deleteMessage(currentChat.id, value.id)
      "
      style="height: 85%"
      @addImportantMessage="(value) => authStore.setImportantMessage(value)"
      @removeImportantMessage="
        (value) => authStore.removeImportantMessage(value)
      "
    />
    <MessageList :readonly="true" v-else :messages="foundMessages" />
    <MessageManager
      v-if="!currentChat.blocked"
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
import { ref, reactive } from "vue";
import MessageList from "../components/MessageList.vue";
import MessageManager from "../components/MessageManager.vue";
import MessageHeader from "../components/MessageHeader.vue";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
const currentChat: Chat = reactive({}) as Chat;
const searchingInput = ref<boolean>(false);
const searchText = ref<string>("");
const message = ref<string>("");
const searching = ref<boolean>(false);
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

async function sendMessage(message: string) {
  if (message !== "") {
    const friendEmail = currentChat.with.email;
    let docId = "";
    let docId2 = "";
    let friendChats = [] as Array<Chat>;

    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc: any) => {
      const docEmail = doc.data().email;
      if (docEmail === friendEmail) {
        friendChats.push(...doc.data().chats);
        docId2 = doc.id;
      } else if (docEmail === authStore.user.email) {
        docId = doc.id;
      }
    });
    const user = {
      email: authStore.user.email,
      name: authStore.user.displayName,
      photoURL: authStore.user.photoURL,
    };
    const newMessage = {
      from: user,
      message,
      id: uuidv4(),
      createdAt: Date.now(),
    };
    authStore.setMessage(activeChat.id, newMessage);
    const chat = authStore.user.chats.find(
      (chat: Chat) => chat.id === activeChat.id
    );
    Object.assign(activeChat, chat);
    friendChats = friendChats.map((chat: Chat) => {
      if (chat.with.email === authStore.user.email) {
        return { ...chat, messages: [...chat.messages, newMessage] };
      } else {
        return chat;
      }
    });
    await updateDoc(doc(db, "users", docId), {
      chats: authStore.user.chats,
    });

    await updateDoc(doc(db, "users", docId2), {
      chats: friendChats,
    });
    message.value = "";
  }
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

@media (max-width: 450px) {
  .chats_content {
    border-radius: 0;
  }
}
</style>
