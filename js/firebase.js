// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCrpD5p89CKebHpHD7FmbkozUveJTatlew",
  authDomain: "corestore-31be1.firebaseapp.com",
  databaseURL: "https://corestore-31be1-default-rtdb.firebaseio.com",
  projectId: "corestore-31be1",
  storageBucket: "corestore-31be1.firebasestorage.app",
  messagingSenderId: "1029361023884",
  appId: "1:1029361023884:web:f6f5025f8f477e1ba574a9",
  measurementId: "G-BQT65M6HJ0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
