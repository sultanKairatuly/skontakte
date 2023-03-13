<template>
  <div class="content" v-if="!props.readonly">
    <div class="images" v-if="photoStore.photos.length > 0">
      <div
        class="user-image_container"
        v-for="(image, index) in photoStore.photos"
        :class="{
          last: index === photoStore.photos.length - 1,
          first: index === 0,
        }"
      >
        <img
          :src="getImageUrl(image.url)"
          class="user-image"
          :key="image.url"
        />
      </div>
    </div>
    <div v-else class="no-photo_message">У вас нет фото</div>
    <div class="btns">
      <SkButton
        :font-size="'18px'"
        :padding="'10px 25px'"
        @click="uploadImage"
        label="Загрузить"
      />
      <SkButton
        v-if="photoStore.photos.length > 4"
        :font-size="'18px'"
        :padding="'10px 25px'"
        @click="uploadImage"
        label="Показать ещё"
      />
    </div>
  </div>
  <div class="loading" v-if="loading && props.readonly">loading...</div>
  <div class="content" v-if="!loading && props.readonly">
    <div class="images" v-if="props.user.photos.length > 0">
      <img
        :src="getImageUrl(image.url)"
        v-for="image in props.user.photos"
        class="user-image"
        :key="image.url"
      />
    </div>
    <div v-else class="no-photo_message">У {{ props.user.name }} нет фото</div>
    <div>{{ props.user.name }}</div>
  </div>
  <TransitionGroup name="modal" v-if="isModal" key="0">
    <SkPopup @close-popup="isModal = false">
      <template #modal>
        <h3 class="modal_title">Добавление фотографий</h3>
        <div class="modal_image_container">
          <div class="separator"></div>
          <img class="modal_image" :src="getImageUrl(imageUrl)" />
          <SkInput
            class="extra-info"
            :placeholder="'Добавить описание...'"
            :padding="'5px 20px'"
            :font-size="'18px'"
            :model-value="photoDescription"
            @update:model-value="(newValue) => (photoDescription = newValue)"
          />
          <div class="separator"></div>
        </div>
        <SkButton class="publish" @click="publish" label="Опубликовать" />
      </template>
    </SkPopup>
  </TransitionGroup>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useImageGetter } from "@/composables/utilities";
import SkButton from "../UIcomponents/SkButton.vue";
import SkPopup from "../UIcomponents/SkPopup.vue";
import SkInput from "../UIcomponents/SkInput.vue";
import type { UserDB, Photo } from "env";
import { usePhotoStore } from "../stores/photo";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { useAuthStore } from "../stores/auth";

const authStore = useAuthStore();
const photoStore = usePhotoStore();
const isModal = ref<boolean>(false);
const photoDescription = ref<string>("");

const props = withDefaults(
  defineProps<{
    readonly?: boolean;
    user: UserDB;
  }>(),
  {
    readonly: false,
  }
);

setTimeout(() => {
  loading.value = false;
}, 1000);
const loading = ref<boolean>(true);
const { getImageUrl } = useImageGetter();
const imageUrl = ref<string>("");
const image = ref<string>("");
function onFilePicked(event: any) {
  const target = event?.target;
  if (target) {
    const files = [target][0].files;
    let filename = files[0].name;
    const fileReader = new FileReader();
    fileReader.addEventListener("load", () => {
      imageUrl.value = fileReader.result as string;
    });
    fileReader.readAsDataURL(files[0]);
    image.value = files[0];

    isModal.value = true;
  }
}

function uploadImage() {
  const fileInput = document.createElement("input");
  fileInput.setAttribute("type", "file");
  fileInput.click();
  fileInput.addEventListener("change", onFilePicked);
}

async function publish() {
  const photo: Photo = {
    url: imageUrl.value,
    description: photoDescription.value,
  };
  let docId = ref<string>("");
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    const docEmail = doc.data().email;
    if (docEmail === authStore.user.email) {
      docId.value = doc.id;
    }
  });
  await updateDoc(doc(db, "users", docId.value), {
    posts: arrayUnion(photo),
  });
  photoStore.setPhoto(photo);

  isModal.value = false;
}
</script>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.images {
  display: flex;
  width: 100%;
  padding: 5px;
  column-gap: 5px;
  row-gap: 5px;
  position: relative;
  flex-wrap: wrap;
  width: 100%;
}

.user-image_container {
  width: 24%;
}

.user-image {
  width: 100%;
  height: 280px;
  cursor: pointer;
  object-fit: cover;
}

.modal {
  padding: 10px;
}

.modal_title {
  font-size: 25px;
}

.modal_image {
  width: 200px;
  height: 200px;
  object-fit: cover;
  margin: 20px auto;
  display: block;
}

.no-photo_message {
  font-size: 17px;
  color: #9f9f9f;
  margin: 10px 0;
}

.btns {
  margin-top: 10px;
  display: flex;
  column-gap: 20px;
  align-items: center;
}

.separator {
  border: 0.5px solid #000;
  opacity: 0.5;
}

.extra-info {
  margin: 10px 0;
}

.publish {
  margin-top: 30px;
}

.last {
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
  overflow: hidden;
}

.first {
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
  overflow: hidden;
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.5s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
