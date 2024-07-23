import {
    DailyChallenge,
    Sighting,
    User,
    UserDailyChallenge,
} from '@/types/db-types'
import { db } from './db'
import { desc, eq, inArray } from 'drizzle-orm'
import {
    daily_challenges,
    sightings,
    user_daily_challenges,
    users,
} from './schema'

export async function getUser(id: string): Promise<User | undefined> {
    return await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, id),
    })
}

export async function getUserDailyChallenges(
    user: User
): Promise<UserDailyChallenge[] | undefined> {
    return await db.query.user_daily_challenges.findMany({
        where: eq(user_daily_challenges.user_id, user.id),
        orderBy: [desc(user_daily_challenges.id)],
        limit: 3,
    })
}

export async function getDailyChallenges(
    user_daily_challenges: UserDailyChallenge[]
): Promise<DailyChallenge[]> {
    const ids = user_daily_challenges.map((udc) => {
        return udc.daily_challenge_id
    })

    return await db.query.daily_challenges.findMany({
        where: inArray(daily_challenges.id, ids),
    })
}

export async function getAllUserSightings(user: User): Promise<Sighting[]> {
    return await db.query.sightings.findMany({
        where: eq(sightings.user_id, user.id),
    })
}
