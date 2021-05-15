import dotEnv from 'dotenv'

import { createConnection } from 'typeorm'
import { app } from './app'

dotEnv.config()

const PORT = process.env.PORT

const startUpServer = async () => {
  try {
    await createConnection()
    console.info('Database Online')

    app.listen(PORT, () => console.info(`Server running at http://localhost:${PORT}`))
  } catch (error) {
    console.log('Error server')

    console.error(error)
  }
}

startUpServer()
