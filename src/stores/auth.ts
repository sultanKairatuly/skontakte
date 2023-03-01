import { defineStore } from 'pinia'
import { auth, db } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import type {User, UserDB } from '../../env.d'
import router from '@/router';

export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      user: JSON.parse(localStorage.getItem("user") as string) || {},
    }
  },
  getters: {

  },
  actions: {
    async registerUser(user: User){
      const { email, password, name, photoURL } = user;

      try {
        const userCredentilas = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        await updateProfile(userCredentilas.user, {
          displayName: name,
          photoURL: photoURL || 'https://images.are.na/eyJidWNrZXQiOiJhcmVuYV9pbWFnZXMiLCJrZXkiOiI4MDQwOTc0L29yaWdpbmFsX2ZmNGYxZjQzZDdiNzJjYzMxZDJlYjViMDgyN2ZmMWFjLnBuZyIsImVkaXRzIjp7InJlc2l6ZSI6eyJ3aWR0aCI6MTIwMCwiaGVpZ2h0IjoxMjAwLCJmaXQiOiJpbnNpZGUiLCJ3aXRob3V0RW5sYXJnZW1lbnQiOnRydWV9LCJ3ZWJwIjp7InF1YWxpdHkiOjkwfSwianBlZyI6eyJxdWFsaXR5Ijo5MH0sInJvdGF0ZSI6bnVsbH19?bc=0',
        });
        this.user = auth.currentUser;
        localStorage.setItem("user", JSON.stringify(this.user));
        await addDoc(collection(db, "users"), {
          name: this.user.displayName,
          email: this.user.email,
          comments: [],
          posts: [],
          photoURL: this.user.photoURL,
          id: uuidv4(),
        });
        router.push('/')
      } catch (e) {
        console.log(e);
      }
    },
    async loginUser(payload: Omit<User, "name" | "photoURL">) {
      const { email, password } = payload;

      try {
        await signInWithEmailAndPassword(auth, email, password);
        this.user = auth.currentUser;
        localStorage.setItem("user", JSON.stringify(this.user));
        router.push("/");
      } catch (e: any) {
        switch (e.code) {
          case "auth/user-not-found":
            console.log("Пользователь не найден")
            break;
          case "auth/wrong-password":
            console.log("Неверный пароль")
            break;
          default:
            console.log("ПНепредвиденная ошибка")
            break;
        }

        return;
      }
    },
    async logoutUser() {
      await signOut(auth);
      localStorage.removeItem("user");
      this.user = {};
      router.push("/login");
    },
  }
}
)
