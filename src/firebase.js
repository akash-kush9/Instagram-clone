import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyBNhPhrVCi68sOJ76UQQzoC3YHISsH7XVY",
  authDomain: "insta-clone-eb154.firebaseapp.com",
  databaseURL: "https://insta-clone-eb154.firebaseio.com",
  projectId: "insta-clone-eb154",
  storageBucket: "insta-clone-eb154.appspot.com",
  messagingSenderId: "768278952248",
  appId: "1:768278952248:web:28a86514150c71e62da9cd",
  measurementId: "G-MGFDLT9Y6R",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
