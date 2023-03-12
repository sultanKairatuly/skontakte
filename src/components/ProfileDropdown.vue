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
    <div
      class="dropdown_menu_item"
      v-for="list in props.dropdownList"
      :key="list.id"
      @click="$emit('listItemClicked', list)"
    >
      <i class="icon" :class="list.icon"></i>
      <div class="text">{{ list.title }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { profileListItem } from "env";
import { useAuthStore } from "@/stores/auth";
import { useImageGetter } from "../composables/utilities";
import router from "@/router";

const { getImageUrl } = useImageGetter();
const store = useAuthStore();
const props = defineProps<{
  dropdownList?: Array<profileListItem>;
}>();

const emit = defineEmits<{
  (e: 'closeProfileDropdown'): void;
}>()


function openUserProfile(){
  router.push('/profile')
  emit('closeProfileDropdown')

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
  object-fit: cover;
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

.profile:hover {
  background-color: #ebf3ff;
}

@media (max-width: 1440px) {
  .dropdown_menu {
  width: 250px;
  padding: 15px;
}

.dropdown_menu_item {
  padding: 10px 25px;
  font-size: 18px;
}

.user_avatar_container {
  width: 42px;
  height: 42px;
}

.user_avatar {
  width: 42px;
  height: 42px;
}

.profile {
  padding: 10px 22px;
}

}
</style>
