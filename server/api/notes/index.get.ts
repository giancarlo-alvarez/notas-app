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
    const query = getQuery(event)

    // Construir filtros
    const filters: any = { userId }

    // Filtro por categoría
    if (query.category && typeof query.category === 'string') {
      filters.category = query.category
    }

    // Filtro por búsqueda de texto
    let searchQuery = {}
    if (query.search && typeof query.search === 'string') {
      searchQuery = {
        $or: [
          { title: { $regex: query.search, $options: 'i' } },
          { description: { $regex: query.search, $options: 'i' } }
        ]
      }
    }

    // Combinar filtros
    const finalQuery = { ...filters, ...searchQuery }

    // Configurar paginación
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 10
    const skip = (page - 1) * limit

    // Configurar ordenamiento
    let sortBy: any = { createdAt: -1 } // Por defecto, más recientes primero
    if (query.sortBy === 'title') {
      sortBy = { title: 1 }
    } else if (query.sortBy === 'updatedAt') {
      sortBy = { updatedAt: -1 }
    }

    // Obtener notas con paginación
    const [notes, total] = await Promise.all([
      Note.find(finalQuery)
        .sort(sortBy)
        .skip(skip)
        .limit(limit)
        .lean(),
      Note.countDocuments(finalQuery)
    ])

    return {
      success: true,
      data: {
        notes,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    }
  } catch (error: any) {
    if (error.statusCode) {
      throw error
    }

    console.error('Error obteniendo notas:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error interno del servidor'
    })
  }
})