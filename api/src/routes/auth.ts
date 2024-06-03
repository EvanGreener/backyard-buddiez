import dotenv from 'dotenv'

// Initialize server
dotenv.config()

// Initialize Firebase admin sdk
var admin = require('firebase-admin')
var serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT!)
const firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
})
