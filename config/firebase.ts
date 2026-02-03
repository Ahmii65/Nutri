// Import the functions you need from the SDKs you need
import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
// @ts-ignore
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDb7HZ-0Um9pQR9e0pK4E1w1oGGEDohKkQ",
  authDomain: "nutri-track-616a1.firebaseapp.com",
  projectId: "nutri-track-616a1",
  storageBucket: "nutri-track-616a1.firebasestorage.app",
  messagingSenderId: "789157451983",
  appId: "1:789157451983:web:185ad31ab015932c59ffba",
  measurementId: "G-FL7T1JY1SZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
// Initialize Firestore with specific settings for React Native
// @ts-ignore
// Note: Standard JS SDK Firestore usually works, but sometimes explicit initialization helps.
// For now keeping simple getFirestore but forcing experimentalLongPolling might be needed if it hangs.
const db = getFirestore(app);

export { auth, db };
