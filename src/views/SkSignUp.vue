<template>
  <div class="container">
    <div class="content">
      <div class="title">Регистрация Skontakte</div>
      <SkForm class="form">
        <template #inputs>
          <label class="label" for="name">Имя</label>
          <SkInput
            :modelValue="name"
            @update:modelValue="(newValue) => (name = newValue as string)"
            placeholder="Имя"
            class="input"
            :padding="'10px 30px'"
            :rules="[(val) => val.length >= 1 || 'Поле не должно быть пустым']"
            :fontSize="'16px'"
          />
          <label class="label" for="email">Email</label>
          <SkInput
            :modelValue="email"
            @update:modelValue="(newValue) => (email = newValue as string)"
            placeholder="Email"
            class="input"
            :padding="'10px 30px'"
            :rules="[(val) => val.length >= 1 || 'Поле не должно быть пустым']"
            :fontSize="'16px'"
          />
          <label class="label" for="name">Пароль</label>
          <SkInput
            :modelValue="password"
            @update:modelValue="(newValue) => (password = newValue as string)"
            placeholder="Пароль"
            class="input"
            :type="isPwt ? 'text' : 'password'"
            @iconClicked="isPwt = !isPwt"
            :padding="'10px 30px'"
            :icon="passwordIcon"
            :rules="[(val) => val.length >= 1 || 'Поле не должно быть пустым']"
            :fontSize="'16px'"
          />
          <label class="label photo-label" for="profile photo"
            >Фото профиля</label
          >
          <div class="avatar_container">
            <q-skeleton type="circle" v-if="photoLoading" class="skeleton" />
            <img :src="photoUrl" v-else class="avatar" />
          </div>
          <SkButton class="btn" @click="uploadPhoto" label="Загрузить" />
        </template>
        <template #inputs2>
          <label class="label" for="gender">Пол</label>
          <SkSelect
            :options="['Мужской', 'Женский']"
            :modelValue="gender"
            @update:modelValue="(newValue) => (gender = newValue)"
          />
          <label class="label" for="name">Дата рождения</label>
          <div class="birth">
            <SkSelect
              class="select-one"
              :options="birthDayOptions"
              :modelValue="birthday.day"
              @update:modelValue="(newValue) => (birthday.day = newValue)"
            />
            <SkSelect
              class="select-two"
              :options="birthMonthOptions.map((item) => item.slice(0, 3))"
              :modelValue="birthday.month"
              @update:modelValue="monthChanged"
            />
            <SkSelect
              class="select-three"
              :options="birthYearOptions"
              :modelValue="birthday.year"
              @update:modelValue="(newValue) => (birthday.year = newValue)"
            />
          </div>
          <label class="label" for="name">Город</label>
          <SkInput
            :modelValue="city"
            @update:modelValue="(newValue) => (city = newValue as string)"
            placeholder="Родной город"
            class="input"
            :padding="'10px 30px'"
            :fontSize="'16px'"
            :rules="[(val) => val.length >= 1 || 'Поле не должно быть пустым']"
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
import SkButton from "../UIcomponents/SkButton.vue";
import { ref, reactive, computed } from "vue";
import { useAuthStore } from "../stores/auth";
import type { User, Birthday, MonthData, stringMonthSignature } from "env";

const photoLoading = ref<boolean>(false);
const loading = ref<boolean>(false);
const isPwt = ref(false);
const store = useAuthStore();
const name = ref<string>("");
const email = ref<string>("");
const password = ref<string>("");
const city = ref<string>("");
const gender = ref<string>("");
const birthday: Birthday = reactive({
  month: "янв",
  day: "1",
  year: "2000",
});
const photoURL = ref<string>("");
const passwordIcon = computed(() => {
  if (isPwt.value && !password.value) return "";
  else if (isPwt.value && password.value) return "fa-solid fa-eye";
  else if (!isPwt.value && password.value) return "fa-solid fa-eye-slash";
  else return "";
});
const monthData: Array<MonthData> = [
  {
    name: "январь",
    days: 31,
  },
  {
    name: "февраль",
    days: 28,
  },
  {
    name: "март",
    days: 31,
  },
  {
    name: "апрель",
    days: 30,
  },
  {
    name: "май",
    days: 31,
  },
  {
    name: "июнь",
    days: 30,
  },
  {
    name: "июль",
    days: 31,
  },
  {
    name: "август",
    days: 31,
  },
  {
    name: "сентябрь",
    days: 30,
  },
  {
    name: "октябрь",
    days: 31,
  },
  {
    name: "ноябрь",
    days: 30,
  },
  {
    name: "декабрь",
    days: 31,
  },
];

const birthYearOptions: Array<string> = [];
const birthDayOptions: Array<string> = reactive([]);
const birthMonthOptions: Array<string> = monthData.map(
  (item: MonthData) => item.name
);

const monthsValue: stringMonthSignature = {
  янв: 1,
  фев: 2,
  мар: 3,
  апр: 4,
  май: 5,
  июн: 6,
  июл: 7,
  авг: 8,
  сен: 9,
  окт: 10,
  ноя: 11,
  дек: 12,
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

const photoUrl = computed(() => {
  return imageUrl.value.length > 0
    ? imageUrl.value
    : "https://images.are.na/eyJidWNrZXQiOiJhcmVuYV9pbWFnZXMiLCJrZXkiOiI4MDQwOTc0L29yaWdpbmFsX2ZmNGYxZjQzZDdiNzJjYzMxZDJlYjViMDgyN2ZmMWFjLnBuZyIsImVkaXRzIjp7InJlc2l6ZSI6eyJ3aWR0aCI6MTIwMCwiaGVpZ2h0IjoxMjAwLCJmaXQiOiJpbnNpZGUiLCJ3aXRob3V0RW5sYXJnZW1lbnQiOnRydWV9LCJ3ZWJwIjp7InF1YWxpdHkiOjkwfSwianBlZyI6eyJxdWFsaXR5Ijo5MH0sInJvdGF0ZSI6bnVsbH19?bc=0";
});

function register(e: Event): void {
  e.preventDefault();
  if (
    name.value === "" ||
    email.value === "" ||
    city.value == "" ||
    password.value === "" ||
    birthday.month === "" ||
    birthday.day === "" ||
    birthday.year === ""
  ) {
    console.log("you are wrong");
    return;
  } else {
    loading.value = true;
    const user: User = {
      name: name.value,
      email: email.value,
      password: password.value,
      photoURL: photoUrl.value,
      birthday: `${dayFormatted.value}.${monthFormatted.value}.${birthday.year}`,
      city: city.value,
      gender: gender.value,
      friends: [],
      chats: [],
      importantMessages: [],
    };
    store.registerUser(user);
    name.value = "";
    email.value = "";
    password.value = "";
    photoURL.value = "";
    birthday.day = "";
    birthday.year = "";
    birthday.month = "январь";
  }
}

function monthChanged(month: string) {
  birthday.month = month;
  const monthDays = monthData.filter(
    (item) => item.name.slice(0, 3) === month
  )[0].days;
  birthDayOptions.splice(0);
  for (let i = 1; i <= monthDays; i++) {
    birthDayOptions.push(i.toString());
  }
  if (+birthday.day > monthDays) {
    birthday.day = "1";
  }
}

const imageUrl = ref<string>("");
const image = ref<string>("");
function onFilePicked(event: any) {
  photoLoading.value = true;
  const target = event?.target;
  if (target) {
    const files = [target][0].files;
    let filename = files[0].name;
    const fileReader = new FileReader();
    fileReader.addEventListener("load", async () => {
      imageUrl.value = fileReader.result as string;
    });
    photoLoading.value = false;
    fileReader.readAsDataURL(files[0]);
    image.value = files[0];
  }
}

function uploadPhoto() {
  const fileInput: HTMLInputElement = document.createElement("input");
  fileInput.setAttribute("type", "file");
  fileInput.addEventListener("change", onFilePicked);
  fileInput.click();
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

.avatar {
  width: 100%;
  object-fit: cover;
  height: 100%;
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

.birth {
  column-gap: 10px;
  display: flex;
}

.label {
  font-size: 16px;
}

.login:hover {
  background-color: #1c86ff;
}

.btn {
  margin: 10px auto;
  display: block;
}

.photo-label {
  text-align: center;
  display: block;
}

.select-one {
  width: 55px;
}

.select-two {
  width: 65px;
}

.select-three {
  width: 80px;
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

.avatar_container {
  width: 50%;
  border-radius: 50%;
  overflow: hidden;
  margin: 15px auto;
  height: 110px;
}

.skeleton {
  width: 100%;
  height: 100%;
}

.dark .title {
  color: #fff;
}
.dark .content {
  background-color: #222222;
}

.dark .birth {
  column-gap: 10px;
  display: flex;
}

.dark .label {
  color: #fff;
}

.dark .photo-label {
  color: #fff;
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

@media (max-width: 800px) {
  .title {
    font-size: 24px;
  }
  .content {
    width: 600px;
  }

  .login {
    font-size: 16px;
    padding: 5px;
  }

  .content {
    padding: 20px;
  }

  .register {
    font-size: 16px;
    padding: 5px;
  }

  .info {
    font-size: 13px;
  }
}

@media (max-width: 450px) {
  .title {
    margin: 20px 0;
    font-size: 20px;
  }
  .content {
    padding: 20px;
    width: 300px;
  }

  .login {
    font-size: 14px;
    padding: 5px;
  }

  .register {
    font-size: 14px;
    padding: 5px;
  }

  .info {
    opacity: 0.7;
    font-size: 11px;
    text-align: center;
    margin: 15px 0;
  }

  .label {
    font-size: 14px;
  }
}
</style>
