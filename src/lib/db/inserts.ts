import { SupabaseClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { LOGIN_SIGN_UP_ROUTE } from '../routes'
import { db } from './db'
import { sightings, user_daily_challenges, users } from './schema'
import { and, AnyColumn, eq, inArray, sql } from 'drizzle-orm'
import { getDailyChallenges, getUser, getUserDailyChallenges } from './queries'
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
        console.log('Adding new challenges')
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

function increment(column: AnyColumn, value = 1) {
    return sql`${column} + ${value}`
}

export async function addNewSightingAndUpdateDCProgress(
    user: User,
    dcIDs: number[],
    speciesId: string,
    lat: number | undefined,
    long: number | undefined
) {
    const newSighting = await db
        .insert(sightings)
        .values({
            species_id: speciesId,
            user_id: user.id,
            seen_at: new Date(),
            lat: lat,
            long: long,
        })
        .returning()

    const udcs = (await getUserDailyChallenges(user))!
    const udcIDs = udcs.map((udc) => udc.id)
    const dcs = await getDailyChallenges(udcs)

    const dcsInProgress = udcs
        .filter((udc) => {
            const dc = dcs.find((dc) => dc.id == udc.daily_challenge_id)!
            return udc.birds_found < dc.birds_to_find
        })
        .map((udc) => udc.daily_challenge_id)

    const idsUpdated = dcsInProgress.filter((id) => dcIDs.includes(id))

    const newUDCProgress = await db
        .update(user_daily_challenges)
        .set({
            birds_found: increment(user_daily_challenges.birds_found),
        })
        .where(
            and(
                inArray(user_daily_challenges.daily_challenge_id, idsUpdated),
                inArray(user_daily_challenges.id, udcIDs)
            )
        )
        .returning()

    return { newSighting, newUDCProgress }
}
