// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCe9C8JGzKLwBCP7K4HSRleZHcCwGd91iI",
  authDomain: "d-bot-a8646.firebaseapp.com",
  projectId: "d-bot-a8646",
  storageBucket: "d-bot-a8646.firebasestorage.app",
  messagingSenderId: "457794456593",
  appId: "1:457794456593:web:6f9772ea98746dce5eb5b0",
  measurementId: "G-C24ZZ8QCPD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, analytics, auth, googleProvider };

