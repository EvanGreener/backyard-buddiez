import { relations } from "drizzle-orm/relations";
import { users, sightings, daily_challenges, user_daily_challenges } from "./schema";

export const sightingsRelations = relations(sightings, ({one}) => ({
	user: one(users, {
		fields: [sightings.user_id],
		references: [users.id]
	}),
}));

export const usersRelations = relations(users, ({many}) => ({
	sightings: many(sightings),
	user_daily_challenges: many(user_daily_challenges),
}));

export const user_daily_challengesRelations = relations(user_daily_challenges, ({one}) => ({
	daily_challenge: one(daily_challenges, {
		fields: [user_daily_challenges.daily_challenge_id],
		references: [daily_challenges.id]
	}),
	user: one(users, {
		fields: [user_daily_challenges.user_id],
		references: [users.id]
	}),
}));

export const daily_challengesRelations = relations(daily_challenges, ({many}) => ({
	user_daily_challenges: many(user_daily_challenges),
}));