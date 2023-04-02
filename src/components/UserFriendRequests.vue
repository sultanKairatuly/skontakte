<template>
  <div
    class="requests"
    v-if="props.friendRequestFrom.length > 0 && !props.readonly"
  >
    <h3 class="requests_title title">
      Заявки в друзья
      <span class="amount">{{ props.friendRequestFrom.length }}</span>
    </h3>
    <q-separator size="1px" q-pa="sm" />

    <div class="request_content">
      <FriendRequest
        :friend-request-from="props.friendRequestFrom"
        @acceptFriendRequest="acceptFriendRequest"
      />
    </div>
  </div>
  <div
    class="requests"
    v-if="props.friendRequestFrom.length === 0 && !props.readonly"
  >
    <NoMessage>У вас нет заявок в друзья</NoMessage>
  </div>
  <div
    class="requests"
    v-if="props.friendRequestFrom.length > 0 && props.readonly"
  >
    <h3 class="requests_title title">
      Заявки {{ props.user?.name }}
      <span class="amount">{{ props.friendRequestFrom.length }}</span>
    </h3>
    <q-separator size="1px" q-pa="sm" />

    <div class="request_content">
      <FriendRequest :friend-request-from="props.friendRequestFrom" />
    </div>
  </div>
  <div
    class="requests"
    v-if="props.friendRequestFrom.length === 0 && props.readonly"
  >
    <NoMessage>У {{ props?.user?.name }} нет заявок в друзья</NoMessage>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "../stores/auth";
import type { AddedUser } from "env";
import FriendRequest from "../components/FriendRequest.vue";

const props = withDefaults(
  defineProps<{
    readonly?: boolean;
    user?: AddedUser;
    friendRequestFrom: Array<AddedUser>;
  }>(),
  {
    readonly: false,
    friendRequestFrom: () => [] as Array<AddedUser>,
  }
);
const authStore = useAuthStore();

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

.dark .requests {
  background-color: #222222;
  border: 1px solid #424242;
}
.dark .title {
  color: #fff;
  font-size: 20px;
}
.dark .amount {
  color: #aaa9ad;
  font-weight: bold;
}

@media (max-width: 1440px) {
  .requests {
    padding: 7px 17px;
    width: 68%;
  }
  .title {
    font-size: 18px;
  }
}

@media (max-width: 800px) {
  .requests {
    padding: 7px 17px;
    width: 68%;
  }
  .title {
    font-size: 16px;
  }
}

@media (max-width: 800px) {
  .requests {
    padding: 7px 17px;
    border-radius: 0px;
    height: 100%;
    width: 100%;
  }
  .title {
    font-size: 16px;
  }
}
</style>
