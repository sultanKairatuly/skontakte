<template>
  <div class="messages" ref="messages" v-if="props.messages.length">
    <MessageItem
      :readonly="props.readonly"
      :message="message"
      v-for="message in props.messages"
      :key="message.id"
      @addImportantMessage="(value) => $emit('addImportantMessage', value)"
      @removeImportantMessage="
        (value) => $emit('removeImportantMessage', value)
      "
      @click="handleMessageClick"
      @deleteMessage="(value) => $emit('deleteMessage', value)"
    />
  </div>
  <div class="messages" v-else>
    <NoMessage>Сообщений нет</NoMessage>
  </div>
</template>

<script setup lang="ts">
import type { Chat, Message } from "env";
import MessageItem from "../components/MessageItem.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const messages = ref<HTMLElement | null>(null);

const props = withDefaults(
  defineProps<{
    messages: Array<Message>;
    readonly?: boolean;
  }>(),
  {
    readonly: false,
  }
);

defineEmits<{
  (e: "addImportantMessage", value: Message): void;
  (e: "removeImportantMessage", value: Message): void;
  (e: "deleteMessage", value: Message): void;
}>();

function handleMessageClick() {
  if (props.readonly && messages.value) {
  } else {
    return;
  }
}
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
