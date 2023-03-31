<template>
  <div class="container">
    <ChatSidebar
      :activeChat="activeChat"
      :chats="authStore.user.chats"
      @chooseChat="chooseChat"
    />
    <ChatContent
      @searchMessages="searching = true"
      @cancelSearching="searching = false"
      :activeChat="activeChat"
      :searchText="searchText"
      :searching="searching"
      @sendMessage="sendMessage"
      @update:modelValue="(value: string) => (searchText = value)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onUnmounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import ChatSidebar from "../components/ChatSidebar.vue";
import ChatContent from "../components/ChatContent.vue";
import type { Chat } from "env";
import { getDocs, doc, updateDoc, collection } from "firebase/firestore";
import { db } from "../../firebase";
import { uuidv4 } from "@firebase/util";
import { useRoute } from "vue-router";

const route = useRoute();
const searching = ref<boolean>(false);
const authStore = useAuthStore();
const activeChat: Chat = reactive({}) as Chat;
const searchText = ref<string>("");

authStore.refreshUser();

let interval = setInterval(() => {
  authStore.refreshUser();
  console.log('updated chats!')
}, 10000);

onUnmounted(() => {
  clearInterval(interval);
});

watch(
  () => authStore.user.chats,
  (nv) => {
    const chat = nv.find((chat: Chat) => chat.id === activeChat.id);
    Object.assign(activeChat, chat);
  }
);
watch(
  () => route.query,
  (params: { email: string } | {}) => {
    if ("email" in params) {
      const chat = authStore.user.chats.find(
        (chat: Chat) => chat.with.email === params.email
      );
      Object.assign(activeChat, chat);
    } else {
      return;
    }
  },
  {
    immediate: true,
  }
);
function chooseChat(chat: Chat) {
  authStore.refreshUser();
  Object.assign(activeChat, chat);
}

async function sendMessage(message: string) {
  const friendEmail = activeChat.with.email;
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
}
</script>

<style scoped>
.container {
  display: flex;
  max-height: 100vh;
}
</style>
