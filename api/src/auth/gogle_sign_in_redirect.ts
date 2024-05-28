import { GoogleAuthProvider, signInWithRedirect, getAuth } from 'firebase/auth'

const provider = new GoogleAuthProvider()
const auth = getAuth()

export default function signInWithGoogle() {
    signInWithRedirect(auth, provider)
}
