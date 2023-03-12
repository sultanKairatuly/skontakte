<template>
  <div class="content" v-if="!props.readonly">
    <div class="images" v-if="userImages.length > 0">
      <img
        :src="getImageUrl(image.imageUrl)"
        v-for="image in userImages"
        class="user-image"
        :key="image.imageUrl"
      />
    </div>
    <div v-else class="no-photo_message">У вас нет фото</div>
    <SkButton :font-size="'18px'" :padding="'10px 25px'" @click="uploadImage" label="Загрузить" />
  </div>
  <div class="loading" v-if="loading && props.readonly">loading...</div>
  <div class="content" v-if="!loading && props.readonly">
    <div class="images" v-if="props.user.photos.length > 0">
      <img
        :src="getImageUrl(image.imageUrl)"
        v-for="image in userImages"
        class="user-image"
        :key="image.imageUrl"
      />
    </div>
    <div v-else class="no-photo_message">У {{ props.user.name }} нет фото</div>
    <div>{{ props.user.name }}</div>
  </div>
  <TransitionGroup name="modal" v-if="isModal" key="0">
    <SkPopup
    @close-popup="isModal = false"
    >
    <template #modal>
      <h3 class="modal_title">Добавление фотографий</h3>
      <div class="modal_image_container">
        <div class="separator"></div>
        <img class="modal_image" :src="getImageUrl(imageUrl)" />
        <SkInput
        :placeholder="'Добавить описание...'"
        :padding="'5px 20px'"
        :font-size="'18px'"
        :model-value="photoDescription"
        @update:model-value="newValue => photoDescription= newValue" 
        />
        <div class="separator"></div>
      </div>
    </template>
  </SkPopup>
  </TransitionGroup>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useImageGetter } from "@/composables/utilities";
import SkButton from "../UIcomponents/SkButton.vue";
import SkPopup from '../UIcomponents/SkPopup.vue'
import SkInput from '../UIcomponents/SkInput.vue'
import type { UserDB } from "env";

const userImages: Array<{ imageUrl: string, message?: string }> = reactive([]);
const isModal = ref<boolean>(false)
const photoDescription = ref<string>('')

const props = withDefaults(defineProps<{
  readonly?: boolean,
  user: UserDB
}>(), {
  readonly: false
})

setTimeout(() => {
  loading.value = false
}, 1000);
const loading = ref<boolean>(true)
const { getImageUrl } = useImageGetter();
const imageUrl = ref<string>("");
const image = ref<string>("");
function onFilePicked(event: Event) {
  const target = event?.target;
  if(target) {
    const files = [target][0].files;
    let filename = files[0].name;
    const fileReader = new FileReader();
    fileReader.addEventListener("load", () => {
      imageUrl.value = fileReader.result as string;
    });
    fileReader.readAsDataURL(files[0]);
    image.value = files[0];
    
    isModal.value = true
   
  }
}

function uploadImage() {
  const fileInput = document.createElement("input");
  fileInput.setAttribute("type", "file");
  fileInput.addEventListener("change", onFilePicked);
  fileInput.click();
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
  padding: 30px;
  column-gap: 20px;
  row-gap: 20px;
  flex-wrap: wrap;
}

.user-image {
  width: 200px;
  height: 200px;
}


.modal{
  padding: 20px;
}

.modal_title{
  font-size: 20px;
}

.modal_image{
  width: 185px;
  height: 127px;
  object-fit: cover;
}

.no-photo_message{
  font-size: 17px;
  color: #9f9f9f;
  margin: 10px 0;
}

.separator{
  border: 2px solid #000;
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
