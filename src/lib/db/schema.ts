import { relations } from 'drizzle-orm'
import {
    pgTable,
    serial,
    varchar,
    boolean,
    integer,
    timestamp,
} from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
    id: varchar('id', { length: 64 }).primaryKey(),
    email: varchar('email', { length: 64 }),
    displayName: varchar('display_name', { length: 32 }),
    createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
    profiledCreated: boolean('profile_created').default(false).notNull(),
})

export const usersRelations = relations(users, ({ many }) => ({
    sightings: many(sightings, { relationName: 'sightings' }),
    userDailyChallenges: many(userDailyChallenges, {
        relationName: 'user_daily_challenges',
    }),
}))

export const sightings = pgTable('sightings', {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    speciesID: varchar('species_id', { length: 8 }).notNull(),
    seenAt: timestamp('seen_at', { mode: 'date' }).defaultNow().notNull(),
})

export const dailyChallenges = pgTable('daily_challenges', {
    id: serial('id').primaryKey(),
    challengeText: varchar('challenge_text', { length: 256 }).notNull(),
    birdsToFind: integer('birds_to_find').notNull(),
})

export const dailyChallengeRelation = relations(
    dailyChallenges,
    ({ many }) => ({
        userDailyChallenges: many(userDailyChallenges),
    })
)

export const userDailyChallenges = pgTable('user_daily_challenges', {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
        .references(() => users.id, { onDelete: 'cascade' })
        .notNull(),
    dailyChallengeId: integer('daily_challenge_id')
        .references(() => dailyChallenges.id, { onDelete: 'set null' })
        .notNull(),
    birdsFound: integer('birds_found').default(0).notNull(),
})
