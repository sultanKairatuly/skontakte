<template>
  <div class="content">
    <div class="images">
      <img
        :src="getImageUrl(image.imageUrl)"
        v-for="image in userImages"
        class="user-image"
        :key="image.imageUrl"
      />
    </div>
    <SkButton :font-size="'18px'" :padding="'10px 25px'" @click="uploadImage">
      Загрузить
    </SkButton>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useImageGetter } from "@/composables/utilities";
import SkButton from "../UIcomponents/SkButton.vue";

const userImages: Array<{ imageUrl: string }> = reactive([]);

const { getImageUrl } = useImageGetter();
const imageUrl = ref<string>("");
const image = ref<string>("");
function onFilePicked(event: Event) {
  const target = event?.target;
  const files = target?.files;
  let filename = files[0].name;
  const fileReader = new FileReader();
  fileReader.addEventListener("load", () => {
    imageUrl.value = fileReader.result as string;
    const newUserImage = {
      imageUrl: imageUrl.value,
    };
    userImages.push(newUserImage);
  });
  fileReader.readAsDataURL(files[0]);
  image.value = files[0];
}

function uploadImage() {
  const fileInput = document.createElement("input");
  fileInput.setAttribute("type", "file");
  fileInput.click();
  fileInput.addEventListener("change", onFilePicked);
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
</style>
