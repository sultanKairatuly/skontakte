import { ref } from 'vue'
import {
  getDocs,
  doc,
  updateDoc,
  collection,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useAuthStore } from '@/stores/auth';

export function useImageGetter() {
  const store = useAuthStore()

    const getImageUrl = (name: string) => {
      return new URL(name, import.meta.url).href;
    };
  
    const includes = <T, K extends keyof T>(item: T & {[key: string]: any}, where: Array<T>, propName: K) => {
      return where.filter((el) => {
        return el[propName] === item[propName] // Type 'C' cannot be used to index type 'T'.ts(2536)
      }).length !== 0
    }

    
    const imageUrl = ref<string>("");
    const image = ref<string>("");
    function onFilePicked(event: any): void {
      const target = event?.target;
      if (target) {
        const files = [target][0].files;
        let filename = files[0].name;
        const fileReader = new FileReader();
        fileReader.addEventListener("load", async () => {
          imageUrl.value = fileReader.result as string;
          store.user.photoURL = imageUrl.value;
          localStorage.setItem("user", JSON.stringify(store.user));
          let docId = "";
          const querySnapshot = await getDocs(collection(db, "users"));
          querySnapshot.forEach((doc: any) => {
            const docEmail = doc.data().email;
            if (docEmail === store.user.email) {
              docId = doc.id;
            }
          });

          await updateDoc(doc(db, "users", docId), {
            photoURL: imageUrl.value,
          });
        });
        fileReader.readAsDataURL(files[0]);
        image.value = files[0];
      }
    }

    function changeProfilePhoto(): void {
      const fileInput = document.createElement("input");
      fileInput.setAttribute("type", "file");
      fileInput.click();
      fileInput.addEventListener("change", onFilePicked);
    }

    function timeSince(date: number): string {

      var seconds = Math.floor(((new Date() as unknown as number) - date) / 1000);
      
      var interval: number = seconds / 31536000;
      
      if (interval > 1) {
        return Math.floor(interval) + " years";
      }
      interval = seconds / 2592000;
      if (interval > 1) {
        return Math.floor(interval) + " months";
      }
      interval = seconds / 86400;
      if (interval > 1) {
        return Math.floor(interval) + " days";
      }
      interval = seconds / 3600;
      if (interval > 1) {
        return Math.floor(interval) + " hours";
      }
      interval = seconds / 60;
      if (interval > 1) {
        return Math.floor(interval) + " minutes";
      }
      return Math.floor(seconds) + " seconds";
      }


    return {
      getImageUrl,
      includes,
      changeProfilePhoto,
      timeSince
    };
  }