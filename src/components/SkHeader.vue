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
          :theme="props.theme"
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

const props = defineProps<{
  theme: any;
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
  console.log(theme, " Header theme");
  emit("changeTheme", theme);
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

  .menu {
    padding: 10px 0;
    width: 270px;
  }
}

@media (max-width: 800px) {
  .header {
    padding: 0;
  }

  .dropdown_menu {
    position: absolute;
    left: -150%;
    bottom: -165px;
  }

  .header__content {
    margin: 0 auto;
    font-size: 10px;
    padding: 0 10px;
  }
  .header__logo {
    font-size: 20px;
  }
  .search {
    padding: 3px 30px;
    font-size: 16px;
    background-size: 16px 16px;
  }

  .profile {
    padding: 2px;
  }
  .dropdown {
    width: 5px;
    height: 5px;
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

  .menu {
    padding: 5px 0;
    width: 240px;
  }

  .user {
    padding: 2px 7px;
  }

  .user_avatar {
    width: 40px;
    object-fit: cover;
    height: 40px;
  }
  .user_name {
    font-size: 15px;
    color: #2d5a86;
    font-weight: bold;
  }

  .user_avatar_container {
    width: 40px;
    height: 40px;
  }
}

@media (max-width: 450px) {
  .dropdown_menu {
    position: absolute;
    left: -150%;
    bottom: -155px;
  }

  .header__content {
    margin: 0 auto;
    font-size: 8px;
    padding: 0 5px;
  }
  .header__logo {
    font-size: 18px;
  }
  .search {
    padding: 3px 30px;
    font-size: 14px;
    background-size: 16px 16px;
    width: 200px;
  }

  .profile {
    padding: 2px;
  }
  .dropdown {
    width: 6px;
    height: 6px;
  }
  .user {
    padding: 2px;
    column-gap: 10px;
  }
  .avatar_wrapper {
    border-radius: 50%;
  }

  .avatar {
    width: 30px;
    height: 30px;
  }

  .menu {
    padding: 5px 0;
    width: 200px;
  }

  .user {
    padding: 2px 5px;
  }

  .user_avatar {
    width: 35px;
    object-fit: cover;
    height: 35px;
  }
  .user_name {
    font-size: 13px;
    color: #2d5a86;
    font-weight: bold;
  }

  .user_avatar_container {
    width: 35px;
    height: 35px;
  }
}

@media (max-width: 320px) {
  .dropdown_menu {
    position: absolute;
    left: -150%;
    bottom: -145px;
  }

  .header__content {
    margin: 0 auto;
    font-size: 8px;
    column-gap: 5px;
  }
  .header__logo {
    font-size: 15px;
  }
  .search {
    padding: 3px 30px;
    font-size: 12px;
    background-size: 16px 16px;
    width: 150px;
  }

  .avatar_wrapper {
    border-radius: 50%;
  }

  .avatar {
    width: 27px;
    height: 27px;
  }

  .menu {
    padding: 5px 0;
    width: 150px;
  }

  .user {
    padding: 2px 5px;
  }

  .user_avatar {
    width: 30px;
    object-fit: cover;
    height: 30px;
  }
  .user_name {
    font-size: 12px;
    color: #2d5a86;
    font-weight: bold;
  }

  .user_avatar_container {
    width: 30px;
    height: 30px;
  }
}

.dark .header {
  background-color: #222222;
  border-bottom: 1px solid #292929;
}
.dark .header__logo {
  color: #fff;
}

.dark .search {
  background-color: #424242;
  color: #fff;
}
.dark .menu {
  background-color: #292929;
}
.dark .user {
  background-color: #222222;
}

.dark .user:hover {
  background-color: #292929;
}

.dark .user_name {
  color: #fff;
}

.dark .profile {
  background-color: #222222;
}

.dark .profile:hover {
  background-color: #292929;
}
</style>
