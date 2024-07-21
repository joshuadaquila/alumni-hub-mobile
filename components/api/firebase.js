import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  // apiKey: "YOUR_API_KEY",
  // authDomain: "YOUR_AUTH_DOMAIN",
  // projectId: "ua-alumni-hub",
  // storageBucket: "YOUR_STORAGE_BUCKET",
  // messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  // appId: "YOUR_APP_ID"

  apiKey: "AIzaSyDMIQYBlEEqyTGF-Loji0354JhNqbuo3vA",
  authDomain: "ua-alumni-hub.firebaseapp.com",
  projectId: "ua-alumni-hub",
  storageBucket: "ua-alumni-hub.appspot.com",
  messagingSenderId: "893787350905",
  appId: "1:893787350905:web:a551817751f7daf990f1a8",
  measurementId: "G-RJBKP63E64"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
