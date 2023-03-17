<template>
  <div class="tabs">
    <div
      class="tab_item"
      @click="$emit('changeActiveComponent', tab.component)"
      :key="tab.id"
      v-for="(tab, index) in props.tabs"
    >
      {{ tab.title }}
      <q-badge color="#447BBA" transparent>{{ props.badges[index] }}</q-badge>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Tabs } from "env";
import type { ComponentOptions } from "vue";

const props = defineProps<{
  tabs: Array<Tabs>;
  badges: Array<number>;
}>();
</script>

<style scoped>
.tabs {
  width: 18%;
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
</style>
