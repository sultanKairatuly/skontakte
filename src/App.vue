<template>
  <div class="app">
    <SkHeader />
    <div class="app_layout">
      <SkSidebar v-if="localStorage.getItem('user')" />
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
import SkHeader from "./components/SkHeader.vue";
import SkSidebar from "./components/SkSidebar.vue";

const localStorage = window.localStorage;
</script>

<style>
* {
  font-family: Arial, "Helvetica Neue", Helvetica, sans-serif;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app {
  position: relative;

  background-color: #edeef0;
}

.container {
  min-height: 100vh;
  background-color: #edeef0;
  padding: 0px 20px;
  width: 87%;
}
.app_layout {
  display: flex;
  justify-content: center;
  margin: 0 auto;
  padding: 0 30px;
  max-width: 1600px;
  padding: 100px 0;
}


@media (max-width: 1440px){
  .container{
    width: 65%
  }
}


</style>
