// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "@firebase/firestore"
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWU5mfJAg37GBY961hkCGrmmAUORJmqnw",
  authDomain: "weather-chatbot-232b8.firebaseapp.com",
  projectId: "weather-chatbot-232b8",
  storageBucket: "weather-chatbot-232b8.appspot.com",
  messagingSenderId: "441816577712",
  appId: "1:441816577712:web:58487dd5c177f039752d75",
  measurementId: "G-J3HNL8982M"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const firestore = getFirestore(app);
export const auth = getAuth(app);