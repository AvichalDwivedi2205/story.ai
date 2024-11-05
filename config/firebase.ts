// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getApp, getApps } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore"
import { Story } from "@/schema/schema";


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider()
const firestore = getFirestore(app)

export async function getStoryById(id: string): Promise<Story | null> {
  const storyRef = doc(firestore, 'stories', id);
  const storySnap = await getDoc(storyRef);
  if (storySnap.exists()) {
    return { storyId: storySnap.id, ...storySnap.data() } as Story;
  } else {
    return null;
  }
}

export {app, firestore, auth, googleProvider}