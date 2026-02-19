import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_apiKey,
  authDomain: import.meta.env.VITE_authDomain,
  projectId: import.meta.env.VITE_projectId,
  storageBucket: import.meta.env.VITE_storageBucket,
  messagingSenderId: import.meta.env.VITE_messagingSenderId,
  appId: import.meta.env.VITE_appId,
  measurementId: import.meta.env.VITE_measurementId
};

//For debugging: Log the config object to verify env variables are loaded.
//console.log("PropPlug Firebase Config:", firebaseConfig);

// Explicit check for missing API key to give a clear error
if (!firebaseConfig.apiKey) {
  console.error("CRITICAL: Firebase API Key is missing/undefined. Check your .env file variable names.");
}

let app;
try {
  // Check if an app is already initialized to prevent "Duplicate App" errors during hot reloads
  if (getApps().length > 0) {
    app = getApp();
  } else {
    app = initializeApp(firebaseConfig);
  }
} catch (e) {
  console.error("!!! FIREBASE INITIALIZATION FAILED !!!", e);
  throw new Error(`Firebase initialization failed. This almost always means your config values (API key, auth domain, etc.) are incorrect. Please check them in your .env file and in the Firebase console. The original error was: ${e.message}`);
}

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;