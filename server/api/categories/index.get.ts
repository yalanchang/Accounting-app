import { useDb } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
    const db = useDb()
    const query = getQuery(event)
    const { type } = query
  
    let sql = 'SELECT * FROM categories'
    const params: any[] = []
  
    if (type) {
      sql += ' WHERE type = ?'
      params.push(type)
    }
  
    sql += ' ORDER BY type, name'
  
    try {
      const [rows] = await db.execute(sql, params)
      return rows
    } catch (error) {
      throw createError({ statusCode: 500, message: '取得分類失敗' })
    }
  })