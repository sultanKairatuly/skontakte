<template>
  <div class="container" v-if="loadOtherArticles">
    <h3 class="title">
      Статьи пользователей <span class="amount">{{ articles.length }}</span>
    </h3>
    <div class="wrapper" v-if="loading">
      <SkLoader />
    </div>
    <ArticleList
      :articles="articles"
      :editing="editing"
      @deleteArticle="deleteArticle"
      @saveEdits="saveEdits"
      @editArticle="editArticle"
    />
  </div>
  <div class="container" v-else>
    <div class="title">
      Мои статьи
      <span class="amount">{{ authStore.user.articles.length }}</span>
      <ArticleList
        v-if="authStore.user.articles"
        :articles="authStore.user.articles"
        :editing="editing"
        @deleteArticle="deleteArticle"
        @saveEdits="saveEdits"
        @editArticle="editArticle"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch, computed } from "vue";
import type { Article } from "env";
import { getDocs, collection, updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { useImageGetter } from "@/composables/utilities";
import { useRoute } from "vue-router";
import { useAuthStore } from "../stores/auth";
import SkLoader from "../components/SkLoader.vue";
import ArticleList from "../components/ArticlesList.vue";

const editing = ref<boolean>(false);
const loading = ref<boolean>(false);
const authStore = useAuthStore();
const route = useRoute();
const loadOtherArticles = computed(() => {
  return !route.path.includes("my") ? true : false;
});
const { getImageUrl, timeSince } = useImageGetter();
const articles: Array<Article> = reactive([]);

if (loadOtherArticles) {
  loadArticles();
}

watch(articles, (nv) => {
  if (nv.length > 0) {
  }
});

async function loadArticles() {
  loading.value = true;
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc: any) => {
    articles.push(...doc.data().articles);
  });
  loading.value = false;
}

async function deleteArticle(id: string) {
  authStore.user.articles = authStore.user.articles.filter(
    (article: Article) => article.id !== id
  );
  localStorage.setItem("user", JSON.stringify(authStore.user));
  let docId: string = "";
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc: any) => {
    if (doc.data().email === authStore.user.email) {
      docId = doc.id;
    }
  });

  await updateDoc(doc(db, "users", docId), {
    articles: authStore.user.articles,
  });
}

function editArticle() {
  editing.value = true;
}

async function saveEdits(id: string) {
  editing.value = false;
  localStorage.setItem("user", JSON.stringify(authStore.user));
  let docId: string = "";
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc: any) => {
    if (doc.data().email === authStore.user.email) {
      docId = doc.id;
    }
  });

  await updateDoc(doc(db, "users", docId), {
    articles: authStore.user.articles,
  });
}
</script>

<style scoped>
.wrapper {
  position: relative;
  height: 600px;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid #dce1e6;
}
.title {
  font-size: 25px;
  margin-bottom: 15px;
  background-color: #fff;
  padding: 5px 15px;
  border-radius: 20px;
  border: 1px solid #dce1e6;
}

.amount {
  font-weight: bold;
  color: #2a5885;
  font-size: 25px;
}
</style>
