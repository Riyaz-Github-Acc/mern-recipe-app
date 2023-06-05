import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "mern-recipe-app.firebaseapp.com",
  projectId: "mern-recipe-app",
  storageBucket: "mern-recipe-app.appspot.com",
  messagingSenderId: "396671767937",
  appId: "1:396671767937:web:b6e25730830723ce3b0480",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
