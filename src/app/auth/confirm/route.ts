import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ERROR_ROUTE, HOME_ROUTE } from '@/lib/routes'

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType | null
    const next = HOME_ROUTE

    if (token_hash && type) {
        const supabase = createClient()

        const { error } = await supabase.auth.verifyOtp({
            type,
            token_hash,
        })
        if (!error) {
            // redirect user to specified redirect URL or root of app
            redirect(next)
        } else {
            console.error(error)
            redirect(ERROR_ROUTE)
        }
    } else {
        console.error('Error: Token hash and type need to be supplied')

        redirect(ERROR_ROUTE)
    }
}
