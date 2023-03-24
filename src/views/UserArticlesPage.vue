<template>
    <div class="container">
        <div class="title">Мои статьи</div>
        <div class="articles">
            <div class="article" v-for="article in authStore.user.articles" :key="article.id">
                <div class="author">
                    <div class="author_avatar_container">
                        <img :src="getImageUrl(article.author.photoURL)" class="author_avatar">
                    </div>
                    <div class="author_name">{{ article.author.name }}</div>
                </div>
                <q-separator class="q-ma-md" />
                <div class="article_content" v-html="article.content"></div>
            </div>
        </div>
    </div>
</template>


<script setup lang="ts">
import { reactive } from 'vue'
import type { Article } from 'env'
import {
  getDocs,
  collection
} from "firebase/firestore";
import { db } from '../../firebase'
import { useImageGetter } from '@/composables/utilities';
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const { getImageUrl } = useImageGetter()
const articles: Array<Article> = reactive([])
loadArticles()

async function loadArticles(){
    const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc: any) => {
        articles.push(...doc.data().articles)
    });
}
</script>

<style scoped>
.title {
    font-size: 30px;
    margin-bottom: 15px;
}

.articles {
    display: flex;
    flex-direction: column;
    row-gap: 10px;
}

.article {
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

.author_avatar_container{
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

.author_name{
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
</style>

