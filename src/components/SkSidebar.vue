<template>
  <div class="sidebar">
    <div
      class="sidebar_item"
      :key="item.id"
      v-for="item in sidebarItems"
      @click="$router.push(item.route)"
    >
      <i class="sidebar_item-icon" :class="item.icon"></i>
      <div class="sidebar_item-title">{{ item.title }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { sidebarItem } from "env";
import { v4 as uuidv4 } from "uuid";

const sidebarItems: Array<sidebarItem> = [
  {
    icon: " fa-solid fa-user",
    title: "Моя страница",
    id: uuidv4(),
    route: "/profile",
  },
  {
    icon: " fa-solid fa-users",
    title: "Друзья",
    id: uuidv4(),
    route: "/profile",
  },
  {
    icon: " fa-solid fa-newspaper",
    title: "Новости",
    id: uuidv4(),
    route: "/profile",
  },
  {
    icon: " fa-solid fa-message",
    title: "Мессенджер",
    id: uuidv4(),
    route: "/profile",
  },
];
</script>

<style scoped>
.sidebar {
  width: 13%;
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  height: fit-content;
}

.sidebar_item {
  display: flex;
  column-gap: 15px;
  padding: 10px;
  border-radius: 4px;
  transition: 0.1s ease-in-out;
  cursor: pointer;
  margin: 10px 0;
}

.sidebar_item:hover {
  background-color: #cecece;
}

.sidebar_item-icon {
  font-size: 22px;
  color: #447bba;
}

.sidebar_item-title {
  font-size: 18px;
}

@media (max-width: 1440px) {
  .sidebar {
  padding: 15px;
}

.sidebar_item {
  column-gap: 10px;
  padding: 5px;
}

.sidebar_item-icon {
  font-size: 20px;
}

.sidebar_item-title {
  font-size: 16px;
}
}
</style>
