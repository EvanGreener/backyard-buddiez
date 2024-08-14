'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
    CREATE_PROFILE_ROUTE,
    ERROR_ROUTE,
    HOME_ROUTE,
    LOGIN_SIGN_UP_ROUTE,
    ROOT,
} from './routes'
import { checkUserExists } from './db/inserts'

export async function login(formData: FormData) {
    const supabase = createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { data: data2, error } = await supabase.auth.signInWithPassword(data)
    const { user } = data2
    if (error) {
        console.error('Error logging in with email/pass')
        console.error(error)
        redirect(ERROR_ROUTE)
    } else if (!user) {
        console.error('User null')
        redirect(ERROR_ROUTE)
    } else {
        await checkUserExists(user)
        revalidatePath('/', 'layout')
        redirect(HOME_ROUTE)
    }
}

export async function signInGoogle() {
    const supabase = createClient()

    const redirectURL =
        process.env.NODE_ENV === 'development'
            ? 'http://localhost:3000/auth/callback'
            : 'https://backyard-buddiez.vercel.app/auth/callback'

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: redirectURL,
        },
    })

    if (error) {
        console.error('Error signing up with google')
        console.error(error)
        redirect(ERROR_ROUTE)
    } else if (data.url) {
        redirect(data.url) // use the redirect API for your server framework
    }
}

export async function signUpEmail(formData: FormData) {
    const supabase = createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        password2: formData.get('password') as string,
    }

    // Input validation
    const { password, password2 } = data
    if (password !== password2) {
        console.error('Password mismatch')
        redirect(ERROR_ROUTE)
    }

    const { error } = await supabase.auth.signUp(data)

    if (error) {
        console.error('Error signing up with email/pass')
        console.error(error)
        redirect(ERROR_ROUTE)
    }

    revalidatePath('/', 'layout')
    redirect(CREATE_PROFILE_ROUTE)
}

export async function getUserAuth() {
    const supabase = createClient()

    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
        error && console.error(error)
        redirect(LOGIN_SIGN_UP_ROUTE)
    }

    return data.user
}

export async function signOut() {
    const supabase = createClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
        console.error('Error signing out')
        console.error(error)
        redirect(ERROR_ROUTE)
    }
    redirect(ROOT)
}
