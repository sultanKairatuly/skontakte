<template>
  <div class="friends" v-if="props.friends.length > 0">
    <SkLoader v-if="props.loading"></SkLoader>
    <header class="friends_header">
      <div class="friends_title title">
        Все друзья {{ props.friends.length }}
      </div>
      <SkButton style="margin-bottom: 20px;" label="Найти друзей" @click="$router.push('find-friends')" />
    </header>
    <SkInput
      :model-value="searchFriend"
      @update:model-value="(newValue) => (searchFriend = newValue as string)"
      placeholder="Поиск друзей"
    />
    <div class="friends_content" v-if="friends.length">
      <TransitionGroup name="friends">
        <UserFriend
          :key="friend.email"
          v-for="friend in friends"
          :friend="friend"
          @removeFriend="removeFriend"
          @showFriends="showFriends"
        />
      </TransitionGroup>
    </div>
    <div v-else>
      <NoMessage
        >По результату "{{ searchFriend }}" друзей не найдено</NoMessage
      >
    </div>
  </div>
  <div class="friends" v-else>
    <NoMessage>У вас нет друзей</NoMessage>
    <SkButton
      class="btn btn-center"
      label="Найти друзей"
      @click="$router.push('find-friends')"
    />
  </div>
</template>
0

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import type { AddedUser, UserDB } from "env";
import SkButton from "../UIcomponents/SkButton.vue";
import SkInput from "../UIcomponents/SkInput.vue";
import { ref, computed } from "vue";
import SkLoader from "./SkLoader.vue";
import { useRouter } from "vue-router";
import UserFriend from "./UserFriend.vue";

const router = useRouter();
const props = defineProps<{
  loading?: boolean;
  user?: UserDB;
  friends: Array<AddedUser>;
}>();
const authStore = useAuthStore();
const friends = computed(() => {
  return props.friends.filter((friend: AddedUser) =>
    friend.name.toLowerCase().startsWith(searchFriend.value.toLowerCase())
  );
});
const searchFriend = ref<string>("");

function removeFriend(friendEmail: string) {
  authStore.removeFriend(friendEmail);
}

function showFriends(friendEmail: string) {
  router.push(`/friends/${friendEmail}`);
}
</script>

<style scoped>
.friends {
  position: relative;
  overflow: hidden;
  background-color: #fff;
  padding: 10px 20px;
  border-radius: 20px;
  border: 1px solid #dce1e6;
}
.title {
  font-size: 20px;
}
.amount {
  color: #919099;
  font-weight: bold;
}
.friends_content {
  display: flex;
  flex-direction: column;
  transition: 0.1s ease-in;
}

.friends_title {
  margin-bottom: 20px;
}

.btn-center {
  margin: 17px auto;
  display: block;
}

.friends-move, /* apply transition to moving elements */
.friends-enter-active,
.friends-leave-active {
  transition: all 0.5s ease;
}

.friends-enter-from,
.friends-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.dark .friends {
  background-color: #222222;
  border: 1px solid #424242;
}
.dark .title {
  font-size: 20px;
  color: #fff;
}
.dark .amount {
  color: #919099;
  font-weight: bold;
}

@media (max-width: 1440px) {
  .friends {
    padding: 8px 18px;
  }
  .title {
    font-size: 18px;
  }
  .friend {
    padding: 12px 0;
    column-gap: 17px;
  }

  .friend_item_avatar_container {
    width: 105px;
    height: 105px;
  }
  .friend_item_avatar {
    width: 105px;
    height: 105px;
    object-fit: cover;
  }
  .friend_item_name {
    margin-bottom: 5px;
    font-size: 16px;
  }

  .request_item_btns,
  .friend_item_btns {
    display: flex;
    column-gap: 8px;
  }

  .friends {
    margin-top: 20px;
  }
  .friends_header {
    padding: 8px 0;
    margin: 3px 0;
  }
  .no-friends-message {
    margin: 17px 0;
    font-size: 18px;
  }

  .btn-center {
    margin: 17px auto;
    display: block;
  }
}
</style>
