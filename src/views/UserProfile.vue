<template>
  <div class="container">
    <ProfileBanner 
      :user="({} as UserDB)"
      class="banner"
      @changeProfilePhoto="openProfilePhotoPopup"
      @deleteProfilePhoto="deleteProfilePhoto"
      :is-loading="isProfilePhotoLoading"
    />
    <ProfileEntries :user="({} as UserDB)" />
  </div>
  <Teleport to=".app" v-if="isPopup">
    <SkPopup @close-popup="closePopup">
      <template #modal>
        <h3 class="popup_title">
          Поставьте свое реальное фото,чтобы вашим друзьям было легче вас найти
        </h3>
        <div class="label">URL фото:</div>
        <SkInput
          class="popup_input"
          :modelValue="photoURL"
          @update:modelValue="(newValue) => (photoURL = newValue)"
          :type="'text'"
          :placeholder="'Введите URL фото'"
        />
        <SkButton
          class="confirm"
          :font-size="'22px'"
          :padding="'10px 40px'"
          @click="changeProfilePhoto"
          >Изменить</SkButton
        >
      </template>
    </SkPopup>
  </Teleport>
</template>

<script setup lang="ts">
import { ref } from "vue";
import SkInput from "@/UIcomponents/SkInput.vue";
import SkPopup from "@/UIcomponents/SkPopup.vue";
import SkButton from "@/UIcomponents/SkButton.vue";
import ProfileBanner from "@/components/ProfileBanner.vue";
import { useAuthStore } from "../stores/auth";
import ProfileEntries from "../components/ProfileEntries.vue";
import type { UserDB } from "env";
import {
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  collection,
} from "firebase/firestore";
import { db } from "../../firebase";

const isProfilePhotoLoading = ref<boolean>(false)
const isPopup = ref<boolean>(false);
const photoURL = ref<string>("");
const store = useAuthStore();

async function fetchPhotoURL(prop: string) {
  isProfilePhotoLoading.value = true;
  console.log('TTTRUUUEEWW')
  let id: string = "";
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    if (doc.data().name === store.user.displayName) {
      id = doc.id;
    }
  });

  await updateDoc(doc(db, "users", id), {
    photoURL: prop,
  });

  store.user.photoURL = prop;
  localStorage.setItem("user", JSON.stringify(store.user));
  isPopup.value = false;
}

function openProfilePhotoPopup(): void {
  isPopup.value = true;
}

async function deleteProfilePhoto() {
  fetchPhotoURL(
    "https://images.are.na/eyJidWNrZXQiOiJhcmVuYV9pbWFnZXMiLCJrZXkiOiI4MDQwOTc0L29yaWdpbmFsX2ZmNGYxZjQzZDdiNzJjYzMxZDJlYjViMDgyN2ZmMWFjLnBuZyIsImVkaXRzIjp7InJlc2l6ZSI6eyJ3aWR0aCI6MTIwMCwiaGVpZ2h0IjoxMjAwLCJmaXQiOiJpbnNpZGUiLCJ3aXRob3V0RW5sYXJnZW1lbnQiOnRydWV9LCJ3ZWJwIjp7InF1YWxpdHkiOjkwfSwianBlZyI6eyJxdWFsaXR5Ijo5MH0sInJvdGF0ZSI6bnVsbH19?bc=0"
  );
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    if (doc.data().email === store.user.email) {
      store.user.photoURL = doc.data().photoURL;
      localStorage.setItem("user", JSON.stringify(store.user));
    }
  });

  setTimeout(() => {
    isProfilePhotoLoading.value = false;
    console.log('FFFAAALSSEEE')
  }, 1000);
  
}

async function changeProfilePhoto() {
  fetchPhotoURL(photoURL.value);
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    if (doc.data().email === store.user.email) {
      store.user.photoURL = doc.data().photoURL;
      localStorage.setItem("user", JSON.stringify(store.user));
      isPopup.value = false;
    }
  });
  setTimeout(() => {
    isProfilePhotoLoading.value = false;
    console.log('FFFAAALSSEEE2342343')
  }, 1000);

}

function closePopup(): void {
  isPopup.value = false;
}
</script>

<style scoped>
.popup_title {
  text-align: center;
  font-size: 20px;
  font-weight: 400;
}
.popup_input {
  margin: 45px auto;
  width: 100%;
}

.label {
  margin-top: 15px;
  font-size: 20px;
  font-weight: 600;
}

.confirm {
  display: block;
  margin: 0px auto;
}

.banner {
  margin-bottom: 30px;
}
</style>
