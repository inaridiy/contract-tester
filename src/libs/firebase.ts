import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAxXYkN06iWRs6yS_2sl3_5FpMkQAN0YDg",
  authDomain: "master-panel-845d7.firebaseapp.com",
  projectId: "master-panel-845d7",
  storageBucket: "master-panel-845d7.appspot.com",
  messagingSenderId: "851907703336",
  appId: "1:851907703336:web:942eedc84f61c57831fb1d",
  measurementId: "G-Q7G6V5D1M3",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { db, analytics };
