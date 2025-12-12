import { useDb } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
    const db = useDb()
    const id = getRouterParam(event, 'id')
  
    try {
      const [result]: any = await db.execute(
        'DELETE FROM transactions WHERE id = ?',
        [id]
      )
  
      if (result.affectedRows === 0) {
        throw createError({ statusCode: 404, message: '找不到該筆記錄' })
      }
  
      return { message: '刪除成功' }
    } catch (error: any) {
      if (error.statusCode) throw error
      throw createError({ statusCode: 500, message: '刪除交易記錄失敗' })
    }
  })