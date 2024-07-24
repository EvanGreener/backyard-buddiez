import {
    DailyChallenge,
    Sighting,
    User,
    UserDailyChallenge,
} from '@/types/db-types'
import { db } from './db'
import { and, asc, desc, eq, inArray, sql } from 'drizzle-orm'
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

export async function getNumCompletedChallenges(user: User) {
    return await db
        .select({
            count: sql<number>`cast(count(${user_daily_challenges.id}) as int)`,
        })
        .from(user_daily_challenges)
        .innerJoin(
            daily_challenges,
            eq(user_daily_challenges.daily_challenge_id, daily_challenges.id)
        )
        .where(
            and(
                eq(user_daily_challenges.user_id, user.id),
                eq(
                    user_daily_challenges.birds_found,
                    daily_challenges.birds_to_find
                )
            )
        )
        .limit(1)
}

export async function getNumSpeciesIdentified(user: User) {
    return await db
        .select({
            speciesId: sightings.species_id,
        })
        .from(sightings)
        .groupBy(sightings.species_id)
        .where(eq(sightings.user_id, user.id))
}

export async function getTopXGlobal(x: number = 50) {
    const usersCompletedChallenges = db
        .select({
            user_id: user_daily_challenges.user_id,
            challenge_count: sql<number>`cast(count(*) as int)`.as(
                'challenge_count'
            ),
        })
        .from(user_daily_challenges)
        .innerJoin(
            daily_challenges,
            eq(user_daily_challenges.daily_challenge_id, daily_challenges.id)
        )
        .groupBy(user_daily_challenges.user_id)
        .where(
            eq(
                user_daily_challenges.birds_found,
                daily_challenges.birds_to_find
            )
        )
        .as('sq0')

    const sq2 = db
        .select({
            user_id: users.id,
            display_name: users.display_name,
            species_id: sightings.species_id,
        })
        .from(users)
        .leftJoin(sightings, eq(users.id, sightings.user_id))
        .groupBy(users.id, users.display_name, sightings.species_id)
        .as('sq2')

    const usersSpeciesIDd = db
        .select({
            user_id: sq2.user_id,
            display_name: sq2.display_name,
            species_count:
                sql<number>`cast(count(${sq2.species_id}) as int)`.as(
                    'species_count'
                ),
        })
        .from(sq2)
        .groupBy(sq2.user_id, sq2.display_name)
        .as('sq1')

    return await db
        .select({
            user_id: usersCompletedChallenges.user_id,
            display_name: usersSpeciesIDd.display_name,
            species_count: usersSpeciesIDd.species_count,
            challenge_count: usersCompletedChallenges.challenge_count,
            total_points: sql<number>`${usersSpeciesIDd.species_count} + ${usersCompletedChallenges.challenge_count}`,
        })
        .from(usersCompletedChallenges)
        .rightJoin(
            usersSpeciesIDd,
            eq(usersCompletedChallenges.user_id, usersSpeciesIDd.user_id)
        )
        .orderBy(
            asc(
                sql<number>`${usersSpeciesIDd.species_count} + ${usersCompletedChallenges.challenge_count}`
            )
        )
        .limit(x)
}
