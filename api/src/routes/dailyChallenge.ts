import express from 'express'

export let dailyChallengeRouter = express.Router()

/* GET users listing. */
dailyChallengeRouter.get('/', function (req, res, next) {
    res.send('respond with a resource')
})
