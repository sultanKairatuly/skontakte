<template>
  <div
    class="app"
    :class="{
      dark: isDark,
    }"
  >
    <SkHeader :theme="theme" @changeTheme="changeTheme" />
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
import { ref, provide } from "vue";
import { usePhotoStore } from "./stores/photo";
import type { Theme } from "env";
import { useQuasar } from "quasar";
const authStore = useAuthStore();
const photosStore = usePhotoStore();
const isDark = ref<boolean>(false);
const isSavedMessage = ref<boolean>(false);

const theme =
  ref<Theme>(localStorage.getItem("theme") as Theme) || ref<Theme>("Светлая");
const $q = useQuasar();
changeTheme(theme.value);
provide("isDark", isDark);

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

function changeTheme(them: Theme) {
  theme.value = them as Theme;
  if (theme.value === "Dark" || theme.value === "Темная") {
    isDark.value = true;
    $q.dark.set(true);
  } else {
    isDark.value = false;
    $q.dark.set(false);
  }
  localStorage.setItem("theme", theme.value);
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
  overflow: hidden;
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

.dark {
  background-color: #141414;
}

.dark .container {
  background-color: #141414;
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
    width: 75%;
  }

  .app_layout {
    max-width: 1450px;
    padding: 65px 0;
  }
}

@media (max-width: 450px) {
  .container {
    padding: 0;
    width: 100%;
    overflow: hidden;
  }

  .app_layout {
    padding: 41px 0;
  }
}
</style>
