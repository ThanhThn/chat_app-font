import { initializeApp } from "firebase/app";
import { getDatabase, onChildChanged, onValue, ref, set } from "firebase/database";
import path from "path";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
}

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const sendData = (path: string, data: any) => {
    set(ref(database, path), data);
}

const getData = (path: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        onValue(ref(database, path), (snapshot) => {
            resolve(snapshot.val());
        }, (error) => {
            reject(error);
        });
    });
}

const onChange = (path: string, callback: (snapshot: any) => void) => {
    onValue(ref(database, path), callback);
}

export { database, sendData, getData, onChange };
