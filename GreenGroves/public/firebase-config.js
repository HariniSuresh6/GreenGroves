// Import the functions you need from the SDKs
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDpAEbE_u25Ky9NPdMUx7LZZHun6VKFMZc",
  authDomain: "greengroves-700c4.firebaseapp.com",
  projectId: "greengroves-700c4",
  storageBucket: "greengroves-700c4.appspot.com", // Corrected the storageBucket URL
  messagingSenderId: "180698842303",
  appId: "1:180698842303:web:d51654ec5beb7ce11cf20a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);
