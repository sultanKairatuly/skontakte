import { defineStore } from 'pinia'
import type { Photo } from 'env'

export const usePhotoStore = defineStore('photo', {
    state: () => {
        return {
            photos: JSON.parse(localStorage.getItem('photos') as string) || [] as Array<Photo>
        }
    },
    getters: {},
    actions: {
        setPhoto(photo: Photo){ 
            this.photos.push(photo)
            localStorage.setItem('photos', JSON.stringify(this.photos))
        },
        async likePhoto(){
            
        }
    }
})