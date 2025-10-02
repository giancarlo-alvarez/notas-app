import { connectToDatabase } from '../../utils/database'
import { User } from '../../models/User'
import authMiddleware from '../../middleware/auth'

export default defineEventHandler(async (event) => {
  try {
    // Verificar autenticación
    const decoded = await authMiddleware(event)
    
    // Conectar a la base de datos
    await connectToDatabase()

    const userId = event.context.user.userId

    // Buscar usuario por ID
    const user = await User.findById(userId).select('-password')
    if (!user) {
      throw createError({
        statusCode: 404,
        message: 'Usuario no encontrado'
      })
    }

    return {
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    }
  } catch (error: any) {
    // Si es un error de autenticación, devolver 401
    if (error.statusCode === 401) {
      throw createError({
        statusCode: 401,
        message: error.message || 'Token inválido o expirado'
      })
    }

    // Si es otro tipo de error conocido, reenviarlo
    if (error.statusCode) {
      throw error
    }

    console.error('Error obteniendo usuario:', error)
    throw createError({
      statusCode: 500,
      message: 'Error interno del servidor'
    })
  }
})