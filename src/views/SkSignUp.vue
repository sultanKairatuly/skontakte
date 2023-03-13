<template>
  <div class="container">
    <div class="content">
      <div class="title">Регистрация Skontakte</div>
      <SkForm class="form">
        <template #inputs>
          <label class="label" for="name">Имя</label>
          <SkInput
            :modelValue="name"
            @update:modelValue="(newValue) => (name = newValue)"
            placeholder="Имя"
            class="input"
            :padding="'10px 30px'"
            :fontSize="'16px'"
          />
          <label class="label" for="email">Email</label>
          <SkInput
            :modelValue="email"
            @update:modelValue="(newValue) => (email = newValue)"
            placeholder="Email"
            class="input"
            :padding="'10px 30px'"
            :fontSize="'16px'"
          />
          <label class="label" for="name">Пароль</label>
          <SkInput
            :modelValue="password"
            @update:modelValue="(newValue) => (password = newValue)"
            placeholder="Пароль"
            class="input"
            :icon="isPwt ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'"
            :type="isPwt ? 'text' : 'password'"
            @iconClicked="isPwt = !isPwt"
            :padding="'10px 30px'"
            :fontSize="'16px'"
          />
          <label class="label" for="profile photo">Фото профиля</label>
          <SkInput
            :modelValue="photoURL"
            @update:modelValue="(newValue) => (photoURL = newValue)"
            placeholder="Фото профиля"
            class="input"
            :type="'text'"
            :padding="'10px 30px'"
            :fontSize="'16px'"
          />
        </template>
        <template #inputs2>
          <label class="label" for="gender">Пол</label>
          <SkSelect
            :options="['Мужской', 'Женский']"
            :modelValue="gender"
            @update:modelValue="(newValue) => (gender = newValue)"
          />
          <div class="birth">
            <label class="label" for="name">День рождения</label>
            <SkSelect
              class="select"
              :options="birthDayOptions"
              :modelValue="birthday.day"
              @update:modelValue="(newValue) => (birthday.day = newValue)"
            />
            <label class="label" for="name">Месяц рождения</label>
            <SkSelect
              class="select"
              :options="birthMonthOptions"
              :modelValue="birthday.month"
              @update:modelValue="(newValue) => (birthday.month = newValue as Months)"
            />
            <label class="label" for="name">Год рождения</label>
            <SkSelect
              class="select"
              :options="birthYearOptions"
              :modelValue="birthday.year"
              @update:modelValue="(newValue) => (birthday.year = newValue)"
            />
          </div>
          <label class="label" for="name">Город</label>
          <SkInput
            :modelValue="city"
            @update:modelValue="(newValue) => (city = newValue)"
            placeholder="Родной город"
            class="input"
            :padding="'10px 30px'"
            :fontSize="'16px'"
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
    <SkLoader v-if="loading" />
  </div>
</template>

<script setup lang="ts">
import SkForm from "../components/SkForm.vue";
import SkInput from "../UIcomponents/SkInput.vue";
import SkLoader from "../components/SkLoader.vue";
import SkSelect from "../UIcomponents/SkSelect.vue";
import { ref, reactive, computed } from "vue";
import { useAuthStore } from "../stores/auth";
import type { User, Birthday, Months } from "env";

const loading = ref<boolean>(false);
const isPwt = ref(false);
const store = useAuthStore();
const name = ref<string>("");
const email = ref<string>("");
const password = ref<string>("");
const city = ref<string>("");
const gender = ref<string>("");
const birthday: Birthday = reactive({
  month: "январь",
  day: "1",
  year: "2000",
});
const photoURL = ref<string>("");

const birthYearOptions: Array<string> = [];
const birthDayOptions: Array<string> = [];
const birthMonthOptions: Array<string> = [
  "январь",
  "февраль",
  "март",
  "апрель",
  "май",
  "июнь",
  "июль",
  "август",
  "сентябрь",
  "октябрь",
  "ноябрь",
  "декабрь",
];

type A = {
  [a: string]: number;
};

const monthsValue: A = {
  январь: 1,
  февраль: 2,
  март: 3,
  апрель: 4,
  май: 5,
  июнь: 6,
  июль: 7,
  август: 8,
  сентябрь: 9,
  октябрь: 10,
  ноябрь: 11,
  декабрь: 12,
};

const monthFormatted = computed(() => {
  let month = monthsValue[birthday.month];
  return month >= 9 ? `0${month}` : month;
});

const dayFormatted = computed(() => {
  return +birthday.day <= 9 ? `0${birthday.day}` : birthday.day;
});

for (let i = 1; i <= 31; i++) {
  birthDayOptions.push(i.toString());
}

for (let i = 1900; i <= 2010; i++) {
  birthYearOptions.push(i.toString());
}

function register(e: Event): void {
  loading.value = true;
  e.preventDefault();
  const user: User = {
    name: name.value,
    email: email.value,
    password: password.value,
    photoURL: photoURL.value,
    birthday: `${dayFormatted.value}.${monthFormatted.value}.${birthday.year}`,
    city: city.value,
    gender: gender.value,
  };
  loading.value = false;
  store.registerUser(user);
  name.value = "";
  email.value = "";
  password.value = "";
  photoURL.value = "";
  birthday.day = "";
  birthday.year = "";
  birthday.month = "январь";
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
  width: 650px;
}

.input {
  margin: 10px 0 25px 0;
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

.label {
  font-size: 16px;
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
    font-size: 28px;
  }
  .content {
    width: 600px;
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
    font-size: 15px;
  }
}
</style>
