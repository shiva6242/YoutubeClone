// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDcyzhkQ25lyuaC4kYzO9HJmWErOp-ndt8",
  authDomain: "video-7c1e5.firebaseapp.com",
  projectId: "video-7c1e5",
  storageBucket: "video-7c1e5.appspot.com",
  messagingSenderId: "1092621762994",
  appId: "1:1092621762994:web:879dcace5430b4e0ada4ab",
  measurementId: "G-MK3ECM2CM4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth()
export const provider=new GoogleAuthProvider()
export default app;