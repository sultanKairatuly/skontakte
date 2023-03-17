<template>
  <div class="friends" v-if="props.friends.length > 0">
    <SkLoader v-if="props.loading"></SkLoader>
    <header class="friends_header">
      <div class="friends_title title">
        Все друзья {{ props.friends.length }}
      </div>
      <SkButton label="Найти друзей" />
    </header>
    <SkInput
      :model-value="searchFriend"
      @update:model-value="(newValue) => (searchFriend = newValue as string)"
      placeholder="Поиск друзей"
    />
    <div class="friends_content" v-if="friends.length">
      <TransitionGroup name="friends">
        <div class="friend" v-for="friend in friends" :key="friend.email">
          <div class="friend_item_avatar_container">
            <img
              class="friend_item_avatar"
              :src="getImageUrl(friend.photoURL)"
            />
          </div>
          <div class="friend_item_text">
            <div
              class="friend_item_name"
              @click="$router.push(`/user/${friend.email}`)"
            >
              {{ friend.name }}
            </div>
            <div class="friend_item_btns">
              <SkButton class="friend_item_btn" label="Написать сообщение" />
            </div>
          </div>
          <q-btn-dropdown class="dropdown" dropdown-icon="fa-solid fa-ellipsis">
            <q-list>
              <q-item
                clickable
                @click="removeFriend(friend.email)"
                v-close-popup
              >
                <q-item-section>
                  <q-item-label>Удалить из друзей</q-item-label>
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="showFriends">
                <q-item-section>
                  <q-item-label>Посмотреть друзей</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </TransitionGroup>
    </div>
    <div v-else>
      <h4 class="no-friends-message">
        По результату "{{ searchFriend }}" друзей не найдено
      </h4>
    </div>
  </div>
  <div class="friends" v-else>
    <div class="no-friends-message">У вас нет друзей</div>
    <SkButton class="btn btn-center" label="Найти друзей" />
  </div>
</template>
0

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import type { AddedUser } from "env";
import { useImageGetter } from "../composables/utilities";
import SkButton from "../UIcomponents/SkButton.vue";
import SkInput from "../UIcomponents/SkInput.vue";
import { ref, reactive, computed } from "vue";
import SkLoader from "../components/SkLoader.vue";

const props = defineProps<{
  loading?: boolean;
  friends: Array<AddedUser>;
}>();
const authStore = useAuthStore();
const friends = computed(() => {
  return props.friends.filter((friend: AddedUser) =>
    friend.name.toLowerCase().startsWith(searchFriend.value.toLowerCase())
  );
});
const searchFriend = ref<string>("");

const { getImageUrl } = useImageGetter();

function removeFriend(friendEmail: string) {
  authStore.removeFriend(friendEmail);
}

function showFriends() {}
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
.friend {
  padding: 15px 0;
  display: flex;
  align-items: center;
  position: relative;
  column-gap: 20px;
}

.friend_item_avatar_container {
  width: 120px;
  height: 120px;
  overflow: hidden;
  border-radius: 50%;
}
.friend_item_avatar {
  width: 120px;
  height: 120px;
  object-fit: cover;
}
.friend_item_name {
  margin-bottom: 5px;
  font-weight: bold;
  font-size: 18px;
  color: #2a5885;
}

.friend_item_name:hover {
  text-decoration: underline;
  cursor: pointer;
}
.request_item_btns,
.friend_item_btns {
  display: flex;
  column-gap: 10px;
}

.friends {
  margin-top: 20px;
}
.friends_header {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  margin: 5px 0;
}
.no-friends-message {
  text-align: center;
  margin: 20px 0;
  color: #bfc6cf;
  font-size: 20px;
}

.btn {
  display: block;
}

.btn-center {
  margin: 20px auto;
}

.dropdown {
  position: absolute;
  top: 20px;
  right: 20px;
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
</style>
