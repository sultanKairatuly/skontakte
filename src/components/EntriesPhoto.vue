<template>
  <input type="file" @change="onFilePicked" />
  <img :src="getImageUrl(imageUrl)" alt="" />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useImageGetter } from "@/composables/utilities";

const { getImageUrl } = useImageGetter();
const imageUrl = ref<string>("");
const image = ref<string>("");
function onFilePicked(event) {
  const files = event.target.files;
  let filename = files[0].name;
  const fileReader = new FileReader();
  fileReader.addEventListener("load", () => {
    imageUrl.value = fileReader.result;
  });
  fileReader.readAsDataURL(files[0]);
  image.value = files[0];
}
</script>

<style scoped></style>
