<template>
  <q-btn
    color="#e5ebf1"
    text-color="#346bb4"
    :label="props.label"
    :loading="props.loading"
    class="btn q-pa-sm text-body2"
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
    loading?: boolean
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
</style>
