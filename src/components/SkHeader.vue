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
      />
      <div class="menu">
        <div
          class="user"
          v-for="user in users"
          :key="user.email"
          @click="viewProfile(user.email)"
        >
          {{ user.name }}
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
          :dropdown-list="dropdownListItems"
          @listItemClicked="handleListItemClicked"
          @close-profile-dropdown="closeProfileDropdown"
        />
      </div>
      <div v-else>регистрация</div>
    </div>
  </header>
</template>

<script setup lang="ts">
import type { profileListItem, UserDB } from "env";
import ProfileDropdown from "./ProfileDropdown.vue";
import { v4 as uuidv4 } from "uuid";
import { useAuthStore } from "@/stores/auth";
import { ref, reactive } from "vue";
import {
  getDocs,
  doc,
  updateDoc,
  collection,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useRouter } from "vue-router";

const router = useRouter();
const users: Array<UserDB> = reactive([]);
const search = ref<string>("");
const store = useAuthStore();
const isProfileDropDown = ref<boolean>(false);
const dropdownListItems: Array<profileListItem> = [
  {
    icon: "fa-solid fa-gear",
    title: "Настройки",
    action: goSettings,
    id: uuidv4(),
  },
  {
    icon: "fa-solid fa-palette",
    title: "Тема",
    action: changeTheme,
    id: uuidv4(),
  },
  {
    icon: "fa-solid fa-arrow-right-from-bracket",
    title: "Выйти",
    action: logOut,
    id: uuidv4(),
  },
];

function goSettings() {
  console.log("settings");
}

function changeTheme() {
  console.log("changeTheme");
}

function logOut() {
  store.logoutUser();
}

function handleListItemClicked(list: profileListItem): void {
  dropdownListItems.forEach((listItem) => {
    if (list.id === listItem.id) {
      listItem.action();
      isProfileDropDown.value = false;
    }
  });
}

function openProfileDropdown() {
  isProfileDropDown.value = !isProfileDropDown.value;
}

function closeProfileDropdown() {
  isProfileDropDown.value = false;
}

async function searchUsers() {
  const querySnapshot = await getDocs(collection(db, "users"));
  users.splice(0);
  querySnapshot.forEach((doc: any) => {
    if (doc.data().name.toLowerCase().includes(search.value.toLowerCase()))
      users.push(doc.data());
  });
}

function viewProfile(userEmail: string) {
  router.push(`/user/${userEmail}`);
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
    padding: 10px 0;
  }

  .dropdown_menu {
    position: absolute;
    left: -10px;
    bottom: -235px;
  }

  .header__content {
    margin: 0 auto;
    font-size: 12.5px;
    padding: 0 15px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .header__logo {
    font-size: 25px;
  }
  .search {
    padding: 5px 30px;
    font-size: 18px;
    background-size: 16px 16px;
  }

  .profile {
    padding: 2px;
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
    width: 35px;
    height: 35px;
  }
}
</style>
