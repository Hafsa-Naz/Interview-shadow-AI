import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "./firebase";
import { isFirebaseConfigured } from "./firebase";

const demoUserKey = "interview-shadow-demo-user";
const demoAuthEvent = "interview-shadow-demo-auth";

const demoUser = (email) => ({ uid: "demo-user", email, getIdToken: async () => null });

export const registerUser = (email, password) => {
  if (isFirebaseConfigured) return createUserWithEmailAndPassword(auth, email, password);
  if (password.length < 6) return Promise.reject(new Error("Password must contain at least 6 characters."));
  localStorage.setItem(demoUserKey, email);
  window.dispatchEvent(new Event(demoAuthEvent));
  return Promise.resolve({ user: demoUser(email) });
};

export const loginUser = (email, password) => {
  if (isFirebaseConfigured) return signInWithEmailAndPassword(auth, email, password);
  if (!email || !password) return Promise.reject(new Error("Enter an email and password to continue."));
  localStorage.setItem(demoUserKey, email);
  window.dispatchEvent(new Event(demoAuthEvent));
  return Promise.resolve({ user: demoUser(email) });
};

export const logoutUser = () => {
  if (isFirebaseConfigured) return signOut(auth);
  localStorage.removeItem(demoUserKey);
  window.dispatchEvent(new Event(demoAuthEvent));
  return Promise.resolve();
};

export const subscribeToAuth = (callback) => {
  if (isFirebaseConfigured) return onAuthStateChanged(auth, callback);
  const notify = () => callback(localStorage.getItem(demoUserKey) ? demoUser(localStorage.getItem(demoUserKey)) : null);
  notify();
  window.addEventListener(demoAuthEvent, notify);
  return () => window.removeEventListener(demoAuthEvent, notify);
};
