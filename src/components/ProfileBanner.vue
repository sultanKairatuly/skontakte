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
            <q-skeleton type="circle" v-if="props.isLoading" />
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
              <div class="link_text">{{ store.user.city }}</div>
            </div>
            <div class="link">
              <i class="fa-solid fa-circle-info icon"></i>
              <div class="link_text" @click="showDetails">Подробнее</div>
            </div>
          </div>
        </div>
      </div>

      <div class="helpers">
        <SkButton @click="$router.push('/edit')" label="Редактировать" />
      </div>
    </div>
    <div class="user" v-else>
      <div class="user_info">
        <div class="user_avatar_wrapper">
          <div class="user_avatar_box">
            <q-skeleton
              class="skeleton"
              type="circle"
              v-if="props.isLoading || props.loading"
            />
            <img
              :src="props.user.photoURL"
              v-else
              alt="avatar"
              class="user_avatar"
            />
          </div>
        </div>
        <div class="text">
          <div class="user_name">{{ props.user.name }}</div>
          <div class="links">
            <div class="link">
              <i class="fa-solid fa-location-dot icon"></i>
              <div class="link_text">{{ props.user.city }}</div>
            </div>
            <div class="link">
              <i class="fa-solid fa-circle-info icon"></i>
              <div class="link_text" @click="showDetails">Подробнее</div>
            </div>
          </div>
        </div>
      </div>
      <div class="helpers">
        <SkButton
          @click="sendFriendRequest"
          v-if="!includes(props.user, store.user.friendRequestTo, 'email')"
          label="Добавить в друзья"
        />
        <SkButton
          v-if="includes(props.user, store.user.friendRequestTo, 'email')"
          @click="showCancelFriendRequestPopup"
          icon="check"
          label="Заявка отправлена"
        />
        <SkButton
          v-if="includes(props.user, store.user.chats, 'email')"
          label="Написать сообщение"
        />
      </div>
    </div>
    <Teleport to=".app" v-if="isDetailsPopup">
      <SkPopup
        @close-popup="closeDetailsPopup"
        class="details_modal"
        padding="0px"
        width="500px"
      >
        <template #modal>
          <h3 class="details_title">Подробная информация</h3>
          <q-separator size="2px" q-pa="sm" />
          <div class="personal">
            <div class="personal_item">
              <div class="personal_item_title">Родной город:</div>
              <div class="personal_item_text">
                <i class="fa-solid fa-city"></i>
                <span class="city">{{ store.user.city }}</span>
              </div>
            </div>
            <div class="personal_item">
              <div class="personal_item_title">День рождения:</div>
              <div class="personal_item_text">
                <i class="fa-solid fa-gift"></i>
                <span class="city">{{ store.user.birthday }}</span>
              </div>
            </div>
          </div>
          <q-separator size="2px" q-pa="sm" />
          <div class="general">
            <div class="general_item">
              <div class="general_item_amount">
                {{ store.user.friends.length }}
              </div>
              <div class="general_item_title">Друзья</div>
              <div class="general_item_images">
                <div
                  class="general_item_image_container"
                  v-for="friend in store.user.friends.slice(0, 3)"
                  :key="friend.email"
                >
                  <img :src="friend.photoURL" class="general_item_image" />
                </div>
              </div>
            </div>
          </div>
        </template>
      </SkPopup>
    </Teleport>
    <Teleport to=".app" v-if="isCancelFriendRequestPopup">
      <SkPopup
        @close-popup="closeCancelFriendRequestPopup"
        class="details_modal"
        padding="0px"
        width="800px"
      >
        <template #modal>
          <h3 class="details_title">Отменить запрос в друзья?</h3>
          <div class="btns">
            <SkButton label="Отмена" @click="closeCancelFriendRequestPopup" />
            <SkButton label="ОК" @click="cancelFriendRequest" />
          </div>
        </template>
      </SkPopup>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import SkButton from "../UIcomponents/SkButton.vue";
import SkPopup from "../UIcomponents/SkPopup.vue";
import { useAuthStore } from "@/stores/auth";
import { ref } from "vue";
import type { UserDB } from "env";
import { useImageGetter } from "../composables/utilities";

const isCancelFriendRequestPopup = ref<boolean>(false);
const isDetailsPopup = ref<boolean>(false);
const profilePhotoHovered = ref<boolean>(false);
const { includes, changeProfilePhoto } = useImageGetter();
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
    loading?: boolean;
    readonly?: boolean;
    user: UserDB;
  }>(),
  {
    isLoading: false,
    readonly: false,
    loading: true,
  }
);

function deleteProfilePhoto() {
  emit("deleteProfilePhoto");
}

function showDetails() {
  isDetailsPopup.value = true;
}

function closeDetailsPopup() {
  isDetailsPopup.value = false;
}

function closeCancelFriendRequestPopup() {
  isCancelFriendRequestPopup.value = false;
}

function sendFriendRequest() {
  store.addFriend(props.user);
}

function cancelFriendRequest() {}

function showCancelFriendRequestPopup() {
  isCancelFriendRequestPopup.value = true;
}
</script>

<style scoped>
.banner {
  border: 1px solid #dce1e6;
  height: 400px;
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

.btns {
  margin: 20px 0;
  padding: 10px 0;
  display: flex;
  width: 100%;
  justify-content: center;
  column-gap: 20px;
}

.skeleton {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.link {
  align-items: center;
}
.details_title {
  font-size: 30px;
  background-color: #f0f4f8;
  padding: 30px;
  border-radius: 10px;
}
.personal {
  padding: 20px 30px;
}
.personal_item {
  display: flex;
}
.personal_item_title {
  font-size: 22px;
}
.personal_item_text {
  font-size: 20px;
  margin-right: 10px;
}
.fa-solid {
  color: #447bba;
  font-size: 23px;
  margin: 0px 10px;
}
.general {
  padding: 20px 30px;
}
.general_item {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.general_item_amount {
  font-size: 20px;
  font-weight: bold;
}
.general_item_title {
  font-size: 23px;
  margin-bottom: 5px;
}
.general_item_images {
  display: flex;
  column-gap: 4px;
}

.general_item_image_container {
  width: 40px;
  height: 40px;
  overflow: hidden;
  border-radius: 50%;
}
.general_item_image {
  width: 40px;
  height: 40px;
  object-fit: cover;
}

@media (max-width: 1440px) {
  .banner {
    height: 300px;
  }
  .user {
    height: 110px;
    padding: 15px;
  }

  .user_info {
    column-gap: 25px;
  }
  .user_avatar_wrapper {
    width: 120px;
    height: 120px;
  }

  .user_avatar_box {
    width: 120px;
    height: 120px;
  }
  .user_avatar {
    width: 120px;
    height: 120px;
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
    width: 130px;
    padding: 3px;
  }

  .dropdown_list-item {
    font-size: 16px;
    padding: 5px;
  }

  .details_modal {
  }
  .details_title {
    font-size: 23px;
  }
  .btns {
  }

  .personal_item_title {
    font-size: 16px;
  }
  .personal_item_text {
    font-size: 16px;
  }
  .fa-solid {
    font-size: 15px;
  }
  .general_item_title {
    font-size: 17px;
  }
}

@media (max-width: 800px) {
  .banner {
    height: 250px;
  }
  .user {
    height: 80px;
    padding: 15px;
  }

  .user_info {
    column-gap: 20px;
  }
  .user_avatar_wrapper {
    width: 95px;
    height: 95px;
  }

  .user_avatar_box {
    width: 95px;
    height: 95px;
  }
  .user_avatar {
    width: 95px;
    height: 95px;
  }
  .user_name {
    font-size: 18px;
  }
  .links {
    margin-top: 5px;
    column-gap: 5px;
  }

  .link {
    column-gap: 0px;
  }

  .icon {
    font-size: 15px;
  }
  .link_text {
    font-size: 14px;
  }

  .helpers {
    column-gap: 12px;
  }

  .dropdown_list {
    width: 130px;
    padding: 3px;
  }

  .dropdown_list-item {
    font-size: 16px;
    padding: 5px;
  }
}

@media (max-width: 450px) {
  .banner {
    height: 250px;
    border-radius: 0;
  }
  .user {
    height: 60px;
    padding: 15px;
  }

  .user_info {
    column-gap: 20px;
  }
  .user_avatar_wrapper {
    width: 80px;
    height: 80px;
  }

  .user_avatar_box {
    width: 80px;
    height: 80px;
  }
  .user_avatar {
    width: 80px;
    height: 80px;
  }
  .user_name {
    font-size: 16px;
  }
  .links {
    margin-top: 3px;
  }

  .icon {
    font-size: 13px;
  }
  .link_text {
    font-size: 12px;
  }

  .helpers {
    column-gap: 10px;
  }

  .dropdown_list {
    width: 110px;
    margin-bottom: 30px;
  }

  .dropdown_list-item {
    font-size: 14px;
    padding: 1px;
  }
}

@media (max-width: 380px) {
  .banner {
    height: 250px;
    border-radius: 0;
  }
  .user {
    height: 60px;
    padding: 10px;
  }

  .user_info {
    column-gap: 8px;
  }
  .user_avatar_wrapper {
    width: 65px;
    height: 65px;
  }

  .user_avatar_box {
    width: 65px;
    height: 65px;
  }
  .user_avatar {
    width: 65px;
    height: 65px;
  }
  .user_name {
    font-size: 13px;
  }
  .links {
    margin-top: 3px;
  }

  .icon {
    font-size: 10px;
  }
  .link_text {
    font-size: 10px;
  }

  .helpers {
    column-gap: 5px;
  }

  .dropdown_list {
    width: 90px;
    margin-bottom: 30px;
  }

  .dropdown_list-item {
    font-size: 12px;
  }

  .details_modal {
    padding: 0;
  }
  .details_title {
    font-size: 16px;
    padding: 10px;
  }

  .personal {
    padding: 5px;
  }

  .personal_item_title {
    font-size: 14px;
  }

  .fa-city {
    font-size: 14px;
  }
  .city {
    font-size: 13px;
  }
  .general_item_title {
    font-size: 15px;
  }
}

@media (max-width: 320px) {
  .banner {
    height: 170px;
  }
}
.dark .banner {
  border: 1px solid #424242;
  background-color: #5c5e63;
}
.dark .user {
  background-color: #222222;
}
.dark .user_avatar_wrapper {
  background-color: #222222;
}
.dark .dropdown_list {
  background-color: #292929;
}
.dark .text {
  color: #fff;
}
.dark .user_name {
  color: #fff;
}
.dark .link_text {
  color: #fff;
}

.dark .details_title {
  color: #fff;
  background-color: #333333;
}
.dark .personal_item {
  color: #fff;
}
.dark .fa-city {
  color: #939393;
}
.dark .fa-gift {
  color: #939393;
}
.dark .general_item_amount {
  color: #fff;
}
.dark .general_item_title {
  color: #fff;
}

.dark .icon {
  color: #939393;
}
</style>
