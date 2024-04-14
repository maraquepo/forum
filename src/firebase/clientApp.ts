// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBPCcGBDRnX67ElvcbgEdClH1RHwQfoIzQ",
  authDomain: "forum-9b949.firebaseapp.com",
  projectId: "forum-9b949",
  storageBucket: "forum-9b949.appspot.com",
  messagingSenderId: "177765753804",
  appId: "1:177765753804:web:b536fede00858eacbf3369",
  measurementId: "G-SLD7MY5CMD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
