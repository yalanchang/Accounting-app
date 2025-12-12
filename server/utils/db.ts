import mysql from 'mysql2/promise'

let pool: mysql.Pool | null = null

export const useDb = () => {
  const config = useRuntimeConfig()
  if (!pool) {
    pool = mysql.createPool({
      host: config.db.host,
      user: config.db.user,
      password: config.db.password,
      database: config.db.database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    })
  }
  return pool
}
