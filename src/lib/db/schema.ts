import {
    pgTable,
    pgEnum,
    text,
    timestamp,
    boolean,
    foreignKey,
    bigint,
    smallint,
    varchar,
} from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export const aal_level = pgEnum('aal_level', ['aal1', 'aal2', 'aal3'])
export const code_challenge_method = pgEnum('code_challenge_method', [
    's256',
    'plain',
])
export const factor_status = pgEnum('factor_status', ['unverified', 'verified'])
export const factor_type = pgEnum('factor_type', ['totp', 'webauthn'])
export const one_time_token_type = pgEnum('one_time_token_type', [
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token',
])
export const key_status = pgEnum('key_status', [
    'default',
    'valid',
    'invalid',
    'expired',
])
export const key_type = pgEnum('key_type', [
    'aead-ietf',
    'aead-det',
    'hmacsha512',
    'hmacsha256',
    'auth',
    'shorthash',
    'generichash',
    'kdf',
    'secretbox',
    'secretstream',
    'stream_xchacha20',
])
export const action = pgEnum('action', [
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR',
])
export const equality_op = pgEnum('equality_op', [
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in',
])

export const users = pgTable('users', {
    id: text('id').primaryKey().notNull(),
    created_at: timestamp('created_at', { withTimezone: true, mode: 'string' })
        .defaultNow()
        .notNull(),
    email: text('email'),
    display_name: text('display_name'),
    profile_created: boolean('profile_created').default(false).notNull(),
    dcs_last_updated: timestamp('dcs_last_updated', {
        withTimezone: true,
        mode: 'string',
    }),
})

export const sightings = pgTable('sightings', {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint('id', { mode: 'number' })
        .primaryKey()
        .generatedByDefaultAsIdentity({
            name: 'sightings_id_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 9223372036854775807,
            cache: 1,
        }),
    seen_at: timestamp('seen_at', { withTimezone: true, mode: 'string' })
        .defaultNow()
        .notNull(),
    species_id: text('species_id').notNull(),
    user_id: text('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
})

export const daily_challenges = pgTable('daily_challenges', {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint('id', { mode: 'number' })
        .primaryKey()
        .generatedByDefaultAsIdentity({
            name: 'daily_challenges_id_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 9223372036854775807,
            cache: 1,
        }),
    challenge_text: text('challenge_text').notNull(),
    birds_to_find: smallint('birds_to_find').notNull(),
})

export const user_daily_challenges = pgTable('user_daily_challenges', {
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    id: bigint('id', { mode: 'number' })
        .primaryKey()
        .generatedByDefaultAsIdentity({
            name: 'user_daily_challenges_id_seq',
            startWith: 1,
            increment: 1,
            minValue: 1,
            maxValue: 9223372036854775807,
            cache: 1,
        }),
    user_id: varchar('user_id')
        .notNull()
        .references(() => users.id, { onDelete: 'cascade' }),
    // You can use { mode: "bigint" } if numbers are exceeding js number limitations
    daily_challenge_id: bigint('daily_challenge_id', { mode: 'number' })
        .notNull()
        .references(() => daily_challenges.id, { onDelete: 'set null' }),
    birds_found: smallint('birds_found').default(0).notNull(),
})
