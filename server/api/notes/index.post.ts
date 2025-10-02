import { connectToDatabase } from '../../utils/database'
import { Note } from '../../models/Note'
import authMiddleware from '../../middleware/auth'
import Joi from 'joi'

export default defineEventHandler(async (event) => {
  try {
    // Verificar autenticación
    await authMiddleware(event)
    
    // Conectar a la base de datos
    await connectToDatabase()

    const userId = event.context.user.userId

    // Obtener datos del cuerpo de la petición
    const body = await readBody(event)

    // Validar datos de entrada
    const { error, value } = noteSchema.validate(body)
    if (error) {
      throw createError({
        statusCode: 400,
        statusMessage: error.details[0].message
      })
    }

    const { title, description, category } = value

    // Crear nueva nota
    const newNote = new Note({
      title,
      description,
      category,
      userId
    })

    await newNote.save()

    return {
      success: true,
      message: 'Nota creada exitosamente',
      data: newNote
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Error creando nota:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor'
    })
  }
})