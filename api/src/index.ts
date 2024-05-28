import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'
import { firebaseConfig } from '../firebase-config'
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig)
// const analytics = getAnalytics(firebaseApp)

// Initialize server
dotenv.config()

const app: Express = express()
const port = process.env.PORT || 7777

app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server')
})

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`)
})
