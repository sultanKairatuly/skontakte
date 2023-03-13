import { defineStore } from 'pinia'
import { auth, db } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { collection, addDoc, arrayUnion } from "firebase/firestore";
import type { Updates, User } from 'env'
import router from '@/router';
import {
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";


export const useAuthStore = defineStore('auth', {
  state: () => {
    return {
      user: JSON.parse(localStorage.getItem("user") as string) || {},
      loading: false
    }
  },
  getters: {

  },
  actions: {
    async registerUser(user: User){
      const { 
        email, 
        password, 
        name, 
        photoURL,
      } = user;

      try {
        const userCredentilas = await createUserWithEmailAndPassword(
          auth,
          email,
          password,

        );
        await updateProfile(userCredentilas.user, {
          displayName: name,
          photoURL: photoURL || 'https://images.are.na/eyJidWNrZXQiOiJhcmVuYV9pbWFnZXMiLCJrZXkiOiI4MDQwOTc0L29yaWdpbmFsX2ZmNGYxZjQzZDdiNzJjYzMxZDJlYjViMDgyN2ZmMWFjLnBuZyIsImVkaXRzIjp7InJlc2l6ZSI6eyJ3aWR0aCI6MTIwMCwiaGVpZ2h0IjoxMjAwLCJmaXQiOiJpbnNpZGUiLCJ3aXRob3V0RW5sYXJnZW1lbnQiOnRydWV9LCJ3ZWJwIjp7InF1YWxpdHkiOjkwfSwianBlZyI6eyJxdWFsaXR5Ijo5MH0sInJvdGF0ZSI6bnVsbH19?bc=0',
        });
        
        this.user = {
          ...auth.currentUser,
          city: user.city,
          gender: user.gender,
          birthday: user.birthday,
          friends: user.friends
        }
        localStorage.setItem("user", JSON.stringify(this.user));
        await addDoc(collection(db, "users"), {
          name: this.user.displayName,
          email: this.user.email,
          posts: [],
          news: [],
          articles: [],
          photos: [],
          photoURL: this.user.photoURL,
          city: user.city,
          gender: user.gender,
          birthday: user.birthday,
        });
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => {
          if (doc.data().name === this.user.displayName) {
            this.user.photoURL = doc.data().photoURL;
            localStorage.setItem('posts', JSON.stringify(doc.data().posts))
          }
        });
        router.push('/')
      } catch (e) {
        console.log(e);
      }
    },
    async loginUser(payload: Omit<User, "name" | "photoURL" | "city" | "gender" | "birthday">) {
      const { email, password } = payload;
      
      try {
        await signInWithEmailAndPassword(auth, email, password);
        this.user = auth.currentUser;
        console.log(this.user.displayName)
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => {
          console.log(doc)
          if (doc.data().name === this.user.displayName) {
            this.user.photoURL = doc.data().photoURL;
            this.user.gender = doc.data().gender
            this.user.city = doc.data().city
            this.user.birthday = doc.data().birthday
            console.log(this.user)
            localStorage.setItem('posts', JSON.stringify(doc.data().posts))
          }
        });
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
    async addFriend(friends: Array<User>){
      let docId = "";
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc: any) => {
        const docEmail = doc.data().email;
        if (docEmail === this.user.email) {
          docId = doc.id;
        }
      });
    
      await updateDoc(doc(db, "users", docId), {
        friends: friends
      });


      localStorage.setItem('user', JSON.stringify(this.user))
    },
    async refreshUser(){
      let docId = "";
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc: any) => {
        const docEmail = doc.data().email;
        if (docEmail === this.user.email) {
          this.user = {
            ...this.user,
            ...doc.data()
          }

          localStorage.setItem('user', JSON.stringify(this.user))
          localStorage.setItem('posts', JSON.stringify(this.user.posts))
          console.log(this.user.posts)
        }
      });
    },
    async logoutUser() {
      await signOut(auth);
      localStorage.removeItem("user");
      localStorage.removeItem("posts");
      localStorage.removeItem("photos");
      this.user = {};
      router.push("/login");
    },
    async updateUser(updates: Updates){
      let docId = "";
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc: any) => {
        const docEmail = doc.data().email;
        if (docEmail === this.user.email) {
          docId = doc.id;
        }
      });
    
      await updateDoc(doc(db, "users", docId), {
        name: updates.name,
        gender: updates.gender,
        city: updates.city,
        birthday: updates.birthday,
      });

      this.user.displayName = updates.name 
      this.user.city = updates.city
      this.user.birthday = updates.birthday
      this.user.gender = updates.gender

      localStorage.setItem('user', JSON.stringify(this.user))
    }
  }
}
)
