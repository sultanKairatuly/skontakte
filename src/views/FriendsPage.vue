<template>
  <div class="container">
    <div class="component loader_wrapper" v-if="loading">
      <SkLoader />
    </div>
    <KeepAlive v-else>
      <component
        class="component"
        :friends="authStore.user.friends"
        :is="activeComponent"
        :friend-request-from="authStore.user.friendRequestFrom"
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
import type { ComponentOptions, Component } from "vue";
import { shallowRef, computed, ref } from "vue";
import { useAuthStore } from "@/stores/auth";
import type { Tabs } from "env";
import SkLoader from "../components/SkLoader.vue";
const authStore = useAuthStore();
const loading = ref<boolean>(false);
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

let activeComponent = shallowRef<Component>(UserFriends);
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
  width: 78%;
  height: fit-content;
}


.friends {
  margin: 0;
}

.loader_wrapper {
  position: relative;
  background-color: #fff;
}

@media (max-width: 1440px) {
  .component {
    width: 68%;
  }
}
</style>
