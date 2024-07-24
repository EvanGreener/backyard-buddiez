import {
    daily_challenges,
    sightings,
    user_daily_challenges,
    users,
} from '@/lib/db/schema'
export type User = typeof users.$inferSelect
export type DailyChallenge = typeof daily_challenges.$inferSelect
export type UserDailyChallenge = typeof user_daily_challenges.$inferSelect
export type Sighting = typeof sightings.$inferSelect
