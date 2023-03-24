<template>
  <div
    class="message"
    :class="{
      yours: message.from.email === authStore.user.email,
    }"
  >
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

const { timeSince } = useImageGetter();
const authStore = useAuthStore();

const props = defineProps<{
  message: Message;
}>();
</script>

<style scoped>
.message {
  padding: 5px;
  display: flex;
}

.text {
  width: 90%;
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
  word-wrap: break-word;
  width: 98%;
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
  display: flex;
  column-gap: 5px;
}
</style>
