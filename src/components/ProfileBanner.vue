<template>
  <div class="banner">
    <div class="user" v-if="!readonly">
      <div class="user_info">
        <div
          class="user_avatar_wrapper"
          @mouseenter="profilePhotoHovered = true"
          @mouseleave="profilePhotoHovered = false"
        >
          <div class="user_avatar_box">
            <img :src="store.user.photoURL" alt="avatar" class="user_avatar" />
            <SkLoader v-if="props.isLoading"></SkLoader>
          </div>
          <TransitionGroup name="menu">
            <div class="dropdown_list" v-if="profilePhotoHovered">
              <div class="dropdown_list-item" @click="changeProfilePhoto">
                Сменить фото
              </div>
              <div
                class="dropdown_list-item"
                v-if="store.user.photoURL !== defaultPhotoURL"
                @click="deleteProfilePhoto"
              >
                Удалить фото
              </div>
            </div>
          </TransitionGroup>
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
        <SkButton
          @click="$router.push('/edit')"
          :padding="'1vh 3vw'"
          :font-size="'18px'"
          label="Редактировать"
        />
      </div>
    </div>
    <div class="user" v-else>
      <div class="user_info">
        <div class="user_avatar_wrapper">
          <div class="user_avatar_box">
            <img :src="props.user.photoURL" alt="avatar" class="user_avatar" />
            <SkLoader v-if="props.isLoading"></SkLoader>
          </div>
        </div>
        <div class="text">
          <div class="user_name">{{ props.user.name }}</div>
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
    </div>
  </div>
</template>

<script setup lang="ts">
import SkButton from "../UIcomponents/SkButton.vue";
import SkLoader from "./SkLoader.vue";
import { useAuthStore } from "@/stores/auth";
import { ref } from "vue";
import type { UserDB } from "env";

const profilePhotoHovered = ref<boolean>(false);
const defaultPhotoURL =
  "https://images.are.na/eyJidWNrZXQiOiJhcmVuYV9pbWFnZXMiLCJrZXkiOiI4MDQwOTc0L29yaWdpbmFsX2ZmNGYxZjQzZDdiNzJjYzMxZDJlYjViMDgyN2ZmMWFjLnBuZyIsImVkaXRzIjp7InJlc2l6ZSI6eyJ3aWR0aCI6MTIwMCwiaGVpZ2h0IjoxMjAwLCJmaXQiOiJpbnNpZGUiLCJ3aXRob3V0RW5sYXJnZW1lbnQiOnRydWV9LCJ3ZWJwIjp7InF1YWxpdHkiOjkwfSwianBlZyI6eyJxdWFsaXR5Ijo5MH0sInJvdGF0ZSI6bnVsbH19?bc=0";
const store = useAuthStore();
const emit = defineEmits<{
  (e: "changeProfilePhoto"): void;
  (e: "deleteProfilePhoto"): void;
}>();
const props = withDefaults(
  defineProps<{
    isLoading?: boolean;
    readonly?: boolean;
    user: UserDB;
  }>(),
  {
    isLoading: false,
    readonly: false,
  }
);

function changeProfilePhoto() {
  emit("changeProfilePhoto");
}

function deleteProfilePhoto() {
  emit("deleteProfilePhoto");
}
</script>

<style scoped>
.banner {
  border: 1px solid #dce1e6;
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
  position: relative;
  height: 180px;
  overflow: hidden;
  border-radius: 50%;
}
.user_avatar {
  width: 180px;
  height: 180px;
  object-fit: cover;
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

.menu-enter-active,
.menu-leave-active {
  transition: all 0.2s ease;
}
.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 1440px) {
  .banner {
    height: 450px;
  }
  .user {
    height: 110px;
    padding: 15px;
  }

  .user_info {
    column-gap: 25px;
  }
  .user_avatar_wrapper {
    width: 160px;
    height: 160px;
  }

  .user_avatar_box {
    width: 160px;
    height: 160px;
  }
  .user_avatar {
    width: 160px;
    height: 160px;
  }
  .user_name {
    font-size: 24px;
  }
  .links {
    margin-top: 10px;
    column-gap: 25px;
  }

  .icon {
    font-size: 18px;
  }
  .link_text {
    font-size: 17px;
  }

  .helpers {
    column-gap: 12px;
  }

  .dropdown_list {
    width: 180px;
    padding: 3px;
  }

  .dropdown_list-item {
    font-size: 18px;
    padding: 12px;
  }
}
</style>
