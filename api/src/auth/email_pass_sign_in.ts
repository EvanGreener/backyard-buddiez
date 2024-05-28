import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

const auth = getAuth()

export default function emailPassSignIn(email: string, password: string) {
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user
            // ...
        })
        .catch((error) => {
            const errorCode = error.code
            const errorMessage = error.message
        })
}
