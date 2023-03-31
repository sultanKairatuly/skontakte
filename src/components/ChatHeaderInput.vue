<template>
  <div class="sidebar_search">
    <q-input
      class="q-pa-sm text-subtitle1 input"
      :class="{
        'bg-grey-9': isDark,
      }"
      color="primary"
      :model-value="props.modelValue"
      @update:model-value="(newValue) => $emit('update:modelValue', newValue)"
      label="Поиск"
      borderless
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
      <template v-slot:append>
        <q-icon
          v-if="props.modelValue !== ''"
          name="close"
          @click="$emit('clearModelValue')"
          class="cursor-pointer"
        />
      </template>
    </q-input>
    <div class="manage_item" v-if="props.ellipsis">
      <q-menu transition-show="scale" transition-hide="scale">
        <q-list style="min-width: 100px">
          <q-item
            clickable
            class="text-subtitle1"
            @click="$emit('showImportantMessages')"
          >
            <q-item-section>Важные сообщения</q-item-section>
          </q-item>
          <q-item clickable class="text-subtitle1">
            <q-item-section>Настройки</q-item-section>
          </q-item>
          <q-separator />
        </q-list>
      </q-menu>
      <i class="fa-solid fa-ellipsis ellipsis"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject } from "vue";

const isDark = inject("isDark");

const props = withDefaults(
  defineProps<{
    modelValue: string;
    ellipsis?: boolean;
  }>(),
  {
    ellipsis: false,
  }
);

defineEmits<{
  (e: "showImportantMessages"): void;
}>();
</script>

<style scoped>
.sidebar_search {
  padding: 0 5px;
  background-color: #fff;
  border-bottom: 1px solid #dde1e5;
  display: flex;
  align-items: center;
}

.input {
  width: 95%;
}

.ellipsis {
  font-size: 25px;
}

.manage_item {
  cursor: pointer;
  color: #b9bec5;
}

.manage_item:hover {
  color: #9ba2ac;
}

.dark .sidebar_search {
  background-color: #333333;
  border-bottom: 1px solid #424242;
}

.dark .input {
  background-color: #333333;
}

.dark .ellipsis {
  font-size: 25px;
}

.dark .manage_item {
  cursor: pointer;
  color: #b9bec5;
}

.dark .manage_item:hover {
  color: #9ba2ac;
}

@media (max-width: 1440px) {
  .sidebar_search {
    padding: 0 15px;
  }

  .ellipsis {
    font-size: 20px;
  }
}
</style>
