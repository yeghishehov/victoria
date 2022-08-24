import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDu87wIb14KW9mY8_DP2Q83nioulFJmXzU',
  authDomain: 'victoria-stock.firebaseapp.com',
  projectId: 'victoria-stock',
  storageBucket: 'victoria-stock.appspot.com',
  messagingSenderId: '153836916677',
  appId: '1:153836916677:web:2c354f15bc8714916185ac',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
