
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth"; 
import {getFirestore} from 'firebase/firestore';
import { getStorage } from "firebase/storage";
import { setPersistence, browserLocalPersistence } from "firebase/auth";
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

export default app;

const auth = getAuth(app);
const storage = getStorage(app);


setPersistence(auth, browserLocalPersistence).catch((error) => {
  console.error("Error setting persistence:", error);
});


// Función para suscribirse a los cambios de autenticación
const authStateChanged = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, (user) => {
  
    callback(user);
  });
};


export const db = getFirestore(app);
export { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, authStateChanged, storage };
