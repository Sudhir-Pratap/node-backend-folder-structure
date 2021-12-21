/* NPM modules import */

const express = require('express')
const dotenv = require('dotenv')
dotenv.config({ path: '../config/config.env' })
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const mongoSanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')
const cors = require('cors')

/* File imports */
const userRoutes = require('../routers/userRoutes')
const globalErrHandler = require('../controllers/errorController')
const AppError = require('../utils/errorResponse')
const connectDB = require('../config/db')

const app = express()

/* Middleware */

// Allow Cross-Origin requests
app.use(cors())

// Set security HTTP headers
app.use(helmet())

// Limit request from the same API
const limiter = rateLimit({
    max: 150,
    windowMs: 60 * 60 * 1000,
    message: 'Too Many Request from this IP, please try again in an hour',
})
app.use('/api', limiter)

// Body parser, reading data from body into req.body
app.use(
    express.json({
        limit: '15kb',
    })
)

// Data sanitization against NoSQL query injection
app.use(mongoSanitize())

// Data sanitization against XSS(clean user input from malicious HTML code)
app.use(xss())

// Prevent parameter pollution
app.use(hpp())

// Routes
app.use('/api/v1/users', userRoutes)

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

// handle undefined Routes
app.use('*', (req, res, next) => {
    const err = new AppError(404, 'fail', 'undefined route')
    next(err, req, res, next)
})

// const database = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD)

// connectDB(database)
connectDB(process.env.DATABASE)

app.use(globalErrHandler)

// app.use((req, res, next) => {
//     req.identifier = uuid()
//     const logString = `a request has been made with the following uuid [${req.identifier}] ${req.url} ${
//         req.headers['user-agent']
//     } ${JSON.stringify(req.body)}`
//     console.log(logString, 'info')
//     next()
// })

module.exports = app
