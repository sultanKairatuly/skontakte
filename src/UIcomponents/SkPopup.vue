<template>
  <div class="wrapper" @mousedown="closePopup">
    <div class="modal" @mousedown.stop>
      <i class="fa-sharp close fa-solid fa-xmark" @click="closePopup"></i>
      <div
        class="pad-wrapper"
        :style="{
          width: props.width,
          padding: props.padding,
        }"
      >
        <slot name="modal"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    padding?: string;
    width?: string;
  }>(),
  {
    padding: "40px 30px",
    width: "auto",
  }
);

const emit = defineEmits<{
  (e: "closePopup"): void;
}>();

document.addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.code === "Escape") {
    closePopup();
  }
});

function closePopup() {
  emit("closePopup");
}
</script>

<style scoped>
.wrapper {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #000000c0;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 100;
  overflow: hidden;
}

.pad-wrapper {
  overflow: hidden;
}

.modal {
  position: relative;
  background-color: #fff;
  border-radius: 10px;
}

.close {
  top: 10px;
  right: 10px;
  font-size: 30px;
  color: #447bba;
  position: absolute;
  padding: 3px;
  cursor: pointer;
}
</style>
