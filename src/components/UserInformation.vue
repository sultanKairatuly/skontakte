<template>
  <div class="information">
    <div class="content">
      <div
        class="friends_container"
        v-if="!props.readonly"
        @click="$router.push('/friends')"
      >
        <SkLoader v-if="props.loading" />
        <div v-else>
          <div class="title">
            Друзья
            <span class="friend_number">{{ store.user.friends.length }}</span>
          </div>
          <div class="friends">
            <div
              @click="$router.push(`/user/${friend.email}`)"
              class="friend"
              v-for="friend in store.user.friends"
              :key="friend.email"
            >
              <div class="friend_avatar_container">
                <img
                  class="friend_avatar"
                  :src="getImageUrl(friend.photoURL)"
                  alt="friend avatar"
                />
              </div>
              <div class="friend_name">
                {{ friend.name.split(" ")[0] }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="friends_container" v-if="props.readonly">
        <div class="title">
          Друзья
          <span class="friend_number">{{ props?.user?.friends?.length }}</span>
        </div>
        <div class="friends">
          <div
            @click="$router.push(`/user/${friend?.email}`)"
            class="friend"
            v-for="friend in props.user?.friends"
            :key="friend.email"
          >
            <div class="friend_avatar_container">
              <img
                class="friend_avatar"
                :src="getImageUrl(friend.photoURL)"
                alt="friend avatar"
              />
            </div>
            <div class="friend_name">
              {{ friend.name.split(" ")[0] }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "../stores/auth";
import { useImageGetter } from "../composables/utilities";
import SkLoader from "../components/SkLoader.vue";
import type { User, UserDB } from "env";
import { ref, watch } from "vue";

const store = useAuthStore();
const { getImageUrl } = useImageGetter();
const loading = ref<boolean>(true);
watch(
  () => props.user,
  (newVal) => {
    if (Object.keys(newVal).length > 0) {
      loading.value = false;
      console.log("newVal:", newVal);
    }
  }
);

const props = withDefaults(
  defineProps<{
    readonly?: boolean;
    user: UserDB;
    loading: boolean;
  }>(),
  {
    loading: true,
    readonly: false,
  }
);

console.log("User:   ", props.user);
console.log(props.user.friends);
</script>

<style scoped>
.information {
  width: 40%;
}

.loader {
  position: relative;
}

.friends_container {
  position: relative;
  padding: 15px 20px;
  background-color: #fff;
  border-radius: 20px;
  border: 1px solid #dce1e6;
  overflow: hidden;
}

.title {
  font-size: 20px;
  margin-bottom: 30px;
}

.friend_number {
  font-weight: 600;
  color: #717d7e;
}

.friends {
  display: flex;
  flex-wrap: wrap;
  column-gap: 5px;
  row-gap: 15px;
}
.friend {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  border-radius: 5px;
  padding: 5px;
  transition: 0.2s ease-in-out;
}

.friend:hover {
  background-color: #eeeeee;
}

.friend_avatar_container {
  width: 90px;
  height: 90px;
  overflow: hidden;
  border-radius: 50%;
  margin-bottom: 10px;
}
.friend_avatar {
  width: 90px;
  height: 90px;
  object-fit: cover;
}

.friend_name {
  font-size: 16px;
}


.dark .friend:hover {
  background-color: #474747;
}

.dark .friends_container {
  background-color: #333333;
  border: 1px solid #424242;
}

.dark .title {
  color: #fff;
}

.dark .friend_number {
  color: #a9adad;
}
.dark .friend_name {
  font-size: 16px;
  color: #fff;
}
</style>
