import { defineStore } from 'pinia'
import type { Photo } from 'env'
import { db } from '../../firebase'
import {
    getDocs,
    doc,
    updateDoc,
    collection,
    arrayUnion
  } from "firebase/firestore";
import { useAuthStore } from './auth';

export const usePhotoStore = defineStore('photo', {
    state: () => {
        return {
            photos: JSON.parse(localStorage.getItem('photos') as string) || [] as Array<Photo>,
            photoLoading: true
        }
    },
    getters: {},
    actions: {
        async setPhoto(photo: Photo){ 
            this.photos.push(photo)
            const authStore = useAuthStore()
            let docId = "";
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc: any) => {
        const docEmail = doc.data().email;
        if (docEmail === authStore.user.email) {
          docId = doc.id;
        }
      });

    
      await updateDoc(doc(db, "users", docId), {
        photos: arrayUnion(photo)
      });

            localStorage.setItem('photos', JSON.stringify(this.photos))
        },
        async likePhoto(){
            
        },
        async loadPhotos(){
            const authStore = useAuthStore()
            let docId = "";
            const querySnapshot = await getDocs(collection(db, "users"));
            querySnapshot.forEach((doc: any) => {
              const docEmail = doc.data().email;
              if (docEmail === authStore.user.email) {
                this.photos = doc.data().photos 
                this.photoLoading = false
            }
            });
      
        }
    }
})