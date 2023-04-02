<template>
  <div class="container">
    <div class="component loader_wrapper" v-if="loading">
      <SkLoader />
    </div>
    <KeepAlive v-else>
      <component
        class="component"
        :friends="userFriends"
        :readonly="true"
        :user="user"
        :is="activeComponent"
        :friend-request-from="userFriendRequestFrom"
      ></component>
    </KeepAlive>
    <FriendTabs
      :readonly="true"
      :user="(user as unknown as UserDB)"
      :tabs="tabs"
      @changeActiveComponent="changeActiveComponent"
      :loading="loading"
    />
  </div>
</template>

<script setup lang="ts">
import { reactive, shallowRef, computed, watch, ref } from "vue";
import type { AddedUser } from "env";
import { useRoute } from "vue-router";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../firebase";
import { v4 as uuidv4 } from "uuid";
import type { Tabs, UserDB } from "env";
import type { ComponentOptions, Component } from "vue";
import UserFriends from "../components/UserFriends.vue";
import UserFriendRequests from "../components/UserFriendRequests.vue";
import FriendTabs from "../components/FriendsTabs.vue";
import SkLoader from "../components/SkLoader.vue";

const loading = ref<boolean>(false);
fetchUserFriends();
const route = useRoute();
watch(
  () => route.params.email,
  (nv) => {
    fetchUserFriends();
  }
);
const userEmail = computed(() => {
  return route.params.email;
});
const userFriends: Array<AddedUser> = reactive([]);
const userFriendRequestFrom: Array<AddedUser> = reactive([]);
const user: AddedUser = reactive({}) as AddedUser;
const tabs: Array<Tabs> = [
  {
    title: "Друзья",
    component: UserFriends,
    id: uuidv4(),
  },
  {
    title: "Заявки в друзья",
    component: UserFriendRequests,
    id: uuidv4(),
  },
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
async function fetchUserFriends() {
  loading.value = true;
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc: any) => {
    const docEmail = doc.data().email;
    if (docEmail === userEmail.value) {
      Object.assign(userFriends, doc.data().friends);
      Object.assign(userFriendRequestFrom, doc.data().friendRequestFrom);
      const addedUser = {
        email: doc.data().email,
        name: doc.data().name,
        photoURL: doc.data().photoURL,
      };
      Object.assign(user, addedUser);
    }
  });
  loading.value = false;
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.component {
  margin: 0;
  width: 80%;
  height: fit-content;
}

.loader_wrapper {
  position: relative;
  background-color: #fff;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

@media (max-width: 1440px) {
  .component {
    width: 71%;
  }
}

@media (max-width: 450px) {
  .container {
    padding-top: 80px;
    padding-bottom: 19px;
  }

  .component {
    width: 100%;
    height: 100%;
  }

  .loader_wrapper {
    border-radius: 0;
  }
}


</style>
