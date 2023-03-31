<template>
  <div class="item" @click="$emit('chooseChat', props.chat)">
    <div class="avatar_container">
      <img class="avatar" :src="getImageUrl(props.chat.with.photoURL)" />
    </div>
    <div class="text">
      <div class="with_name">{{ props.chat.with.name }}</div>
      <div class="with_message">
        {{ lastMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Chat } from "env";
import { useImageGetter } from "@/composables/utilities";
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth";

const emit = defineEmits<{
  (e: "chooseChat", value: Chat): void;
}>();
const authStore = useAuthStore();
const { getImageUrl } = useImageGetter();
const props = defineProps<{
  chat: Chat;
}>();

const lastMessage = computed(() => {
  return props.chat.messages?.[props.chat.messages.length - 1]?.from.email ===
    authStore.user.email
    ? `Вы: ${props.chat.messages?.[props.chat.messages.length - 1]?.message}`
    : props.chat.messages?.[props.chat.messages.length - 1]?.message;
});
</script>

<style scoped>
.item {
  background-color: #fff;
  display: flex;
  cursor: pointer;
  transition: 0.2s ease-in-out;
  padding: 5px 10px;
}

.item:hover {
  background-color: #e8e8e8;
  border-bottom: 1px solid #e5e5e5;
}

.avatar_container {
  width: 80px;
  height: 80px;
  overflow: hidden;
  border-radius: 50%;
}

.avatar {
  width: 80px;
  height: 80px;
  object-fit: cover;
}
.text {
  margin-left: 15px;
  padding: 6px;
  width: 75%;
}
.with_name {
  font-size: 21px;
}

.with_message {
  color: gray;
  font-size: 18px;
  width: 100%;
  overflow: hidden; /* hide any overflow beyond the container */
  white-space: nowrap;
  text-overflow: ellipsis;
}

.active {
  background-color: #5c80b4;
}

.active:hover {
  background-color: #5c80b4;
}

.active .with_name {
  font-size: 21px;
  color: #fff;
}

.active .with_message {
  color: #fff;
}

.dark .item {
  background-color: #222222;
}

.dark .item:hover {
  background-color: #363636;
  border-bottom: 1px solid #bdbdbd;
}

.dark .text {
  margin-left: 15px;
  padding: 6px;
  width: 75%;
}
.dark .with_name {
  font-size: 21px;
  color: #fff;
}

.dark .active {
  background-color: #397dcc;
}

.dark .active:hover {
  background-color: #5c80b4;
}

.dark .active .with_name {
  font-size: 21px;
  color: #fff;
}

.dark .active .with_message {
  color: #fff;
}

@media (max-width: 1440px) {
  .item {
    padding: 5px 10px;
  }

  .avatar_container {
    width: 50px;
    height: 50px;
    overflow: hidden;
    border-radius: 50%;
  }

  .avatar {
    width: 50px;
    height: 50px;
    object-fit: cover;
  }
  .text {
    margin-left: 15px;
    padding: 2px;
    width: 75%;
  }
  .with_name {
    font-size: 18px;
  }

  .with_message {
    font-size: 13px;
    width: 100%;
  }

  .active .with_name {
    font-size: 18px;
  }
}
</style>
