const rootDir = process.env.NODE_ENV === 'development' ? 'src' : 'build'

module.exports = {
  type: process.env.DB_DIALECT,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  // synchronize: true,
  logging: process.env.NODE_ENV === 'development',
  entities: [`${rootDir}/entities/**/*{.ts,.js}`],
  migrations: [`${rootDir}/migrations/**/*{.ts,.js}`],
  subscribers: [`${rootDir}/subscribers/**/*{.ts,.js}`],
  seeds: [`${rootDir}/seeds/**/*{.ts,.js}`],
  cli: {
    entitiesDir: 'src/entities',
    migrationsDir: 'src/migrations',
    subscribersDir: 'src/subscribers'
  }
}
