import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

export const firebaseConfig = {
  apiKey:            'AIzaSyA9OURChaHTSqGbbeufabWOpIyzi6xdrIo',
  authDomain:        'nammadeal-870a6.firebaseapp.com',
  projectId:         'nammadeal-870a6',
  storageBucket:     'nammadeal-870a6.firebasestorage.app',
  messagingSenderId: '325159966469',
  appId:             '1:325159966469:web:9e97193ebf1326e165c96c',
  measurementId:     'G-QMPXFM6584',
};

export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db   = null; // Firestore not used - data stored locally via AsyncStorage
