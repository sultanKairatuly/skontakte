import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { collection } from 'firebase/firestore'
const firebaseConfig = {
  apiKey: "AIzaSyDU5FEq3CVmPchH-ViZaqPr0NsvMX6Tifo",
  authDomain: "skontakte-25a25.firebaseapp.com",
  projectId: "skontakte-25a25",
  storageBucket: "skontakte-25a25.appspot.com",
  messagingSenderId: "440497654865",
  appId: "1:440497654865:web:bd3572931c04f7d599bc70",
  measurementId: "G-YCB80L3XX9"
};
// const functions = require('firebase-functions');

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app)

export { auth, db }

