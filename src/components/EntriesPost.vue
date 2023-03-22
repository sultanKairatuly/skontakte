<template>
  <div class="content" v-if="!props.readonly">
    <div class="posts" v-if="postStore.posts.length > 0">
      <div class="post" v-for="(post, index) in postStore.posts" :key="post.id">
        <div class="separator"></div>
        <h3 class="post_title">{{ post.title }}</h3>
        <div class="post_body">{{ post.body }}</div>
        <div class="manage">
          <div
            class="manage_item"
            @click="likePost(post, index)"
            :class="{
              liked: postLiked,
            }"
          >
            <i class="fa-solid fa-thumbs-up manage-item_icon"></i>
            <div class="manage-item_text">{{ post.likes }}</div>
          </div>
          <div class="manage_item" @click="viewComments">
            <i class="fa-solid fa-comment manage-item_icon"></i>
            <div class="manage-item_text">{{ post.comments.length }}</div>
          </div>
        </div>
        <q-input
          bottom-slots
          v-model="commentsModels[index]"
          label="Комментарий"
          counter
          maxlength="120"
        >
          <template v-slot:before>
            <q-avatar>
              <img :src="getImageUrl(authStore.user.photoURL)" />
            </q-avatar>
          </template>

          <template v-slot:append>
            <q-icon
              v-if="commentsModels[index] !== ''"
              name="close"
              @click="commentsModels[index] = ''"
              class="cursor-pointer"
            />
          </template>

          <template v-slot:after>
            <q-btn
              round
              dense
              flat
              icon="send"
              @click="commentPost(post.id, index)"
            />
          </template>
        </q-input>
        <div class="comments" v-if="isComments">
          <div class="comment" v-for="comment in post.comments">
            <div class="comment_photo_container">
              <img
                class="comment_photo"
                :src="getImageUrl(comment.authorProfilePhoto)"
              />
            </div>
            <div class="comment_text">
              <div class="comment_author">{{ comment.author }}</div>

              <div class="comment_message">{{ comment.comment }}</div>
            </div>
          </div>
        </div>
        <div class="separator"></div>
      </div>
    </div>
    <div v-else class="no-posts_message">У вас нет постов</div>
    <SkButton
      class="btn"
      :font-size="'18px'"
      :padding="'10px 25px'"
      @click="uploadPost"
      label="Сделать пост"
    />
  </div>
  <div v-else class="content">
    <div class="posts" v-if="props.user.posts.length > 0">
      <div
        class="post"
        v-for="(post, index) in props.user.posts"
        :key="post.id"
      >
        <div class="separator"></div>
        <h3 class="post_title">{{ post.title }}</h3>
        <div class="post_body">{{ post.body }}</div>
        <div class="manage">
          <div
            class="manage_item"
            @click="likePost(post, index)"
            :class="{
              liked: postLiked,
            }"
          >
            <i class="fa-solid fa-thumbs-up manage-item_icon"></i>
            <div class="manage-item_text">{{ post.likes }}</div>
          </div>
          <div class="manage_item" @click="viewComments">
            <i class="fa-solid fa-comment manage-item_icon"></i>
            <div class="manage-item_text">{{ post.comments.length }}</div>
          </div>
        </div>
        <q-input
          bottom-slots
          v-model="commentsModels[index]"
          label="Комментарий"
          counter
          maxlength="120"
        >
          <template v-slot:before>
            <q-avatar>
              <img class="q-avatar" :src="getImageUrl(authStore.user.photoURL)" />
            </q-avatar>
          </template>

          <template v-slot:append>
            <q-icon
              v-if="commentsModels[index] !== ''"
              name="close"
              @click="commentsModels[index] = ''"
              class="cursor-pointer"
            />
          </template>

          <template v-slot:after>
            <q-btn
              round
              dense
              flat
              icon="send"
              @click="commentPost(post.id, index, props.user.email)"
            />
          </template>
        </q-input>
        <div class="comments" v-if="isComments">
          <div class="comment" v-for="comment in post.comments">
            <div class="comment_photo_container">
              <img
                class="comment_photo"
                :src="getImageUrl(comment.authorProfilePhoto)"
              />
            </div>
            <div class="comment_text">
              <div class="comment_author">{{ comment.author }}</div>

              <div class="comment_message">{{ comment.comment }}</div>
            </div>
          </div>
        </div>
        <div class="separator"></div>
      </div>
    </div>
    <div class="no-posts_message" v-else>
      У {{ props.user.name }} нет постов
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useImageGetter } from "@/composables/utilities";
import SkButton from "../UIcomponents/SkButton.vue";
import { useRouter } from "vue-router";
import { usePostStore } from "@/stores/post";
import { useAuthStore } from "@/stores/auth";
import type { Post, UserDB, Comment } from "env";

const isComments = ref<boolean>(false);
const commentsModels: Array<string> = reactive([]);
const props = withDefaults(
  defineProps<{
    readonly?: boolean;
    user: UserDB;
  }>(),
  {
    readonly: false,
  }
);
console.log(props.user);
const authStore = useAuthStore();
const router = useRouter();
const postStore = usePostStore();
const { getImageUrl } = useImageGetter();
const postLiked = reactive([]);

function uploadPost() {
  router.push("/add-post");
}

async function likePost(post: Post, index: number) {
  postStore.likePost(post, index);
}

function commentPost(id: string, index: number, userEmail?: string) {
  const comment: Comment = {
    authorProfilePhoto: authStore.user.photoURL,
    author: authStore.user.displayName,
    comment: commentsModels[index],
  };
  if (userEmail) {
    postStore.commentPost(id, comment, userEmail);
  } else {
    postStore.commentPost(id, comment);
  }
  commentsModels[index] = "";
}

function viewComments() {
  isComments.value = !isComments.value;
}
</script>

<style scoped>
.no-posts_message {
  font-size: 20px;
  color: #9f9f9f;
  margin: 20px 0;
  text-align: center;
}
.btn {
  display: block;
  margin: 10px auto;
}

.posts {
  display: flex;
  flex-direction: column;
  row-gap: 20px;
  align-items: center;
}

.post {
  box-shadow: 0px 0px 8px 0px rgba(34, 60, 80, 0.2);
  width: 100%;
  padding: 20px;
  border-radius: 5px;
}

.separator {
  width: 100%;
  height: 0.7px;
  margin: 10px 0;
  background-color: #d4d4d4;
}

.post_title {
  font-size: 22px;
  margin-bottom: 20px;
  font-weight: 500;
}

.q-avatar{
  object-fit: cover;
  width: 30px;
  height: 30px;
}

.post_body {
  font-size: 18px;
}

.manage {
  display: flex;
  column-gap: 12px;
  align-items: center;
  margin: 15px 0;
}

.manage_item {
  display: flex;
  column-gap: 5px;
  padding: 5px 12px;
  cursor: pointer;
  align-items: center;
  background-color: #eaedf0;
  border-radius: 15px;
  transition: 0.2s ease-in-out;
}

.manage_item:hover {
  background-color: #dfe2e5;
}

.manage-item_icon {
  color: #808b98;
  font-size: 20px;
}

.manage-item_text {
  color: #808b98;
  font-size: 16px;
}

.comment {
  display: flex;
  column-gap: 10px;
  padding: 5px;
  align-items: flex-start;
}

.comment_photo_container {
  border-radius: 50%;
  overflow: hidden;
  width: 50px;
  height: 50px;
}
.comment_photo {
  width: 50px;
  height: 50px;
  object-fit: cover;
}

.comment_text {
  width: 85%;
}
.comment_author {
  font-size: 19px;
}

.comment_message {
  font-size: 17px;
  width: 100%;
  word-wrap: break-word;
}

.liked .manage-item_icon {
  color: #fff;
}
.liked .manage-item_text {
  color: #fff;
}

.liked {
  background-color: rgb(226, 32, 32);
}

.liked:hover {
  background-color: rgb(226, 32, 32);
}
</style>
