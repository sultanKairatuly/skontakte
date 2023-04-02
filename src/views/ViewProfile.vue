<template>
  <div class="container">
    <ProfileBanner
      class="banner"
      :loading="loading"
      :user="user"
      :readonly="true"
    />
    <div class="profile_bottom">
      <ProfileEntries class="entries" :user="user" :readonly="true" />
      <UserInformation
        :loading="loading"
        :user="userComputed"
        :readonly="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed, watch } from "vue";
import { useRoute } from "vue-router";
import ProfileBanner from "../components/ProfileBanner.vue";
import ProfileEntries from "../components/ProfileEntries.vue";
import UserInformation from "../components/UserInformation.vue";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../firebase";
import type { UserDB } from "env";
import { usePostStore } from "@/stores/post";

getUser();
const postStore = usePostStore();
const loading = ref<boolean>(true);
const route = useRoute();
const user: UserDB = reactive({}) as UserDB;
async function getUser() {
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc: any) => {
    if (doc.data().email === route.params.usermail) {
      Object.assign(user, doc.data());
    }
  });
}

watch(
  () => postStore.needUpdate,
  (nv) => {
    if (nv) {
      getUser();
    }
  }
);

watch(
  () => route.params,
  () => getUser(),
  { deep: true }
);
watch(user, (nv) => {
  const isUser = Object.keys(nv).length > 0;
  if (isUser) {
    loading.value = false;
  } else {
    loading.value = true;
  }
});
const userComputed = computed(() => {
  console.log("user changed");
  return { ...user };
});
</script>

<style scoped>
.banner {
  margin-bottom: 15px;
}

.loading {
  width: 40%;
  background-color: #fff;
  padding: 15px 20px;
  border-radius: 20px;
  border: 1px solid #dce1e6;
}
.profile_bottom {
  display: flex;
  justify-content: space-between;
}

.entries {
  width: 59%;
}

.dark .entries {
  background-color: #33333333;
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
