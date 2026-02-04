import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
// @ts-ignore
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDb7HZ-0Um9pQR9e0pK4E1w1oGGEDohKkQ",
  authDomain: "nutri-track-616a1.firebaseapp.com",
  projectId: "nutri-track-616a1",
  storageBucket: "nutri-track-616a1.firebasestorage.app",
  messagingSenderId: "789157451983",
  appId: "1:789157451983:web:185ad31ab015932c59ffba",
  measurementId: "G-FL7T1JY1SZ",
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);

export { auth, db };
