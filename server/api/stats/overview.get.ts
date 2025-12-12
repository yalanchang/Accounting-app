import { useDb } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
    const db = useDb()
    const query = getQuery(event)
    const { start_date, end_date } = query
  
    let dateFilter = ''
    const params: any[] = []
  
    if (start_date && end_date) {
      dateFilter = 'WHERE date >= ? AND date <= ?'
      params.push(start_date, end_date)
    }
  
    try {
      // 總收入
      const [incomeResult]: any = await db.execute(
        `SELECT COALESCE(SUM(amount), 0) as total FROM transactions ${dateFilter ? dateFilter + ' AND' : 'WHERE'} type = 'income'`,
        [...params]
      )
  
      // 總支出
      const [expenseResult]: any = await db.execute(
        `SELECT COALESCE(SUM(amount), 0) as total FROM transactions ${dateFilter ? dateFilter + ' AND' : 'WHERE'} type = 'expense'`,
        [...params]
      )
  
      const totalIncome = Number(incomeResult[0].total)
      const totalExpense = Number(expenseResult[0].total)
  
      return {
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense
      }
    } catch (error) {
      throw createError({ statusCode: 500, message: '取得統計失敗' })
    }
  })