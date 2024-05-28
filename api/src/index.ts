import express, { Express } from 'express'
import dotenv from 'dotenv'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
import { userRouter } from './routes/users'
import { dailyChallengeRouter } from './routes/dailyChallenge'

console.log('test')



// Initialize server
dotenv.config()

const app: Express = express()

app.use('/user', userRouter)
app.use('/dailyChallenge', dailyChallengeRouter)

const port = process.env.PORT || 7777

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`)
})
