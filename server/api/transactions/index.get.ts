import { useDb } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
    const db = useDb()
    const query = getQuery(event)
    const { type, category_id, start_date, end_date } = query
  
    let sql = `
      SELECT t.*, c.name as category_name, c.icon as category_icon 
      FROM transactions t 
      LEFT JOIN categories c ON t.category_id = c.id 
      WHERE 1=1
    `
    const params: any[] = []
  
    if (type) {
      sql += ' AND t.type = ?'
      params.push(type)
    }
    if (category_id) {
      sql += ' AND t.category_id = ?'
      params.push(category_id)
    }
    if (start_date) {
      sql += ' AND t.date >= ?'
      params.push(start_date)
    }
    if (end_date) {
      sql += ' AND t.date <= ?'
      params.push(end_date)
    }
  
    sql += ' ORDER BY t.date DESC, t.created_at DESC'
  
    try {
      const [rows] = await db.execute(sql, params)
      return rows
    } catch (error) {
      throw createError({ statusCode: 500, message: '取得交易記錄失敗' })
    }
  })