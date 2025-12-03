// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAV0py9cg5Hh8kX6b9dAObBGwNdJfloTHE",
  authDomain: "cruise-fbc86.firebaseapp.com",
  projectId: "cruise-fbc86",
  storageBucket: "cruise-fbc86.firebasestorage.app",
  messagingSenderId: "671166982630",
  appId: "1:671166982630:web:e89df3d9138f8872f48e27",
  measurementId: "G-CXVLM231LY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };