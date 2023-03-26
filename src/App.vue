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
import { usePhotoStore } from "./stores/photo";

const authStore = useAuthStore();
const photosStore = usePhotoStore();

const isSavedMessage = ref<boolean>(false);


if (Object.keys(authStore.user).length > 0) {
  authStore.refreshUser();
  photosStore.loadPhotos();
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



.savedMessage-enter-active,
.savedMessage-leave-active {
  transition: all 0.5s ease;
}
.savedMessage-enter-from,
.savedMessage-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

@media (max-width: 1440px) {
  .container {
    width: 65%;
  }

  .app_layout {
    max-width: 1450px;
    padding: 65px 0;
}
}

@media (max-width: 1000px) {
  .container {
    width: 80%;
  }

  .app_layout {
    max-width: 1450px;
    padding: 65px 0;
}
} 
</style>
