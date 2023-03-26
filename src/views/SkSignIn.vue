<template>
  <div class="container">
    <SkLoader v-if="loading" />
    <div class="content">
      <div class="title">Вход Skontakte</div>
      <SkForm class="form">
        <template #inputs>
          <SkInput
            :modelValue="email"
            @update:modelValue="(newValue) => (email = newValue as string)"
            placeholder="Email пользователя"
            class="input"
          />
          <SkInput
            :modelValue="password"
            @update:modelValue="(newValue) => (password = newValue as string)"
            placeholder="Пароль"
            class="input"
            :icon="isPwt ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'"
            :type="isPwt ? 'text' : 'password'"
            @iconClicked="isPwt = !isPwt"
          />
        </template>
        <template #btns>
          <div class="text-negative q-my-sm">{{ store.errorMessage }}</div>
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
import SkLoader from "../components/SkLoader.vue";

const store = useAuthStore();
const loading = ref<boolean>(false);
const isPwt = ref<boolean>(false);
const email = ref<string>("");
const password = ref<string>("");

async function login(e: Event) {
  e.preventDefault();
  if (password.value.length > 0 || email.value.length > 0) {
    try {
      loading.value = true;
      const user = {
        email: email.value,
        password: password.value,
      };
      await store.loginUser(user);

      email.value = "";
      password.value = "";
      loading.value = false;
    } catch (e) {
      console.log("result ", e);
    }
  } else {
    return;
  }
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

@media (max-width: 1440px) {
  .title {
    margin: 28px 0;
    font-size: 28px;
  }
  .content {
    width: 400px;
  }

  .input {
    margin: 15px 0;
    width: 100%;
  }

  .login {
    font-size: 18px;
    padding: 10px;
  }

  .register {
    font-size: 18px;
    padding: 10px;
  }

  .info {
    opacity: 0.7;
    font-size: 15px;
    text-align: center;
    margin: 15px 0;
  }
}
</style>
