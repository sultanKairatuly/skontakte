<template>
  <div class="container">
    <div class="content">
      <div class="title">Регистрация Skontakte</div>
      <SkForm class="form">
        <template #inputs>
          <SkInput
            :modelValue="name"
            @update:modelValue="(newValue) => (name = newValue)"
            placeholder="Имя"
            class="input"
          />
          <SkInput
            :modelValue="email"
            @update:modelValue="(newValue) => (email = newValue)"
            placeholder="Email"
            class="input"
          />
          <SkInput
            :modelValue="password"
            @update:modelValue="(newValue) => (password = newValue)"
            placeholder="Пароль"
            class="input"
            :icon="isPwt ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'"
            :type="isPwt ? 'text' : 'password'"
            @iconClicked="isPwt = !isPwt"
          />
          <SkInput
            :modelValue="photoURL"
            @update:modelValue="(newValue) => (photoURL = newValue)"
            placeholder="Фото профиля"
            class="input"
            :type="'text'"
          />
        </template>
        <template #btns>
          <button class="register" @click="register">Зарегистрироваться</button>
        </template>
      </SkForm>
    </div>
    <div class="content">
      <button class="login" @click="$router.push('/login')">Войти</button>
      <div class="info">
        После регистрации вы получите дополнительные возможности
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SkForm from "../components/SkForm.vue";
import SkInput from "../UIcomponents/SkInput.vue";
import { ref } from "vue";
import { useAuthStore } from "../stores/auth";
import type { User } from "env";

const isPwt = ref(false);
const store = useAuthStore();
const name = ref<string>("");
const email = ref<string>("");
const password = ref<string>("");
const photoURL = ref<string>("");

function register(e: Event): void {
  e.preventDefault();
  const user: User = {
    name: name.value,
    email: email.value,
    password: password.value,
    photoURL: photoURL.value,
  };
  store.registerUser(user);
  name.value = "";
  email.value = "";
  password.value = "";
  photoURL.value = "";
}
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.title {
  text-align: center;
  font-weight: 500;
  color: #000;
  margin: 30px 0;
  font-size: 33px;
}
.content {
  background-color: #fff;
  padding: 32px 54px;
  border-radius: 20px;
  margin-bottom: 30px;
  width: 450px;
}

.input {
  margin: 15px 0;
  width: 100%;
}

.login {
  color: #fff;
  font-size: 19px;
  padding: 15px;
  cursor: pointer;
  border-radius: 10px;
  text-align: center;
  border: none;
  width: 100%;
  background-color: #0077ff;
}

.login:hover {
  background-color: #1c86ff;
}

.register {
  color: #fff;
  font-size: 19px;
  padding: 15px;
  cursor: pointer;
  border-radius: 10px;
  text-align: center;
  border: none;
  width: 100%;
  background-color: #4bb34b;
}

.register:hover {
  background-color: #4fc04f;
}

.info {
  opacity: 0.7;
  font-size: 17px;
  text-align: center;
  margin: 15px 0;
}
</style>
