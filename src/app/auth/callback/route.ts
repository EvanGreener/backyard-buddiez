import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/lib/supabase/server'
import { ERROR_ROUTE, HOME_ROUTE } from '@/lib/routes'
import { checkUserExists } from '@/lib/db/inserts'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? HOME_ROUTE

    if (code) {
        const supabase = createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            return NextResponse.redirect(`${origin}${next}`)
        } else {
            console.error(error)
            redirect(ERROR_ROUTE)
        }
    } else {
        console.error('Error: code not supplied')
        return NextResponse.redirect(`${origin}${ERROR_ROUTE}`)
    }
}
