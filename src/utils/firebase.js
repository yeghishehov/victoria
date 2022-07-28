import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA9uKvWNnHSoA9zSZVZFxKSsYukf-R4V7w",
  authDomain: "victoria-a93ce.firebaseapp.com",
  projectId: "victoria-a93ce",
  storageBucket: "victoria-a93ce.appspot.com",
  messagingSenderId: "1017090600868",
  appId: "1:1017090600868:web:a0ff81b3c1ae7984a69b31"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
