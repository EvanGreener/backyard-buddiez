import type { NextRequest } from 'next/server'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { homeRoute, loginEmailRoute, signUpEmailRoute } from '@/lib/routes'
import { firebaseApp } from '@/config/firebase-config'

export function middleware(request: NextRequest) {
    const auth = getAuth(firebaseApp)

    auth.onAuthStateChanged((currentUser) => {
        console.log(`currentUser: ${currentUser}`)

        // If user isnt on one of the login or sign up pages, redirect them to the root
        if (
            !currentUser &&
            !(
                request.nextUrl.pathname.startsWith('/') ||
                request.nextUrl.pathname.startsWith(loginEmailRoute) ||
                request.nextUrl.pathname.startsWith(signUpEmailRoute)
            )
        ) {
            return Response.redirect(new URL('/', request.url))
        } else if (currentUser && request.nextUrl.pathname.startsWith('/')) {
            return redirectToHomePage(request)
        } else if (
            currentUser &&
            request.nextUrl.pathname.startsWith(loginEmailRoute)
        ) {
            return redirectToHomePage(request)
        } else if (
            currentUser &&
            request.nextUrl.pathname.startsWith(signUpEmailRoute)
        ) {
            return redirectToHomePage(request)
        }
    })
}

function redirectToHomePage(request: NextRequest) {
    return Response.redirect(new URL(homeRoute, request.url))
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
