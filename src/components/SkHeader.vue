<template>
  <header class="header">
    <div class="header__content">
      <div class="header__logo">skontakte</div>
      <input
        @input="searchUsers"
        class="search"
        type="text"
        placeholder="Поиск"
        v-model="search"
        @focus="searchUsers"
      />
      <div class="menu" v-if="isMenu">
        <div
          class="user"
          v-for="user in users"
          :key="user.email"
          @click="viewProfile(user.email)"
        >
          <div class="user_avatar_container">
            <img class="user_avatar" :src="user.photoURL" />
          </div>
          <div class="user_name">{{ user.name }}</div>
        </div>
      </div>
      <div
        class="profile"
        @click="openProfileDropdown"
        v-if="Object.keys(store.user).length"
      >
        <div class="user">
          <div class="avatar_wrapper">
            <img class="avatar" :src="store.user.photoURL" alt="avatar" />
          </div>
          <div class="dropdown"></div>
        </div>
        <ProfileDropdown
          @click.stop
          v-if="isProfileDropDown"
          @closeProfileDropdown="closeProfileDropdown"
          @openUserProfile="openProfileDropdown"
          @changeTheme="changeTheme"
          @logout="logout"
        />
      </div>
      <div v-else>регистрация</div>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { UserDB, Theme } from "env";
import ProfileDropdown from "./ProfileDropdown.vue";
import { useAuthStore } from "@/stores/auth";
import { ref, reactive, watch } from "vue";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../firebase";
import { useRouter } from "vue-router";
import { useImageGetter } from "@/composables/utilities";

document.addEventListener("click", (e: Event) => {
  const target = e.target as HTMLElement;
  if (!target?.classList.contains("search")) {
    isMenu.value = false;
  }
});

const emit = defineEmits<{
  (e: "changeTheme", value: Theme): void;
}>();

const { includes } = useImageGetter();
const isMenu = ref<boolean>(false);
const router = useRouter();
const users: Array<UserDB> = reactive([]);
const search = ref<string>("");
const store = useAuthStore();
const isProfileDropDown = ref<boolean>(false);

watch(users, (nv) => {
  if (Object.keys(nv).length > 0) {
    isMenu.value = true;
  } else {
    isMenu.value = false;
  }
});

function openProfileDropdown() {
  isProfileDropDown.value = !isProfileDropDown.value;
}

function closeProfileDropdown() {
  isProfileDropDown.value = false;
}

function logout() {
  store.logoutUser();
  isProfileDropDown.value = false;
}

async function searchUsers() {
  if (search.value === "") {
    const querySnapshot = await getDocs(collection(db, "users"));
    users.splice(0);
    querySnapshot.forEach((doc: any) => {
      if (includes(doc.data(), store.user.friends, "email")) {
        users.push(doc.data());
      }
    });
  } else {
    const querySnapshot = await getDocs(collection(db, "users"));
    users.splice(0);
    querySnapshot.forEach((doc: any) => {
      if (
        doc.data().name.toLowerCase().startsWith(search.value.toLowerCase()) &&
        doc.data().email !== store.user.email
      )
        users.push(doc.data());
    });
  }
}

function viewProfile(userEmail: string) {
  isMenu.value = false;
  router.push(`/user/${userEmail}`);
  search.value = "";
}

function changeTheme(theme: Theme) {
  emit("changeTheme", theme);
  console.log(theme);
  isProfileDropDown.value = false;
}
</script>

<style scoped>
.header {
  background-color: #fff;
  border-bottom: 1px solid #dce1e6;
  position: fixed;
  width: 100%;
  padding: 15px 0;
  z-index: 100;
}

.user_avatar_container {
  border-radius: 50%;
  width: 50px;
  height: 50px;
  overflow: hidden;
}

.menu {
  position: absolute;
  left: 51.3%;
  top: 100%;
  background-color: #fff;
  padding: 15px 0;
  z-index: 500;
  display: flex;
  width: 300px;
  flex-direction: column;
  row-gap: 20px;
  transform: translateX(-50%);
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.2);
}

.user {
  padding: 5px 15px;
  display: flex;
  column-gap: 10px;
  cursor: pointer;
  transition: 0.1s ease-in-out;
}

.user:hover {
  background-color: #eeeeee;
}
.user_avatar {
  width: 50px;
  object-fit: cover;
  height: 50px;
}
.user_name {
  font-size: 18px;
  color: #2d5a86;
  font-weight: bold;
}

.dropdown_menu {
  position: absolute;
  left: 0;
  bottom: -280px;
}

.header__content {
  max-width: 1080px;
  margin: 0 auto;
  font-size: 12.5px;
  padding: 0 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.header__logo {
  font-size: 30px;
  font-weight: bold;
}
.search {
  padding: 10px 35px;
  background-color: #edeef0;
  border-radius: 10px;
  border: none;
  font-size: 20px;
  outline: none;
  background-image: url("../assets/search.svg");
  background-repeat: no-repeat;
  background-size: 19px 19px;
  background-position: center left 10px;
}

.profile {
  padding: 10px 15px;
  transition: 0.2s ease-in-out;
  cursor: pointer;
  position: relative;
}

.profile:hover {
  background-color: #edeef0;
}

.dropdown {
  width: 8px;
  height: 8px;
  border: 3px solid #aeb7c2;
  border-bottom: none;
  border-right: none;
  transform: rotate(225deg);
}

.user {
  align-items: center;
  display: flex;
  column-gap: 15px;
}
.avatar_wrapper {
  border-radius: 50%;
  overflow: hidden;
}

.avatar {
  width: 42px;
  height: 42px;
  object-fit: cover;
}

.dark .header {
  background-color: #222222;
  border-bottom: 1px solid #292929;
}
.dark .header__logo {
  color: #fff;
}

.dark .header__content {
}
.dark .search {
  background-color: #424242;
  color: #fff;
}
.dark .menu {
  background-color: #292929;
}
.dark .user {
}

.dark .user {
  background-color: #222222;
}

.dark .user:hover {
  background-color: #292929;
}
.dark .user_avatar_container {
}
.dark .user_avatar {
}
.dark .user_name {
}

.dark .profile {
  background-color: #222222;
}

.dark .profile:hover {
  background-color: #292929;
}
.dark .avatar_wrapper {
}
.dark .avatar {
}
.dark .dropdown {
}

@media (max-width: 1440px) {
  .header {
    padding: 2px 0;
  }

  .dropdown_menu {
    position: absolute;
    left: -10px;
    bottom: -195px;
  }

  .header__content {
    margin: 0 auto;
    font-size: 12.5px;
    padding: 0 15px;
  }
  .header__logo {
    font-size: 23px;
  }
  .search {
    padding: 3px 30px;
    font-size: 18px;
    background-size: 16px 16px;
  }

  .profile {
    padding: 2px;
  }
  .dropdown {
    width: 8px;
    height: 8px;
  }
  .user {
    padding: 2px;
    column-gap: 15px;
  }
  .avatar_wrapper {
    border-radius: 50%;
  }

  .avatar {
    width: 35px;
    height: 35px;
  }
}
</style>
