<template>
  <div class="sidebar_search">
    <q-input
      color="primary bg-white"
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
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
}>();
</script>

<style scoped>
.sidebar_search {
  padding: 0 5px;
  background-color: #fff;
  border-bottom: 1px solid #dde1e5;
}
</style>
