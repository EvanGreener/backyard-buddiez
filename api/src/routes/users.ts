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
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
// Initialize Firebase
// Initialize Cloud Firestore and get a reference to the service
const firebaseApp = initializeApp(firebaseConfig)
const db = getFirestore(firebaseApp)

const provider = new GoogleAuthProvider()
const auth = getAuth()

export let userRouter = express.Router()

const errHandler: ErrorRequestHandler = (error, req, res, next) => {
    // Handle Errors here.
    const errorCode = error.code
    const errorMessage = error.message
    res.status(500).send({ errorCode, errorMessage })
}
userRouter.use(errHandler)

userRouter.post('/sign-in-google', async function (req, res, next) {
    await signInWithRedirect(auth, provider)
    const result = await getRedirectResult(auth)
    try {
        if (result) {
            const credential = GoogleAuthProvider.credentialFromResult(result)

            if (credential) {
                const token = credential.accessToken
                res.send({ accessToken: token })
            }
            res.send({ error: 'Invalid user credentials?' })
        }
        res.send({ error: 'No redirect was called?' })
    } catch (error: any) {
        next(error)
    }
})
userRouter.post('/sign-up', async function (req, res, next) {
    const { email, password } = req.body
    try {
        await createUserWithEmailAndPassword(auth, email, password)
        res.send('Sign up successful')
    } catch (error: any) {
        next(error)
    }
})

userRouter.post('/sign-in', async function (req, res, next) {
    const { email, password } = req.body
    try {
        await signInWithEmailAndPassword(auth, email, password)
        res.send('Sign in successful')
    } catch (error: any) {
        next(error)
    }
})

userRouter.post('/sign-out', function (req, res, next) {
    try {
        signOut(auth)
        res.send('Sign out successful')
    } catch (error) {
        next(error)
    }
})
