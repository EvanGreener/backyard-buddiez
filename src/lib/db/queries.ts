import { db } from './db'

export async function getUser(id: string) {
    return await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.id, id),
    })
}
