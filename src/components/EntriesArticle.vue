<template>
  <div>
    <q-editor v-model="editor" min-height="5rem" />
    <SkButton label="OK" @click="publishArticle" />
    <div class="item" v-for="article in articles" :key="article.id" v-html="article.content">
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import SkButton from '../UIcomponents/SkButton.vue'

type Article = {
    content: string,
    id: string,
    createdAt: number
}

const articles: Array<Article> = reactive([])
const editor = ref<string>('')

function publishArticle(){
    const newArticle: Article = {
        content: editor.value,
        createdAt: Date.now(),
        id: uuidv4()
    }

    articles.push(newArticle)
    editor.value = ''
}

</script>

<style scoped></style>
