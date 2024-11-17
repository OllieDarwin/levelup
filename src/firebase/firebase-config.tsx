import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

//GetAuth Method is used to Configure our app to use Firebase Authentication
import { getAuth } from "firebase/auth"

const firebaseConfig = {
    apiKey: import.meta.env.VITE_APIKEY,
    authDomain: import.meta.env.VITE_AUTHDOMAIN,
    projectId: import.meta.env.VITE_PROJECTID,
    storageBucket: import.meta.env.VITE_STORAGEBUCKET,
    messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
    appId: import.meta.env.VITE_APPID,
    measurementId: import.meta.env.VITE_MEASUREMENTID
  };


const app = initializeApp(firebaseConfig)

export const db = getFirestore(app)
export const auth = getAuth(app)