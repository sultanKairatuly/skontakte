<template>
  <div class="dropdown_menu">
    <div class="profile" @click="openUserProfile">
      <div class="user_avatar_container">
        <img
          :src="getImageUrl(store.user.photoURL)"
          alt=""
          class="user_avatar"
        />
      </div>
      <div class="user_name">{{ store.user.displayName }}</div>
    </div>
    <div class="dropdown_menu_item">
      <i class="icon fa-solid fa-gear"></i>
      <div class="title">Настройки</div>
    </div>
    <div class="dropdown_menu_item">
      <i class="icon fa-solid fa-palette"></i>
      <SkSelect
        class="select"
        :model-value="props.theme"
        @update:modelValue="updateTheme"
        :options="['Светлая', 'Темная']"
      />
    </div>

    <div class="dropdown_menu_item" @click="$emit('logout')">
      <i class="icon fa-solid fa-arrow-right-from-bracket"></i>
      <div class="title">Выйти</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { useImageGetter } from "../composables/utilities";
import router from "@/router";
import SkSelect from "../UIcomponents/SkSelect.vue";
import { ref, watch } from "vue";
import type { Theme } from "env";

const { getImageUrl } = useImageGetter();
const store = useAuthStore();

const props = defineProps<{
  theme: any;
}>();
console.log(props.theme);

const emit = defineEmits<{
  (e: "closeProfileDropdown"): void;
  (e: "changeTheme", value: Theme): void;
  (e: "openUserProfile"): void;
}>();

function openUserProfile() {
  router.push("/profile");
  emit("closeProfileDropdown");
}

function updateTheme(them: string) {
  emit("changeTheme", them as Theme);
}
</script>

<style scoped>
.dropdown_menu {
  box-shadow: 2px 4px 20px 23px rgba(0, 0, 0, 0.13);
  width: 300px;
  background-color: #fff;
  padding: 20px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
}

.select {
  margin: 0;
}

.dropdown_menu_item {
  padding: 13px 30px;
  font-size: 20px;
  transition: 0.2s ease-in-out;
  display: flex;
  align-items: center;
}

.icon {
  margin-right: 10px;
  color: #447bba;
}

.dropdown_menu_item:hover {
  background-color: #f3f3f3;
}

.user_avatar_container {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  overflow: hidden;
}

.user_avatar {
  width: 52px;
  height: 52px;
  object-fit: contain;
}

.profile {
  margin-bottom: 10px;
  display: flex;
  column-gap: 15px;
  padding: 15px 28px;
  border-radius: 10px;
  background-color: #f0f2f5;
  align-items: center;
}

.user_name {
  font-size: 18px;
}

.profile:hover {
  background-color: #ebf3ff;
}

.dark .dropdown_menu {
  background-color: #292929;
}
.dark .user_name {
  color: #fff;
}
.dark .dropdown_menu_item {
  color: #fff;
}

.dark .dropdown_menu_item:hover {
  color: #575656;
}
.dark .profile {
  background-color: #333333;
}

@media (max-width: 1440px) {
  .dropdown_menu {
    width: 200px;
    padding: 10px;
  }

  .dropdown_menu_item {
    padding: 5px 15px;
    font-size: 16px;
  }

  .user_avatar_container {
    width: 40%;
    height: 42px;
  }

  .user_avatar {
    width: 100%;
    height: 42px;
    object-fit: cover;
  }

  .profile {
    padding: 10px 22px;
    justify-content: space-between;
  }
}

@media (max-width: 800px) {
  .dropdown_menu {
    width: 170px;
    padding: 10px;
  }

  .dropdown_menu_item {
    padding: 2px 10px;
    font-size: 14px;
  }

  .user_avatar_container {
    width: 40%;
    height: 42px;
  }

  .user_avatar {
    width: 100%;
    height: 42px;
    object-fit: cover;
  }

  .profile {
    padding: 5px;
    justify-content: space-between;
  }

  .user_name {
    font-size: 14px;
  }
}

@media (max-width: 450px) {
  .dropdown_menu {
    width: 155px;
    padding: 10px;
  }

  .dropdown_menu_item {
    padding: 2px 5px;
    font-size: 12px;
  }

  .user_avatar_container {
    width: 40%;
    height: 42px;
  }

  .user_avatar {
    width: 100%;
    height: 42px;
    object-fit: cover;
  }

  .profile {
    padding: 5px;
    justify-content: space-between;
  }

  .user_name {
    font-size: 12px;
  }
}

@media (max-width: 320px) {
  .dropdown_menu {
    width: 150px;
    padding: 5px;
  }

  .dropdown_menu_item {
    font-size: 11px;
  }

  .user_avatar_container {
    width: 35%;
    height: 38px;
  }

  .user_avatar {
    width: 100%;
    height: 38px;
    object-fit: cover;
  }

  .profile {
    justify-content: space-between;
  }

  .user_name {
    font-size: 11px;
  }
}
</style>
