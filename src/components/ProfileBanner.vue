<template>
  <div class="banner">
    <div class="user">
      <div class="user_info">
        <div class="user_avatar_wrapper">
          <div class="user_avatar_box">
            <img :src="store.user.photoURL" alt="avatar" class="user_avatar" />
          </div>
          <div class="dropdown_list">
            <div class="dropdown_list-item" @click="changeProfilePhoto">Сменить фото</div>
            <div
              class="dropdown_list-item"
              v-if="store.user.photoURL !== defaultPhotoURL"
            >
              Удалить фото
            </div>
          </div>
        </div>
        <div class="text">
          <div class="user_name">{{ store.user.displayName }}</div>
          <div class="links">
            <div class="link">
              <i class="fa-solid fa-location-dot icon"></i>
              <div class="link_text">Алматы</div>
            </div>
            <div class="link">
              <i class="fa-solid fa-circle-info icon"></i>
              <div class="link_text">Подробнее</div>
            </div>
          </div>
        </div>
      </div>

      <div class="helpers">
        <SkButton :padding="'12px 30px'" :font-size="'18px'"
          >Редактировать</SkButton
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SkButton from "../UIcomponents/SkButton.vue";
import { useAuthStore } from "@/stores/auth";
const defaultPhotoURL =
  "https://images.are.na/eyJidWNrZXQiOiJhcmVuYV9pbWFnZXMiLCJrZXkiOiI4MDQwOTc0L29yaWdpbmFsX2ZmNGYxZjQzZDdiNzJjYzMxZDJlYjViMDgyN2ZmMWFjLnBuZyIsImVkaXRzIjp7InJlc2l6ZSI6eyJ3aWR0aCI6MTIwMCwiaGVpZ2h0IjoxMjAwLCJmaXQiOiJpbnNpZGUiLCJ3aXRob3V0RW5sYXJnZW1lbnQiOnRydWV9LCJ3ZWJwIjp7InF1YWxpdHkiOjkwfSwianBlZyI6eyJxdWFsaXR5Ijo5MH0sInJvdGF0ZSI6bnVsbH19?bc=0";
const store = useAuthStore();

function changeProfilePhoto(){
    
}
</script>

<style scoped>
.banner {
  height: 500px;
  background-color: #f0f4f8;
  display: flex;
  border-radius: 30px;
  align-items: flex-end;
  overflow: hidden;
}
.user {
  border-top-right-radius: 10px;
  border-top-left-radius: 20px;
  height: 130px;
  background-color: #fff;
  width: 100%;
  padding: 20px;
  display: flex;
  justify-content: space-between;
}

.user_info {
  display: flex;
  column-gap: 30px;
  align-items: center;
}
.user_avatar_wrapper {
  position: relative;
  transform: translateY(-30%);
  width: 195px;
  height: 195px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  border-radius: 50%;
  cursor: pointer;
}

.user_avatar_box {
  width: 180px;
  height: 180px;
  overflow: hidden;
  border-radius: 50%;
}
.user_avatar {
  width: 180px;
  height: 180px;
}
.user_name {
  font-size: 27px;
  font-weight: 600;
}
.links {
  margin-top: 15px;
  display: flex;
  column-gap: 30px;
}
.link {
  display: flex;
  column-gap: 10px;
}
.icon {
  color: #626d7a;
  font-size: 20px;
}
.link_text {
  color: #626d7a;
  font-size: 19px;
  cursor: pointer;
}

.link_text:hover {
  text-decoration: underline;
}

.helpers {
  display: flex;
  column-gap: 15px;
  align-items: center;
}

.dropdown_list {
  position: absolute;
  top: 50%;
  left: 50%;
  background-color: #fff;
  width: 200px;
  padding: 5px;
  z-index: 5;
  box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2);
}

.dropdown_list-item {
  text-align: center;
  font-size: 20px;
  cursor: pointer;
  padding: 15px;
  transition: 0.1s ease-in-out;
}

.dropdown_list-item:hover {
  background-color: #cecece;
}
</style>
