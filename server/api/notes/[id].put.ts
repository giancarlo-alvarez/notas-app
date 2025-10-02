import { connectToDatabase } from '../../utils/database'
import { Note } from '../../models/Note'
import authMiddleware from '../../middleware/auth'
import Joi from 'joi'

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

    // Obtener datos del cuerpo de la petición
    const body = await readBody(event)

    // Esquema de validación para actualización (campos opcionales)
    const updateSchema = Joi.object({
      title: Joi.string().min(1).max(200).optional(),
      description: Joi.string().min(1).max(2000).optional(),
      category: Joi.string().valid('personal', 'trabajo', 'ideas', 'recordatorios').optional()
    }).min(1) // Al menos un campo debe estar presente

    // Validar datos
    const { error, value } = updateSchema.validate(body)
    if (error) {
      throw createError({
        statusCode: 400,
        statusMessage: error.details[0].message
      })
    }

    // Conectar a la base de datos
    await connectToDatabase()

    // Actualizar la nota
    const updatedNote = await Note.findOneAndUpdate(
      {
        _id: noteId,
        userId: event.context.user.userId
      },
      {
        ...value,
        updatedAt: new Date()
      },
      {
        new: true,
        lean: true
      }
    )

    if (!updatedNote) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Nota no encontrada'
      })
    }

    return {
      success: true,
      data: updatedNote
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Error al actualizar la nota'
    })
  }
})