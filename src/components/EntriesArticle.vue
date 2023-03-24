<template>
  <div>
    <q-editor v-model="editor" min-height="5rem" />
    <div class="btns">
        <SkButton label="Опубликовать" @click="publishArticle" :loading="loading" />
        <SkButton label="Мои статьи" @click="showUserArticles" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import SkButton from '../UIcomponents/SkButton.vue'
import type { Article } from 'env'
import { useAuthStore } from '@/stores/auth'
import {
  getDocs,
  collection,
  arrayUnion,
  doc,
  updateDoc
} from "firebase/firestore";
import { db } from '../../firebase'
import { useRouter } from 'vue-router'

const router = useRouter()
const authStore = useAuthStore()
const editor = ref<string>('')
const loading = ref<boolean>(false)

async function publishArticle(){
  if(editor.value === ''){
    return;
  }
    loading.value = true
    const newArticle: Article = {
        content: editor.value,
        createdAt: Date.now(),
        id: uuidv4(),
        author: {
            name: authStore.user.displayName,
            email: authStore.user.email,
            photoURL: authStore.user.photoURL
        }
    }
    let docId = "";
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc: any) => {
        const docEmail = doc.data().email;
        if (docEmail === authStore.user.email) {
            docId = doc.id
            authStore.user.articles.push(newArticle)
        }
      });

      await updateDoc(doc(db, "users", docId), {
        articles: arrayUnion(newArticle),
      });

      editor.value = ''
      loading.value = false
}


function showUserArticles(){
    router.push('/my-articles')
}
</script>

<style scoped>
.btns {
    margin: 20px 0 10px 0;
    display: flex;
    column-gap: 15px;
    align-items: center;    
}
</style>
