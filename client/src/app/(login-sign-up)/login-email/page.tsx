import LoginEmailPassForm from '@/components/LoginEmailPassForm'
import SignUpEmailPassForm from '@/components/SignUpEmailPassForm'
import { AuthContext } from '@/contexts/AuthContext'
import { HOME_ROUTE } from '@/lib/routes'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'

export default function LoginEmail() {
    const router = useRouter()
    const currentUser = useContext(AuthContext)

    // useEffect(() => {

    //     // If you're alredy signed in, go to home page
    //     if (currentUser) {
    //         router.push(HOME_ROUTE)
    //     }

    //     // Will redirect if sign in through google was successful
    // }, [])
    return <LoginEmailPassForm />
}
