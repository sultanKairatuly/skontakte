<template>
  <div class="container">
    <div class="profile">
      <div class="profile_content">
        <div
          class="avatar_container"
          @mouseenter="profilePhotoHovered = true"
          @mouseleave="profilePhotoHovered = false"
        >
          <img :src="store.user.photoURL" class="avatar" alt="avatar" />
          <div class="bg" v-if="profilePhotoHovered">
            <i class="fa-solid fa-camera"></i>
          </div>
        </div>
        <div class="name">{{ name }}</div>
      </div>
      <label class="label">Имя</label>
      <SkInput
        class="select"
        padding="8px 20px"
        font-size="19px"
        :model-value="name"
        @update:model-value="(newValue) => (name = newValue)"
      />
      <label class="label">День рождения</label>
      <SkSelect
        class="select"
        :model-value="birthday.day"
        @update:model-value="(newValue) => (birthday.day = newValue)"
        :options="birthDayOptions"
      />
      <SkSelect
        class="select"
        :model-value="birthday.month"
        @update:model-value="(newValue) => (birthday.month = newValue)"
        :options="birthMonthOptions"
      />
      <SkSelect
        class="select"
        :model-value="birthday.year"
        @update:model-value="(newValue) => (birthday.year = newValue)"
        :options="birthYearOptions"
      />
      <label class="label">Пол</label>
      <SkInput
        padding="8px 20px"
        font-size="19px"
        :model-value="city"
        @update:model-value="(newValue) => (city = newValue)"
      />
      <label class="label">Родной город</label>
      <SkSelect
        class="select"
        :options="['Мужской', 'Женский']"
        :model-value="gender"
        @update:model-value="(newValue) => (gender = newValue)"
      />
      <SkButton class="btn" label="Сохранить" @click="saveEdits" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import SkButton from "../UIcomponents/SkButton.vue";
import SkInput from "../UIcomponents/SkInput.vue";
import SkSelect from "../UIcomponents/SkSelect.vue";
import SkNotification from "../UIcomponents/SkNotification.vue";
import { ref, reactive, computed } from "vue";
import type { Birthday, Months, Updates } from "env";
import router from "@/router";

const emit = defineEmits<{
  (e: "changesSaved"): void;
}>();
const store = useAuthStore();
const birthYearOptions: Array<string> = [];
const birthDayOptions: Array<string> = [];
const birthMonthOptions: Array<Months> = [
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
  [month: string]: number;
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

for (let i = 1; i <= 31; i++) {
  birthDayOptions.push(i.toString());
}

for (let i = 1900; i <= 2010; i++) {
  birthYearOptions.push(i.toString());
}

const [day, monthNumber, year]: [
  day: string,
  monthNumber: string,
  year: string
] = store.user.birthday.split(".");
const month = computed(() => {
  for (let key in monthsValue) {
    if (+monthsValue[key] === +monthNumber) {
      return key;
    }
  }
  return "";
});

const name = ref<string>(store.user.displayName);
const city = ref<string>(store.user.city);
const gender = ref<string>(store.user.gender);
const birthday: Birthday = reactive({
  day: day.replace("0", ""),
  month: month.value,
  year,
});
const profilePhotoHovered = ref<boolean>(false);
const birthdayFormatted = computed(() => {
  return `${day}.${
    +monthNumber > 9 ? monthNumber : `0${monthNumber}`
  }.${year}`;
});

async function saveEdits() {
  const user: Updates = {
    name: name.value,
    gender: gender.value,
    birthday: birthdayFormatted.value,
    city: city.value,
  };
  await store.updateUser(user);
  emit("changesSaved");
  router.push("/profile");
}
</script>

<style scoped>
.container {
  width: 800px;
}

.profile {
  padding: 20px;
  background-color: #fff;
  border-radius: 15px;
  border: 1px solid #dde1e5;
}

.profile_content {
  padding: 10px;
  display: flex;
  align-items: center;
}

.bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background-color: #000;
  opacity: 0.3;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}

.select {
  display: inline-block;
  margin: 0px 5px;
}

.invalid {
  background-color: #faebeb;
  border: 1px solid red;
}

.fa-camera {
  color: #fff;
  font-size: 25px;
}

.avatar_container {
  width: 90px;
  cursor: pointer;
  height: 90px;
  position: relative;
  border-radius: 50%;
  overflow: hidden;
}

.avatar {
  width: 90px;
  height: 90px;
  object-fit: cover;
}

.name {
  font-size: 23px;
  margin-left: 15px;
}

.label {
  font-size: 20px;
  display: block;
  margin: 15px 0 5px 0;
}

.btn {
  display: block;
  margin: 35px 0px 10px 0px;
}
</style>
