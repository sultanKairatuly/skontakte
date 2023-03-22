<template>
  <div class="tabs" v-if="!props.readonly">
    <div
      class="tab_item"
      @click="$emit('changeActiveComponent', tab.component)"
      :key="tab.id"
      :class="{
        'active-tab': tab.id === props.activeTabId
      }"
      v-for="(tab, index) in props.tabs"
    >
      {{ tab.title }}
      <q-badge color="#447BBA" v-if="props.badges" transparent>{{ props?.badges?.[index] }}</q-badge>
    </div>
  </div>
  <div class="tabs" v-if="props.readonly">
    <div class="banner">
      <div class="user_avatar_container">
        <q-skeleton type="circle" class="skeleton" v-if="props.loading" />
        <img :src="props.user?.photoURL" v-else class="user_avatar" alt="">
      </div>
      <h3 class="title">Друзья {{ props.user?.name }}</h3>
    </div>
    <div
      class="tab_item"
      @click="$emit('changeActiveComponent', tab.component)"
      :key="tab.id"
      v-for="(tab, index) in props.tabs"
    >
      {{ tab.title }}
      <q-badge color="#447BBA" v-if="props.badges" transparent>{{ props?.badges?.[index] }}</q-badge>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tabs, UserDB } from 'env'

const props = withDefaults(defineProps<{
  tabs: Array<Tabs>;
  badges?: Array<number>;
  readonly: boolean;
  user?: UserDB;
  activeTabId?: string;
  loading: boolean
}>(), {
  readonly: false,
  loading: false
});
</script>

<style scoped>
.tabs {
  width: 27%;
  background-color: #fff;
  padding: 15px 20px;
  border-radius: 20px;
  border: 1px solid #dce1e6;
  height: fit-content;
  padding: 10px;
}

.tab_item {
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 19px;
  transition: 0.1s ease-in-out;
}

.tab_item:hover {
  background-color: #f7f7f7;
}

.banner {
  display: flex;
  margin-bottom: 10px;
  align-items: center;
}

.user_avatar_container{
  width: 35px;
  position: relative;
  height: 35px;
  border-radius: 50%;
  overflow: hidden;
}

.title{
  font-size: 18px;
  margin-left: 10px;
}

.user_avatar {
  width: 35px;
  height: 35px;
  object-fit: cover;
}

.skeleton {
  width: 100%;
  height: 100%;
}

.active-tab{
  color: red
}

@media (max-width: 1440px) {
    .tabs {
      width: 30%;
    }

    
    .title{
      font-size: 14px;
      margin-left: 10px;
    }

}
</style>
