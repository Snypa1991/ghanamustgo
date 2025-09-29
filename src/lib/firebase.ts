
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  "projectId": "studio-8918059625-dfdab",
  "appId": "1:655937884691:web:b051ed17ed331cdb82e5e6",
  "apiKey": "AIzaSyB5ii8Kpu6e4pGhVhfnkj3obUSIJB-IpgE",
  "authDomain": "studio-8918059625-dfdab.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "655937884691"
};

// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
