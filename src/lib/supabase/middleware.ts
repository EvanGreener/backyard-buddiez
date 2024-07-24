import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { HOME_ROUTE, LOGIN_SIGN_UP_ROUTE, ROOT } from '../routes'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // IMPORTANT: Avoid writing any logic between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (
        !user &&
        !request.nextUrl.pathname.startsWith(LOGIN_SIGN_UP_ROUTE) &&
        !request.nextUrl.pathname.startsWith('/auth')
    ) {
        const url = request.nextUrl.clone()
        url.pathname = LOGIN_SIGN_UP_ROUTE
        return NextResponse.redirect(url)
    } else if (
        user &&
        (request.nextUrl.pathname.startsWith(LOGIN_SIGN_UP_ROUTE) ||
            request.nextUrl.pathname.startsWith('/auth') ||
            request.nextUrl.pathname == ROOT)
    ) {
        const url = request.nextUrl.clone()
        url.pathname = HOME_ROUTE
        return NextResponse.redirect(url)
    }

    return supabaseResponse
}
