import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase configuration retrieved from SDK config
const firebaseConfig = {
  apiKey: "AIzaSyBKkUmf6G0CZcesrsXcOlL0PgPH_gzWMrs",
  authDomain: "gratitude-garden-vijet-2026.firebaseapp.com",
  projectId: "gratitude-garden-vijet-2026",
  storageBucket: "gratitude-garden-vijet-2026.firebasestorage.app",
  messagingSenderId: "883115843504",
  appId: "1:883115843504:web:66a46efdd21701f1934075"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and export db service
export const db = getFirestore(app);
