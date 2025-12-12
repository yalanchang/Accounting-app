
import { useDb } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
    const db = useDb()
    const body = await readBody(event)
    const { name, type, icon } = body
  
    if (!name || !type) {
      throw createError({ statusCode: 400, message: '請填寫分類名稱和類型' })
    }
  
    try {
      const [result]: any = await db.execute(
        'INSERT INTO categories (name, type, icon) VALUES (?, ?, ?)',
        [name, type, icon || '📁']
      )
  
      return { id: result.insertId, message: '新增分類成功' }
    } catch (error) {
      throw createError({ statusCode: 500, message: '新增分類失敗' })
    }
  })