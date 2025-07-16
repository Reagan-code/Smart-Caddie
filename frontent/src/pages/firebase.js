import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCBuHGc9EKIhR9f2redVm_AWj_5JeqOltA",
  authDomain: "golf-75775.firebaseapp.com",
  projectId: "golf-75775",
  storageBucket: "golf-75775.firebasestorage.app",
  messagingSenderId: "826134239856",
  appId: "1:826134239856:web:d688b65929e13af1f532b5",
  measurementId: "G-8VK5WHQRWD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;