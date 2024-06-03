import SignUpEmailPassForm from '@/components/SignUpEmailPassForm'
import { AuthContext } from '@/contexts/AuthContext'
import { HOME_ROUTE } from '@/lib/routes'
import { useRouter } from 'next/navigation'
import { useContext, useEffect } from 'react'

export default function SignUpEmail() {
    
    return <SignUpEmailPassForm />
}
