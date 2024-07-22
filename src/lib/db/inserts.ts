import { SupabaseClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { LOGIN_SIGN_UP_ROUTE } from '../routes'
import { db } from './db'
import { user_daily_challenges, users } from './schema'
import { eq } from 'drizzle-orm'
import { getUser } from './queries'
import { DailyChallenge, User } from '@/types/db-types'
import { shuffle } from '../utils'

export async function checkUserExists(
    supabase: SupabaseClient<any, 'public', any>
) {
    const { data, error } = await supabase.auth.getUser()
    const { user } = data
    if (!error && user) {
        const userDB = await getUser(user.id)

        if (!userDB) {
            // Add new user
            const newUser = await db
                .insert(users)
                .values({
                    id: user.id,
                    email: user.email,
                })
                .returning()
            return newUser[0]
        }

        return userDB
    } else {
        redirect(LOGIN_SIGN_UP_ROUTE)
    }
}

export async function refreshDailyChallenges(user: User) {
    const currentTime = new Date()
    const lastUpdated = user.dcs_last_updated
    const resetTime = new Date(
        Date.UTC(
            currentTime.getUTCFullYear(),
            currentTime.getUTCMonth(),
            currentTime.getUTCDate()
        ) +
            1000 * 60 * 60 * 24
    )

    const lastUpdatedDate = lastUpdated
        ? new Date(
              Date.UTC(
                  lastUpdated.getUTCFullYear(),
                  lastUpdated.getUTCMonth(),
                  lastUpdated.getUTCDate()
              )
          )
        : // Doesn't matter
          new Date(0)

    // console.log(currentTime)
    // console.log(lastUpdated)
    // console.log(resetTime)
    // console.log(lastUpdatedDate)

    if (
        lastUpdated == null ||
        lastUpdatedDate.getTime() + 1000 * 60 * 60 * 24 !== resetTime.getTime()
    ) {
        // add new challenges
        console.log('=-=-=-=-=-=-=-=-=-')
        console.log('DEBUG: adding new challenges')
        console.log('=-=-=-=-=-=-=-=-=-')
        addNewChallenges(user)
    }
}

async function addNewChallenges(user: User) {
    await db
        .update(users)
        .set({ dcs_last_updated: new Date() })
        .where(eq(users.id, user.id))

    const allDailyChallenges: DailyChallenge[] =
        await db.query.daily_challenges.findMany()

    shuffle(allDailyChallenges)

    const newChallenges = allDailyChallenges.slice(0, 3)

    return await db
        .insert(user_daily_challenges)
        .values([
            {
                daily_challenge_id: newChallenges[0].id,
                user_id: user.id,
            },
            {
                daily_challenge_id: newChallenges[1].id,
                user_id: user.id,
            },
            {
                daily_challenge_id: newChallenges[2].id,
                user_id: user.id,
            },
        ])
        .returning()
}
