// Import the functions you need from the SDKs you need
// import { getAnalytics } from "firebase/analytics";

// const analytics = getAnalytics(app);

import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
    apiKey: "AIzaSyBs7h6aCOcjDuRDowR2gUy-FogBqHI-QBU",
    authDomain: "naft-559f7.firebaseapp.com",
    projectId: "naft-559f7",
    storageBucket: "naft-559f7.appspot.com",
    messagingSenderId: "96477081373",
    appId: "1:96477081373:web:d2394e9cf94b13418ffbf4",
    measurementId: "G-1PWXJ5FRZP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);