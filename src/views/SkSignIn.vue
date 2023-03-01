<template>
  <div class="container">
    <div class="content">
      <div class="title">Вход Skontakte</div>
      <SkForm class="form">
        <template #inputs>
          <SkInput
            :modelValue="email"
            @update:modelValue="(newValue) => (email = newValue)"
            placeholder="Email пользователя"
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
        </template>
        <template #btns>
          <button class="login" @click="login">Войти</button>
        </template>
      </SkForm>
    </div>
    <div class="content">
      <button class="register" @click="$router.push('/register')">
        Зарегистрироваться
      </button>
      <div class="info">После входа вы получите дополнительные возможности</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SkForm from "../components/SkForm.vue";
import SkInput from "../UIcomponents/SkInput.vue";
import { ref } from "vue";
import { useAuthStore } from "@/stores/auth";

const store = useAuthStore();
const isPwt = ref<boolean>(false);
const email = ref<string>("");
const password = ref<string>("");

function login(e: Event) {
  e.preventDefault();
  console.log("loging...");
  const user = {
    email: email.value,
    password: password.value,
  };
  store.loginUser(user);

  email.value = "";
  password.value = "";
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
