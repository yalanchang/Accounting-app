import { useDb } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
    const db = useDb()
    const id = getRouterParam(event, 'id')
  
    try {
      // 檢查是否有交易記錄使用此分類
      const [transactions]: any = await db.execute(
        'SELECT COUNT(*) as count FROM transactions WHERE category_id = ?',
        [id]
      )
  
      if (transactions[0].count > 0) {
        throw createError({ statusCode: 400, message: '此分類下還有交易記錄，無法刪除' })
      }
  
      const [result]: any = await db.execute(
        'DELETE FROM categories WHERE id = ?',
        [id]
      )
  
      if (result.affectedRows === 0) {
        throw createError({ statusCode: 404, message: '找不到該分類' })
      }
  
      return { message: '刪除分類成功' }
    } catch (error: any) {
      if (error.statusCode) throw error
      throw createError({ statusCode: 500, message: '刪除分類失敗' })
    }
  })