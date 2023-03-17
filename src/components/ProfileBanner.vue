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
            <img :src="props.user.photoURL" alt="avatar" class="user_avatar" />
            <SkLoader v-if="props.isLoading || props.loading"></SkLoader>
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
              <div class="link_text" @click="showDetails">Подробнее</div>
            </div>
          </div>
        </div>
      </div>
      <div class="helpers">
        <SkButton
          @click="sendFriendRequest"
          v-if="!includes(props.user, store.user.friends, 'email')"
          label="Добавить в друзья"
        />
        <SkButton
          v-else
          @click="showCancelFriendRequestPopup"
          icon="check"
          label="Заявка отправлена"
        />
      </div>
    </div>
    <Teleport to=".app" v-if="isDetailsPopup">
      <SkPopup
        @close-popup="closeDetailsPopup"
        class="details_modal"
        padding="0px"
        width="800px"
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
            <div class="general_item">
              <div class="general_item_amount"></div>
              <div class="general_item_title"></div>
              <div class="general_item_images"></div>
            </div>
            <div class="general_item">
              <div class="general_item_amount"></div>
              <div class="general_item_title"></div>
              <div class="general_item_images"></div>
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
import SkLoader from "./SkLoader.vue";
import SkPopup from "../UIcomponents/SkPopup.vue";
import { useAuthStore } from "@/stores/auth";
import { ref } from "vue";
import type { UserDB } from "env";
import {
  getDocs,
  doc,
  updateDoc,
  collection,
  addDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useImageGetter } from "../composables/utilities";

const EMAIL: string = "email"
const isCancelFriendRequestPopup = ref<boolean>(false);
const isDetailsPopup = ref<boolean>(false);
const profilePhotoHovered = ref<boolean>(false);
const { includes } = useImageGetter();
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

const imageUrl = ref<string>("");
const image = ref<string>("");
function onFilePicked(event: any) {
  const target = event?.target;
  if (target) {
    const files = [target][0].files;
    let filename = files[0].name;
    const fileReader = new FileReader();
    fileReader.addEventListener("load", async () => {
      imageUrl.value = fileReader.result as string;
      store.user.photoURL = imageUrl.value;
      localStorage.setItem("user", JSON.stringify(store.user));
      let docId = "";
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc: any) => {
        const docEmail = doc.data().email;
        if (docEmail === store.user.email) {
          docId = doc.id;
        }
      });

      await updateDoc(doc(db, "users", docId), {
        photoURL: imageUrl.value,
      });
    });
    fileReader.readAsDataURL(files[0]);
    image.value = files[0];
  }
}

function changeProfilePhoto() {
  const fileInput = document.createElement("input");
  fileInput.setAttribute("type", "file");
  fileInput.click();
  fileInput.addEventListener("change", onFilePicked);
}

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
