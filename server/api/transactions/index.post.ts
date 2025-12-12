import { useDb } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
    const db = useDb()
    const body = await readBody(event)
    const { type, amount, category_id, description, date } = body
  
    if (!type || !amount || !category_id || !date) {
      throw createError({ statusCode: 400, message: '請填寫必要欄位' })
    }
  
    try {
      const [result]: any = await db.execute(
        'INSERT INTO transactions (type, amount, category_id, description, date) VALUES (?, ?, ?, ?, ?)',
        [type, amount, category_id, description || '', date]
      )
  
      return { id: result.insertId, message: '新增成功' }
    } catch (error) {
      console.error('DB Error:', error)
      throw createError({ statusCode: 500, message: '新增交易記錄失敗' })
    }
  })