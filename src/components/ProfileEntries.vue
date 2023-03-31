<template>
  <div class="entries">
    <nav class="nav">
      <div
        class="nav_item"
        v-for="item in navItems"
        :key="item.id"
        @click="changeEntryLink(item)"
        :class="{
          active: item.title === activeNavItem,
        }"
      >
        <i class="nav_item-icon" :class="item.icon"></i>
        <div class="nav_item-text">{{ item.title }}</div>
      </div>
    </nav>
    <KeepAlive>
      <component
        :loading="loading"
        :readonly="props.readonly"
        :user="props.user"
        :is="activeEntryComponent"
      ></component>
    </KeepAlive>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { v4 as uuidv4 } from "uuid";
import type { entriesNavItem, UserDB } from "env";
import EntriesPhoto from "./EntriesPhoto.vue";
import EntriesPost from "./EntriesPost.vue";
import EntriesArticle from "./EntriesArticle.vue";
import type { Component } from "vue";

const loading = ref<boolean>(true);
const props = withDefaults(
  defineProps<{
    readonly?: boolean;
    user: UserDB;
  }>(),
  {
    readonly: false,
  }
);
watch(
  () => props.user,
  (nv) => {
    const isUser = Object.keys(nv).length > 0;
    if (isUser) {
      console.log("NNNNNVVVV:::  ", nv);
      loading.value = false;
    } else {
      loading.value = true;
    }
  },
  {
    deep: true,
  }
);
let activeEntryComponent: Component = EntriesPhoto;
const navItems: Array<entriesNavItem> = [
  {
    icon: "fa-solid fa-image ",
    title: "Фото",
    id: uuidv4(),
    component: EntriesPhoto,
  },
  {
    icon: "fa-sharp fa-solid fa-envelope ",
    title: "Посты",
    id: uuidv4(),
    component: EntriesPost,
  },
  {
    icon: "fa-solid fa-file-lines ",
    title: "Статьи",
    id: uuidv4(),
    component: EntriesArticle,
  },
];
const activeNavItem = ref<string>(navItems[0].title);

function changeEntryLink(link: entriesNavItem) {
  activeNavItem.value = link.title;
  activeEntryComponent = link.component;
}
</script>

<style scoped>
.entries {
  background-color: #fff;
  padding: 15px 20px;
  border-radius: 20px;
  border: 1px solid #dce1e6;
}

.nav {
  display: flex;
  column-gap: 20px;
  margin-bottom: 20px;
}

.nav_item {
  cursor: pointer;
  padding: 10px 10px;
  border-radius: 10px;
  font-size: 19px;
  font-weight: 600;
  color: #818c99;
  display: flex;
  align-items: center;
  transition: 0.1s ease-in-out;
  column-gap: 10px;
}

.nav_item:not(.active):hover {
  background-color: #eaeaeabe;
}

.active {
  transition: 0.1s ease-in-out;
  box-shadow: 1px -2px 21px -4px rgba(34, 60, 80, 0.2);
  color: #346297;
  border: 2px solid #dce1e6;
}



.dark .active {
  color: #fff;
}

@media (max-width: 1440px) {
  .entries {
    padding: 25px;
  }

  .nav {
    column-gap: 16px;
    margin-bottom: 16px;
  }

  .nav_item {
    padding: 6px 6px;
    font-size: 16px;
  }
}
</style>
