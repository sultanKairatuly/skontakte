<template>
    <div class="container" v-if="loadOtherArticles">
        <h3 class="title">Статьи пользователей <span class="amount">{{ articles.length}}</span></h3>
        <div class="wrapper" v-if="loading">
        <SkLoader  />
        </div>
        <div class="articles" v-if="articles.length > 0">
            <div class="article" v-for="article in articles" :key="article.id">
                <div class="author">
                    <div class="author_avatar_container">
                        <img :src="getImageUrl(article.author.photoURL)" class="author_avatar">
                        </div>
                    <div class="author_name">{{ article.author.name }}</div>
                </div>
                <div class="time">{{ timeSince(article.createdAt) }} ago</div>
                    <q-separator class="q-ma-md" />
                <div class="article_content" v-html="article.content"></div>
            </div>
        </div>
        <div v-else>
            <h3 class="empty_title">Здесь пусто</h3>
        </div>
    </div>
    <div class="container" v-else>
        <div class="title">Мои статьи <span class="amount">{{ authStore.user.articles.length}}</span></div>
        <div class="articles" v-if="authStore.user.articles.length">
        <TransitionGroup name="articles">
            <div class="article" v-for="article in authStore.user.articles" :key="article.id">
                <div class="author">
                    <div class="author_avatar_container">
                        <img :src="getImageUrl(article.author.photoURL)" class="author_avatar">
                    </div>
                    <div class="author_name">{{ article.author.name }}</div>
                </div>
                <q-separator class="q-ma-md" />
                <q-editor v-model="article.content" v-if="editing" min-height="5rem" />
                <div class="article_content" v-else v-html="article.content"></div>
                <div class="time">{{ timeSince(article.createdAt) }} ago</div>
                <div class="manage">
                    <div class="manage_item" @click="deleteArticle(article.id)">
                        <i class="fa-solid fa-trash delete icon"></i>
                    </div>
                    <div v-if="!editing" class="manage_item" @click="editArticle">
                        <i class="fa-solid fa-pen-to-square edit icon"></i>
                    </div>
                    <div v-else class="manage_item" @click="saveEdits(article.id)">
                        <i class="fa-solid fa-floppy-disk icon"></i>
                    </div>
                </div>
            </div>
        </TransitionGroup>
    </div>
        <div v-else class="no-articles">
            У вас пока нет статей
        </div>
    </div>
</template>


<script setup lang="ts">
import { reactive, ref, watch, computed } from 'vue'
import type { Article } from 'env'
import {
  getDocs,
  collection,
  updateDoc,
  doc
} from "firebase/firestore";
import { db } from '../../firebase'
import { useImageGetter } from '@/composables/utilities';
import { useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import SkLoader from '../components/SkLoader.vue';

const editing = ref<boolean>(false)
const loading = ref<boolean>(false)
const authStore = useAuthStore()
const route = useRoute()
const loadOtherArticles = computed(() => {
    return !route.path.includes('my') ? true : false
}) 
const { getImageUrl, timeSince } = useImageGetter()
const articles: Array<Article> = reactive([])



if(loadOtherArticles){
    loadArticles()
}

watch(articles, (nv) => {
    if(nv.length > 0){
    }
})

async function loadArticles(){
    loading.value = true
    const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc: any) => {
        articles.push(...doc.data().articles)
    });
    loading.value = false
}

async function deleteArticle(id: string){
    authStore.user.articles = authStore.user.articles.filter((article: Article) => article.id !== id)
    localStorage.setItem('user', JSON.stringify(authStore.user))
    let docId: string = ''
    const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc: any) => {
        if(doc.data().email === authStore.user.email){
            docId = doc.id
        }
    });

    await updateDoc(doc(db, "users", docId), {
        articles: authStore.user.articles,
    });
}

function editArticle(){
    editing.value = true
}

async function saveEdits(id: string){
    editing.value = false
    localStorage.setItem('user', JSON.stringify(authStore.user))
    let docId: string = ''
    const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc: any) => {
        if(doc.data().email === authStore.user.email){
            docId = doc.id
        }
    });

    await updateDoc(doc(db, "users", docId), {
        articles: authStore.user.articles,
    });
}
</script>

<style scoped>

.article{
    position: relative;
}

.wrapper{
    position: relative;
    height: 600px;
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid #dce1e6;
}
.title {
    font-size: 30px;
    margin-bottom: 15px;
    background-color: #fff;
    padding: 5px 15px;
    border-radius: 20px;
    border: 1px solid #dce1e6;
}

.time{
    position: absolute;
    bottom: 10px;
    right: 10px;
}

.articles {
    display: flex;
    flex-direction: column;
    row-gap: 10px;
}

.empty_title{
    font-size: 25px;
    color: rgb(164, 160, 160);
    background-color: #fff;
    padding: 10px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 300px;
    border: 1px solid #dce1e6
}

.amount {
    font-weight: bold;
    color: #2a5885;
    font-size: 28px;
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

.no-articles{
    height: 200px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    padding: 10px;
    border: 1px solid #dce1e6;
    border-radius: 20px;
    font-size: 25px;
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

.manage{
    display: flex;
    align-items: center;
    column-gap: 15px;
    margin-top: 10px;
}

.icon{
    font-size: 20px;
    color:#2a5885;
    cursor: pointer;
    padding: 5px;
    transition: 0.2s ease-in-out
}

.icon:hover{
    color:#3a7dbf;
    background-color: #ebe6e6;
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

