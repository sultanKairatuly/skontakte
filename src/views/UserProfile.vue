<template>
  <div class="container">
    <ProfileBanner
      :user="({} as UserDB)"
      class="banner"
      @changeProfilePhoto="openProfilePhotoPopup"
      @deleteProfilePhoto="deleteProfilePhoto"
      :is-loading="isProfilePhotoLoading"
    />
    <div class="profile_bottom">
      <ProfileEntries class="entries" :user="({} as UserDB)" />
      <UserInformation
        :loading="false"
        :user="({} as UserDB)"
        class="user_information"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import ProfileBanner from "@/components/ProfileBanner.vue";
import { useAuthStore } from "../stores/auth";
import ProfileEntries from "../components/ProfileEntries.vue";
import UserInformation from "../components/UserInformation.vue";
import type { UserDB } from "env";
import { getDocs, doc, updateDoc, collection } from "firebase/firestore";
import { db } from "../../firebase";

const isProfilePhotoLoading = ref<boolean>(false);
const isPopup = ref<boolean>(false);
const photoURL = ref<string>("");
const store = useAuthStore();

async function fetchPhotoURL(prop: string) {
  isProfilePhotoLoading.value = true;
  console.log("TTTRUUUEEWW");
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
    console.log("FFFAAALSSEEE");
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
    console.log("FFFAAALSSEEE2342343");
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

.user_profile {
  width: 40%;
}

.confirm {
  display: block;
  margin: 0px auto;
}

.banner {
  margin-bottom: 30px;
}

.entries {
  width: 58%;
}

.profile_bottom {
  display: flex;
  justify-content: space-between;
}

/* .dark .popup_title {
}
.dark .popup_input {
}

.dark .label {
}

.dark .user_profile {
}

.dark .confirm {
}

.dark .banner {
} */

.dark .entries {
  background-color: #222222;
  border: 1px solid #424242;
}

@media (max-width: 1440px) {
  .popup_title {
    font-size: 18px;
  }
  .popup_input {
    margin: 40px auto;
  }

  .label {
    margin-top: 10px;
    font-size: 18px;
  }

  .banner {
    margin-bottom: 25px;
  }

  .entries {
    width: 58%;
  }
}

@media (max-width: 450px) {
  .popup_title {
    font-size: 15px;
  }
  .popup_input {
    margin: 40px auto;
  }

  .label {
    margin-top: 10px;
    font-size: 18px;
  }

  .banner {
    margin-bottom: 0;
  }

  .entries {
    width: 60%;
    height: 100%;
    border-radius: 0;
  }

  .user_information {
    height: 100%;
    background-color: #fff;
  }

  .profile_bottom {
    height: 100%;
  }
}

@media (max-width: 380px) {
  .profile_bottom {
    flex-direction: column;
    height: 80%;
  }

  .entries {
    width: 100%;
  }
}
</style>
