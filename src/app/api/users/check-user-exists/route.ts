import { checkUserExists } from '@/lib/db/inserts'
import { createClient } from '@/lib/supabase/server'
import { AuthError } from '@supabase/supabase-js'

export async function GET() {
    const res = await checkUserExists()

    if (res instanceof AuthError) {
        console.error('Error checkUserExists')
        console.error(res)
        return Response.json('Authentication error', { status: 400 })
    } else {
        return Response.json({ res }, { status: 200 })
    }
}
