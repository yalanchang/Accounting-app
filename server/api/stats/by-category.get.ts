import { useDb } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
    const db = useDb()
    const query = getQuery(event)
    const { type } = query
  
    let sql = `
      SELECT 
        c.id,
        c.name,
        c.icon,
        c.type,
        COALESCE(SUM(t.amount), 0) as total,
        COUNT(t.id) as count
      FROM categories c
      LEFT JOIN transactions t ON c.id = t.category_id
    `
  
    const params: any[] = []
  
    if (type) {
      sql += ' WHERE c.type = ?'
      params.push(type)
    }
  
    sql += ' GROUP BY c.id ORDER BY total DESC'
  
    try {
      const [rows] = await db.execute(sql, params)
      return rows
    } catch (error) {
      throw createError({ statusCode: 500, message: '取得分類統計失敗' })
    }
  })