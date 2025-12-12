import { useDb } from '~/server/utils/db'


export default defineEventHandler(async (event) => {
    const db = useDb()
    const query = getQuery(event)
    const targetYear = query.year || new Date().getFullYear()
  
    try {
      const [rows]: any = await db.execute(`
        SELECT 
          MONTH(date) as month,
          type,
          SUM(amount) as total
        FROM transactions
        WHERE YEAR(date) = ?
        GROUP BY MONTH(date), type
        ORDER BY month
      `, [targetYear])
  
      // 整理成前端需要的格式
      const monthlyData = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        income: 0,
        expense: 0
      }))
  
      rows.forEach((row: any) => {
        const idx = row.month - 1
        if (row.type === 'income') {
          monthlyData[idx].income = Number(row.total)
        } else {
          monthlyData[idx].expense = Number(row.total)
        }
      })
  
      return monthlyData
    } catch (error) {
      throw createError({ statusCode: 500, message: '取得月度統計失敗' })
    }
  })