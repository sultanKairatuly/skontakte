<template>
  <div class="requests" v-if="props.friendRequestFrom.length > 0 && !props.readonly">
    <h3 class="requests_title title">
      Заявки в друзья
      <span class="amount">{{ props.friendRequestFrom.length }}</span>
    </h3>
    <q-separator size="1px" q-pa="sm" />

    <div class="request_content">
      <div class="request" v-for="request in props.friendRequestFrom">
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
    <h4 class="no-requests-message">У вас нет заявок в друзья</h4>
  </div>
  <div class="requests" v-if="props.friendRequestFrom.length > 0 && props.readonly">
    <h3 class="requests_title title">
      Заявки {{ props.user?.name }}
      <span class="amount">{{ props.friendRequestFrom.length }}</span>
    </h3>
    <q-separator size="1px" q-pa="sm" />

    <div class="request_content">
      <div class="request" v-for="request in props.friendRequestFrom">
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
</template>

<script setup lang="ts">
import { useAuthStore } from "../stores/auth";
import { useImageGetter } from "../composables/utilities";
import SKButton from "../UIcomponents/SkButton.vue";
import type { AddedUser } from 'env'

const props = withDefaults(defineProps<{
  readonly?: boolean,
  user?: AddedUser,
  friendRequestFrom: Array<AddedUser>
}>(), {
  readonly: false,
  friendRequestFrom: () =>[] as Array<AddedUser>
})
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
  width: 80%;
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

@media (max-width: 1440px) {
  .requests {
  padding: 7px 17px;
  width: 68%;
}
.title {
  font-size: 18px;
}
.request {
  padding: 12px 0;
  column-gap: 15px;
}

.request_item_avatar_container {
  width: 105px;
  height: 105px;
}
.request_item_avatar {
  width: 105px;
  height: 105px;
}
.request_item_name {
  margin-bottom: 3px;
  font-size: 16px;
}
.request_item_btns {
  display: flex;
  column-gap: 6px;
}

.no-requests-message {
  margin: 15px auto;
  padding: 15px;
  font-size: 20px;
}

.btn {
  display: block;
  margin: 10px 0;
}

}
</style>
