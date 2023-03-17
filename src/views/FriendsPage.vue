<template>
  <div class="container">
    <KeepAlive>
      <component
        class="component"
        :friends="authStore.user.friends"
        :is="activeComponent"
      ></component>
    </KeepAlive>
    <FriendTabs
      :tabs="tabs"
      :badges="badges"
      @changeActiveComponent="changeActiveComponent"
    />
  </div>
</template>

<script setup lang="ts">
import UserFriends from "../components/UserFriends.vue";
import UserFriendRequests from "../components/UserFriendRequests.vue";
import FriendTabs from "../components/FriendsTabs.vue";
import { v4 as uuidv4 } from "uuid";
import type { ComponentOptions } from "vue";
import { shallowRef, computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import type { Tabs } from "env";
const authStore = useAuthStore();

const tabs: Array<Tabs> = [
  {
    title: "Мои Друзья",
    component: UserFriends,
    id: uuidv4(),
  },
  {
    title: "Заявки в друзья",
    component: UserFriendRequests,
    id: uuidv4(),
  },
];

const badges: Array<number> = [
  authStore.user.friends.length,
  authStore.user.friendRequestFrom.length,
];

let activeComponent = shallowRef<ComponentOptions>(UserFriends);
const componentName = computed(() => {
  if (activeComponent.value.__file) {
    let matches = activeComponent.value.__file.match(/\/\w+\.vue/);
    if (matches) {
      return matches[0].replace(/[\/\.vue]/, "").replace(/\.vue/, "");
    } else {
      return "";
    }
  } else {
    return "";
  }
});
function changeActiveComponent(component: ComponentOptions) {
  activeComponent.value = component;
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.component {
  width: 80%;
  height: fit-content;
}

.friends {
  margin: 0;
}
</style>
