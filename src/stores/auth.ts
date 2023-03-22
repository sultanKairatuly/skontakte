import { defineStore } from 'pinia'
import { auth, db } from "../../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import {  } from "firebase/firestore";
import type { Updates, User } from 'env'
import router from '@/router';
import {
  getDocs,
  doc,
  updateDoc,
  collection, addDoc, arrayUnion
} from "firebase/firestore";
import type { UserDB, AddedUser } from 'env'
import { usePhotoStore } from './photo';


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
        });
        
        this.user = {
          ...auth.currentUser,
          city: user.city,
          gender: user.gender,
          birthday: user.birthday,
          friends: user.friends,
          photoURL: photoURL,
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
          friends: [],
          friendRequestTo: [],
          friendRequestFrom: [],
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
    async loginUser(payload: { password: string, email: string }) {
      const { email, password } = payload;
      
      try {
        await signInWithEmailAndPassword(auth, email, password);
        this.user = auth.currentUser;
        this.user.friends = [];
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => {
          console.log(doc)
          if (doc.data().email === this.user.email) {
            this.user.photoURL = doc.data().photoURL;
            this.user.displayName = doc.data().name;
            this.user.gender = doc.data().gender
            this.user.city = doc.data().city
            this.user.birthday = doc.data().birthday
            this.user.friends = doc.data().friends
            this.user.friendRequestFrom = doc.data().friendRequestFrom
            this.user.friendRequestTo = doc.data().friendRequestTo
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
    async addFriend(friend: UserDB){
      let docId1 = "";
      let docId2 = ""
      let friendTo: AddedUser = {} as AddedUser
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc: any) => {
        const docEmail = doc.data().email;
        if (docEmail === this.user.email) {
          docId1 = doc.id;
        }else if(docEmail === friend.email){
          docId2 = doc.id
          friendTo.name = doc.data().name
          friendTo.photoURL = doc.data().photoURL
          friendTo.email = doc.data().email
        }
      });
    
      await updateDoc(doc(db, "users", docId1), {
        friendRequestTo: arrayUnion(friendTo)
      });

      const addedUser: AddedUser = {
        name: this.user.displayName,
        email: this.user.email,
        photoURL: this.user.photoURL,
      }
      await updateDoc(doc(db, "users", docId2), {
        friendRequestFrom: arrayUnion(addedUser)
      });


      this.user.friends.push(friend)
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
      const photosStore = usePhotoStore()
      await photosStore.loadPhotos()
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
    },
    async acceptFriendRequest(friendEmail: string){

      let docId = "";
      let docId2 = ''
      let friend: AddedUser = {} as AddedUser;
      let friendFrom;
      let friendTo;
      let friendFrom2;
      let friendTo2;
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc: any) => {
        const docEmail = doc.data().email;
        if (docEmail === friendEmail) {
          friend = {
            email: doc.data().email,
            name: doc.data().name,
            photoURL: doc.data().photoURL,
          }
          docId2 = doc.id
          friendFrom2 = doc.data().friendRequestFrom.filter( (item: UserDB) => item.email !== this.user.email)
          friendTo2 = doc.data().friendRequestFrom.filter( (item: UserDB) => item.email !== this.user.email)
        }else if(docEmail === this.user.email){
          docId = doc.id
          friendFrom = doc.data().friendRequestFrom.filter( (item: UserDB) => item.email !== friendEmail)
          friendTo = doc.data().friendRequestTo.filter( (item: UserDB) => item.email !== friendEmail)
        }
      });
      await updateDoc(doc(db, "users", docId), {
        friendRequestFrom: friendFrom,
        friendRequestTo: friendTo,
        friends: arrayUnion(friend),

      });


      const addedUser: AddedUser = {
        name: this.user.displayName,
        email: this.user.email,
        photoURL: this.user.photoURL,
      }

      await updateDoc(doc(db, "users", docId2), {
        friendRequestFrom: friendFrom2,
        friendRequestTo: friendTo2,
        friends: arrayUnion(addedUser),

      });
      this.refreshUser()
    },
    async removeFriend(friendEmail: string){
      this.user.friends = this.user.friends.filter((friend: AddedUser) => friend.email !== friendEmail)
      let docId = "";
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc: any) => {
        const docEmail = doc.data().email;
        if (docEmail === this.user.email) {
          docId = doc.id
        }
      });
      await updateDoc(doc(db, "users", docId), {
        friends: this.user.friends
      });
    }
  }
}
)
