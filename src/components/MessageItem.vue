<template>
  <div
    @mouseenter="messageHovered = true"
    @mouseleave="messageHovered = false"
    class="message"
    :class="{
      yours: message.from.email === authStore.user.email,
    }"
  >
    <div class="icons" v-if="messageHovered && !props.readonly">
      <i
        class="fa-solid fa-star message-icon"
        @click="toggleImportantMessage(message)"
        :class="{
          'active-icon': authStore.user.importantMessages.filter((item: Message) => item.id === message.id).length !== 0 
        }"
      >
        <q-tooltip
          class="text-body1"
          anchor="top middle"
          self="bottom middle"
          :offset="[10, 10]"
        >
          Важные сообщения
        </q-tooltip>
      </i>
      <i
        class="fa-solid fa-trash message-icon"
        @click="deleteMessage(message.id)"
      >
        <q-tooltip
          class="text-body1"
          anchor="top middle"
          self="bottom middle"
          :offset="[10, 10]"
        >
          Удалить сообщение
        </q-tooltip>
      </i>
      <i class="fa-solid fa-reply message-icon">
        <q-tooltip
          class="text-body1"
          anchor="top middle"
          self="bottom middle"
          :offset="[10, 10]"
        >
          Ответить
        </q-tooltip>
      </i>
    </div>

    <div class="message_author">
      <div class="author_avatar_container">
        <img :src="message.from.photoURL" class="author_avatar" />
      </div>
    </div>
    <div class="text">
      <div class="info">
        <div class="author_name">{{ message.from.name }}</div>
        <div class="time">
          {{ timeSince(message.createdAt) }}
        </div>
      </div>
      <div class="message_content">
        {{ message.message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "../stores/auth";
import { useImageGetter } from "@/composables/utilities";
import type { Message } from "env";
import { ref } from "vue";

const messageHovered = ref<boolean>(false);
const emit = defineEmits<{
  (e: "addImportantMessage", value: Message): void;
  (e: "removeImportantMessage", value: Message): void;
  (e: "deleteMessage", value: string): void;
}>();
const { timeSince } = useImageGetter();
const authStore = useAuthStore();

const props = withDefaults(
  defineProps<{
    message: Message;
    readonly?: boolean;
  }>(),
  {
    readonly: false,
  }
);

function toggleImportantMessage(message: Message) {
  const exist = authStore.user.importantMessages.filter(
    (item: Message) => item.id === message.id
  ).length;
  if (exist) {
    removeImportantMessage(message);
  } else {
    addImportantMessage(message);
  }
}

function addImportantMessage(message: Message) {
  emit("addImportantMessage", message);
}

function removeImportantMessage(message: Message) {
  emit("removeImportantMessage", message);
}

function deleteMessage(id: string) {
  emit("deleteMessage", id);
}
</script>

<style scoped>
.message {
  padding: 15px;
  display: flex;
  position: relative;
}

.text {
  width: 90%;
}

.icons {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  column-gap: 15px;
}

.message-icon {
  color: #b7bec5;
  font-size: 18px;
  cursor: pointer;
}

.message-icon:hover {
  color: #c0c6cc;
}
.message_author {
  margin-right: 10px;
}
.author_avatar_container {
  width: 55px;
  height: 55px;
  overflow: hidden;
  border-radius: 50%;
}
.author_avatar {
  width: 55px;
  height: 55px;
  object-fit: cover;
}
.author_name {
  font-size: 20px;
}
.message_content {
  word-wrap: break-word;
  width: 98%;
  font-size: 19px;
}

.time {
  color: rgb(162, 162, 162);
  font-size: 16px;
}

.yours {
  background-color: #f0f2f5;
}

.info {
  display: flex;
  column-gap: 5px;
}

.active-icon {
  color: #447bba;
}

.active-icon:hover {
  color: #447bba;
}



.dark .message {
  padding: 15px;
  display: flex;
  position: relative;
}



.dark .message-icon {
  color: #b7bec5;
  font-size: 18px;
  cursor: pointer;
}

.dark .message-icon:hover {
  color: #c0c6cc;
}
.dark .message_author {
  margin-right: 10px;
  color: #fff;
}
.dark .author_name {
  font-size: 20px;
  color: #fff;
}
.dark .message_content {
  word-wrap: break-word;
  width: 98%;
  font-size: 19px;
  color: #fff;
}

.dark .yours {
  background-color: #333333;
}

.dark .active-icon {
  color: #447bba;
}

.dark .active-icon:hover {
  color: #447bba;
}

@media (max-width: 1440px) {
  .message {
    padding: 5px;
    display: flex;
  }

  .message-icon {
    font-size: 18px;
  }
  .message_author {
    margin-right: 10px;
  }
  .author_avatar_container {
    width: 35px;
    height: 35px;
    overflow: hidden;
    border-radius: 50%;
  }
  .author_avatar {
    width: 35px;
    height: 35px;
    object-fit: cover;
  }
  .author_name {
    font-size: 15px;
  }
  .message_content {
    font-size: 15px;
  }

  .time {
    color: rgb(162, 162, 162);
    font-size: 12px;
  }

  .yours {
    background-color: #f0f2f5;
  }

  .info {
    column-gap: 5px;
  }

  .hovered {
  }
}
</style>
