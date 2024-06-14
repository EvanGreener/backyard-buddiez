import { getApps, initializeApp } from 'firebase/app'

export const firebaseConfig = {
    apiKey: 'AIzaSyBxwhDLvReopj4IAKOU9qknM2nqbSA2M6M',
    authDomain: 'backyard-buddiez.firebaseapp.com',
    projectId: 'backyard-buddiez',
    storageBucket: 'backyard-buddiez.appspot.com',
    messagingSenderId: '944383757019',
    appId: '1:944383757019:web:7b73ef7c7da6c7bc32dafe',
    measurementId: 'G-PECJV453P0',
}

export const firebaseApp =
    getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
