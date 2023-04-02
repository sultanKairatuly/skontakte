<template>
  <div class="container" v-if="screenWidth <= 320">
    <ChatSidebar
      :activeChat="activeChat"
      :chats="authStore.user.chats"
      @chooseChat="chooseChat"
      v-if="back"
      @showImportantMessages="showImportantMessages"
      :style="{
        width: back ? '100%' : '10%',
      }"
    />
    <ChatContent
      v-else
      @goBack="back = true"
      @addImportantMessage="addImportantMessage"
      @searchMessages="searching = true"
      @cancelSearching="searching = false"
      :activeChat="activeChat"
      :searching="searching"
      @sendMessage="sendMessage"
      @removeImportantMessage="removeImportantMessage"
      @deleteMessage="deleteMessage"
      :style="{
        width: back ? '10%' : '100%',
      }"
    />
    <Teleport to=".app">
      <SkPopup
        :class="{
          showed: importantMessagesPopup,
          hidden: !importantMessagesPopup,
        }"
        @close-popup="closeCancelFriendRequestPopup"
        class="details_modal"
        padding="0px"
        width="800px"
      >
        <template #modal>
          <h3 class="details_title">Важные сообщения</h3>
          <div
            class="messages"
            ref="messages"
            v-if="authStore.user.importantMessages.length"
          >
            <MessageItem
              v-for="message in authStore.user.importantMessages"
              :message="message"
              :key="message.id"
            />
          </div>
          <div class="messages" v-else>
            <NoMessage>Важных сообщений нет</NoMessage>
          </div>
        </template>
      </SkPopup>
    </Teleport>
  </div>
  <div class="container" v-else>
    <ChatSidebar
      :activeChat="activeChat"
      :chats="authStore.user.chats"
      @chooseChat="chooseChat"
      @showImportantMessages="showImportantMessages"
    />
    <ChatContent
      @addImportantMessage="addImportantMessage"
      @searchMessages="searching = true"
      @cancelSearching="searching = false"
      :activeChat="activeChat"
      :searching="searching"
      @sendMessage="sendMessage"
      @removeImportantMessage="removeImportantMessage"
      @deleteMessage="deleteMessage"
    />
    <Teleport to=".app">
      <SkPopup
        :class="{
          showed: importantMessagesPopup,
          hidden: !importantMessagesPopup,
        }"
        @close-popup="closeCancelFriendRequestPopup"
        class="details_modal"
        padding="0px"
        width="800px"
      >
        <template #modal>
          <h3 class="details_title">Важные сообщения</h3>
          <div
            class="messages"
            ref="messages"
            v-if="authStore.user.importantMessages.length"
          >
            <MessageItem
              v-for="message in authStore.user.importantMessages"
              :message="message"
              :key="message.id"
            />
          </div>
          <div class="messages" v-else>
            <NoMessage>Важных сообщений нет</NoMessage>
          </div>
        </template>
      </SkPopup>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onUnmounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import ChatSidebar from "../components/ChatSidebar.vue";
import ChatContent from "../components/ChatContent.vue";
import type { Chat, Message } from "env";
import { getDocs, doc, updateDoc, collection } from "firebase/firestore";
import { db } from "../../firebase";
import { v4 as uuidv4 } from "uuid";
import { useRoute } from "vue-router";
import SkPopup from "../UIcomponents/SkPopup.vue";
import MessageItem from "../components/MessageItem.vue";

const screenWidth = ref<number>(screen.width);
const resizeCallback = (e: Event) => {
  screenWidth.value = screen.width;
};
window.addEventListener("resize", resizeCallback);

const route = useRoute();

const back = ref<boolean>(true);
const searching = ref<boolean>(false);
const authStore = useAuthStore();
const activeChat: Chat = reactive({}) as Chat;
const importantMessagesPopup = ref<boolean>(false);
const stoped = ref<boolean>(false);

authStore.refreshUser();

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
  back.value = false;
  Object.assign(activeChat, chat);
}

async function sendMessage(message: string) {
  if (message !== "") {
    stoped.value = true;
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
    stoped.value = false;
  }
}

async function deleteMessage(id: string) {
  stoped.value = true;
  let docId = "";

  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc: any) => {
    const docEmail = doc.data().email;
    if (docEmail === authStore.user.email) {
      docId = doc.id;
    }
  });
  await authStore.deleteMessage(id, activeChat.id);
  await updateDoc(doc(db, "users", docId), {
    chats: authStore.user.chats,
    importantMessages: authStore.user.importantMessages,
  });

  stoped.value = false;
}

function addImportantMessage(message: Message) {
  stoped.value = true;
  authStore.setImportantMessage(message);
  stoped.value = false;
}

function removeImportantMessage(message: Message) {
  stoped.value = true;
  authStore.removeImportantMessage(message);
  stoped.value = false;
}

function showImportantMessages() {
  importantMessagesPopup.value = true;
}
function closeCancelFriendRequestPopup() {
  importantMessagesPopup.value = false;
}

onUnmounted(() => {
  window.removeEventListener("resize", resizeCallback);
});
</script>

<style scoped>
.container {
  display: flex;
  max-height: 100vh;
}

.details_title {
  font-size: 20px;
  background-color: #f0f4f8;
  padding: 15px;
  border-top-right-radius: 10px;
  border-top-left-radius: 10px;
  border-bottom: 1px solid #dce1e6;
}

.showed {
  opacity: 1;
  visibility: visible;
}

.chats-btn {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1222;
}

.hidden {
  opacity: 0;
  visibility: hidden;
}

.messages {
  background-color: #fff;
  min-height: 200px;
  padding: 20px 40px 40px 40px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.dark .details_title {
  border-bottom: 1px solid #424242;
  background-color: #222222;
}
.dark .messages {
  background-color: #222222;
}
</style>
