import { defineStore } from 'pinia'
import type { Post, UserDB } from 'env'
import { useAuthStore } from './auth'
import { db } from "../../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

export const usePostStore = defineStore('post', {
    state: () => {
      return {
        posts: JSON.parse(localStorage.getItem('posts') as string) || [] as Array<Post>,
      }
    },
    getters: {
  
    },
    actions: {
      setPost(post: Post){
        this.posts.push(post)
        localStorage.setItem('posts', JSON.stringify(this.posts))
      },
      async likePost(post: Post, index: number) {
        const authStore = useAuthStore()
        this.posts = this.posts.map( (item: Post) => {
          if(item.id === post.id){
            return {
              ...item,
              likes: item.likes + 1
            }
          }else{
            return item
          }
        })
        let docId = ''
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach( (doc: any) => {
            const docEmail = doc.data().email
            if(docEmail === authStore.user.email){
                docId = doc.id
            }
        })
        await updateDoc(doc(db, "users", docId), {
            posts: this.posts
        });
      },
      commentPost(postId: string){

      }
    }
  }
  )
  