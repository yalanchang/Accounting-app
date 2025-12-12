
import { useDb } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
    const db = useDb()
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    const { name, type, icon } = body
  
    try {
      const [result]: any = await db.execute(
        'UPDATE categories SET name = ?, type = ?, icon = ? WHERE id = ?',
        [name, type, icon, id]
      )
  
      if (result.affectedRows === 0) {
        throw createError({ statusCode: 404, message: '找不到該分類' })
      }
  
      return { message: '更新分類成功' }
    } catch (error: any) {
      if (error.statusCode) throw error
      throw createError({ statusCode: 500, message: '更新分類失敗' })
    }
  })