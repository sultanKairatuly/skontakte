<template>
  <div class="container">
    <div class="search">
      <ChatHeaderInput
        class="search_input"
        :model-value="searchText"
        @update:modelValue="(newValue: string) => $emit('update:modelValue', newValue)"
        @clearModelValue="$emit('clearModelValue')"
      />
      <button class="search_btn">Поиск</button>
    </div>
    <div class="users" v-if="users.length > 0">
      <div class="user" v-for="user in users">
        <div
          class="user_avatar_container"
          @click="$router.push(`/user/${user.email}`)"
        >
          <img :src="getImageUrl(user.photoURL)" class="user_avatar" />
        </div>
        <div class="user_bottom">
          <div class="user_name" @click="$router.push(`/user/${user.email}`)">
            {{ user.name }}
          </div>
          <i
            v-if="!includes(user, authStore.user.friendRequestTo, 'email')"
            class="fa-solid fa-user-plus add-icon"
            @click="sendFriendRequest(user.email)"
          >
            <q-tooltip
              anchor="top middle"
              self="bottom middle"
              :offset="[10, 10]"
            >
              Добавить в друзья
            </q-tooltip>
          </i>
          <i v-else class="fa-solid fa-user-check add-icon"></i>
        </div>
      </div>
    </div>
    <div class="wrapper" v-if="loading">
      <SkLoader />
    </div>
  </div>
</template>

<script setup lang="ts">
import ChatHeaderInput from "../components/ChatHeaderInput.vue";
import { ref, reactive } from "vue";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../firebase";
import type { AddedUser, UserDB } from "env";
import { useImageGetter } from "../composables/utilities";
import SkLoader from "../components/SkLoader.vue";
import { useAuthStore } from "@/stores/auth";

const { getImageUrl, includes } = useImageGetter();
const loading = ref<boolean>(false);
const searchText = ref<string>("");
const users: Array<AddedUser> = reactive([]);
const authStore = useAuthStore();

fetchUsers();
async function fetchUsers() {
  loading.value = true;
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc: any) => {
    if (doc.data().email !== authStore.user.email) {
      const user: AddedUser = {
        email: doc.data().email,
        name: doc.data().name,
        photoURL: doc.data().photoURL,
      };
      users.push(user);
    } else {
      return;
    }
  });
  loading.value = false;
}

async function sendFriendRequest(email: string) {
  let friend: UserDB;
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc: any) => {
    if (doc.data().email === email) {
      friend = doc.data();
      authStore.addFriend(friend);
    } else {
      return;
    }
  });
}
</script>

<style scoped>
.search {
  display: flex;
  background-color: #fff;
  align-items: center;
  padding: 5px;
  border: 1px solid #e5e5e5;
  border-bottom: none;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
}

.search_input {
  width: 90%;
}

.user_avatar_container {
  width: 130px;
  height: 130px;
  overflow: hidden;
  margin-bottom: 10px;
  border-radius: 4px;
}

.wrapper {
  position: relative;
  min-height: 200px;
  background-color: #fff;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  overflow: hidden;
  border: 1px solid #e5e5e5;
  border-top: none;
}
.search_btn {
  padding: 5px 15px;
  font-size: 13px;
  border: none;
  border-radius: 10px;
  outline: none;
  cursor: pointer;
  background-color: #668abe;
  color: #fff;
  margin-right: 10px;
}

.users {
  border: 1px solid #e5e5e5;
  border-top: none;
  display: flex;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  background-color: #fff;
  flex-wrap: wrap;
  padding: 30px;
  row-gap: 20px;
}

.user_bottom {
  display: flex;
  width: 100%;
  justify-content: space-between;
}
.user {
  width: 135px;
  display: flex;
  margin: 0 5px;
  flex-direction: column;
  align-items: flex-start;
}

.add-icon {
  margin-left: 10px;
  font-size: 13px;
  cursor: pointer;
  color: #4c72b2;
}

.add-icon:hover {
  color: #668abe;
}
.user_avatar {
  width: 130px;
  height: 130px;
  object-fit: cover;
  cursor: pointer;
}
.user_name {
  color: #4c72b2;
  font-size: 12px;
  overflow: hidden; /* hide any overflow beyond the container */
  white-space: nowrap;
  text-overflow: ellipsis;
  font-weight: bold;
  cursor: pointer;
  max-width: 80%;
}

.user_name:hover {
  text-decoration: underline;
}
</style>
