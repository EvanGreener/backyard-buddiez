import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'

const auth = getAuth()

export default function createAccountEmailPass(
    email: string,
    password: string
) {
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            // Signed up
            const user = userCredential.user
            // ...
        })
        .catch((error) => {
            const errorCode = error.code
            const errorMessage = error.message
            // ..
        })
}
