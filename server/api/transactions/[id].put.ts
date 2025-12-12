import { useDb } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
    const db = useDb()
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    const { type, amount, category_id, description, date } = body
  
    try {
      const [result]: any = await db.execute(
        'UPDATE transactions SET type = ?, amount = ?, category_id = ?, description = ?, date = ? WHERE id = ?',
        [type, amount, category_id, description || '', date, id]
      )
  
      if (result.affectedRows === 0) {
        throw createError({ statusCode: 404, message: '找不到該筆記錄' })
      }
  
      return { message: '更新成功' }
    } catch (error: any) {
      if (error.statusCode) throw error
      throw createError({ statusCode: 500, message: '更新交易記錄失敗' })
    }
  })