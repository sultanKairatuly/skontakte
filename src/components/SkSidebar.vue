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
    route: "/friends",
  },
  {
    icon: " fa-solid fa-newspaper",
    title: "Статьи",
    id: uuidv4(),
    route: "/articles",
  },
  {
    icon: " fa-solid fa-message",
    title: "Мессенджер",
    id: uuidv4(),
    route: "/chats",
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

.dark .sidebar {
  background-color: #222222;
}

.dark .sidebar_item:hover {
  background-color: rgb(63, 63, 63);
}
.dark .sidebar_item-title {
  color: #fff;
}

@media (max-width: 1440px) {
  .sidebar {
    padding: 10px;
    width: 10%;
  }

  .sidebar_item {
    column-gap: 5px;
    padding: 3px;
  }

  .sidebar_item-icon {
    font-size: 16px;
  }

  .sidebar_item-title {
    font-size: 14px;
  }
}

@media (max-width: 1000px) {
  .sidebar {
    padding: 10px;
    width: 15%;
  }

  .sidebar_item {
    column-gap: 3px;
  }

  .sidebar_item-icon {
    font-size: 14px;
  }

  .sidebar_item-title {
    font-size: 12px;
  }
}

@media (max-width: 475px) {
  .sidebar {
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 0;
    border-radius: 0;
    display: flex;
    justify-content: space-between;
    padding: 0 30px;
    border-top: 1px solid #dce1e6;
  }

  .sidebar_item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .sidebar_item-icon {
    font-size: 18px;
  }

  .sidebar_item-title {
    font-size: 11px;
  }
}
</style>
