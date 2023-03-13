<template>
  <div class="information">
    <div class="friends_container">
      <div class="title">
        Друзья
        <span class="friend_number">{{ store.user.friends.length }}</span>
      </div>
      <div class="friends">
        <div class="friend" v-for="friend in store.user.friends">
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
    <div class="subscribes"></div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "../stores/auth";
import { useImageGetter } from "../composables/utilities";

const store = useAuthStore();
const { getImageUrl } = useImageGetter();
</script>

<style scoped>
.information {
}

.friends_container {
  padding: 15px 20px;
  background-color: #fff;
  border-radius: 20px;
  border: 1px solid #dce1e6;
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
</style>
