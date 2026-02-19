// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-marketplace-1ece1.firebaseapp.com",
  projectId: "mern-marketplace-1ece1",
  storageBucket: "mern-marketplace-1ece1.firebasestorage.app",
  messagingSenderId: "1001609461570",
  appId: "1:1001609461570:web:7b0d44f420f558f16dd2db",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
