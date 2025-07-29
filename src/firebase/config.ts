import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDdWcO4W7hxSywMzwNq4teDSur0O1YDbKE",
  authDomain: "healthtick-bookings.firebaseapp.com",
  projectId: "healthtick-bookings",
  storageBucket: "healthtick-bookings.firebasestorage.app",
  messagingSenderId: "298611731133",
  appId: "1:298611731133:web:cb7d1afb0c3887e622e5d4",
};

export const app = initializeApp(firebaseConfig);
