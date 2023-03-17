<template>
  <div class="requests" v-if="authStore.user.friendRequestFrom.length > 0">
    <h3 class="requests_title title">
      Заявки в друзья
      <span class="amount">{{ authStore.user.friendRequestFrom.length }}</span>
    </h3>
    <q-separator size="1px" q-pa="sm" />

    <div class="request_content">
      <div class="request" v-for="request in authStore.user.friendRequestFrom">
        <div class="request_item_avatar_container">
          <img
            class="request_item_avatar"
            :src="getImageUrl(request.photoURL)"
          />
        </div>
        <div class="request_item_text">
          <div class="request_item_name">{{ request.name }}</div>
          <div class="request_item_btns">
            <SKButton
              class="request_item_btn"
              @click="acceptFriendRequest(request.email)"
              label="Принять"
            />
            <SKButton
              class="request_item_btn"
              label="Отклонить"
              @click="cancelFriendRequest"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="requests" v-else>
    <h4 class="no-requests-message">У вас не заявок в друзья</h4>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "../stores/auth";
import { useImageGetter } from "../composables/utilities";
import SKButton from "../UIcomponents/SkButton.vue";

const authStore = useAuthStore();
const { getImageUrl } = useImageGetter();
function acceptFriendRequest(email: string) {
  authStore.acceptFriendRequest(email);
}
function cancelFriendRequest() {}
</script>

<style scoped>
.requests {
  background-color: #fff;
  padding: 10px 20px;
  min-height: 200px;
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
.request_content {
  display: flex;
  flex-direction: column;
}
.request {
  padding: 15px 0;
  display: flex;
  align-items: center;
  position: relative;
  column-gap: 20px;
}

.request_item_avatar_container {
  width: 120px;
  height: 120px;
  overflow: hidden;
  border-radius: 50%;
}
.request_item_avatar {
  width: 120px;
  height: 120px;
  object-fit: cover;
}
.request_item_name {
  margin-bottom: 5px;
  font-weight: bold;
  font-size: 18px;
  color: #2a5885;
}
.request_item_btns {
  display: flex;
  column-gap: 10px;
}

.no-requests-message {
  text-align: center;
  margin: 20px auto;
  text-align: center;
  padding: 20px;
  color: #bfc6cf;
  font-size: 25px;
}

.btn {
  display: block;
  margin: 15px 0;
}
</style>
