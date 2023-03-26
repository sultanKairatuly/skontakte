<template>
  <div class="article">
    <div class="author">
      <div class="author_avatar_container">
        <img
          :src="getImageUrl(props.article.author.photoURL)"
          class="author_avatar"
        />
      </div>
      <div class="author_name">{{ props.article.author.name }}</div>
    </div>
    <q-separator class="q-ma-md" />
    <q-editor
      v-model="article.content"
      v-if="props.editing"
      min-height="5rem"
    />
    <div class="article_content" v-else v-html="props.article.content"></div>
    <div class="time">{{ timeSince(props.article.createdAt) }} ago</div>
    <div class="manage">
      <div class="manage_item" @click="$emit('deleteArticle', article.id)">
        <i class="fa-solid fa-trash delete icon"></i>
      </div>
      <div v-if="!editing" class="manage_item" @click="$emit('editArticle')">
        <i class="fa-solid fa-pen-to-square edit icon"></i>
      </div>
      <div v-else class="manage_item" @click="$emit('saveEdits', article.id)">
        <i class="fa-solid fa-floppy-disk icon"></i>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Article } from "env";
import { useImageGetter } from "@/composables/utilities";

const { getImageUrl, timeSince } = useImageGetter();
const props = defineProps<{
  article: Article;
  editing: boolean;
}>();
</script>

<style scoped>
.article {
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  padding: 10px;
  border: 1px solid #dce1e6;
  border-radius: 20px;
}

.author {
  display: flex;
  column-gap: 10px;
  align-items: center;
}

.author_avatar_container {
  width: 60px;
  height: 60px;
  overflow: hidden;
  border-radius: 50%;
}

.author_avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author_name {
  font-size: 17px;
  color: #2a5885;
  font-weight: bold;
}

.author_name:hover {
  cursor: pointer;
  text-decoration: underline;
}

.article_content {
  font-size: 18px;
}

.manage {
  display: flex;
  align-items: center;
  column-gap: 15px;
  margin-top: 10px;
}

.time {
  position: absolute;
  bottom: 10px;
  right: 10px;
  font-size: 15px;
  color: gray;
}

.icon {
  font-size: 20px;
  color: #2a5885;
  cursor: pointer;
  padding: 5px;
  transition: 0.2s ease-in-out;
}

.icon:hover {
  color: #3a7dbf;
  background-color: #ebe6e6;
}
</style>
