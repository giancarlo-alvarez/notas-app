import { connectToDatabase } from '../../utils/database'
import { Note } from '../../models/Note'
import authMiddleware from '../../middleware/auth'

export default defineEventHandler(async (event) => {
  try {
    // Verificar autenticación
    await authMiddleware(event)

    // Obtener ID de la nota
    const noteId = getRouterParam(event, 'id')

    if (!noteId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'ID de nota requerido'
      })
    }

    // Conectar a la base de datos
    await connectToDatabase()

    // Eliminar la nota
    const deletedNote = await Note.findOneAndDelete({
      _id: noteId,
      userId: event.context.user.userId
    })

    if (!deletedNote) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Nota no encontrada'
      })
    }

    return {
      success: true,
      message: 'Nota eliminada exitosamente'
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Error al eliminar la nota'
    })
  }
})