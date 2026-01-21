// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged as firebaseOnAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Import the functions you need from the SDKs you need

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const realAuth = getAuth(app);
const isMockMode = !firebaseConfig.apiKey || firebaseConfig.apiKey === "your_real_api_key" || firebaseConfig.apiKey.includes("xxxx");

if (isMockMode) {
  console.warn("Firebase API key is a placeholder. Initializing in MOCK MODE.");
}

// Mock Storage
let mockUser = null;
const mockListeners = new Set();

// Proxied Auth Object
export const auth = new Proxy(realAuth, {
  get(target, prop) {
    if (isMockMode) {
      if (prop === "currentUser") return mockUser;
      if (prop === "onAuthStateChanged") {
        return (callback) => {
          mockListeners.add(callback);
          setTimeout(() => callback(mockUser), 100);
          return () => mockListeners.delete(callback);
        };
      }
      if (prop === "signOut") {
        return async () => {
          mockUser = null;
          mockListeners.forEach(cb => cb(null));
        };
      }
    }
    return target[prop];
  }
});

export const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: "select_account"
});

// Mock Auth Functions
export const mockCreateUserWithEmailAndPassword = async (authInstance, email, password) => {
  console.log("Mock Signup:", email);
  mockUser = {
    email,
    displayName: "",
    uid: "mock-uid-" + email,
    getIdToken: async () => "mock-token-" + email
  };
  mockListeners.forEach(cb => cb(mockUser));
  return { user: mockUser };
};

export const mockSignInWithEmailAndPassword = async (authInstance, email, password) => {
  console.log("Mock Login:", email);
  mockUser = {
    email,
    displayName: "Test User",
    uid: email === "admin@example.com" ? "mock-admin-uid" : "mock-uid-" + email,
    getIdToken: async () => email === "admin@example.com" ? "mock-admin-token" : "mock-token-" + email
  };
  mockListeners.forEach(cb => cb(mockUser));
  return { user: mockUser };
};

export const mockUpdateProfile = async (user, data) => {
  if (user === mockUser) {
    mockUser.displayName = data.displayName;
    mockListeners.forEach(cb => cb({ ...mockUser }));
  }
  return;
};

// Common functions that handle both real/mock
export const onAuthStateChanged = (authInstance, callback) => {
  return authInstance.onAuthStateChanged(callback);
};

export const signOut = async (authInstance) => {
  await authInstance.signOut();
};

export { isMockMode };