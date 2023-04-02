<template>
  <div class="container">
    <div class="content">
      <h3 class="title">Добавление поста</h3>
      <q-input
        class="input"
        bg-color="white"
        v-model="postTitle"
        label="Заголовок поста"
      />
      <q-input
        v-model="postBody"
        label="Описание поста"
        autogrow
        class="input"
        bg-color="white"
      />
      <SkButton :label="'Добавить пост'" @click="addPost" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import SkButton from "../UIcomponents/SkButton.vue";
import { usePostStore } from "../stores/post";
import { useAuthStore } from "@/stores/auth";
import { v4 as uuidv4 } from "uuid";
import type { Post } from "env";
import { useRouter } from "vue-router";
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";

const router = useRouter();

const postStore = usePostStore();
const authStore = useAuthStore();

const postTitle = ref<string>("");
const postBody = ref<string>("");

async function addPost() {
  const post: Post = {
    title: postTitle.value,
    body: postBody.value,
    id: uuidv4(),
    comments: [],
    likes: 0,
  };
  let docId = ref<string>("");
  const querySnapshot = await getDocs(collection(db, "users"));
  querySnapshot.forEach((doc) => {
    const docEmail = doc.data().email;
    if (docEmail === authStore.user.email) {
      docId.value = doc.id;
    }
  });
  await updateDoc(doc(db, "users", docId.value), {
    posts: arrayUnion(post),
  });
  postStore.setPost(post);
  router.push("/profile");
  postTitle.value = "";
  postBody.value = "";
}
</script>

<style scoped>
.title {
  margin: 30px 0;
  text-align: center;
  font-size: 25px;
}
.container {
  background-color: #fff;
  margin-left: 30px;
  border-radius: 20px;
}

.content {
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  row-gap: 30px;
  margin: 0 auto;
  padding: 10px;
}

.input {
  width: 100%;
  background-color: #000;
}

.dark .title {
  color: #fff;
}
.dark .container {
  background-color: #222222;
}

.dark .input {
  width: 100%;
  background-color: #000;
}

@media (max-width: 450px) {
  .container {
    height: 100%;
    border-radius: 0;
    margin-left: 0;
  }
}
</style>
