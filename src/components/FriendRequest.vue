<template>
  <div class="request" v-for="request in props.friendRequestFrom">
    <div class="request_item_avatar_container">
      <img class="request_item_avatar" :src="getImageUrl(request.photoURL)" />
    </div>
    <div class="request_item_text">
      <div class="request_item_name">{{ request.name }}</div>
      <div class="request_item_btns">
        <SKButton
          class="request_item_btn"
          @click="$emit('acceptFriendRequest', request.email)"
          label="Принять"
        />
        <SKButton
          class="request_item_btn"
          label="Отклонить"
          @click="$emit('cancelFriendRequest')"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AddedUser } from "env";
import { useImageGetter } from "../composables/utilities";
import SKButton from "../UIcomponents/SkButton.vue";

const { getImageUrl } = useImageGetter();
const props = defineProps<{
  friendRequestFrom: Array<AddedUser>;
}>();
</script>

<style scoped>
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

@media (max-width: 800px) {
  .request {
    padding: 6px 0;
    column-gap: 10px;
  }

  .request_item_avatar_container {
    width: 85px;
    height: 85px;
  }
  .request_item_avatar {
    width: 85px;
    height: 85px;
  }
  .request_item_name {
    margin-bottom: 3px;
    font-size: 14px;
  }
  .request_item_btns {
    display: flex;
    column-gap: 3px;
  }

  .no-requests-message {
    margin: 15px auto;
    padding: 10px;
    font-size: 18px;
  }

  .btn {
    display: block;
    margin: 10px 0;
  }
}

@media (max-width: 450px) {
  .request {
    padding: 6px 0;
    column-gap: 15px;
  }

  .request_item_avatar_container {
    width: 65px;
    height: 65px;
  }
  .request_item_avatar {
    width: 65px;
    height: 65px;
  }
  .request_item_name {
    margin-bottom: 3px;
    font-size: 15px;
  }
  .request_item_btns {
    display: flex;
    column-gap: 6px;
  }

  .btn {
    display: block;
    margin: 10px 0;
  }
}
</style>
