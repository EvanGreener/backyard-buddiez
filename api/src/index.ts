import express, { Express } from 'express'
import dotenv from 'dotenv'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
import { authRouter } from './routes/auth'
import { dailyChallengeRouter } from './routes/dailyChallenge'
import bodyParser from 'body-parser'

console.log('test')

// Initialize server
dotenv.config()

const app: Express = express()

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.use('/auth', authRouter)
app.use('/dailyChallenge', dailyChallengeRouter)

const port = process.env.PORT || 7777

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`)
})
