import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult, signOut, User } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project"}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project"}.firebasestorage.app`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "demo-app-id",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

const provider = new GoogleAuthProvider();

export function signInWithGoogle() {
  return signInWithRedirect(auth, provider);
}

export function handleRedirectResult() {
  return getRedirectResult(auth);
}

export function signOutUser() {
  return signOut(auth);
}

export type { User };
