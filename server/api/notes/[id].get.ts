import { connectToDatabase } from '../../utils/database'
import { Note } from '../../models/Note'
import authMiddleware from '../../middleware/auth'

export default defineEventHandler(async (event) => {
  try {
    // Verificar autenticación
    await authMiddleware(event)
    
    // Conectar a la base de datos
    await connectToDatabase()

    const userId = event.context.user.userId
    const noteId = getRouterParam(event, 'id')

    if (!noteId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de nota requerido'
      })
    }

    // Buscar nota por ID y verificar que pertenezca al usuario
    const note = await Note.findOne({ _id: noteId, userId })

    if (!note) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Nota no encontrada'
      })
    }

    return {
      success: true,
      data: note
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Error obteniendo nota:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor'
    })
  }
})