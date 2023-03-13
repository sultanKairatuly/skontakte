<template>
  <div class="app">
    <SkHeader />
    <div class="app_layout">
      <SkSidebar v-if="Object.keys(authStore.user).length > 0" />
      <router-view @changesSaved="changesSaved"></router-view>
      <TransitionGroup name="savedMessage">
        <div class="message" key="0">
          <SkNotification v-if="isSavedMessage" />
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
import SkHeader from "./components/SkHeader.vue";
import SkSidebar from "./components/SkSidebar.vue";
import SkNotification from "./UIcomponents/SkNotification.vue";
import { useAuthStore } from "./stores/auth";
import { ref } from "vue";

const authStore = useAuthStore();

const isSavedMessage = ref<boolean>(false);
const localStorage = window.localStorage;

const friend = {
  name: "Демон Упругий",
  email: "demon@mail.ru",
  articles: [],
  photos: [],
  posts: [],
  password: "123123",
  friends: [],
  birthday: "",
  city: "",
  gender: "",
  photoURL:
    "data:image/jpeg;base64,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",
};

const friend1 = { ...friend };
const friend2 = { ...friend };
const friend3 = { ...friend };
const friend4 = { ...friend };
const friend5 = { ...friend };
const friend6 = { ...friend };
const friend7 = { ...friend };
const friend8 = { ...friend };

const friends = [
  friend1,
  friend2,
  friend3,
  friend4,
  friend5,
  friend6,
  friend7,
  friend8,
];

authStore.addFriend(friends);
if (Object.keys(authStore.user).length > 0) {
  authStore.refreshUser();
  console.log("refreshed");
}

function changesSaved() {
  isSavedMessage.value = true;
  setTimeout(() => {
    isSavedMessage.value = false;
  }, 1000);
}
</script>

<style>
* {
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  position: relative;
  background-color: #edeef0;
}

.container {
  min-height: 100vh;
  background-color: #edeef0;
  padding: 0px 20px;
  width: 87%;
}
.app_layout {
  display: flex;
  justify-content: center;
  margin: 0 auto;
  max-width: 1450px;
  padding: 125px 0;
}

@media (max-width: 1440px) {
  .container {
    width: 65%;
  }
}

.savedMessage-enter-active,
.savedMessage-leave-active {
  transition: all 0.5s ease;
}
.savedMessage-enter-from,
.savedMessage-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
