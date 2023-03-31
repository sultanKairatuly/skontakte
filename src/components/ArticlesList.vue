<template>
  <div class="articles" v-if="props.articles.length">
    <TransitionGroup name="articles">
      <ArticleItem
        v-for="article in props.articles"
        :editing="props.editing"
        :article="article"
        :key="article.id"
        @deleteArticle="(value) => $emit('deleteArticle', value)"
        @editArticle="$emit('editArticle')"
        @saveEdits="(value) => $emit('saveEdits', value)"
      />
    </TransitionGroup>
  </div>
  <NoMessage v-else>У вас пока нет статей</NoMessage>
</template>

<script setup lang="ts">
import type { Article } from "env";
import ArticleItem from "./ArticleItem.vue";

const props = defineProps<{
  articles: Array<Article>;
  editing: boolean;
}>();
</script>

<style scoped>
.articles {
  display: flex;
  flex-direction: column;
  row-gap: 10px;
}

.articles-enter-active,
.articles-leave-active {
  transition: all 0.4s ease;
}
.articles-enter-from,
.articles-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
