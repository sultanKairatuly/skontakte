import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
export const myFunction = functions.firestore
  .document("myCollection/{documentId}")
  .onWrite((change, context) => {
    console.log('dddddawd12')
  });
