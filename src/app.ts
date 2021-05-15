import express from 'express'
import morgan from 'morgan'
import cors from 'cors'

import routes from './routes'
import { ErrorHandler } from './modules/common/middlewares/ErrorHandler'

const app = express()

app.use(express.json())
app.use(morgan('dev'))
app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200
  })
)

app.use('/api', routes)

app.use(ErrorHandler)

export { app }
