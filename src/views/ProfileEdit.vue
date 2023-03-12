<template>
    <div class="container">
        <div class="profile">
            <div class="title">Профиль</div>
            <div class="profile_content">
                <div class="avatar_container">
                    <img :src="store.user.photoURL" class="avatar" alt="avatar">
                </div>
                <div class="name">{{ store.user.displayName }}</div>
                <SkButton label="Изменить"/>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import SkButton from '../UIcomponents/SkButton.vue'
const store = useAuthStore()
</script>


<style scoped>
.container {

}

.profile {
    padding: 20px;
    background-color: #fff;
    border-radius: 15px;
    border: 1px solid #dde1e5;
}

.title {
    font-size: 18px;
    margin-bottom: 30px;
}

.profile_content {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.avatar_container {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
}

.avatar {
    width: 100px;
    height: 100px;
    object-fit: cover;
}

.name {
    font-size: 16px;
    font-weight: bold;
}
</style>