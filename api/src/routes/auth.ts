import express, { ErrorRequestHandler } from 'express'
import {
    GoogleAuthProvider,
    signInWithRedirect,
    getAuth,
    getRedirectResult,
    signOut,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from 'firebase/auth'

import { firebaseConfig } from '../../firebase-config'
import { getFirestore } from 'firebase/firestore'

var admin = require('firebase-admin')
var serviceAccount = require('../../backyard-buddiez-firebase-adminsdk-o4axt-f7dec846e5.json')
// Initialize Firebase
const firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
})

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(firebaseApp)

const provider = new GoogleAuthProvider()
const auth = getAuth()

export let authRouter = express.Router()

const errHandler: ErrorRequestHandler = (error, req, res, next) => {
    // Handle Errors here.
    const errorCode = error.code
    const errorMessage = error.message
    res.status(500).send({ errorCode, errorMessage })
}
authRouter.use(errHandler)

authRouter.post('/sign-in-google', async function (req, res, next) {
    await signInWithRedirect(auth, provider)
    const result = await getRedirectResult(auth)
    try {
        if (result) {
            const credential = GoogleAuthProvider.credentialFromResult(result)

            if (credential) {
                const token = credential.accessToken
                res.send({ googleAccessToken: token })
            }
            res.send({ error: 'Invalid user credentials?' })
        }
        res.send({ error: 'No redirect was called?' })
    } catch (error: any) {
        next(error)
    }
})
authRouter.post('/sign-up', async function (req, res, next) {
    console.log(req.body)
    const { email, password } = req.body
    try {
        const credential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        )
        res.send({ idToken: credential.user.getIdToken() })
    } catch (error: any) {
        next(error)
    }
})

authRouter.post('/sign-in', async function (req, res, next) {
    const { email, password } = req.body
    try {
        const credential = await signInWithEmailAndPassword(
            auth,
            email,
            password
        )

        res.send({ idToken: credential.user.getIdToken() })
    } catch (error: any) {
        next(error)
    }
})

authRouter.post('/sign-out', function (req, res, next) {
    try {
        signOut(auth)
        res.send('Sign out successful')
    } catch (error) {
        next(error)
    }
})

authRouter.post('/authenticate', function (req, res, next) {
    try {
        signOut(auth)
        res.send('Sign out successful')
    } catch (error) {
        next(error)
    }
})
