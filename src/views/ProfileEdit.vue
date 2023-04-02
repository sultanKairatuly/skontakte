<template>
  <div class="container">
    <div class="profile">
      <div class="profile_content">
        <div
          class="avatar_container"
          @mouseenter="profilePhotoHovered = true"
          @mouseleave="profilePhotoHovered = false"
          @click="changeProfilePhoto"
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
        @update:model-value="(newValue) => (name = newValue as string)"
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
      <label class="label">Родной город</label>
      <SkInput
        padding="8px 20px"
        font-size="19px"
        :model-value="city"
        @update:model-value="(newValue) => (city = newValue as string)"
      />
      <label class="label">Пол</label>
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
import { ref, reactive, computed } from "vue";
import type {
  Birthday,
  Months,
  Updates,
  MonthData,
  stringMonthSignature,
} from "env";
import { useRouter } from "vue-router";
import { useImageGetter } from "../composables/utilities";

const { changeProfilePhoto } = useImageGetter();
const router = useRouter();
const emit = defineEmits<{
  (e: "changesSaved"): void;
}>();
const store = useAuthStore();
const birthYearOptions: Array<string> = [];
const birthDayOptions: Array<string> = reactive([]);

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

const birthMonthOptions: Array<Months> = monthData.map(
  (item) => item.name
) as Array<Months>;

const monthsValue: stringMonthSignature = {
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
  month: month.value.slice(0, 3),
  year,
});
const profilePhotoHovered = ref<boolean>(false);
const birthdayFormatted = computed(() => {
  let monthKey: number = 0;

  for (let key in monthsValue) {
    if (key.slice(0, 3) === birthday.month) {
      monthKey = monthsValue[key];
    }
  }

  return `${day}.${+monthKey > 9 ? monthKey : `0${monthKey}`}.${year}`;
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

.select-one {
  width: 55px;
}

.select-two {
  width: 65px;
}

.select-three {
  width: 80px;
}

.birth {
  display: flex;
  column-gap: 10px;
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

.dark .profile {
  background-color: #222222;
  border: 1px solid #424242;
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

.select-one {
  width: 55px;
}

.select-two {
  width: 65px;
}

.select-three {
  width: 80px;
}

.birth {
  display: flex;
  column-gap: 10px;
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

@media (max-width: 1440px) {
  .fa-camera {
    color: #fff;
    font-size: 20px;
  }

  .avatar_container {
    width: 80px;
    cursor: pointer;
    height: 80px;
    position: relative;
    border-radius: 50%;
    overflow: hidden;
  }

  .avatar {
    width: 80px;
    height: 80px;
    object-fit: cover;
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

  .birth {
    display: flex;
    column-gap: 10px;
  }
  .name {
    font-size: 20px;
    margin-left: 15px;
  }

  .label {
    font-size: 18px;
    margin: 10px 0 5px 0;
  }
}

@media (max-width: 800px) {
  .fa-camera {
    color: #fff;
    font-size: 18px;
  }

  .avatar_container {
    width: 70px;
    cursor: pointer;
    height: 70px;
    position: relative;
    border-radius: 50%;
    overflow: hidden;
  }

  .avatar {
    width: 70px;
    height: 70px;
    object-fit: cover;
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

  .birth {
    display: flex;
    column-gap: 10px;
  }
  .name {
    font-size: 18px;
    margin-left: 15px;
  }

  .label {
    font-size: 16px;
    margin: 5px 0 5px 0;
  }
}

@media (max-width: 450px) {
  .fa-camera {
    color: #fff;
    font-size: 18px;
  }

  .avatar_container {
    width: 60px;
    height: 60px;
  }

  .avatar {
    width: 60px;
    height: 60px;
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

  .birth {
    display: flex;
    column-gap: 10px;
  }
  .name {
    font-size: 16px;
    margin-left: 15px;
  }

  .label {
    font-size: 14px;
    margin: 5px 0 5px 0;
  }

  .profile {
    height: 100%;
    border-radius: 0;
  }
}
</style>
