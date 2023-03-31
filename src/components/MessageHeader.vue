<template>
  <header>
    <header class="header" v-if="!props.searching">
      <div class="user">
        <div class="header_item_avatar_container">
          <img :src="activeChat.with.photoURL" class="header_item_avatar" />
        </div>
        <div class="header_item_name">{{ activeChat.with.name }}</div>
      </div>
      <div class="manages">
        <div class="manage_item" @click="$emit('searchMessages')">
          <q-tooltip
            anchor="top middle"
            self="bottom middle"
            :offset="[10, 10]"
          >
            Поиск сообщений
          </q-tooltip>
          <i class="fa-solid fa-magnifying-glass"></i>
        </div>
        <div class="manage_item">
          <q-menu transition-show="scale" transition-hide="scale">
            <q-list style="min-width: 100px">
              <q-item
                clickable
                class="text-subtitle1"
                @click="$emit('clearChatHistory')"
              >
                <q-item-section>Удалить историю сообщений</q-item-section>
              </q-item>
              <q-item
                clickable
                class="text-subtitle1"
                @click="$emit('blockChat')"
              >
                <q-item-section>Заблокировать сообщения</q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable class="text-subtitle1">
                <q-item-section>Закрепить чат</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
          <i class="fa-solid fa-ellipsis"></i>
        </div>
      </div>
    </header>
    <div v-else class="search_container">
      <ChatHeaderInput
        :model-value="props.searchText"
        @update:modelValue="(newValue: string) => $emit('update:modelValue', newValue)"
        @clearModelValue="$emit('clearModelValue')"
        class="search_input"
      />
      <button class="search_btn search" @click="$emit('startSearching')">
        Поиск
      </button>
      <button class="search_btn cancel" @click="$emit('cancelSearching')">
        Отмена
      </button>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { Chat } from "env";
import ChatHeaderInput from "./ChatHeaderInput.vue";

const props = defineProps<{
  searching: boolean;
  activeChat: Chat;
  searchText: string;
}>();
const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "searchMessages"): void;
  (e: "cancelSearching"): void;
  (e: "clearModelValue"): void;
  (e: "startSearching"): void;
  (e: "clearChatHistory"): void;
  (e: "blockChat"): void;
}>();
</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 20px;
  border-bottom: 1px solid #dde1e5;
}
.header_item_avatar_container {
  width: 50px;
  height: 50px;
  overflow: hidden;
  border-radius: 50%;
}

.header_item_avatar {
  width: 50px;
  height: 50px;
  object-fit: cover;
}
.header_item_name {
  font-size: 20px;
}

.user {
  display: flex;
  column-gap: 15px;
  align-items: center;
}

.search_container {
  padding: 0 5px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #dbe2e9;
}

.search_btn {
  padding: 5px 15px;
  font-size: 16px;
  border: none;
  border-radius: 10px;
  outline: none;
  cursor: pointer;
}
.search {
  background-color: #668abe;
  color: #fff;
  margin-right: 10px;
}

.search_input {
  width: 90%;
}
.cancel {
  background-color: #dbe2e9;
  color: #668abe;
}
.manages {
  display: flex;
  column-gap: 15px;
  padding: 0 3px;
}
.manage_item {
  cursor: pointer;
  color: #b9bec5;
}

.manage_item:hover {
  color: #9ba2ac;
}
.fa-solid {
  font-size: 18px;
}

@media (max-width: 1440px) {
  .header {
    padding: 13px 20px;
  }
  .header_item_avatar_container {
    width: 30px;
    height: 30px;
    overflow: hidden;
    border-radius: 50%;
  }

  .header_item_avatar {
    width: 30px;
    height: 30px;
    object-fit: cover;
  }
  .header_item_name {
    font-size: 18px;
  }

  .search_container {
    padding: 0 5px;
  }

  .search_btn {
    padding: 5px 15px;
    font-size: 13px;
    border-radius: 10px;
  }
  .search {
    margin-right: 10px;
  }

  .search_input {
    width: 90%;
  }
  .manages {
    column-gap: 15px;
    padding: 0 3px;
  }
  .fa-solid {
    font-size: 18px;
  }
}
</style>
