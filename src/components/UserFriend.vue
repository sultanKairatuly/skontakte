<template>
  <div class="friend">
    <div class="friend_item_avatar_container">
      <img
        class="friend_item_avatar"
        :src="getImageUrl(props.friend.photoURL)"
      />
    </div>
    <div class="friend_item_text">
      <div
        class="friend_item_name"
        @click="$router.push(`/user/${props.friend.email}`)"
      >
        {{ props.friend.name }}
      </div>
      <div class="friend_item_btns">
        <SkButton
          class="friend_item_btn"
          @click="$router.push(`/chats/?email=${props.friend.email}`)"
          label="Написать сообщение"
        />
      </div>
    </div>
    <q-btn-dropdown
      class="q-pa-sm dropdown"
      dropdown-icon="fa-solid fa-ellipsis"
    >
      <q-list class="list">
        <q-item
          clickable
          @click="$emit('removeFriend', props.friend.email)"
          v-close-popup
        >
          <q-item-section>
            <q-item-label>Удалить из друзей</q-item-label>
          </q-item-section>
        </q-item>

        <q-item
          clickable
          v-close-popup
          @click="$emit('showFriends', props.friend.email)"
        >
          <q-item-section>
            <q-item-label>Посмотреть друзей</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </div>
</template>

<script setup lang="ts">
import type { AddedUser } from "env";
import { useImageGetter } from "../composables/utilities";
import SkButton from "../UIcomponents/SkButton.vue";

const props = defineProps<{
  friend: AddedUser;
}>();
const { getImageUrl } = useImageGetter();
</script>

<style scoped>
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

.dark .friend_item_name {
  margin-bottom: 5px;
  font-weight: bold;
  font-size: 18px;
  color: #fff;
}

.dark .dropdown {
  color: #fff;
}

</style>
