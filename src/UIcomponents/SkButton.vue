<template>
  <q-btn
    color="#e5ebf1"
    text-color="#346bb4"
    :label="props.label"
    :loading="props.loading"
    class="btn q-pa-sm text-capture"
    :icon="props.icon"
  >
    <template v-slot:loading>
      <q-spinner-facebook />
    </template>
  </q-btn>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    label?: string;
    icon?: string;
    loading?: boolean;
  }>(),
  {
    loading: false,
    label: "Подтвердить",
  }
);
</script>

<style scoped>
.btn {
  background-color: #e5ebf1;
  color: #346bb4;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.1s ease-in-out;
}

.btn:hover {
  background-color: #d3d6da;
}

.dark .btn {
  background-color: #424242;
  color: #fff;
}

@media (max-width: 1440px) {
  .btn {
    font-size: 12px;
  }
}

@media (max-width: 800px) {
  .btn {
    font-size: 10px;
  }
}

@media (max-width: 450px) {
  .btn {
    font-size: 8px;
  }
}
</style>
