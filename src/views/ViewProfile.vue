<template>
    <div class="container">
        <ProfileBanner class="banner" :user="user" :readonly="true" />
        <ProfileEntries :user="user" :readonly="true"/>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRoute } from 'vue-router'
import ProfileEntries from '../components/ProfileEntries.vue'
import {
  getDocs,
  collection
} from "firebase/firestore";
import { db } from '../../firebase'
import type { UserDB } from 'env'
import ProfileBanner from '@/components/ProfileBanner.vue';
getUser()
const route = useRoute()
const user: UserDB = reactive({}) as UserDB
async function getUser(){
    const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc: any) => {
            if(doc.data().email === route.params.usermail){
             Object.assign(user, doc.data())
            }
        });
}
console.log('User:', user)
</script>

<style scoped>
    .banner{
        margin-bottom: 15px;
    }
</style>